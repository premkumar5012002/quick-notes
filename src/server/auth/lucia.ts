import postgres from "pg";
import { lucia } from "lucia";
import { cache } from "react";
import * as context from "next/headers";
import { nextjs_future } from "lucia/middleware";
import { pg } from "@lucia-auth/adapter-postgresql";
import { ioredis } from "@lucia-auth/adapter-session-redis";

import { redis } from "@/lib/redis";
import { env } from "@/lib/env.mjs";

const pool = new postgres.Pool({
	connectionString: env.DATABASE_URL,
});

export const auth = lucia({
	adapter: {
		session: ioredis(redis),
		user: pg(pool, { user: "users", key: "keys", session: null }),
	},
	env: env.NODE_ENV === "development" ? "DEV" : "PROD",
	middleware: nextjs_future(),
	sessionCookie: {
		expires: true,
	},
	getUserAttributes: (data) => {
		return {
			email: data.email,
			full_name: data.full_name,
			isVerified: data.is_verified,
		};
	},
});

export type Auth = typeof auth;

export const getPageSession = cache(() => {
	const authRequest = auth.handleRequest("GET", context);
	return authRequest.validate();
});
