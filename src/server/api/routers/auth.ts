import { z } from "zod";
import { Resend } from "resend";
import * as context from "next/headers";
import { TRPCError } from "@trpc/server";
import { User, LuciaError } from "lucia";

import { env } from "@/lib/env.mjs";
import { getBaseUrl } from "@/lib/utils";
import { auth } from "@/server/auth/lucia";
import { TokenManager } from "@/server/auth/token";
import { TimeoutManager } from "@/server/auth/timeout";
import { publicProcedure, createTRPCRouter } from "@/server/api/trpc";
import { EmailVerification } from "@/components/email-template/verify-email";
import ResetPassword from "@/components/email-template/reset-password";

const resend = new Resend(env.RESEND_API_KEY);

export const authRouter = createTRPCRouter({
	signIn: publicProcedure
		.input(
			z.object({
				email: z.string().email("Please provide a valid email address"),
				password: z.string().min(1, { message: "Password cannot be empty" }),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { db } = ctx;

			const { email, password } = input;

			const user = await db.query.users.findFirst({
				where: (users, { eq }) => eq(users.email, email),
			});

			if (user === undefined) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Account does not exist.",
				});
			}

			const cookies = context.cookies();

			const deviceToken = cookies.get("device_token");

			const isValidToken = await TokenManager.validateDeviceToken(
				deviceToken?.value
			);

			if (isValidToken === false) {
				const isTimeout = await TimeoutManager.manageLoginTimeout(email);

				if (isTimeout) {
					throw new TRPCError({
						code: "TOO_MANY_REQUESTS",
						message:
							"The Account currently is locked for 5 minutes due to too many login attempts.",
					});
				}
			}

			let userId: string;

			try {
				const key = await auth.useKey("email", email, password);
				userId = key.userId;
			} catch (e) {
				if (e instanceof LuciaError) {
					switch (e.message) {
						case "AUTH_INVALID_PASSWORD": {
							throw new TRPCError({
								code: "UNAUTHORIZED",
								message: "Invalid password, please try again.",
							});
						}
					}
				}
				throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
			}

			const session = await auth.createSession({
				userId: userId,
				attributes: {},
			});

			const authRequest = auth.handleRequest(ctx.method, context);

			authRequest.setSession(session);

			const newDeviceToken = await TokenManager.generateDeviceToken(email);

			cookies.set("device_token", newDeviceToken, {
				path: "/",
				httpOnly: true,
				maxAge: 60 * 60 * 24 * 365, // 1 year
			});

			return {
				result: session.user.isVerified ? "SUCCESS" : "EMAIL_NOT_VERIFIED",
			};
		}),

	signUp: publicProcedure
		.input(
			z.object({
				fullName: z
					.string()
					.min(1, "First name can't be empty")
					.max(128, "First name can't exceed 128 characters"),
				email: z.string().email("Please provide a valid email address"),
				password: z
					.string()
					.min(8, { message: "Password must be mininum 8 characters" })
					.max(256, { message: "Password should not exceed 256 characters" }),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { db } = ctx;

			const { fullName, email, password } = input;

			let user = await db.query.users.findFirst({
				where: (users, { eq }) => eq(users.email, email),
			});

			if (user) {
				throw new TRPCError({
					code: "CONFLICT",
					message: "Account already exists.",
				});
			}

			let newUser: User;

			try {
				newUser = await auth.createUser({
					key: {
						providerId: "email",
						providerUserId: email,
						password: password,
					},
					attributes: {
						full_name: fullName,
						email: email,
						is_verified: false,
					},
				});
			} catch (e) {
				throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
			}

			const session = await auth.createSession({
				userId: newUser.userId,
				attributes: {},
			});

			const authRequest = auth.handleRequest(ctx.method, context);

			authRequest.setSession(session);

			const emailVerificationToken =
				await TokenManager.generateEmailVerificationToken(newUser.userId);

			const { error } = await resend.emails.send({
				from: "onboarding@resend.dev",
				to: email,
				subject: "Email Verification",
				react: EmailVerification({
					firstName: fullName.split(" ").slice(0, -1).join(" "),
					emailVerificationLink:
						getBaseUrl() + `/email-verification/${emailVerificationToken}`,
				}),
			});

			if (error) {
				throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
			}
		}),

	resendVerificationEmail: publicProcedure.mutation(async () => {
		const authRequest = auth.handleRequest("POST", context);

		const session = await authRequest.validate();

		if (session === null) {
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "You're are not authorized.",
			});
		}

		if (session.user.isVerified) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "You're are already verified",
			});
		}

		const { userId } = session.user;

		const isTimeout = await TimeoutManager.manageEmailVerificationTimeout(
			userId
		);

		if (isTimeout) {
			throw new TRPCError({
				code: "TOO_MANY_REQUESTS",
				message:
					"Email verification link has already been sent to your email, wait for 2 minutes before sending another one.",
			});
		}

		const emailVerificationToken =
			await TokenManager.generateEmailVerificationToken(userId);

		const { error } = await resend.emails.send({
			from: "onboarding@resend.dev",
			to: session.user.email,
			subject: "Email Verification",
			react: EmailVerification({
				firstName: session.user.full_name.split(" ").slice(0, -1).join(" "),
				emailVerificationLink:
					getBaseUrl() + `/email-verification/${emailVerificationToken}`,
			}),
		});

		if (error) {
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
		}
	}),

	verifyEmail: publicProcedure.input(z.string()).mutation(async ({ input }) => {
		const token = input;

		const userId = await TokenManager.validateEmailVerificationToken(token);

		if (userId === undefined) {
			throw new TRPCError({ code: "BAD_REQUEST" });
		}

		const user = await auth.getUser(userId);

		await auth.updateUserAttributes(user.userId, {
			is_verified: true,
		});

		await TokenManager.deleteEmailVerificationToken(token);
	}),

	forgetPassword: publicProcedure
		.input(
			z.object({
				email: z.string().email("Please provide a valid email address"),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { db } = ctx;

			const { email } = input;

			const user = await db.query.users.findFirst({
				where: (users, { eq }) => eq(users.email, email),
			});

			if (user === undefined) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Account does not exist.",
				});
			}

			const isTimeout = await TimeoutManager.managePasswordResetTimeout(email);

			if (isTimeout) {
				throw new TRPCError({
					code: "TOO_MANY_REQUESTS",
					message:
						"Reset link has already been sent to your email, wait for 2 minutes before sending another one.",
				});
			}

			const passwordResetToken = await TokenManager.generatePasswordResetToken(
				user.id
			);

			const { error } = await resend.emails.send({
				from: "onboarding@resend.dev",
				to: user.email,
				subject: "Reset password",
				react: ResetPassword({
					firstName: "John",
					resetPasswordLink:
						getBaseUrl() + `/reset-password/${passwordResetToken}`,
				}),
			});

			if (error) {
				throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
			}
		}),

	resetPassword: publicProcedure
		.input(
			z.object({
				token: z.string(),
				password: z
					.string()
					.min(8, { message: "Password must be mininum 8 characters" })
					.max(256, { message: "Password should not exceed 256 characters" }),
			})
		)
		.mutation(async ({ input }) => {
			const { token, password } = input;

			const userId = await TokenManager.validatePasswordResetToken(token);

			if (userId === undefined) {
				throw new TRPCError({ code: "BAD_REQUEST" });
			}

			let user;

			try {
				user = await auth.getUser(userId);
			} catch (e) {
				if (e instanceof LuciaError) {
					switch (e.message) {
						case "AUTH_INVALID_USER_ID": {
							throw new TRPCError({ code: "NOT_FOUND" });
						}
					}
				}
				throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
			}

			await auth.updateKeyPassword("email", user.email, password);

			await TokenManager.deletePasswordResetToken(token);

			if (user.isVerified === false) {
				await auth.updateUserAttributes(user.userId, { is_verified: true });
			}

			await auth.invalidateAllUserSessions(user.userId);
		}),

	logout: publicProcedure.mutation(async ({ ctx }) => {
		const authRequest = auth.handleRequest(ctx.method, context);

		const session = await authRequest.validate();

		if (session === null) {
			throw new TRPCError({ code: "UNAUTHORIZED" });
		}

		await auth.invalidateSession(session.sessionId);

		authRequest.setSession(null);
	}),
});
