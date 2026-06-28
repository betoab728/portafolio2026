import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type Locale } from "./i18n/config";

function detectLocale(url: URL, request: Request): Locale {
  try {
    // 1. Cookie preference
    const cookie = request.headers.get("cookie") ?? "";
    const match = cookie.match(/preferred_locale=(\w+)/);
    if (match && SUPPORTED_LOCALES.includes(match[1] as Locale)) {
      return match[1] as Locale;
    }

    // 2. Accept-Language header
    const header = request.headers.get("accept-language") ?? "";
    const first = header.split(",")[0]?.trim().slice(0, 2).toLowerCase();
    if (first && SUPPORTED_LOCALES.includes(first as Locale)) {
      return first as Locale;
    }
  } catch {
    // Headers not available during SSG
  }

  // 3. Fallback
  return DEFAULT_LOCALE;
}

export const onRequest = (context: import("astro").APIContext, next: import("astro").MiddlewareNext) => {
  const url = new URL(context.request.url);
  const segments = url.pathname.split("/").filter(Boolean);
  const pathLocale = segments[0];

  // If the first segment is a supported locale, set it and continue
  if (pathLocale && SUPPORTED_LOCALES.includes(pathLocale as Locale)) {
    context.locals.locale = pathLocale as Locale;
    return next();
  }

  // Redirect root to detected locale
  const locale = detectLocale(url, context.request);
  const rest = segments.length > 0 ? `/${segments.join("/")}` : "";
  const target = `/${locale}${rest}${url.search}${url.hash}`;

  return context.redirect(target);
};
