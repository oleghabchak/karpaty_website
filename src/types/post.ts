export type PostAuthor = {
  name: string;
  image: string;
  designation: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  bodyMarkdown: string;
  author: PostAuthor;
  tags: string[];
  publishDate: string;
  publishedAt: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreatePostInput = {
  title: string;
  excerpt: string;
  image: string;
  bodyMarkdown: string;
  tags: string[];
  publishDate?: string;
  author?: Partial<PostAuthor>;
};
