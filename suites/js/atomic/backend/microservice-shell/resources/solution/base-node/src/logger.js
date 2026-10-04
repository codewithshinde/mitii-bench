export function createLogger() {
  return {
    info(obj, msg) {
      const payload = typeof obj === "string" ? { msg: obj } : { ...obj, msg };
      console.log(JSON.stringify({ level: "info", time: Date.now(), ...payload }));
    },
    error(obj, msg) {
      const payload = typeof obj === "string" ? { msg: obj } : { ...obj, msg };
      console.error(JSON.stringify({ level: "error", time: Date.now(), ...payload }));
    },
  };
}
