export type ExperienciaIcono = "pos" | "erp" | "web" | "finance" | "infra";

export interface Experiencia {
  empresa: string;
  ubicacion?: string;
  periodo: string;
  rol: string;
  resumen: string;
  logros: string[];
  tecnologias: string[];
  icono: ExperienciaIcono;
}
