import { defineConfig } from "astro/config";
import rehypeLightboxImages from "./src/lib/rehypeLightboxImages.mjs";

export default defineConfig({
  site: "https://garyyang.info",
  markdown: {
    rehypePlugins: [rehypeLightboxImages]
  }
});
