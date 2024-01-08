import { z } from "zod";
import { eq } from "drizzle-orm";
import { LuciaError } from "lucia";
import { TRPCError } from "@trpc/server";

import { db } from "@/server/db";
import { auth } from "@/server/auth/lucia";
import { users } from "@/server/db/schema";
import { protectedProcedure, createTRPCRouter } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
	me: protectedProcedure.query(async ({ ctx }) => {
		const { userId } = ctx.session.user;

		const data = await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.id, userId),
		});

		if (data === undefined) {
			throw new TRPCError({ code: "NOT_FOUND" });
		}

		return data;
	}),

	changeName: protectedProcedure
		.input(
			z.object({
				fullName: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { userId } = ctx.session.user;

			const { fullName } = input;

			const user = await db.query.users.findFirst({
				where: (users, { eq }) => eq(users.id, userId),
			});

			if (user === undefined) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			await db.update(users).set({ fullName }).where(eq(users.id, userId));
		}),

	changePassword: protectedProcedure
		.input(
			z.object({
				currentPassword: z.string(),
				newPassword: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { userId } = ctx.session.user;

			const { currentPassword, newPassword } = input;

			const user = await db.query.users.findFirst({
				where: (users, { eq }) => eq(users.id, userId),
			});

			if (user === undefined) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			try {
				await auth.useKey("email", user.email, currentPassword);
			} catch (e) {
				if (e instanceof LuciaError && e.message === "AUTH_INVALID_PASSWORD") {
					throw new TRPCError({ code: "BAD_REQUEST" });
				}
				throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
			}

			await auth.updateKeyPassword("email", user.email, newPassword);

			await auth.invalidateAllUserSessions(userId);
		}),

	logoutOfAllDevice: protectedProcedure.mutation(async ({ ctx }) => {
		const { userId } = ctx.session.user;
		await auth.invalidateAllUserSessions(userId);
	}),

	logout: protectedProcedure.mutation(async ({ ctx }) => {
		const { sessionId } = ctx.session;
		await auth.invalidateSession(sessionId);
	}),

	deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
		const { userId } = ctx.session.user;

		const user = await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.id, userId),
		});

		if (user === undefined) {
			throw new TRPCError({ code: "NOT_FOUND" });
		}

		await auth.invalidateAllUserSessions(userId);

		await db.delete(users).where(eq(users.id, userId));
	}),
});
