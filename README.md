# jfinal-aop-docs

jfinal-aop 使用文档：拦截器、依赖注入、注解与实现原理。

- 文档站：https://jfinal-aop.io.nexus/
- 项目源码：https://github.com/litongjava/jfinal-aop
- 拆分自 [tio-boot-docs](https://github.com/litongjava/tio-boot-docs)

## 本地开发

```bash
pnpm install
pnpm docs:dev
```

## 构建

```bash
pnpm docs:build
```

构建产物位于 `docs/.vitepress/dist`。

## 部署

推送到 `main` 分支后，Cloudflare Pages 会自动构建并发布。

## AI 语料

构建时生成，供 AI 检索和问答使用：

- [llms.txt](https://jfinal-aop.io.nexus/llms.txt)：页面目录
- [llms-full.txt](https://jfinal-aop.io.nexus/llms-full.txt)：完整正文
- [ai/index.json](https://jfinal-aop.io.nexus/ai/index.json)：页面元数据
- [ai/chunks.jsonl](https://jfinal-aop.io.nexus/ai/chunks.jsonl)：按标题分段的语料
- `/ai/pages/<路径>.md`：每页的 Markdown 原文
