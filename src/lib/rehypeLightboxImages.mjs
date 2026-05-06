function isElement(node, tagName) {
  return node?.type === "element" && node.tagName === tagName;
}

function hasClass(node, className) {
  const classes = node?.properties?.className;

  if (Array.isArray(classes)) {
    return classes.includes(className);
  }

  if (typeof classes === "string") {
    return classes.split(/\s+/).includes(className);
  }

  return false;
}

function visitImages(node, ancestors = []) {
  if (!node || !Array.isArray(node.children)) {
    return;
  }

  node.children = node.children.map((child) => {
    if (isElement(child, "img")) {
      const alreadyLightbox =
        ancestors.some((ancestor) => hasClass(ancestor, "lightbox-trigger")) ||
        hasClass(node, "lightbox-trigger");

      if (alreadyLightbox) {
        return child;
      }

      const src = child.properties?.src;
      const alt = child.properties?.alt || "";

      if (typeof src !== "string" || src.length === 0) {
        return child;
      }

      return {
        type: "element",
        tagName: "button",
        properties: {
          type: "button",
          className: ["lightbox-trigger"],
          "data-lightbox-src": src,
          "data-lightbox-alt": alt,
          "aria-label": alt ? `Expand image for ${alt}` : "Expand image"
        },
        children: [child]
      };
    }

    visitImages(child, [...ancestors, node]);
    return child;
  });
}

export default function rehypeLightboxImages() {
  return (tree) => {
    visitImages(tree);
  };
}
