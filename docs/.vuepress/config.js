import { defineUserConfig } from "vuepress/cli";
import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";
import { searchProPlugin } from "vuepress-plugin-search-pro";
import { seoPlugin } from "@vuepress/plugin-seo";
import { sitemapPlugin } from "@vuepress/plugin-sitemap";
import sidebar from "./sidebar.json" with { type: "json" };

const hostname = "https://jfinal-aop.io.nexus";

export default defineUserConfig({
  base: "/",
  lang: "zh-CN",
  title: "JFinal AOP",
  description: "jfinal-aop 使用文档：拦截器、依赖注入、注解与实现原理",
  shouldPrefetch: false,
  head: [["link", { rel: "icon", href: "/logo.png" }]],
  markdown: { lineNumbers: true },
  bundler: viteBundler(),
  plugins: [
    searchProPlugin({ indexContent: true }),
    seoPlugin({ hostname, author: { name: "Tong Li", url: "https://github.com/litongjava" } }),
    sitemapPlugin({ hostname }),
  ],
  theme: defaultTheme({
    logo: "/logo.png",
    repo: "litongjava/jfinal-aop-docs",
    docsRepo: "https://github.com/litongjava/jfinal-aop-docs",
    docsBranch: "main",
    docsDir: "docs",
    navbar: [
      { text: "源码", link: "https://github.com/litongjava/jfinal-aop" },
      { text: "Tio Boot", link: "https://tio-boot.com/" },
    ],
    sidebar,
  }),
});
