import { notes } from "@/server/db/schema";

export type Note = typeof notes.$inferSelect;
export type Notes = Note[];
