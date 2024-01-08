import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({
	path: ".env.local",
});

if (typeof process.env.DATABASE_URL !== "string") {
	console.error("DATABASE_URL is not found in environment variables");
	process.exit(1);
}

export default {
	driver: "pg",
	breakpoints: true,
	schema: "./src/server/db/schema.ts",
	out: "./src/server/db/migrations",
	dbCredentials: {
		connectionString: process.env.DATABASE_URL,
	},
} satisfies Config;
