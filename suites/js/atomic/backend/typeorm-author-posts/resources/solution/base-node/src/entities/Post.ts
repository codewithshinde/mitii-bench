import type { Author } from "./Author.js";

export class Post {
  id = 0;
  title = "";
  author = null;
  // @ManyToOne(() => Author, (author) => author.posts, { onDelete: "CASCADE" })
}

export const PostMeta = { entity: "Post", cascadeDelete: true };
