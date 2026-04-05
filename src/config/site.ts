import { responsivePreset } from "./appearance";

const featuredProjectSlugs: string[] = [
  "machine-learning-mesh-re-topology",
  "substance-designer-tree-bark",
  "command-pattern-based-animations-systems"
];

export const siteConfig = {
  title: "Gary Yang",
  siteUrl: "https://garyyang.info",
  description:
    "Procedural Enthusiast",
  hero: {
    eyebrow: "",
    title: "Tech Artist & Real-Time Graphics Engineer",
    intro:
      "Deep low-level experience with C/C++, Python, and shader languages. Passionate about building tools, rendering techniques, and interactive systems.",
    ctaLabel: "Browse Projects",
    ctaHref: "/projects"
  },
  socials: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/gary-w-yang/"
    },
    {
      label: "GitHub",
      href: "https://github.com/ZevosSky"
    }
  ],
  currentFocus: {
    title: "Currently exploring machine learning for mesh workflows",
    summary:
      "Learning how to leverage machhine learning techniques by applying it to a personal project that is meaningful to me: mesh re-topology.",
    href: "/projects/machine-learning-mesh-re-topology"
  },
  portfolio: {
    featuredProjectSlugs,
    showArchivedProjects: true,
    homeProjectLimit: 6,
    showCurrentFocus: true
  },
  blog: {
    title: "Personal Thoughts and Experiments",
    description:
      "A separate writing space for process notes, experiments, and thoughts that do not need to live inside project pages."
  },
  responsivePreset
} as const;

export type SiteConfig = typeof siteConfig;
