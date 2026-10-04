function formatCurrency(val) {
  const n = Number(val);
  if (!Number.isFinite(n)) return "$0.00";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

module.exports = { formatCurrency };
