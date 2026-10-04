import { add, greet } from "./greet.js";

export function main(): string {
  return `${greet("world")} (${add(2, 2)})`;
}
