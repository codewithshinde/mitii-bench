export class ReconnectingDb {
  constructor({ maxRetries = 5, baseDelayMs = 100 } = {}) {
    this.maxRetries = maxRetries;
    this.baseDelayMs = baseDelayMs;
    this.connected = false;
    this.attempts = 0;
  }
  async connect() {
    this.attempts = 0;
    while (this.attempts < this.maxRetries) {
      try {
        await this._tryConnect();
        this.connected = true;
        return;
      } catch (err) {
        this.attempts += 1;
        const delay = this.baseDelayMs * 2 ** (this.attempts - 1);
        await new Promise((r) => setTimeout(r, delay));
        if (this.attempts >= this.maxRetries) throw err;
      }
    }
  }
  async _tryConnect() {
    if (process.env.FORCE_DB_FAIL === "1" && this.attempts < 2) throw new Error("connection dropped");
  }
  async query(sql) {
    if (!this.connected) throw new Error("not connected");
    return { sql, rows: [] };
  }
}
