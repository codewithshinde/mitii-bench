/** In-memory store for dry-run (TypeORM metadata lives in Author.ts). */
class Author {
  id = 0;
  name = "";
  posts = [];
}

class Post {
  id = 0;
  title = "";
  author = null;
}

const authors = new Map();
const posts = new Map();
let nextAuthor = 1;
let nextPost = 1;

export function createAuthor(name) {
  const a = new Author();
  a.id = nextAuthor++;
  a.name = name;
  authors.set(a.id, a);
  return a;
}

export function createPost(authorId, title) {
  const author = authors.get(authorId);
  if (!author) throw new Error("Author not found");
  const p = new Post();
  p.id = nextPost++;
  p.title = title;
  p.author = author;
  author.posts.push(p);
  posts.set(p.id, p);
  return p;
}

export function deleteAuthor(id) {
  const author = authors.get(id);
  if (!author) return false;
  for (const post of author.posts) posts.delete(post.id);
  authors.delete(id);
  return true;
}

export function getAuthor(id) {
  return authors.get(id) ?? null;
}
