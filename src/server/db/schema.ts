import {
	text,
	varchar,
	boolean,
	pgTable,
	timestamp,
	AnyPgColumn,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export const keys = pgTable("keys", {
	id: varchar("id", { length: 191 }).primaryKey(),
	hashedPassword: varchar("hashed_password"),
	userId: varchar("user_id").references(() => users.id, {
		onDelete: "cascade",
	}),
});

export const users = pgTable(
	"users",
	{
		id: varchar("id", { length: 191 }).primaryKey(),
		fullName: text("full_name").notNull(),
		email: varchar("email", { length: 320 }).notNull(),
		isVerified: boolean("is_verified").notNull().default(false),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => ({
		emailIdx: uniqueIndex("email_idx").on(table.email),
	})
);

export const notes = pgTable("notes", {
	id: varchar("id", { length: 128 })
		.primaryKey()
		.$defaultFn(() => createId()),
	title: varchar("title", { length: 128 }),
	content: text("content"),
	noteId: varchar("note_id").references((): AnyPgColumn => notes.id, {
		onDelete: "cascade",
	}),
	authorId: text("author_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
	notes: many(notes),
}));

export const notesRelations = relations(notes, ({ one }) => ({
	note: one(notes, {
		fields: [notes.noteId],
		references: [notes.id],
	}),
	author: one(users, {
		fields: [notes.authorId],
		references: [users.id],
	}),
}));
