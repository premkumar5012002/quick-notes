import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { db } from "@/server/db";
import { notes } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const notesRouter = createTRPCRouter({
	getAll: protectedProcedure.query(async ({ ctx }) => {
		const { userId } = ctx.session.user;

		const notes = await db.query.notes.findMany({
			where: (notes, { and, isNull, eq }) => {
				return and(isNull(notes.noteId), eq(notes.authorId, userId));
			},
		});

		return notes;
	}),

	get: protectedProcedure
		.input(z.string().cuid2())
		.query(async ({ ctx, input }) => {
			const { userId } = ctx.session.user;

			const noteId = input;

			const note = await db.query.notes.findFirst({
				where: (notes, { and, eq }) => {
					return and(eq(notes.id, noteId), eq(notes.authorId, userId));
				},
			});

			if (note === undefined) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			return { note };
		}),

	new: protectedProcedure
		.input(z.string().cuid2().optional())
		.mutation(async ({ ctx, input }) => {
			const { userId } = ctx.session.user;

			const noteId = input;

			if (noteId) {
				const note = await db.query.notes.findFirst({
					where: (notes, { and, eq }) => {
						return and(eq(notes.id, noteId), eq(notes.authorId, userId));
					},
				});

				if (note === undefined) {
					throw new TRPCError({ code: "NOT_FOUND" });
				}
			}

			const [newNote] = await db
				.insert(notes)
				.values({
					authorId: userId,
					noteId: noteId,
				})
				.returning();

			return newNote;
		}),

	update: protectedProcedure
		.input(
			z.object({
				id: z.string().cuid2(),
				title: z.string().max(128).optional().nullable(),
				content: z.string().optional(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { userId } = ctx.session.user;

			const { id, title, content } = input;

			const [updatedNote] = await db
				.update(notes)
				.set({ title, content })
				.where(and(eq(notes.id, id), eq(notes.authorId, userId)))
				.returning();

			return updatedNote;
		}),

	delete: protectedProcedure
		.input(z.string().cuid2())
		.mutation(async ({ ctx, input }) => {
			const { userId } = ctx.session.user;

			const noteId = input;

			const note = await db.query.notes.findFirst({
				where: (notes, { and, eq }) => {
					return and(eq(notes.id, noteId), eq(notes.authorId, userId));
				},
			});

			if (note === undefined) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			await db
				.delete(notes)
				.where(and(eq(notes.id, noteId), eq(notes.authorId, userId)));
		}),
});
