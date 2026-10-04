/** TypeORM-style Author entity (dry-run; decorators as metadata strings). */
export class Author {
  id = 0;
  name = "";
  // @OneToMany(() => Post, (post) => post.author, { cascade: true })
  posts = [];
}

export const AuthorMeta = {
  entity: "Author",
  relations: [{ type: "OneToMany", target: "Post", cascade: true }],
};
