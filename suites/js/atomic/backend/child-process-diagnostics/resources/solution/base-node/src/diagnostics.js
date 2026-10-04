import { exec } from "node:child_process";

export function runSystemDiagnostics(command) {
  const cmd =
    command ??
    (process.platform === "win32" ? "cmd /c echo diagnostics-ok" : "echo diagnostics-ok");
  return new Promise((resolve, reject) => {
    const child = exec(cmd, (error, stdout, stderr) => {
      clearTimeout(timer);
      resolve({
        stdout: stdout ?? "",
        stderr: stderr ?? "",
        exitCode: error && typeof error.code === "number" ? error.code : 0,
      });
    });
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error("Timeout"));
    }, 5000);
  });
}
