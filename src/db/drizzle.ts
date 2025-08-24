import { neon } from "@neondatabase/serverless";

import * as schema from "@/db/schema";
import "dotenv/config";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";

import { env } from "@/env.js";

export const sql = neon(env.DATABASE_URL);

export const db = drizzleNeon(sql, { schema, logger: false });
