import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const users = [{ id: "1", name: "Ada" }];

export const typeDefs = `#graphql
  type User { id: ID! name: String! }
  type Query { user(id: ID!): User }
`;

export const resolvers = {
  Query: {
    user: (_parent, { id }) => users.find((u) => u.id === id) ?? null,
  },
};

export async function startGraphServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, { listen: { port: Number(process.env.PORT || 0) } });
  return { server, url };
}

if (process.env.MITII_NO_LISTEN !== "1") {
  await startGraphServer();
}
