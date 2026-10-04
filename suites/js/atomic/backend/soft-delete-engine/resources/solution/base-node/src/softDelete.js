const tables = new Map();

function table(name) {
  if (!tables.has(name)) tables.set(name, []);
  return tables.get(name);
}

export const softDb = {
  insert(name, row) {
    table(name).push({ ...row, deleted_at: null });
  },
  find(name) {
    return table(name).filter((r) => r.deleted_at == null);
  },
  softDelete(name, id) {
    const rows = table(name);
    const row = rows.find((r) => r.id === id);
    if (row) row.deleted_at = new Date().toISOString();
    return row;
  },
  hardCount(name) {
    return table(name).length;
  },
};
