import type { Locale } from "../i18n/config";

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  seoDescription: string | null;
  coverImage: string | null;
  locale: Locale;
  readingTime: number | null;
  publishedAt: string | null;
  translationGroup: string;
}
