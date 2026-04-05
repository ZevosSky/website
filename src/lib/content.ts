import { getCollection, type CollectionEntry } from "astro:content";
import { siteConfig } from "../config/site";

type ProjectEntry = CollectionEntry<"projects">;
type BlogEntry = CollectionEntry<"blog">;

export async function getAllProjects() {
  const projects = await getCollection("projects");

  return projects.sort((a, b) => {
    const featuredOrder =
      siteConfig.portfolio.featuredProjectSlugs.indexOf(a.slug) -
      siteConfig.portfolio.featuredProjectSlugs.indexOf(b.slug);

    if (
      siteConfig.portfolio.featuredProjectSlugs.includes(a.slug) &&
      siteConfig.portfolio.featuredProjectSlugs.includes(b.slug) &&
      featuredOrder !== 0
    ) {
      return featuredOrder;
    }

    return (
      a.data.homepageWeight - b.data.homepageWeight ||
      b.data.publishedDate.getTime() - a.data.publishedDate.getTime()
    );
  });
}

export async function getVisibleProjects() {
  const projects = await getAllProjects();

  if (siteConfig.portfolio.showArchivedProjects) {
    return projects;
  }

  return projects.filter((project) => project.data.status !== "archived");
}

export async function getHomeProjects() {
  const projects = await getVisibleProjects();
  return projects.slice(0, siteConfig.portfolio.homeProjectLimit);
}

export async function getProjectSidebarProjects(currentSlug: string, count = 4) {
  const projects = (await getVisibleProjects()).filter(
    (project) => project.slug !== currentSlug
  );

  if (projects.length <= count) {
    return projects;
  }

  const seed = Array.from(currentSlug).reduce(
    (total, character) => total + character.charCodeAt(0),
    0
  );
  const start = seed % projects.length;

  return Array.from({ length: count }, (_, index) => {
    return projects[(start + index) % projects.length];
  });
}

export async function getBlogSidebarPosts(currentSlug: string, count = 4) {
  const posts = (await getBlogPosts()).filter((post) => post.slug !== currentSlug);

  if (posts.length <= count) {
    return posts;
  }

  const seed = Array.from(currentSlug).reduce(
    (total, character) => total + character.charCodeAt(0),
    0
  );
  const start = seed % posts.length;

  return Array.from({ length: count }, (_, index) => {
    return posts[(start + index) % posts.length];
  });
}

export function getRecommendedSidebarCount(body: string) {
  const wordCount = body
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  if (wordCount < 90) {
    return 2;
  }

  if (wordCount < 220) {
    return 3;
  }

  if (wordCount < 420) {
    return 4;
  }

  return 5;
}

export async function getBlogPosts() {
  const posts = await getCollection("blog");

  return posts
    .filter((post) => !post.data.draft)
    .sort(
      (a, b) => b.data.publishedDate.getTime() - a.data.publishedDate.getTime()
    );
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

export function getProjectStatusLabel(status: ProjectEntry["data"]["status"]) {
  switch (status) {
    case "in-progress":
      return "In Progress";
    case "completed":
      return "Completed";
    case "archived":
      return "Archived";
    default:
      return "Active";
  }
}

export function isProjectEntry(
  entry: ProjectEntry | BlogEntry
): entry is ProjectEntry {
  return entry.collection === "projects";
}
