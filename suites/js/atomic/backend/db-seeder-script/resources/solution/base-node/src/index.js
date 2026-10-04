import { faker } from "@faker-js/faker";

export function seedUsers(count = 10, seed = 42) {
  faker.seed(seed);
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({
      id: i + 1,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      companyId: (i % 3) + 1,
    });
  }
  return users;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const count = Number(process.argv[2] ?? 10);
  console.log(JSON.stringify(seedUsers(count), null, 2));
}
