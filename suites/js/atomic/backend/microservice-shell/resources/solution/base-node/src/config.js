/** Env validator (zod-compatible parse for DATABASE_URL / PORT). */
function parse(env) {
  const PORT = Number(env.PORT ?? 0);
  if (Number.isNaN(PORT)) throw new Error("PORT malformed");
  return {
    PORT,
    DATABASE_URL: env.DATABASE_URL ?? "sqlite://memory",
    NODE_ENV: env.NODE_ENV ?? "test",
  };
}

export const config = parse(process.env);
export const z = { object: () => ({ parse }) };
