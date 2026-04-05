import { defineCollection, z } from "astro:content";

const linkSchema = z.object({
  label: z.string(),
  href: z.string().url()
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    publishedDate: z.coerce.date(),
    status: z.enum(["active", "completed", "archived", "in-progress"]),
    tags: z.array(z.string()).default([]),
    coverImage: z.string(),
    featured: z.boolean().default(false),
    links: z.array(linkSchema).default([]),
    homepageWeight: z.number().int().nonnegative().default(99)
  })
});

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    publishedDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    coverImage: z.string(),
    draft: z.boolean().default(false)
  })
});

export const collections = { projects, blog };
