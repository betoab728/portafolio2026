import type { Locale } from "../../i18n/config";
import type { Proyecto } from "../../types/proyecto";

import { proyectos as es } from "./es";
import { proyectos as en } from "./en";

const proyectosPorLocale: Record<Locale, Proyecto[]> = { es, en };

export function getProyectos(locale: Locale): Proyecto[] {
  return proyectosPorLocale[locale] ?? proyectosPorLocale.es;
}

export function getProyectosDestacados(locale: Locale): Proyecto[] {
  return getProyectos(locale).filter((p) => p.destacado);
}

export function getProyectoBySlug(locale: Locale, slug: string): Proyecto | undefined {
  return getProyectos(locale).find((p) => p.slug === slug);
}
