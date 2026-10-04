import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { typeDefs, resolvers } from "../src/graphql.js";

describe("Apollo user query", () => {
  it("defines user query resolver", async () => {
    assert.match(typeDefs, /user\(id: ID!\): User/);
    const user = await resolvers.Query.user(null, { id: "1" });
    assert.equal(user.name, "Ada");
  });
});
