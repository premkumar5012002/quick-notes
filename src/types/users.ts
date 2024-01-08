import { users } from "@/server/db/schema";

export type User = typeof users.$inferSelect;
