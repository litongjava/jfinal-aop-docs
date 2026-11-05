import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { defineConfig } from "vitepress";
import { generateLlms, pathOfSource } from "./llms.js";
import sidebar from "./sidebar.json";

const siteUrl = "https://jfinal-aop.io.nexus";
const siteName = "JFinal AOP";
const siteDescription = "jfinal-aop 使用文档：拦截器、依赖注入、注解与实现原理";
const srcRoot = resolve(import.meta.dirname, "..");
const excerptOf = (source: string) => {
  try {
    return readFileSync(join(srcRoot, source), "utf8")
      .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "")
      .replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, " ")
      .replace(/^\s*#\s+.*$/m, " ")
      .replace(/!?(\[[^\]]*\])\([^)]*\)/g, "$1").replace(/<[^>]+>/g, " ")
      .replace(/\[\[toc\]\]/g, " ").replace(/[#>*_\[\]`|]/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);
  } catch { return ""; }
};

export default defineConfig({
  lang: "zh-CN",
  title: siteName,
  description: siteDescription,
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ["link", { rel: "icon", href: "/logo.png" }],
    ["meta", { name: "keywords", content: "jfinal-aop,JFinal AOP,Java AOP,依赖注入,拦截器,AopInterceptor,tio-boot" }],
    ["meta", { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1" }],
    ["meta", { property: "og:site_name", content: siteName }],
    ["meta", { name: "twitter:card", content: "summary" }],
    ["link", { rel: "alternate", href: "/llms.txt", type: "text/plain", title: "LLMs.txt" }],
  ],
  sitemap: { hostname: "https://jfinal-aop.io.nexus" },
  transformPageData(pageData) {
    const url = siteUrl + encodeURI(pathOfSource(pageData.relativePath));
    const isHome = pageData.frontmatter.layout === "home";
    const title = isHome || !pageData.title ? siteName : `${pageData.title} | ${siteName}`;
    const description = pageData.frontmatter.description || (isHome ? "" : excerptOf(pageData.relativePath)) || siteDescription;
    pageData.description = description;
    (pageData.frontmatter.head ??= []).push(
      ["link", { rel: "canonical", href: url }],
      ["meta", { property: "og:type", content: isHome ? "website" : "article" }],
      ["meta", { property: "og:title", content: title }],
      ["meta", { property: "og:description", content: description }],
      ["meta", { property: "og:url", content: url }],
      ["meta", { property: "og:image", content: `${siteUrl}/logo.png` }],
      ["meta", { name: "twitter:title", content: title }],
      ["meta", { name: "twitter:description", content: description }],
      ["script", { type: "application/ld+json" }, JSON.stringify({
        "@context": "https://schema.org",
        "@type": isHome ? "WebSite" : "TechArticle",
        [isHome ? "name" : "headline"]: title,
        description,
        url,
        inLanguage: "zh-CN",
      }).replaceAll("<", "\\u003c")],
    );
  },
  async buildEnd(siteConfig) {
    const sources = siteConfig.pages.map((p) => p.replaceAll("\\", "/"));
    await generateLlms({ srcDir: siteConfig.srcDir, outDir: siteConfig.outDir, sources, hostname: siteUrl, siteName, siteDescription });
  },
  markdown: { lineNumbers: true },
  themeConfig: {
    logo: "/logo.png",
    nav: [
      { text: "源码", link: "https://github.com/litongjava/jfinal-aop" },
      { text: "全部项目", link: "https://io.nexus/projects" },
      { text: "Tio Boot", link: "https://tio-boot.com/" },
    ],
    sidebar,
    socialLinks: [{ icon: "github", link: "https://github.com/litongjava/jfinal-aop-docs" }],
    search: { provider: "local" },
    editLink: {
      pattern: "https://github.com/litongjava/jfinal-aop-docs/edit/main/docs/:path",
      text: "编辑此页",
    },
    outline: { level: [2, 3], label: "本页目录" },
    docFooter: { prev: "上一页", next: "下一页" },
    lastUpdated: { text: "最后更新" },
  },
});
