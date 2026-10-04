class InMemorySearchIndex {
  constructor() { this.docs = new Map(); }
  upsert(id, doc) { this.docs.set(String(id), doc); }
  delete(id) { this.docs.delete(String(id)); }
  search(q) {
    const needle = String(q).toLowerCase();
    return [...this.docs.entries()]
      .filter(([, d]) => JSON.stringify(d).toLowerCase().includes(needle))
      .map(([id, doc]) => ({ id, doc }));
  }
}

export const index = new InMemorySearchIndex();
const listeners = new Set();

export function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export function syncRecord(op, id, payload) {
  if (op === "delete") index.delete(id);
  else index.upsert(id, payload);
  for (const fn of listeners) fn({ op, id, payload });
}

export function hookDbMutation(op, id, payload) {
  syncRecord(op, id, payload);
  return { synced: true };
}
