Build a GraphQL API using `@apollo/server`.

* **TypeDefs**: Query `user(id: ID!): User`.
* **Resolvers**: Fetch user record from a service layer (you may mock it for tests).
* **Endpoint test**: Add an integration test (e.g. `test/integration.test.js`) that starts an `ApolloServer` instance **in‑process** and runs a `user` query via `server.executeOperation`. The test must verify:
  - The happy‑path returns the correct `User` fields for a valid ID.
  - An invalid or missing ID results in a clear GraphQL error (e.g. `User not found`).
  - No GraphQL validation errors are present.
  - The test runs with `node --test` (or the project's test script).

Implement primarily in `src/graphql.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding. Install required packages: `@apollo/server`, `graphql`.
