export type Post = {
  slug: string;
  title: string;
  date: string;
  coverImage: string;
  author: string;
  excerpt: string;
  ogImage: {
    url: string;
  };
  content: string;
  technologies: string;
  externalUrl: string;
};
