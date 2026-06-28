import type { Proyecto } from "../../types/proyecto";

export const proyectos: Proyecto[] = [
  {
    titulo: "Waste Management and Traceability System with Blockchain",
    descripcion:
      "Web platform and mobile app for operational waste management and real-time traceability, featuring GPS tracking, Ethereum blockchain validation, and a distributed client-server architecture.",
    resumen:
      "Enterprise platform developed for Azul Sostenible S.A.C., an EO-RS waste management operator. The solution handles quoting, service orders, and end-to-end logistical traceability of solid and liquid waste through an administrative web portal and a companion Android app for field carriers.",
    tecnologias: [
      "Angular",
      "FastAPI",
      "PostgreSQL",
      "Kotlin",
      "JWT",
      "Ethereum",
      "SHA-256",
      "SendGrid",
      "REST API",
    ],
    imagen: "/assets/sistemas/residuos/login-azul.png",
    demo: null,
    github: null,
    slug: "trazabilidad-residuos-blockchain",
    destacado: true,
    sector: "Environmental Management / Traceability / Blockchain",
    capturas: [
      {
        src: "/assets/sistemas/residuos/dashboard-azul.png",
        alt: "Waste traceability administrative dashboard",
      },
      {
        src: "/assets/sistemas/residuos/loginapp.png",
        alt: "Kotlin mobile app for GPS carrier monitoring",
      },
    ],
    capturasDesktop: [
      {
        src: "/assets/sistemas/residuos/dashboard-azul.png",
        alt: "Angular web portal with operational dashboard and logistics events",
      },
      {
        src: "/assets/sistemas/residuos/registro-azul.png",
        alt: "Industrial company registration",
      },
      {
        src: "/assets/sistemas/residuos/ruta-azul.png",
        alt: "Real-time monitoring",
      },
    ],
    capturasMobile: [
      {
        src: "/assets/sistemas/residuos/loginapp.png",
        alt: "Kotlin Android app for updating statuses and GPS coordinates",
      },
      {
        src: "/assets/sistemas/residuos/monitoreoapp.png",
        alt: "Kotlin Android app for updating statuses and GPS coordinates",
      },
    ],
    arquitectura: [
      {
        titulo: "Kotlin App",
        tecnologia: "Android",
        descripcion: "Field carriers log GPS coordinates, operational statuses, and on-site evidence in real time.",
      },
      {
        titulo: "FastAPI",
        tecnologia: "REST API",
        descripcion: "JWT-authenticated services for syncing mobile events with web operations.",
      },
      {
        titulo: "PostgreSQL",
        tecnologia: "Database",
        descripcion: "Transactional persistence for quotes, orders, routes, events, and traceability records.",
      },
      {
        titulo: "Ethereum Blockchain",
        tecnologia: "Integrity",
        descripcion: "Records critical digital evidence and SHA-256 hashes to ensure operational transparency and auditability.",
      },
      {
        titulo: "Angular Web Portal",
        tecnologia: "Administration",
        descripcion: "Enterprise dashboard for real-time monitoring, logistics control, and operational management.",
      },
    ],
    caracteristicas: [
      "Quote and service order management",
      "Real-time GPS tracking",
      "Georeferenced traceability",
      "Field carrier mobile app",
      "Operational status updates",
      "Administrative dashboard",
      "Real-time notifications",
      "Blockchain validation via Ethereum",
      "Event integrity with SHA-256 hashing",
      "Distributed client-server architecture",
    ],
    retos:
      "The main challenge was architecting a distributed system capable of syncing real-time mobile events from the Android app to the web platform, while maintaining continuous traceability, data integrity, and georeferenced operational monitoring. Ethereum blockchain was integrated to record critical digital evidence, reinforcing the transparency and auditability of field events.",
  },
  {
    titulo: "ERP System for Optical Centers with Electronic Invoicing",
    descripcion:
      "ERP system for optical centers covering sales, inventory, customers, suppliers, financials, clinical operations, and electronic invoice submission to SUNAT.",
    resumen:
      "Desktop ERP built on an N-tier architecture, running optical centers with multiple branches, warehouses, and fully integrated administrative processes.",
    tecnologias: ["C#", "SQL Server", "N-tier", "Electronic Invoicing", "SUNAT"],
    imagen: "/assets/erp.png",
    demo: "/assets/sistemas/erp/video-erp.mp4",
    github: null,
    slug: "erp-centros-opticos",
    destacado: true,
    video: "/assets/sistemas/erp/video-erp.mp4",
    sector: "ERP / Optical Retail",
    capturas: [
      { src: "/assets/sistemas/erp/login.png", alt: "Optical ERP login screen" },
      { src: "/assets/sistemas/erp/venta.png", alt: "Optical ERP sales module" },
      { src: "/assets/sistemas/erp/factura.png", alt: "Electronic invoicing module" },
      {
        src: "/assets/sistemas/erp/imagen_2024-12-02_212150327.png",
        alt: "Optical ERP administrative view",
      },
      { src: "/assets/sistemas/erp/receta.png", alt: "Clinical optical prescription module" },
    ],
    caracteristicas: [
      "User and employee management",
      "Sales, purchasing, supplier and inventory management",
      "Clinical module for consultations and optical prescriptions",
      "Built-in electronic invoicing",
      "PDF and Excel operational reports",
    ],
    retos:
      "The biggest challenge was modeling business processes across multiple domains — from inventory and sales to clinical care and electronic invoicing. The solution was built with a robust architecture, detailed operational analysis, and branch connectivity configuration for efficient multi-location deployment.",
  },
  {
    titulo: "Technical Service Center Management System",
    descripcion:
      "Distributed platform for managing technical service centers, including client and equipment registration, service catalog, work orders, repair tracking, and operational reporting.",
    resumen:
      "Web platform with a Spring Boot and .NET 8 backend, PostgreSQL database, and an Angular frontend styled with Tailwind CSS.",
    tecnologias: ["Angular", "Spring Boot", ".NET 8", "PostgreSQL", "Docker", "Tailwind CSS"],
    imagen: "/assets/centro-tecnico.png",
    demo: "https://centro-tecnico.netlify.app",
    github: "https://github.com/betoab728/centro-tecnico-frontend",
    slug: "centro-tecnico",
    destacado: true,
    sector: "Technical Management / Operations",
    capturas: [
      { src: "/assets/sistemas/tecnico/login.png", alt: "Technical center system login" },
      { src: "/assets/sistemas/tecnico/dashboard.png", alt: "Technical center system dashboard" },
      { src: "/assets/sistemas/tecnico/regcliente.png", alt: "Client registration" },
      { src: "/assets/sistemas/tecnico/orden.png", alt: "Repair order management" },
      { src: "/assets/sistemas/tecnico/reporte.png", alt: "Operational PDF report" },
    ],
    caracteristicas: [
      "Secure user authentication",
      "Client, employee, and equipment registration",
      "Repair order tracking and monitoring",
      "Operational PDF reports",
    ],
    retos:
      "Integrating Spring Boot, .NET 8, and Angular required coordinating API contracts across services and the frontend. PostgreSQL centralized the data layer, while Docker enabled a controlled, consistent deployment pipeline.",
  },
  {
    titulo: "Medical Appointment Booking System",
    descripcion:
      "MERN stack application for managing patients, doctors, clinical histories, appointment scheduling, and operational reports for a healthcare center.",
    resumen:
      "Full stack application built with MongoDB, Express, React, Node.js, and Tailwind CSS, designed to streamline patient care workflows.",
    tecnologias: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    imagen: "/assets/citas.png",
    demo: "https://sistema-pacientes.netlify.app",
    github: "https://github.com/betoab728/sistema-pacientes-frontend",
    slug: "citas-medicas",
    destacado: true,
    sector: "Healthcare / Appointment Management",
    capturas: [
      { src: "/assets/sistemas/citas/login.png", alt: "Medical appointment system login" },
      { src: "/assets/sistemas/citas/dashboard.png", alt: "Medical appointment system dashboard" },
      { src: "/assets/sistemas/citas/regpaciente.png", alt: "Patient registration" },
      { src: "/assets/sistemas/citas/cita.png", alt: "Medical appointment scheduling" },
      { src: "/assets/sistemas/citas/reporte.png", alt: "Medical appointment system report" },
    ],
    caracteristicas: [
      "Secure user authentication",
      "Patient, occupation, and doctor registration",
      "Clinical history management",
      "Appointment scheduling",
      "PDF report generation",
    ],
    retos:
      "The main challenge was decoupling the frontend and backend while maintaining clean integration between them. It also required solving deployment, hosting, and service configuration for a distributed architecture.",
  },
  {
    titulo: "AI-Powered Facial Recognition Attendance System",
    descripcion:
      "Desktop application built with Python and OpenCV for recording employee attendance via facial recognition and generating dynamic reports.",
    resumen:
      "Real-time attendance tracking system that eliminates manual errors using facial recognition, with MySQL for persistent storage and PDF report generation.",
    tecnologias: ["Python", "OpenCV", "MySQL", "AI", "PDF"],
    imagen: "/assets/asistencia.png",
    demo: "/assets/sistemas/asistencia/asistencia.mp4",
    github: "https://github.com/betoab728/sistema-asistencia-python",
    slug: "asistencia-reconocimiento-facial",
    video: "/assets/sistemas/asistencia/asistencia.mp4",
    sector: "AI / Workforce Management",
    capturas: [
      { src: "/assets/sistemas/asistencia/asistencia.png", alt: "Facial attendance module" },
      { src: "/assets/sistemas/asistencia/fechas.png", alt: "Attendance date filter" },
      { src: "/assets/sistemas/asistencia/reporte.png", alt: "Generated attendance report" },
    ],
    caracteristicas: [
      "User authentication",
      "Employee registration",
      "Facial recognition for attendance check-in",
      "Dynamic PDF attendance reports",
    ],
    retos:
      "Real-time image processing was optimized using Python and OpenCV, fine-tuning recognition accuracy across varying lighting conditions and facial expressions, backed by a MySQL database for traceability and audit logs.",
  },
  {
    titulo: "Real-Time Weather Web Application",
    descripcion:
      "React application consuming the OpenWeather API to display temperature, humidity, weather conditions, and forecasts by city.",
    resumen:
      "Clean interface for querying real-time weather data for any city using the OpenWeather API.",
    tecnologias: ["React", "OpenWeather API", "JavaScript", "CSS"],
    imagen: "/assets/proyecto-clima.jpg",
    demo: "https://clima-semanal.netlify.app",
    github: "https://github.com/betoab728/aplicacion-clima-react",
    slug: "clima-tiempo-real",
    sector: "Web Application / API",
    capturas: [
      { src: "/assets/sistemas/clima/clima1.png", alt: "City weather search" },
      { src: "/assets/sistemas/clima/clima2.png", alt: "Real-time weather results" },
      { src: "/assets/sistemas/clima/cima3.png", alt: "Extended weather view" },
    ],
    caracteristicas: [
      "Temperature, humidity, and atmospheric pressure queries",
      "Short-term and extended forecasts",
      "Weather alerts",
      "Global city and region coverage",
    ],
    retos:
      "This project involved structuring API consumption in React, managing application state, and transforming raw weather data into an intuitive user interface.",
  },
  {
    titulo: "Responsive Website for a Veterinary Center",
    descripcion:
      "Responsive website for Allqovet featuring veterinary services, online appointment booking, professional team profiles, and location information.",
    resumen:
      "Informational responsive website built with HTML, CSS, JavaScript, and PHP to showcase veterinary services and streamline appointment scheduling.",
    tecnologias: ["HTML", "CSS", "JavaScript", "PHP"],
    imagen: "/assets/allqovet.png",
    demo: "https://grupoctc.ddns.net/pagina-veterinaria/",
    github: "https://github.com/betoab728/taller-web-utp",
    slug: "allqovet-veterinaria",
    sector: "Corporate Website / Services",
    capturas: [
      { src: "/assets/sistemas/allqovet/pagina1.png", alt: "Allqovet website home" },
      { src: "/assets/sistemas/allqovet/pagina2.png", alt: "Allqovet information section" },
      { src: "/assets/sistemas/allqovet/pagina3.png", alt: "Responsive veterinary services view" },
    ],
    caracteristicas: [
      "Veterinary services section",
      "Online appointment scheduling",
      "Professional team presentation",
      "Contact and location details",
    ],
    retos:
      "The main challenge was translating the clinic's services and brand identity into a clear, responsive, and functional web experience, combining traditional web technologies with modern interface best practices.",
  },
];
