const rolePermissions = {
  admin: new Set(["read", "write", "delete"]),
  editor: new Set(["read", "write"]),
  viewer: new Set(["read"]),
};

const userRoles = new Map([
  ["u1", "admin"],
  ["u2", "viewer"],
]);

const userOverrides = new Map([
  ["u2", new Set(["write"])],
]);

/** RBAC permission evaluator: roles plus direct user permission overrides. */
export function canUserExecute(userId, action, resource) {
  void resource;
  const role = userRoles.get(userId);
  if (!role) return false;
  const permissions = rolePermissions[role] ?? new Set();
  const overrides = userOverrides.get(userId) ?? new Set();
  return permissions.has(action) || overrides.has(action);
}
