import type { Locale } from "./config";
import type {
  NavbarTranslations,
  FooterTranslations,
  HeroTranslations,
  TechnologiesTranslations,
  EducationTranslations,
  ExperienceTranslations,
  AboutTranslations,
  ProjectsTranslations,
  ContactTranslations,
} from "./types";

import { navbar as navbarEs } from "./es/navbar";
import { footer as footerEs } from "./es/footer";
import { hero as heroEs } from "./es/hero";
import { technologies as technologiesEs } from "./es/technologies";
import { education as educationEs } from "./es/education";
import { experience as experienceEs } from "./es/experience";
import { about as aboutEs } from "./es/about";
import { projects as projectsEs } from "./es/projects";
import { contact as contactEs } from "./es/contact";

import { navbar as navbarEn } from "./en/navbar";
import { footer as footerEn } from "./en/footer";
import { hero as heroEn } from "./en/hero";
import { technologies as technologiesEn } from "./en/technologies";
import { education as educationEn } from "./en/education";
import { experience as experienceEn } from "./en/experience";
import { about as aboutEn } from "./en/about";
import { projects as projectsEn } from "./en/projects";
import { contact as contactEn } from "./en/contact";

const navbarMap: Record<Locale, NavbarTranslations> = { es: navbarEs, en: navbarEn };
const footerMap: Record<Locale, FooterTranslations> = { es: footerEs, en: footerEn };
const heroMap: Record<Locale, HeroTranslations> = { es: heroEs, en: heroEn };
const technologiesMap: Record<Locale, TechnologiesTranslations> = { es: technologiesEs, en: technologiesEn };
const educationMap: Record<Locale, EducationTranslations> = { es: educationEs, en: educationEn };
const experienceMap: Record<Locale, ExperienceTranslations> = { es: experienceEs, en: experienceEn };
const aboutMap: Record<Locale, AboutTranslations> = { es: aboutEs, en: aboutEn };
const projectsMap: Record<Locale, ProjectsTranslations> = { es: projectsEs, en: projectsEn };
const contactMap: Record<Locale, ContactTranslations> = { es: contactEs, en: contactEn };

export function getNavbar(locale: Locale): NavbarTranslations {
  return navbarMap[locale] ?? navbarEs;
}

export function getFooter(locale: Locale): FooterTranslations {
  return footerMap[locale] ?? footerEs;
}

export function getHero(locale: Locale): HeroTranslations {
  return heroMap[locale] ?? heroEs;
}

export function getTechnologies(locale: Locale): TechnologiesTranslations {
  return technologiesMap[locale] ?? technologiesEs;
}

export function getEducation(locale: Locale): EducationTranslations {
  return educationMap[locale] ?? educationEs;
}

export function getExperience(locale: Locale): ExperienceTranslations {
  return experienceMap[locale] ?? experienceEs;
}

export function getAbout(locale: Locale): AboutTranslations {
  return aboutMap[locale] ?? aboutEs;
}

export function getProjects(locale: Locale): ProjectsTranslations {
  return projectsMap[locale] ?? projectsEs;
}

export function getContact(locale: Locale): ContactTranslations {
  return contactMap[locale] ?? contactEs;
}
