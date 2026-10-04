import { EventEmitter } from "node:events";

/** @type {{ step: string; orderId: string; email: string }[]} */
const sent = [];

export function getSentNotifications() {
  return [...sent];
}

export function resetSentNotifications() {
  sent.length = 0;
}

function notify(step, order) {
  sent.push({ step, orderId: order.id, email: order.email });
}

export class OrderPipeline extends EventEmitter {
  constructor() {
    super();
    this.on("order:created", (order) => notify("created", order));
    this.on("order:paid", (order) => notify("paid", order));
    this.on("order:shipped", (order) => notify("shipped", order));
  }

  advance(order, step) {
    this.emit(`order:${step}`, order);
  }
}
