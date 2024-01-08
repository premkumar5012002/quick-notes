import { ZodError } from "zod";
import superjson from "superjson";
import * as context from "next/headers";
import { initTRPC, TRPCError } from "@trpc/server";

import { db } from "../db";
import { auth } from "@/server/auth/lucia";

export const createTRPCContext = async (opts: { method: string }) => {
	return {
		db,
		...opts,
	};
};

const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.cause instanceof ZodError ? error.cause.flatten() : null,
			},
		};
	},
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
	const authRequest = auth.handleRequest(ctx.method, context);

	const session = await authRequest.validate();

	if (session === null) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}

	if (session.user.isVerified === false) {
		throw new TRPCError({ code: "FORBIDDEN" });
	}

	return next({
		ctx: {
			...ctx,
			session,
		},
	});
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
