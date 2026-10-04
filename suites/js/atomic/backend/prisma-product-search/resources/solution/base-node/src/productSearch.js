const PRODUCTS = [
  { id: 1, name: "Alpha Phone", category: "electronics", price: 699 },
  { id: 2, name: "Beta Book", category: "books", price: 19 },
  { id: 3, name: "Gamma Gadget", category: "electronics", price: 49 },
  { id: 4, name: "Delta Desk", category: "furniture", price: 199 },
];

/** Prisma-style paginated product search (in-memory). */
export async function searchProducts({ page = 1, limit = 10, category, search } = {}) {
  let rows = [...PRODUCTS];
  if (category) rows = rows.filter((p) => p.category === category);
  if (search) {
    const q = String(search).toLowerCase();
    rows = rows.filter((p) => p.name.toLowerCase().includes(q));
  }
  const totalCount = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const currentPage = Math.min(Math.max(1, Number(page)), totalPages);
  const start = (currentPage - 1) * limit;
  const items = rows.slice(start, start + limit);
  return { items, totalCount, totalPages, currentPage };
}
