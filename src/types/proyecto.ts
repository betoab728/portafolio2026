export interface ProyectoMedia {
  src: string;
  alt: string;
}

export interface Proyecto {
  titulo: string;
  descripcion: string;
  resumen: string;
  tecnologias: string[];
  imagen: string;
  demo: string | null;
  github: string | null;
  slug: string;
  destacado?: boolean;
  video?: string;
  capturas: ProyectoMedia[];
  caracteristicas: string[];
  retos: string;
  sector: string;
}
