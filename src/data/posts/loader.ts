import type { Locale } from "../../i18n/config";
import type { Post } from "../../types/post";
import { getSupabaseClient } from "../../lib/supabase";

interface PostRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  seo_description: string | null;
  cover_image: string | null;
  locale: Locale;
  reading_time: number | null;
  published_at: string | null;
  created_at: string;
  translation_group: string;
  status: string;
}

function mapPost(row: PostRow): Post {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    seoDescription: row.seo_description,
    coverImage: row.cover_image,
    locale: row.locale,
    readingTime: row.reading_time,
    publishedAt: row.published_at,
    translationGroup: row.translation_group,
  };
}

export async function getPosts(locale: Locale): Promise<Post[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("locale", locale)
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as PostRow[]).map(mapPost);
}

export async function getPostBySlug(
  locale: Locale,
  slug: string
): Promise<Post | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("locale", locale)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  return data ? mapPost(data as PostRow) : null;
}

export async function getTranslatedSlug(
  translationGroup: string,
  targetLocale: Locale
): Promise<string | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("posts")
    .select("slug")
    .eq("translation_group", translationGroup)
    .eq("locale", targetLocale)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  return (data as { slug: string } | null)?.slug ?? null;
}
