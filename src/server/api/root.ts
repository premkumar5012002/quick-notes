import { createTRPCRouter } from "@/server/api/trpc";

import { authRouter } from "@/server/api/routers/auth";
import { notesRouter } from "@/server/api/routers/notes";
import { userRouter } from "@/server/api/routers/users";

export const appRouter = createTRPCRouter({
	auth: authRouter,
	user: userRouter,
	notes: notesRouter,
});

export type AppRouter = typeof appRouter;
