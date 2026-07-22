import type { Experiencia } from "../../types/experiencia";

export const experiencias: Experiencia[] = [
  {
    empresa: "Mikipu S.A.C",
    ubicacion: "Lima",
    periodo: "Marzo 2025",
    rol: "Desarrollador de software POS",
    resumen:
      "Desarrollo de funcionalidades para Xacto POS, una solucion orientada a operaciones gastronomicas con arquitectura distribuida, continuidad offline y emision electronica.",
    logros: [
      "Implementacion de arquitectura distribuida local-servidor para operacion resiliente.",
      "Desarrollo de modulos de pedidos, mesas, cuentas y sincronizacion offline.",
      "Integracion de boletas, facturas y comandas electronicas dentro del flujo POS.",
      "Participacion en mejora continua de soluciones POS para restaurantes.",
    ],
    tecnologias: ["POS", "Backend", "Sincronizacion offline", "Facturacion electronica"],
    icono: "pos",
  },
  {
    empresa: "Grupo Optico CT",
    ubicacion: "Piura",
    periodo: "Febrero 2016 - Diciembre 2024",
    rol: "Desarrollador full stack e infraestructura",
    resumen:
      "Liderazgo tecnico en sistemas internos para operacion optica, combinando ERP, salud, movilidad, servidores y seguridad informatica.",
    logros: [
      "Desarrollo e implementacion de ERP con facturacion electronica para procesos comerciales y clinicos.",
      "Construccion de plataforma de triaje COVID para control y registro sanitario.",
      "Desarrollo de aplicacion movil Kotlin con backend .NET 8, autenticacion JWT y servicios protegidos.",
      "Digitalizacion de historiales clinicos para mejorar trazabilidad y consulta operativa.",
      "Implementacion de redes, servidores y controles de seguridad informatica.",
    ],
    tecnologias: ["ERP", ".NET 8", "Kotlin", "JWT", "Servidores", "Redes"],
    icono: "erp",
  },
  {
    empresa: "Veterinaria Allqovet",
    periodo: "Marzo 2023 - Agosto 2023",
    rol: "Desarrollador web",
    resumen:
      "Desarrollo de una presencia digital corporativa para comunicar servicios veterinarios y facilitar la interaccion con clientes.",
    logros: [
      "Construccion de pagina web corporativa responsiva con HTML, CSS, JavaScript y PHP.",
      "Estructuracion visual de servicios, equipo profesional, contacto y contenido institucional.",
      "Optimizacion de la experiencia en dispositivos moviles y escritorio.",
    ],
    tecnologias: ["HTML", "CSS", "JavaScript", "PHP"],
    icono: "web",
  },
  {
    empresa: "Agente de Pagos Valentino",
    periodo: "Agosto 2021 - Diciembre 2021",
    rol: "Desarrollador de sistemas",
    resumen:
      "Automatizacion de procesos de cobranza para mejorar control operativo, registro de pagos y consulta de informacion financiera.",
    logros: [
      "Desarrollo de sistema de cobranzas con C# y MySQL.",
      "Modelado de datos para clientes, pagos y control de saldos.",
      "Creacion de interfaz operativa enfocada en registro rapido y consulta confiable.",
    ],
    tecnologias: ["C#", "MySQL", "Desktop", "Cobranzas"],
    icono: "finance",
  },
  {
    empresa: "Inversiones Riveralens",
    periodo: "Agosto 2018 - Julio 2021",
    rol: "Desarrollador ERP e infraestructura",
    resumen:
      "Implementacion de soluciones de gestion empresarial y base tecnologica para sostener operaciones comerciales con facturacion electronica.",
    logros: [
      "Desarrollo de ERP con facturacion electronica para procesos de venta y administracion.",
      "Implementacion de servidor Ubuntu para centralizar servicios internos.",
      "Configuracion de red empresarial para mejorar conectividad, disponibilidad y control.",
    ],
    tecnologias: ["ERP", "Facturacion electronica", "Ubuntu Server", "Red empresarial"],
    icono: "infra",
  },
];
