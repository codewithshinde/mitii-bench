import { createAuthorLoader, loadAuthorsForPosts } from "./loaders/authorLoader.js";

export async function fetchPostsWithAuthors(posts) {
  const loader = createAuthorLoader();
  const authors = await loadAuthorsForPosts(posts, loader);
  return posts.map((p, i) => ({ ...p, author: authors[i] }));
}
