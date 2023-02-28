import { z, defineCollection } from 'astro:content';

const postCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.string(),
  }),
});

const projectCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    coverImage: z.string().optional(),
    // date: z.string().optional(),
    excerpt: z.string().nullish(),
    // author: z.string().optional(),
    externalUrl: z.string().optional(),
    technologies: z.string().optional(),
  }),
});

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  post: postCollection,
  project: projectCollection,
};
