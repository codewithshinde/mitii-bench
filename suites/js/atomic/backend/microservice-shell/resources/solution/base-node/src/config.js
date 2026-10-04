import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().default(0),
  DATABASE_URL: z.string().default("sqlite://memory"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("test"),
});

export const config = schema.parse(process.env);
