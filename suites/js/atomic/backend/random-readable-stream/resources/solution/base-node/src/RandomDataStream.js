import { Readable } from "node:stream";

export class RandomDataStream extends Readable {
  constructor({ count = 5, min = 0, max = 9, seed = null } = {}) {
    super({ objectMode: true });
    this.remaining = count;
    this.min = min;
    this.max = max;
    this.seed = seed;
    this.index = 0;
  }

  _read() {
    if (this.remaining <= 0) {
      this.push(null);
      return;
    }
    let value;
    if (this.seed != null) {
      value = ((this.seed + this.index) % (this.max - this.min + 1)) + this.min;
    } else {
      value = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
    }
    this.index += 1;
    this.remaining -= 1;
    this.push(value);
  }
}
