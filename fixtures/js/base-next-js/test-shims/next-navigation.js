import { vi } from "vitest";

const params = {};
const search = new URLSearchParams();
const router = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
};

export function useParams() {
  return params;
}

export function useSearchParams() {
  return search;
}

export function useRouter() {
  return router;
}

export function usePathname() {
  return "/";
}

export function redirect() {
  /* no-op in unit tests */
}

export function notFound() {
  /* no-op in unit tests */
}

/** Test helper — mutate shared mocks between cases. */
export function __setParams(next) {
  Object.keys(params).forEach((k) => delete params[k]);
  Object.assign(params, next ?? {});
}

export function __setSearch(query) {
  const next = new URLSearchParams(query ?? "");
  [...search.keys()].forEach((k) => search.delete(k));
  next.forEach((v, k) => search.set(k, v));
}
