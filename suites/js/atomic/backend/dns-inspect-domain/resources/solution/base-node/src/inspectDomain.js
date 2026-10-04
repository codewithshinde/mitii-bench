import dns from "node:dns/promises";

const defaultResolver = {
  resolve4: (domain) => dns.resolve4(domain),
  resolveMx: (domain) => dns.resolveMx(domain),
  resolveTxt: (domain) => dns.resolveTxt(domain),
};

export async function inspectDomain(domain, resolver = defaultResolver) {
  const [a, mx, txt] = await Promise.all([
    resolver.resolve4(domain).catch(() => []),
    resolver.resolveMx(domain).catch(() => []),
    resolver.resolveTxt(domain).catch(() => []),
  ]);
  return {
    domain,
    a,
    mx: mx.map((record) => ({ exchange: record.exchange, priority: record.priority })),
    txt: txt.map((chunks) => chunks.join("")),
  };
}
