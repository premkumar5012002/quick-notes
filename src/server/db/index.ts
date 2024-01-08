import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import { env } from "@/lib/env.mjs";
import * as schema from "@/server/db/schema";

const client = new Client(env.DATABASE_URL);

client.connect();

export const db = drizzle(client, { schema });
