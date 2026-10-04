export class Db {
  constructor() { this.connected = true; }
  async ping() { if (!this.connected) throw new Error("db down"); return true; }
  close() { this.connected = false; }
}
export const db = new Db();
