import DataLoader from "dataloader";

const AUTHORS = {
  1: { id: 1, name: "Turing" },
  2: { id: 2, name: "Lovelace" },
};

export function createAuthorLoader() {
  return new DataLoader(async (ids) => {
    return ids.map((id) => AUTHORS[id] ?? null);
  });
}

export async function loadAuthorsForPosts(posts, loader) {
  return Promise.all(posts.map((p) => loader.load(p.authorId)));
}
