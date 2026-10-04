import { createInterface } from "node:readline/promises";
import { writeFile } from "node:fs/promises";

export async function writeEnvFile({ host, port, user }, outputPath = ".env") {
  const body = [
    `DATABASE_HOST=${host}`,
    `DATABASE_PORT=${port}`,
    `DATABASE_USER=${user}`,
    "",
  ].join("\n");
  await writeFile(outputPath, body, "utf8");
  return body;
}

export async function runInteractiveEnvWizard(
  input,
  output,
  outputPath = ".env",
  createInterfaceFn = createInterface,
) {
  const rl = createInterfaceFn({ input, output });
  try {
    const host = await rl.question("Database Host: ");
    const port = await rl.question("Database Port: ");
    const user = await rl.question("Database User: ");
    const confirm = await rl.question("Write .env? (y/N): ");
    if (String(confirm).trim().toLowerCase() !== "y") {
      return null;
    }
    return writeEnvFile({ host, port, user }, outputPath);
  } finally {
    rl.close();
  }
}
