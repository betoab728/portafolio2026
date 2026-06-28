import type { Locale } from "../../i18n/config";
import type { Experiencia } from "../../types/experiencia";

import { experiencias as es } from "./es";
import { experiencias as en } from "./en";

const experienciasPorLocale: Record<Locale, Experiencia[]> = { es, en };

export function getExperiencias(locale: Locale): Experiencia[] {
  return experienciasPorLocale[locale] ?? experienciasPorLocale.es;
}
