export interface NavbarTranslations {
  home: string;
  skills: string;
  projects: string;
  experience: string;
  about: string;
  brand: string;
  aria: {
    mainNav: string;
    openMenu: string;
    closeMenu: string;
    mobileMenu: string;
    menu: string;
  };
}

export interface FooterTranslations {
  tagline: string;
}

export interface HeroTranslations {
  subtitle: string;
  title: string;
  description: string;
  alt: string;
  social: {
    gmail: string;
    linkedin: string;
    github: string;
  };
  cta: string;
}

export interface TechnologiesTranslations {
  heading: string;
  frontend: {
    title: string;
    description: string;
  };
  backend: {
    title: string;
    description: string;
  };
}

export interface EducationTranslations {
  heading: string;
  degrees: {
    title: string;
    institution: string;
    period: string;
  }[];
  cta: string;
}

export interface ExperienceTranslations {
  eyebrow: string;
  heading: string;
  description: string;
}

export interface AboutPilar {
  titulo: string;
  descripcion: string;
  icono: string;
}

export interface AboutTranslations {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  focusLabel: string;
  focusTitle: string;
  focusDescription: string;
  pilares: AboutPilar[];
}

export interface ProjectsTranslations {
  eyebrow: string;
  heading: string;
  description: string;
  badge: {
    principal: string;
    featured: string;
  };
  aria: {
    detailPrefix: string;
    technologies: string;
  };
  cta: {
    detail: string;
    demo: string;
    github: string;
  };
  detail: {
    back: string;
    stack: string;
    features: string;
    architecture: string;
    architectureHeading: string;
    architectureDescription: string;
    demoHeading: string;
    demoAriaPrefix: string;
    videoFallback: string;
    screenshots: string;
    screenshotsHeading: string;
    screenshotsDescription: string;
    desktopScreenshots: string;
    mobileScreenshots: string;
    challenges: string;
    cta: {
      demo: string;
      code: string;
    };
  };
}

export interface ContactTranslations {
  eyebrow: string;
  title: string;
  description: string;
  emailLabel: string;
  emailText: string;
  whatsappLabel: string;
  whatsappText: string;
  aria: {
    email: string;
    whatsapp: string;
  };
}
