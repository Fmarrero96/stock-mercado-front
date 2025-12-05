export interface Categoria {
  id?: number;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export interface CategoriaCrearDTO {
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface CategoriaActualizarDTO {
  nombre?: string;
  descripcion?: string;
  activo?: boolean;
}

export interface CategoriaResponse {
  categorias: Categoria[];
  total: number;
}