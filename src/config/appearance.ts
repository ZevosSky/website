export type HeroPreset = "split" | "stacked";
export type CardAspect = "portrait" | "landscape" | "square";

export type ResponsivePreset = {
  hero: {
    desktop: HeroPreset;
    mobile: HeroPreset;
  };
  projectsGrid: {
    mobile: 1 | 2;
    tablet: 2 | 3;
    desktop: 2 | 3 | 4;
  };
  blogGrid: {
    mobile: 1 | 2;
    tablet: 2 | 3;
    desktop: 2 | 3;
  };
  cardAspect: {
    projects: CardAspect;
    blog: CardAspect;
  };
  compactSupportingTextOnMobile: boolean;
};

export const responsivePreset: ResponsivePreset = {
  hero: {
    desktop: "split",
    mobile: "stacked"
  },
  projectsGrid: {
    mobile: 1,
    tablet: 2,
    desktop: 3
  },
  blogGrid: {
    mobile: 1,
    tablet: 2,
    desktop: 2
  },
  cardAspect: {
    projects: "landscape",
    blog: "portrait"
  },
  compactSupportingTextOnMobile: true
};

export const breakpoints = {
  tablet: 720,
  desktop: 1100
};
