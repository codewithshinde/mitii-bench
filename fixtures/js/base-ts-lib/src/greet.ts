export function greet(name: string): string {
  // Intentional type error for repair cases — do not "fix" in the fixture baseline.
  const label: number = name;
  return `Hello, ${label}`;
}

export function add(a: number, b: number): number {
  return a + b;
}
