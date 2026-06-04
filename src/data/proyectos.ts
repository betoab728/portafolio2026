import type { Proyecto } from "../types/proyecto";

export const proyectos: Proyecto[] = [
  {
    titulo: "Sistema de Gestion y Trazabilidad de Residuos con Blockchain",
    descripcion:
      "Plataforma web y app movil para gestion operativa y trazabilidad de residuos en tiempo real, con monitoreo GPS, blockchain Ethereum y arquitectura distribuida.",
    resumen:
      "Sistema empresarial desarrollado para Azul Sostenible S.A.C., empresa operadora de residuos EO-RS. La solucion gestiona cotizaciones, ordenes de servicio y trazabilidad logistica de residuos solidos y liquidos mediante portal web administrativo y app Android para transportistas.",
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
    sector: "Gestion ambiental / Trazabilidad / Blockchain",
    capturas: [
      {
        src: "/assets/sistemas/residuos/dashboard-azul.png",
        alt: "Dashboard administrativo de trazabilidad de residuos",
      },
      {
        src: "/assets/sistemas/residuos/loginapp.png",
        alt: "Aplicacion movil Kotlin para monitoreo GPS de transportistas",
      },
    ],
    capturasDesktop: [
      {
        src: "/assets/sistemas/residuos/dashboard-azul.png",
        alt: "Portal web Angular con dashboard operativo y eventos logisticos",
      },
      {
        src: "/assets/sistemas/residuos/registro-azul.png",
        alt: "Registro de empresas industriales",
      },
      {
        src: "/assets/sistemas/residuos/ruta-azul.png",
        alt: "Monitoreo en tiempo real",
      },
    ],
    capturasMobile: [
      {
        src: "/assets/sistemas/residuos/loginapp.png",
        alt: "App Android Kotlin para actualizar estados y coordenadas GPS",
      },
      {
        src: "/assets/sistemas/residuos/monitoreoapp.png",
        alt: "App Android Kotlin para actualizar estados y coordenadas GPS",
      },
    ],
    arquitectura: [
      {
        titulo: "App Kotlin",
        tecnologia: "Android",
        descripcion: "Transportistas registran coordenadas GPS, estados operativos y evidencias desde campo.",
      },
      {
        titulo: "API FastAPI",
        tecnologia: "REST API",
        descripcion: "Servicios autenticados con JWT para sincronizar eventos moviles y operaciones web.",
      },
      {
        titulo: "PostgreSQL",
        tecnologia: "Base de datos",
        descripcion: "Persistencia transaccional de cotizaciones, ordenes, rutas, eventos y trazabilidad.",
      },
      {
        titulo: "Blockchain Ethereum",
        tecnologia: "Integridad",
        descripcion: "Registro de evidencias digitales criticas y hashes SHA-256 para transparencia operativa.",
      },
      {
        titulo: "Portal web Angular",
        tecnologia: "Administracion",
        descripcion: "Dashboard empresarial para monitoreo, control logistico y gestion operativa en tiempo real.",
      },
    ],
    caracteristicas: [
      "Gestion de cotizaciones y ordenes de servicio",
      "Monitoreo GPS en tiempo real",
      "Trazabilidad georreferenciada",
      "App movil para transportistas",
      "Actualizacion de estados operativos",
      "Dashboard administrativo",
      "Notificaciones en tiempo real",
      "Validacion blockchain con Ethereum",
      "Integridad de eventos con SHA-256",
      "Arquitectura distribuida cliente-servidor",
    ],
    retos:
      "El principal reto fue disenar una arquitectura distribuida que permitiera sincronizar eventos moviles en tiempo real desde la app Android hacia la plataforma web, manteniendo trazabilidad continua, integridad de informacion y monitoreo operativo georreferenciado. Tambien se integro blockchain Ethereum para registrar evidencias digitales criticas y reforzar la transparencia de los eventos registrados.",
  },
  {
    titulo: "Sistema ERP para centros opticos con facturacion electronica",
    descripcion:
      "Sistema ERP para centros opticos con ventas, inventarios, clientes, proveedores, finanzas, operaciones clinicas y emision de comprobantes electronicos hacia SUNAT.",
    resumen:
      "ERP de escritorio en arquitectura N-capas para operar centros opticos con multiples sucursales, almacenes y procesos administrativos integrados.",
    tecnologias: ["C#", "SQL Server", "N-capas", "Facturacion electronica", "SUNAT"],
    imagen: "/assets/erp.png",
    demo: "/assets/sistemas/erp/video-erp.mp4",
    github: null,
    slug: "erp-centros-opticos",
    destacado: true,
    video: "/assets/sistemas/erp/video-erp.mp4",
    sector: "ERP / Retail optico",
    capturas: [
      { src: "/assets/sistemas/erp/login.png", alt: "Pantalla de acceso del ERP optico" },
      { src: "/assets/sistemas/erp/venta.png", alt: "Modulo de venta del ERP optico" },
      { src: "/assets/sistemas/erp/factura.png", alt: "Modulo de facturacion electronica" },
      {
        src: "/assets/sistemas/erp/imagen_2024-12-02_212150327.png",
        alt: "Vista administrativa del ERP optico",
      },
      { src: "/assets/sistemas/erp/receta.png", alt: "Modulo clinico de recetas opticas" },
    ],
    caracteristicas: [
      "Modulo de usuarios y trabajadores",
      "Gestion de ventas, compras, proveedores e inventarios",
      "Modulo clinico para consultorio y recetas opticas",
      "Facturacion electronica integrada",
      "Reportes en PDF y Excel para control operativo",
    ],
    retos:
      "El mayor reto fue modelar procesos de negocio de multiples areas, desde inventarios y ventas hasta atencion clinica y facturacion electronica. La solucion se trabajo con una arquitectura robusta, analisis detallado de operaciones y configuracion para conectar sucursales de forma eficiente.",
  },
  {
    titulo: "Sistema de gestion de centros tecnicos",
    descripcion:
      "Sistema distribuido para administrar centros tecnicos, con registro de clientes, equipos, servicios, ordenes de trabajo, seguimiento de reparaciones y reportes.",
    resumen:
      "Plataforma web con backend en Spring Boot y .NET 8, base de datos PostgreSQL y frontend Angular con Tailwind CSS.",
    tecnologias: ["Angular", "Spring Boot", ".NET 8", "PostgreSQL", "Docker", "Tailwind CSS"],
    imagen: "/assets/centro-tecnico.png",
    demo: "https://centro-tecnico.netlify.app",
    github: "https://github.com/betoab728/centro-tecnico-frontend",
    slug: "centro-tecnico",
    destacado: true,
    sector: "Gestion tecnica / Operaciones",
    capturas: [
      { src: "/assets/sistemas/tecnico/login.png", alt: "Login del sistema de centros tecnicos" },
      { src: "/assets/sistemas/tecnico/dashboard.png", alt: "Dashboard del sistema de centros tecnicos" },
      { src: "/assets/sistemas/tecnico/regcliente.png", alt: "Registro de clientes" },
      { src: "/assets/sistemas/tecnico/orden.png", alt: "Gestion de ordenes de reparacion" },
      { src: "/assets/sistemas/tecnico/reporte.png", alt: "Reporte operativo en PDF" },
    ],
    caracteristicas: [
      "Autenticacion segura de usuarios",
      "Registro de clientes, trabajadores y equipos",
      "Monitoreo de ordenes de reparacion",
      "Reportes operativos en PDF",
    ],
    retos:
      "Integrar Spring Boot, .NET 8 y Angular requirio coordinar contratos entre servicios y frontend. PostgreSQL ayudo a centralizar los datos y Docker permitio un despliegue mas controlado y consistente.",
  },
  {
    titulo: "Sistema de reserva de citas medicas",
    descripcion:
      "Sistema MERN para gestionar pacientes, doctores, historial clinico, programacion de citas y reportes para un centro de salud.",
    resumen:
      "Aplicacion full stack con MongoDB, Express, React, Node.js y Tailwind CSS orientada a optimizar la atencion de pacientes.",
    tecnologias: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    imagen: "/assets/citas.png",
    demo: "https://sistema-pacientes.netlify.app",
    github: "https://github.com/betoab728/sistema-pacientes-frontend",
    slug: "citas-medicas",
    destacado: true,
    sector: "Salud / Gestion de citas",
    capturas: [
      { src: "/assets/sistemas/citas/login.png", alt: "Login del sistema de citas medicas" },
      { src: "/assets/sistemas/citas/dashboard.png", alt: "Dashboard del sistema de citas medicas" },
      { src: "/assets/sistemas/citas/regpaciente.png", alt: "Registro de pacientes" },
      { src: "/assets/sistemas/citas/cita.png", alt: "Programacion de citas medicas" },
      { src: "/assets/sistemas/citas/reporte.png", alt: "Reporte del sistema de citas medicas" },
    ],
    caracteristicas: [
      "Autenticacion segura de usuarios",
      "Registro de pacientes, ocupaciones y medicos",
      "Gestion de historial clinico",
      "Programacion de citas",
      "Reportes en PDF",
    ],
    retos:
      "El reto principal fue separar frontend y backend manteniendo una integracion clara entre ambos. Tambien fue necesario resolver despliegue, hosting y configuracion de servicios para una arquitectura distribuida.",
  },
  {
    titulo: "Sistema de control de asistencia con reconocimiento facial IA",
    descripcion:
      "Aplicacion de escritorio construida con Python y OpenCV para registrar asistencias mediante reconocimiento facial y generar reportes dinamicos.",
    resumen:
      "Sistema de asistencia en tiempo real que reduce errores manuales usando reconocimiento facial, MySQL y reportes en PDF.",
    tecnologias: ["Python", "OpenCV", "MySQL", "IA", "PDF"],
    imagen: "/assets/asistencia.png",
    demo: "/assets/sistemas/asistencia/asistencia.mp4",
    github: "https://github.com/betoab728/sistema-asistencia-python",
    slug: "asistencia-reconocimiento-facial",
    video: "/assets/sistemas/asistencia/asistencia.mp4",
    sector: "IA / Control de asistencia",
    capturas: [
      { src: "/assets/sistemas/asistencia/asistencia.png", alt: "Modulo de asistencia facial" },
      { src: "/assets/sistemas/asistencia/fechas.png", alt: "Filtro de asistencias por fechas" },
      { src: "/assets/sistemas/asistencia/reporte.png", alt: "Reporte de asistencia generado" },
    ],
    caracteristicas: [
      "Autenticacion de usuarios",
      "Registro de trabajadores",
      "Reconocimiento facial para marcar asistencia",
      "Reportes dinamicos de asistencia en PDF",
    ],
    retos:
      "Se optimizo el procesamiento de imagenes en tiempo real con Python y OpenCV, ajustando el reconocimiento ante distintas condiciones de iluminacion y expresiones faciales, junto con una base MySQL para trazabilidad.",
  },
  {
    titulo: "Aplicacion web de clima en tiempo real",
    descripcion:
      "Aplicacion React que consume la API de OpenWeather para mostrar temperatura, humedad, condiciones climaticas y pronosticos por ciudad.",
    resumen:
      "Interfaz simple para consultar informacion meteorologica actualizada de cualquier ciudad usando datos de OpenWeather.",
    tecnologias: ["React", "OpenWeather API", "JavaScript", "CSS"],
    imagen: "/assets/proyecto-clima.jpg",
    demo: "https://clima-semanal.netlify.app",
    github: "https://github.com/betoab728/aplicacion-clima-react",
    slug: "clima-tiempo-real",
    sector: "Aplicacion web / API",
    capturas: [
      { src: "/assets/sistemas/clima/clima1.png", alt: "Busqueda de clima por ciudad" },
      { src: "/assets/sistemas/clima/clima2.png", alt: "Resultados climaticos en tiempo real" },
      { src: "/assets/sistemas/clima/cima3.png", alt: "Vista extendida del clima" },
    ],
    caracteristicas: [
      "Consulta de temperatura, humedad y presion atmosferica",
      "Pronosticos a corto y largo plazo",
      "Alertas meteorologicas",
      "Cobertura global por ciudad o region",
    ],
    retos:
      "El proyecto exigio estructurar correctamente el consumo de API en React, manejar estado y transformar los datos meteorologicos en una interfaz clara para el usuario.",
  },
  {
    titulo: "Pagina web responsiva para centro veterinario",
    descripcion:
      "Sitio responsivo para Allqovet con informacion de servicios veterinarios, agendamiento de citas, equipo profesional, contacto y ubicacion.",
    resumen:
      "Web informativa y adaptable creada con HTML, CSS, JavaScript y PHP para comunicar servicios y facilitar citas.",
    tecnologias: ["HTML", "CSS", "JavaScript", "PHP"],
    imagen: "/assets/allqovet.png",
    demo: "https://grupoctc.ddns.net/pagina-veterinaria/",
    github: "https://github.com/betoab728/taller-web-utp",
    slug: "allqovet-veterinaria",
    sector: "Web corporativa / Servicios",
    capturas: [
      { src: "/assets/sistemas/allqovet/pagina1.png", alt: "Inicio de la pagina Allqovet" },
      { src: "/assets/sistemas/allqovet/pagina2.png", alt: "Seccion informativa de Allqovet" },
      { src: "/assets/sistemas/allqovet/pagina3.png", alt: "Vista responsiva de servicios veterinarios" },
    ],
    caracteristicas: [
      "Seccion de servicios veterinarios",
      "Agendamiento de citas en linea",
      "Presentacion del equipo profesional",
      "Informacion de contacto y ubicacion",
    ],
    retos:
      "El reto fue traducir los servicios y la identidad de la veterinaria en una experiencia web clara, responsiva y funcional, combinando tecnologias tradicionales con buenas practicas de interfaz.",
  },
];

export const proyectosDestacados = proyectos.filter((proyecto) => proyecto.destacado);

export const getProyectoBySlug = (slug: string) =>
  proyectos.find((proyecto) => proyecto.slug === slug);
