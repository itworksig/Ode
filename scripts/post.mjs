#!/usr/bin/env node
/**
 * Ode 博文管理工具
 * 用法: node scripts/post.mjs
 *   或: npm run post
 */

import readline from "readline";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const POSTS_DIR = path.join(ROOT, "posts");

// ── 140+ 语言代码（MediaWiki 风格）────────────────────────
const LANGUAGES = {
  af: "Afrikaans",
  ak: "Akan",
  sq: "Shqip",
  gsw: "Alemannisch",
  am: "አማርኛ",
  an: "Aragonés",
  ar: "العربية",
  arc: "ܐܪܡܝܐ",
  hy: "Հայերեն",
  as: "অসমীয়া",
  ast: "Asturianu",
  av: "Авар",
  ay: "Aymar",
  az: "Azərbaycanca",
  ba: "Башҡортса",
  bar: "Boarisch",
  be: "Беларуская",
  bg: "Български",
  bh: "भोजपुरी",
  bi: "Bislama",
  bm: "Bamanankan",
  bn: "বাংলা",
  bo: "བོད་ཡིག",
  br: "Brezhoneg",
  bs: "Bosanski",
  ca: "Català",
  cdo: "Mìng-dĕ̤ng-ngṳ̄",
  ce: "Нохчийн",
  ceb: "Sinugbuanong Binisayâ",
  ch: "Chamoru",
  co: "Corsu",
  cr: "Nēhiyawēwin",
  cs: "Čeština",
  cu: "Словѣньскъ",
  cv: "Чӑвашла",
  cy: "Cymraeg",
  da: "Dansk",
  de: "Deutsch",
  dv: "ދިވެހިބަސް",
  dz: "རྫོང་ཁ",
  ee: "Eʋegbe",
  el: "Ελληνικά",
  en: "English",
  eo: "Esperanto",
  es: "Español",
  et: "Eesti",
  eu: "Euskara",
  fa: "فارسی",
  ff: "Fulfulde",
  fi: "Suomi",
  fj: "Vosa Vakaviti",
  fo: "Føroyskt",
  fr: "Français",
  fy: "Frysk",
  ga: "Gaeilge",
  gd: "Gàidhlig",
  gl: "Galego",
  gn: "Avañe'ẽ",
  gu: "ગુજરાતી",
  gv: "Gaelg",
  ha: "هَوُسَ",
  haw: "Hawaiʻi",
  he: "עברית",
  hi: "हिन्दी",
  hr: "Hrvatski",
  ht: "Kreyòl ayisyen",
  hu: "Magyar",
  ia: "Interlingua",
  id: "Bahasa Indonesia",
  ie: "Interlingue",
  ig: "Igbo",
  ilo: "Ilokano",
  io: "Ido",
  is: "Íslenska",
  it: "Italiano",
  iu: "ᐃᓄᒃᑎᑐᑦ",
  ja: "日本語",
  jbo: "Lojban",
  jv: "Basa Jawa",
  ka: "ქართული",
  kg: "Kongo",
  ki: "Gĩkũyũ",
  kk: "Қазақша",
  kl: "Kalaallisut",
  km: "ភាសាខ្មែរ",
  kn: "ಕನ್ನಡ",
  ko: "한국어",
  ks: "कॉशुर / کٲشُر",
  ku: "Kurdî",
  kv: "Коми",
  kw: "Kernowek",
  ky: "Кыргызча",
  la: "Latina",
  lb: "Lëtzebuergesch",
  lg: "Luganda",
  li: "Limburgs",
  ln: "Lingála",
  lo: "ລາວ",
  lt: "Lietuvių",
  lv: "Latviešu",
  mg: "Malagasy",
  mh: "Kajin M̧ajeļ",
  mi: "Māori",
  mk: "Македонски",
  ml: "മലയാളം",
  mn: "Монгол",
  mr: "मराठी",
  ms: "Bahasa Melayu",
  mt: "Malti",
  my: "မြန်မာဘာသာ",
  na: "Dorerin Naoero",
  nah: "Nāhuatl",
  nb: "Norsk bokmål",
  ne: "नेपाली",
  ng: "Oshiwambo",
  nl: "Nederlands",
  nn: "Norsk nynorsk",
  no: "Norsk",
  nv: "Diné bizaad",
  ny: "Chi-Chewa",
  oc: "Occitan",
  om: "Oromoo",
  or: "ଓଡ଼ିଆ",
  os: "Ирон",
  pa: "ਪੰਜਾਬੀ",
  pi: "Pāli",
  pl: "Polski",
  ps: "پښتو",
  pt: "Português",
  "pt-br": "Português (Brasil)",
  qu: "Runa Simi",
  rm: "Rumantsch",
  rn: "Kirundi",
  ro: "Română",
  ru: "Русский",
  rw: "Kinyarwanda",
  sa: "संस्कृतम्",
  sc: "Sardu",
  sd: "سنڌي",
  se: "Sámegiella",
  sg: "Sängö",
  sh: "Srpskohrvatski",
  si: "සිංහල",
  sk: "Slovenčina",
  sl: "Slovenščina",
  sm: "Gagana Samoa",
  sn: "ChiShona",
  so: "Soomaaliga",
  sq: "Shqip",
  sr: "Српски / Srpski",
  ss: "SiSwati",
  st: "Sesotho",
  su: "Basa Sunda",
  sv: "Svenska",
  sw: "Kiswahili",
  ta: "தமிழ்",
  te: "తెలుగు",
  tg: "Тоҷикӣ",
  th: "ภาษาไทย",
  ti: "ትግርኛ",
  tk: "Türkmençe",
  tl: "Wikang Tagalog",
  tn: "Setswana",
  to: "Faka Tonga",
  tr: "Türkçe",
  ts: "Xitsonga",
  tt: "Татарча",
  tw: "Twi",
  ty: "Reo Tahiti",
  ug: "ئۇيغۇرچە",
  uk: "Українська",
  ur: "اردو",
  uz: "Oʻzbekcha",
  ve: "Tshivenḓa",
  vi: "Tiếng Việt",
  vo: "Volapük",
  wa: "Walon",
  wo: "Wolof",
  xh: "isiXhosa",
  yi: "ייִדיש",
  yo: "Yorùbá",
  za: "Vahcuengh",
  zh: "中文",
  "zh-classical": "文言",
  "zh-yue": "粵語",
  zu: "isiZulu",
};

// ── 工具函数 ──────────────────────────────────────────────

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question, defaultVal = "") {
  return new Promise((resolve) => {
    const hint = defaultVal ? ` [${defaultVal}]` : "";
    rl.question(`  ${question}${hint}: `, (ans) => resolve(ans.trim() || defaultVal));
  });
}

function askRequired(question) {
  return new Promise((resolve) => {
    const retry = () => {
      rl.question(`  ${question}: `, (ans) => {
        const v = ans.trim();
        if (v) resolve(v);
        else { console.log("  (不能为空，请重新输入)"); retry(); }
      });
    };
    retry();
  });
}

function confirm(question) {
  return new Promise((resolve) => {
    rl.question(`  ${question} (y/N): `, (ans) => resolve(ans.trim().toLowerCase() === "y"));
  });
}

function choose(question, options) {
  return new Promise((resolve) => {
    options.forEach((o, i) => console.log(`  ${i + 1}. ${o}`));
    const retry = () => {
      rl.question(`  ${question} [1-${options.length}]: `, (ans) => {
        const n = parseInt(ans.trim());
        if (n >= 1 && n <= options.length) resolve(options[n - 1]);
        else { console.log(`  (请输入 1 到 ${options.length})`); retry(); }
      });
    };
    retry();
  });
}

function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]+/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "post";
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function hr(char = "─") {
  return char.repeat(44);
}

// ── 读取所有博文 ──────────────────────────────────────────

const DEFAULT_LANG = "en";

function readFrontmatter(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const titleMatch = raw.match(/^title:\s*(.+)$/m);
  const langMatch = raw.match(/^lang:\s*(.+)$/m);
  return {
    title: titleMatch ? titleMatch[1].trim() : "",
    lang: langMatch ? langMatch[1].trim() : DEFAULT_LANG,
  };
}

function scanPosts() {
  const posts = [];
  if (!fs.existsSync(POSTS_DIR)) return posts;
  for (const year of fs.readdirSync(POSTS_DIR).sort().reverse()) {
    const yearDir = path.join(POSTS_DIR, year);
    if (!fs.statSync(yearDir).isDirectory() || !/^\d{4}$/.test(year)) continue;

    for (const item of fs.readdirSync(yearDir).sort().reverse()) {
      const itemPath = path.join(yearDir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        // Folder-based: posts/YYYY/slug/en.mdx (+ other langs)
        const langFiles = fs.readdirSync(itemPath).filter((f) => f.endsWith(".mdx"));
        for (const langFile of langFiles.sort()) {
          const lang = langFile.replace(/\.mdx$/, "");
          const fm = readFrontmatter(path.join(itemPath, langFile));
          posts.push({
            year,
            slug: item,
            lang,
            isDefault: lang === DEFAULT_LANG,
            file: `posts/${year}/${item}/${langFile}`,
            title: fm.title || item,
          });
        }
      } else if (item.endsWith(".mdx")) {
        // Flat file: posts/YYYY/slug.mdx (legacy)
        const slug = item.replace(/\.mdx$/, "");
        const fm = readFrontmatter(itemPath);
        posts.push({
          year,
          slug,
          lang: fm.lang,
          isDefault: true,
          file: `posts/${year}/${item}`,
          title: fm.title || slug,
        });
      }
    }
  }
  return posts;
}

// ── 新建博文 ──────────────────────────────────────────────

async function pickLang(prompt = "语言代码") {
  console.log("\n  输入语言代码（如 zh, ru, es, fr, ja）");
  console.log("  输入 ? 显示所有支持的语言代码");
  let lang = await askRequired(prompt);
  if (lang === "?") {
    console.log("\n  支持的语言代码：");
    const entries = Object.entries(LANGUAGES);
    for (let i = 0; i < entries.length; i += 4) {
      const row = entries.slice(i, i + 4)
        .map(([code, name]) => `${code.padEnd(10)}${name}`.slice(0, 30).padEnd(32))
        .join("  ");
      console.log("  " + row);
    }
    console.log();
    lang = await askRequired(prompt);
  }
  if (!LANGUAGES[lang]) console.log(`\n  警告：未知语言代码 "${lang}"，仍然继续。`);
  return lang;
}

async function createPost() {
  console.log(`\n${hr()}`);
  console.log("  新建博文");
  console.log(hr());

  const isTranslation = await confirm("这是某篇文章的译文？");

  let lang = DEFAULT_LANG;
  let targetYear = "";
  let targetSlug = "";

  if (isTranslation) {
    // 选择要翻译的主帖（只显示默认语言的条目）
    const primaries = scanPosts().filter((p) => p.isDefault);
    if (primaries.length === 0) { console.log("\n  没有可用的主帖。"); return; }
    console.log("\n  选择要翻译的主帖：");
    const labels = primaries.map((p) => `${p.title}  (${p.file})`);
    const chosen = await choose("选择", labels);
    const original = primaries[labels.indexOf(chosen)];
    targetYear = original.year;
    targetSlug = original.slug;

    // 显示已有的译文
    const existing = scanPosts()
      .filter((p) => p.year === targetYear && p.slug === targetSlug && !p.isDefault)
      .map((p) => p.lang);
    if (existing.length > 0) {
      console.log(`\n  已有译文：${existing.map((c) => `${c} (${LANGUAGES[c] ?? c})`).join(", ")}`);
    }

    lang = await pickLang("译文语言代码");

    // 检查该译文是否已存在
    const translationPath = path.join(POSTS_DIR, targetYear, targetSlug, `${lang}.mdx`);
    if (fs.existsSync(translationPath)) {
      console.log(`\n  ✗ 译文已存在：posts/${targetYear}/${targetSlug}/${lang}.mdx`);
      return;
    }

    // 读取原文标题作为默认值
    const origFile = path.join(POSTS_DIR, targetYear, targetSlug, `${DEFAULT_LANG}.mdx`);
    const origFm = fs.existsSync(origFile) ? readFrontmatter(origFile) : { title: targetSlug };
    const title = await ask("译文标题", origFm.title);
    const summary = await ask("摘要（可留空）");

    const postDir = path.join(POSTS_DIR, targetYear, targetSlug);
    // Read date/category/tags from original
    const origRaw = fs.existsSync(origFile) ? fs.readFileSync(origFile, "utf-8") : "";
    const dateMatch = origRaw.match(/^date:\s*(.+)$/m);
    const categoryMatch = origRaw.match(/^category:\s*(.+)$/m);
    const tagsMatch = origRaw.match(/^tags:\s*(.+)$/m);

    const lines = [
      "---",
      `title: ${title}`,
      dateMatch ? `date: ${dateMatch[1].trim()}` : `date: ${today()}`,
      categoryMatch ? `category: ${categoryMatch[1].trim()}` : null,
      summary ? `summary: ${summary}` : null,
      `lang: ${lang}`,
      tagsMatch ? `tags: ${tagsMatch[1].trim()}` : null,
      "---",
      "",
      "在这里开始写译文。",
      "",
    ].filter((l) => l !== null).join("\n");

    fs.writeFileSync(path.join(postDir, `${lang}.mdx`), lines, "utf-8");
    console.log(`\n  ✓ 已创建：posts/${targetYear}/${targetSlug}/${lang}.mdx`);
    console.log(`    译文语言：${lang} (${LANGUAGES[lang] ?? lang})`);
    console.log(`    URL：/en/blog/${targetYear}/${targetSlug}/${lang}`);
    console.log(`\n  发布：`);
    console.log(`    git add posts/${targetYear}/${targetSlug}/${lang}.mdx && git commit -m "add: ${title} (${lang})" && git push`);
    return;
  }

  // ── 主帖 ─────────────────────────────────────────────────
  console.log();
  const title = await askRequired("标题");
  const rawSlug = await ask("URL Slug（留空自动生成）");
  const slug = rawSlug || toSlug(title);
  const date = await ask("日期", today());
  const year = date.slice(0, 4);
  const category = await ask("分类", "Notes");
  const readingTime = await ask("阅读时长（留空自动计算）");
  const eyebrow = await ask("Eyebrow 标签（可留空）");
  const summary = await ask("摘要（可留空）");
  const tagsRaw = await ask("标签（逗号分隔，如 linux,infra,notes）");
  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const featured = await confirm("加入 Featured 精选列表？");

  // ── 写文件 ────────────────────────────────────────────────
  const postDir = path.join(POSTS_DIR, year, slug);
  if (fs.existsSync(postDir)) {
    console.log(`\n  ✗ 文件夹已存在：posts/${year}/${slug}/`);
    return;
  }
  fs.mkdirSync(postDir, { recursive: true });

  const filePath = path.join(postDir, `${DEFAULT_LANG}.mdx`);

  const lines = [
    "---",
    `title: ${title}`,
    `date: ${date}`,
    `category: ${category}`,
    readingTime ? `readingTime: ${readingTime}` : null,
    eyebrow ? `eyebrow: ${eyebrow}` : null,
    summary ? `summary: ${summary}` : null,
    `featured: ${featured}`,
    `lang: ${DEFAULT_LANG}`,
    tags.length ? `tags: [${tags.join(", ")}]` : null,
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

  fs.writeFileSync(filePath, lines, "utf-8");

  console.log(`\n  ✓ 已创建：posts/${year}/${slug}/${DEFAULT_LANG}.mdx`);
  console.log(`    URL：/en/blog/${year}/${slug}`);
  console.log(`\n  添加译文：`);
  console.log(`    npm run post  → 选 "新建博文" → 选 "这是某篇文章的译文？"`);
  console.log(`\n  发布：`);
  console.log(`    git add posts/${year}/${slug}/ && git commit -m "add: ${title}" && git push`);
}

// ── 删除博文 ──────────────────────────────────────────────

async function deletePost() {
  console.log(`\n${hr()}`);
  console.log("  删除博文");
  console.log(hr());

  const posts = scanPosts();
  if (posts.length === 0) { console.log("\n  没有博文可删除。"); return; }

  // Group by year/slug for display
  const groups = {};
  for (const p of posts) {
    const key = `${p.year}/${p.slug}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  }

  const groupKeys = Object.keys(groups);
  const labels = groupKeys.map((key) => {
    const entries = groups[key];
    const primary = entries.find((e) => e.isDefault) || entries[0];
    const langs = entries.map((e) => e.lang).join(", ");
    return `${primary.title}  [${langs}]  posts/${key}/`;
  });

  console.log("\n  选择要删除的博文：");
  const chosen = await choose("选择", labels);
  const key = groupKeys[labels.indexOf(chosen)];
  const entries = groups[key];
  const primary = entries.find((e) => e.isDefault) || entries[0];
  const [year, slug] = key.split("/");

  const translations = entries.filter((e) => !e.isDefault);
  const isFolderBased = primary.file.includes(`/${slug}/`);

  if (isFolderBased) {
    console.log(`\n  将要删除文件夹：posts/${year}/${slug}/`);
    if (translations.length > 0) {
      console.log(`  包含 ${entries.length} 个语言文件：${entries.map((e) => e.lang).join(", ")}`);
    }
    if (!await confirm("确认删除整个文件夹？")) return;
    fs.rmSync(path.join(POSTS_DIR, year, slug), { recursive: true, force: true });
    console.log(`  ✓ 已删除：posts/${year}/${slug}/`);
  } else {
    // Flat file — only one file
    console.log(`\n  将要删除：${primary.file}`);
    if (!await confirm("确认删除？")) return;
    fs.unlinkSync(path.join(ROOT, primary.file));
    console.log(`  ✓ 已删除：${primary.file}`);
  }
}

// ── 列出所有博文 ──────────────────────────────────────────

function listPosts() {
  console.log(`\n${hr()}`);
  console.log("  所有博文");
  console.log(hr());

  const posts = scanPosts();
  if (posts.length === 0) { console.log("\n  暂无博文。"); return; }

  // Group by year/slug
  const seen = new Set();
  let lastYear = "";
  for (const p of posts) {
    if (!p.isDefault) continue; // Print each post once from the primary entry
    const key = `${p.year}/${p.slug}`;
    if (seen.has(key)) continue;
    seen.add(key);

    if (p.year !== lastYear) {
      console.log(`\n  ${p.year}`);
      lastYear = p.year;
    }

    const allLangs = posts.filter((e) => e.year === p.year && e.slug === p.slug).map((e) => e.lang);
    const langStr = allLangs.length > 1 ? `  [${allLangs.join(", ")}]` : "";
    console.log(`    ${p.slug}/${langStr}`);
    console.log(`      ${p.title}`);
  }

  // Also list flat files (legacy)
  for (const p of posts) {
    if (!p.isDefault || p.file.includes(`/${p.slug}/`)) continue;
    const key = `${p.year}/${p.slug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (p.year !== lastYear) {
      console.log(`\n  ${p.year}`);
      lastYear = p.year;
    }
    console.log(`    ${p.slug}.mdx  [flat]`);
    console.log(`      ${p.title}`);
  }

  console.log();
}

// ── 主菜单 ────────────────────────────────────────────────

async function main() {
  console.log(`\n${"═".repeat(44)}`);
  console.log("  Ode 博文管理");
  console.log("═".repeat(44));

  while (true) {
    console.log(`\n  1. 新建博文`);
    console.log(`  2. 删除博文`);
    console.log(`  3. 列出所有博文`);
    console.log(`  4. 退出`);
    console.log();

    const choice = await ask("选择操作", "1");

    if (choice === "1") await createPost();
    else if (choice === "2") await deletePost();
    else if (choice === "3") listPosts();
    else if (choice === "4") break;
    else console.log("  (请输入 1–4)");
  }

  rl.close();
  console.log("\n  再见。\n");
}

main().catch((err) => { console.error(err); rl.close(); process.exit(1); });
