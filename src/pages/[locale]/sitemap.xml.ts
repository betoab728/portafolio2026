import type { Locale } from "../../i18n/config";
import { getPosts } from "../../data/posts/loader";
import { getProyectos } from "../../data/proyectos/loader";

const SITE = "https://portafolio2026-seven.vercel.app";
const ALL_LOCALES: Locale[] = ["es", "en"];

export async function getStaticPaths() {
  return [
    { params: { locale: "es" } },
    { params: { locale: "en" } },
  ];
}

export async function GET() {
  const urls: string[] = [];

  function addUrl(path: string) {
    const url = `${SITE}${path}`;
    if (!urls.includes(url)) urls.push(url);
  }

  addUrl("/es/");
  addUrl("/en/");

  for (const loc of ALL_LOCALES) {
    const proyectos = getProyectos(loc);
    for (const p of proyectos) {
      addUrl(`/${loc}/proyectos/${p.slug}/`);
    }
  }

  addUrl("/es/blog/");
  addUrl("/en/blog/");

  const allPosts = [
    ...(await getPosts("es")),
    ...(await getPosts("en")),
  ];

  const postsByGroup = new Map<string, { locale: Locale; slug: string }[]>();
  for (const post of allPosts) {
    const group = postsByGroup.get(post.translationGroup) ?? [];
    group.push({ locale: post.locale, slug: post.slug });
    postsByGroup.set(post.translationGroup, group);
  }

  for (const post of allPosts) {
    addUrl(`/${post.locale}/blog/${post.slug}/`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map((url) => {
    const pathLocale = url.replace(SITE, "").split("/")[1] as Locale;
    if (!ALL_LOCALES.includes(pathLocale)) {
      return `  <url>\n    <loc>${url}</loc>\n  </url>`;
    }

    const pathWithoutLocale = url.replace(SITE, "").replace(/^\/[a-z]{2}/, "");

    const alternates: string[] = [];
    for (const loc of ALL_LOCALES) {
      if (loc === pathLocale) continue;

      let altPath: string | null = null;

      if (pathWithoutLocale.startsWith("/blog/")) {
        const slug = pathWithoutLocale.replace("/blog/", "").replace(/\/$/, "");
        const group = postsByGroup.get(
          allPosts.find(
            (p) => p.locale === pathLocale && p.slug === slug
          )?.translationGroup ?? ""
        );
        const translation = group?.find((p) => p.locale === loc);
        if (translation) {
          altPath = `/${loc}/blog/${translation.slug}/`;
        }
      } else {
        altPath = `/${loc}${pathWithoutLocale}`;
      }

      if (altPath) {
        alternates.push(
          `    <xhtml:link rel="alternate" hreflang="${loc}" href="${SITE}${altPath}" />`
        );
      }
    }

    if (alternates.length > 0) {
      return `  <url>\n    <loc>${url}</loc>\n${alternates.join("\n")}\n  </url>`;
    }
    return `  <url>\n    <loc>${url}</loc>\n  </url>`;
  })
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: { "Content-Type": "application/xml" },
  });
}
