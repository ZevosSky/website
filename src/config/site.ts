import { responsivePreset } from "./appearance";

const featuredProjectSlugs: string[] = [
  "gpu-llm-inference-sharding",
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
    title: "Real-Time Graphics Engineer, ML & Tech Art",
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
    title: "Currently exploring local LLM inference sharding",
    summary:
      "Building a cost-conscious homelab testbed for larger local models by benchmarking Tesla P40 sharding, llama.cpp split modes, PCIe layout, power limits, and networked inference.",
    href: "/projects/gpu-llm-inference-sharding"
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
  comments: {
    giscus: {
      repo: "ZevosSky/website",
      repoId: "R_kgDOR6IlHQ",
      category: "General",
      categoryId: "DIC_kwDOR6IlHc4C8bsa",
      mapping: "pathname",
      reactionsEnabled: "1",
      emitMetadata: "0",
      theme: "https://garyyang.info/giscus-theme.css",
      loading: "lazy"
    }
  },
  responsivePreset
} as const;

export type SiteConfig = typeof siteConfig;
