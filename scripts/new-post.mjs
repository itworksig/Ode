#!/usr/bin/env node
/**
 * 创建新博文
 * 用法: node scripts/new-post.mjs
 */

import readline from "readline";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question, defaultVal = "") {
  return new Promise((resolve) => {
    const hint = defaultVal ? ` (默认: ${defaultVal})` : "";
    rl.question(`${question}${hint}: `, (answer) => {
      resolve(answer.trim() || defaultVal);
    });
  });
}

function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/[\u4e00-\u9fa5]+/g, (m) => encodeURIComponent(m).replace(/%/g, "").slice(0, 20))
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

async function main() {
  console.log("\n── 新博文 ──────────────────────────────────\n");

  const title = await ask("标题");
  if (!title) { console.log("标题不能为空。"); rl.close(); process.exit(1); }

  const rawSlug = await ask("Slug（URL 路径，留空自动生成）");
  const slug = rawSlug || toSlug(title);

  const date = await ask("日期", today());
  const year = date.slice(0, 4);

  const category = await ask("分类", "Notes");
  const readingTime = await ask("阅读时长", "5 min");
  const eyebrow = await ask("Eyebrow（文章小标签，可留空）");
  const summary = await ask("摘要（一句话描述）");
  const featuredInput = await ask("是否加入 Featured 列表？(y/N)", "N");
  const featured = featuredInput.toLowerCase() === "y";

  rl.close();

  const dir = path.join(ROOT, "posts", year);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `${slug}.mdx`);
  if (fs.existsSync(filePath)) {
    console.log(`\n文件已存在: posts/${year}/${slug}.mdx`);
    process.exit(1);
  }

  const frontmatter = [
    "---",
    `title: ${title}`,
    `date: ${date}`,
    `category: ${category}`,
    `readingTime: ${readingTime}`,
    eyebrow ? `eyebrow: ${eyebrow}` : null,
    summary ? `summary: ${summary}` : null,
    `featured: ${featured}`,
    "---",
    "",
    "在这里开始写正文。",
    "",
    "## 标题",
    "",
    "段落内容。",
    "",
    ":::note",
    "这是一个备注框。",
    ":::",
    "",
  ].filter((l) => l !== null).join("\n");

  fs.writeFileSync(filePath, frontmatter, "utf-8");

  console.log(`\n✓ 已创建: posts/${year}/${slug}.mdx`);
  console.log(`  URL: /en/blog/${year}/${slug}`);
  console.log("\n发布方法:");
  console.log(`  git add posts/${year}/${slug}.mdx`);
  console.log(`  git commit -m "add: ${title}"`);
  console.log("  git push\n");
}

main().catch((err) => { console.error(err); process.exit(1); });
