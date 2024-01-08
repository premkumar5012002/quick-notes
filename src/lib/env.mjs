import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		REDIS_URL: z.string().url(),
		DATABASE_URL: z.string().url(),
		RESEND_API_KEY: z.string(),
		NODE_ENV: z.enum(["development", "production"]),
	},
	client: {},
	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		REDIS_URL: process.env.REDIS_URL,
		DATABASE_URL: process.env.DATABASE_URL,
		RESEND_API_KEY: process.env.RESEND_API_KEY,
	},
});
