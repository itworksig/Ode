import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "posts");
export const DEFAULT_LANG = "en";

export type PostMeta = {
  slug: string;
  year: string;
  lang: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  readingTime: string;
  summary: string;
  eyebrow: string;
  featured: boolean;
};

export type Post = PostMeta & { content: string };

export type AdjacentPost = { slug: string; year: string; title: string } | null;

export type TranslationSibling = {
  lang: string;
  langName: string;
  title: string;
  year: string;
  slug: string;
  isDefault: boolean;
};

// ── Language display names (MediaWiki-style, 183 codes) ───

const LANG_NAMES: Record<string, string> = {
  af:"Afrikaans",ak:"Akan",sq:"Shqip",gsw:"Alemannisch",am:"አማርኛ",an:"Aragonés",
  ar:"العربية",arc:"ܐܪܡܝܐ",hy:"Հայերեն",as:"অসমীয়া",ast:"Asturianu",av:"Авар",
  ay:"Aymar",az:"Azərbaycanca",ba:"Башҡортса",bar:"Boarisch",be:"Беларуская",
  bg:"Български",bh:"भोजपुरी",bi:"Bislama",bm:"Bamanankan",bn:"বাংলা",bo:"བོད་ཡིག",
  br:"Brezhoneg",bs:"Bosanski",ca:"Català",cdo:"Mìng-dĕ̤ng-ngṳ̄",ce:"Нохчийн",
  ceb:"Sinugbuanong Binisayâ",ch:"Chamoru",co:"Corsu",cr:"Nēhiyawēwin",cs:"Čeština",
  cu:"Словѣньскъ",cv:"Чӑвашла",cy:"Cymraeg",da:"Dansk",de:"Deutsch",dv:"ދިވެހިބަސް",
  dz:"རྫོང་ཁ",ee:"Eʋegbe",el:"Ελληνικά",en:"English",eo:"Esperanto",es:"Español",
  et:"Eesti",eu:"Euskara",fa:"فارسی",ff:"Fulfulde",fi:"Suomi",fj:"Vosa Vakaviti",
  fo:"Føroyskt",fr:"Français",fy:"Frysk",ga:"Gaeilge",gd:"Gàidhlig",gl:"Galego",
  gn:"Avañe'ẽ",gu:"ગુજરાતી",gv:"Gaelg",ha:"هَوُسَ",haw:"Hawaiʻi",he:"עברית",
  hi:"हिन्दी",hr:"Hrvatski",ht:"Kreyòl ayisyen",hu:"Magyar",ia:"Interlingua",
  id:"Bahasa Indonesia",ie:"Interlingue",ig:"Igbo",ilo:"Ilokano",io:"Ido",
  is:"Íslenska",it:"Italiano",iu:"ᐃᓄᒃᑎᑐᑦ",ja:"日本語",jbo:"Lojban",jv:"Basa Jawa",
  ka:"ქართული",kg:"Kongo",ki:"Gĩkũyũ",kk:"Қазақша",kl:"Kalaallisut",km:"ភាសាខ្មែរ",
  kn:"ಕನ್ನಡ",ko:"한국어",ks:"कॉशुर",ku:"Kurdî",kv:"Коми",kw:"Kernowek",ky:"Кыргызча",
  la:"Latina",lb:"Lëtzebuergesch",lg:"Luganda",li:"Limburgs",ln:"Lingála",lo:"ລາວ",
  lt:"Lietuvių",lv:"Latviešu",mg:"Malagasy",mh:"Kajin M̧ajeļ",mi:"Māori",mk:"Македонски",
  ml:"മലയാളം",mn:"Монгол",mr:"मराठी",ms:"Bahasa Melayu",mt:"Malti",my:"မြန်မာဘာသာ",
  na:"Dorerin Naoero",nah:"Nāhuatl",nb:"Norsk bokmål",ne:"नेपाली",ng:"Oshiwambo",
  nl:"Nederlands",nn:"Norsk nynorsk",no:"Norsk",nv:"Diné bizaad",ny:"Chi-Chewa",
  oc:"Occitan",om:"Oromoo",or:"ଓଡ଼ିଆ",os:"Ирон",pa:"ਪੰਜਾਬੀ",pi:"Pāli",pl:"Polski",
  ps:"پښتو",pt:"Português","pt-br":"Português (Brasil)",qu:"Runa Simi",rm:"Rumantsch",
  rn:"Kirundi",ro:"Română",ru:"Русский",rw:"Kinyarwanda",sa:"संस्कृतम्",sc:"Sardu",
  sd:"سنڌي",se:"Sámegiella",sg:"Sängö",sh:"Srpskohrvatski",si:"සිංහල",sk:"Slovenčina",
  sl:"Slovenščina",sm:"Gagana Samoa",sn:"ChiShona",so:"Soomaaliga",sr:"Српски",
  ss:"SiSwati",st:"Sesotho",su:"Basa Sunda",sv:"Svenska",sw:"Kiswahili",ta:"தமிழ்",
  te:"తెలుగు",tg:"Тоҷикӣ",th:"ภาษาไทย",ti:"ትግርኛ",tk:"Türkmençe",tl:"Wikang Tagalog",
  tn:"Setswana",to:"Faka Tonga",tr:"Türkçe",ts:"Xitsonga",tt:"Татарча",tw:"Twi",
  ty:"Reo Tahiti",ug:"ئۇيغۇرچە",uk:"Українська",ur:"اردو",uz:"Oʻzbekcha",
  ve:"Tshivenḓa",vi:"Tiếng Việt",vo:"Volapük",wa:"Walon",wo:"Wolof",xh:"isiXhosa",
  yi:"ייִדיש",yo:"Yorùbá",za:"Vahcuengh",zh:"中文","zh-classical":"文言","zh-yue":"粵語",
  zu:"isiZulu",
};

export function langName(code: string): string {
  return LANG_NAMES[code] ?? code.toUpperCase();
}

export function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

// ── Reading time estimator ────────────────────────────────

function estimateReadingTime(content: string): string {
  const stripped = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/[#*_~>|[\]()]/g, "")
    .trim();
  const words = stripped.split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

// ── Filesystem helpers ────────────────────────────────────

/**
 * Supports two layouts:
 *   posts/YYYY/slug/en.mdx   ← folder-based (multi-language)
 *   posts/YYYY/slug.mdx      ← flat file (single-language, treated as DEFAULT_LANG)
 */
function readPostEntries(): Array<{ year: string; slug: string }> {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const entries: Array<{ year: string; slug: string }> = [];
  for (const year of fs.readdirSync(POSTS_DIR)) {
    const yearDir = path.join(POSTS_DIR, year);
    if (!fs.statSync(yearDir).isDirectory() || !/^\d{4}$/.test(year)) continue;
    for (const item of fs.readdirSync(yearDir)) {
      const itemPath = path.join(yearDir, item);
      const stat = fs.statSync(itemPath);
      if (stat.isDirectory()) {
        if (fs.existsSync(path.join(itemPath, `${DEFAULT_LANG}.mdx`))) {
          entries.push({ year, slug: item });
        }
      } else if (item.endsWith(".mdx")) {
        entries.push({ year, slug: item.replace(/\.mdx$/, "") });
      }
    }
  }
  return entries;
}

/** All lang codes available for a post */
export function getAvailableLangs(year: string, slug: string): string[] {
  const dir = path.join(POSTS_DIR, year, slug);
  if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
    return fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")).map((f) => f.replace(/\.mdx$/, ""));
  }
  // flat file: only default lang
  const flat = path.join(POSTS_DIR, year, `${slug}.mdx`);
  return fs.existsSync(flat) ? [DEFAULT_LANG] : [];
}

function parseTags(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(String).map((t) => t.trim()).filter(Boolean);
  return String(raw).split(",").map((t) => t.trim()).filter(Boolean);
}

function parsePost(year: string, slug: string, lang = DEFAULT_LANG): Post | null {
  // Try folder-based layout first
  let filePath = path.join(POSTS_DIR, year, slug, `${lang}.mdx`);
  // Fall back to flat file for the default language
  if (!fs.existsSync(filePath) && lang === DEFAULT_LANG) {
    filePath = path.join(POSTS_DIR, year, `${slug}.mdx`);
  }
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    year,
    lang,
    title: data.title ?? slug,
    date: data.date
      ? data.date instanceof Date
        ? data.date.toISOString().slice(0, 10)
        : String(data.date).slice(0, 10)
      : "",
    category: data.category ?? "",
    tags: parseTags(data.tags),
    readingTime: data.readingTime ?? estimateReadingTime(content),
    summary: data.summary ?? "",
    eyebrow: data.eyebrow ?? "",
    featured: data.featured === true,
    content,
  };
}

// ── Public API ────────────────────────────────────────────

export function getAllPosts(): PostMeta[] {
  return readPostEntries()
    .map(({ year, slug }) => parsePost(year, slug))
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getFeaturedPosts(): PostMeta[] {
  return getAllPosts().filter((p) => p.featured);
}

export function getPostBySlug(year: string, slug: string, lang = DEFAULT_LANG): Post | null {
  return parsePost(year, slug, lang);
}

export function getAdjacentPosts(
  year: string,
  slug: string
): { prev: AdjacentPost; next: AdjacentPost } {
  const all = getAllPosts();
  const idx = all.findIndex((p) => p.year === year && p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx < all.length - 1 ? all[idx + 1] : null,
    next: idx > 0 ? all[idx - 1] : null,
  };
}

export function getTranslations(
  year: string,
  slug: string,
  currentLang: string
): TranslationSibling[] {
  return getAvailableLangs(year, slug)
    .filter((lang) => lang !== currentLang)
    .map((lang) => {
      const post = parsePost(year, slug, lang);
      return post
        ? {
            lang,
            langName: langName(lang),
            title: post.title,
            year,
            slug,
            isDefault: lang === DEFAULT_LANG,
          }
        : null;
    })
    .filter((t): t is TranslationSibling => t !== null);
}

export function getAllCategories(): { name: string; slug: string; count: number }[] {
  const map = new Map<string, number>();
  for (const p of getAllPosts()) {
    if (p.category) map.set(p.category, (map.get(p.category) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, slug: toSlug(name), count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllTags(): { name: string; slug: string; count: number }[] {
  const map = new Map<string, number>();
  for (const p of getAllPosts()) {
    for (const tag of p.tags) map.set(tag, (map.get(tag) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, slug: toSlug(name), count }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByCategory(categorySlug: string): PostMeta[] {
  return getAllPosts().filter((p) => toSlug(p.category) === categorySlug);
}

export function getPostsByTag(tagSlug: string): PostMeta[] {
  return getAllPosts().filter((p) => p.tags.some((t) => toSlug(t) === tagSlug));
}
