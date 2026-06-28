import type { Experiencia } from "../../types/experiencia";

export const experiencias: Experiencia[] = [
  {
    empresa: "Mikipu S.A.C",
    ubicacion: "Lima",
    periodo: "March 2025 - Present",
    rol: "POS Software Developer",
    resumen:
      "Development of features for Xacto POS, a solution focused on food service operations with distributed architecture, offline continuity and electronic invoicing.",
    logros: [
      "Implementation of distributed local-server architecture for resilient operations.",
      "Development of order, table, billing and offline sync modules.",
      "Integration of receipts, invoices and electronic kitchen orders within the POS workflow.",
      "Participation in continuous improvement of POS solutions for restaurants.",
    ],
    tecnologias: ["POS", "Backend", "Offline Sync", "Electronic Invoicing"],
    icono: "pos",
  },
  {
    empresa: "Grupo Optico CT",
    ubicacion: "Piura",
    periodo: "February 2016 - December 2024",
    rol: "Full Stack Developer & Infrastructure",
    resumen:
      "Technical leadership in internal systems for optical operations, combining ERP, healthcare, mobility, servers and IT security.",
    logros: [
      "Development and implementation of ERP with electronic invoicing for commercial and clinical processes.",
      "Built a COVID triage platform for health screening and record-keeping.",
      "Developed Kotlin mobile app with .NET 8 backend, JWT authentication and protected services.",
      "Digitized clinical records to improve traceability and operational queries.",
      "Implementation of networks, servers and IT security controls.",
    ],
    tecnologias: ["ERP", ".NET 8", "Kotlin", "JWT", "Servers", "Networking"],
    icono: "erp",
  },
  {
    empresa: "Veterinaria Allqovet",
    periodo: "March 2023 - August 2023",
    rol: "Web Developer",
    resumen:
      "Development of a corporate digital presence to communicate veterinary services and facilitate customer interaction.",
    logros: [
      "Built a responsive corporate website using HTML, CSS, JavaScript and PHP.",
      "Visual structuring of services, professional team, contact and institutional content.",
      "Optimized experience across mobile and desktop devices.",
    ],
    tecnologias: ["HTML", "CSS", "JavaScript", "PHP"],
    icono: "web",
  },
  {
    empresa: "Agente de Pagos Valentino",
    periodo: "August 2021 - December 2021",
    rol: "Systems Developer",
    resumen:
      "Automation of collection processes to improve operational control, payment registration and financial information queries.",
    logros: [
      "Developed a collections system with C# and MySQL.",
      "Data modeling for clients, payments and balance tracking.",
      "Created an operational interface focused on fast registration and reliable queries.",
    ],
    tecnologias: ["C#", "MySQL", "Desktop", "Collections"],
    icono: "finance",
  },
  {
    empresa: "Inversiones Riveralens",
    periodo: "August 2018 - July 2021",
    rol: "ERP Developer & Infrastructure",
    resumen:
      "Implementation of business management solutions and technology infrastructure to support commercial operations with electronic invoicing.",
    logros: [
      "Developed an ERP with electronic invoicing for sales and administration processes.",
      "Deployed Ubuntu Server to centralize internal services.",
      "Configured enterprise network to improve connectivity, availability and control.",
    ],
    tecnologias: ["ERP", "Electronic Invoicing", "Ubuntu Server", "Enterprise Network"],
    icono: "infra",
  },
];
