export interface Producto {
  id: number;
  codigoBarra: string;
  nombre: string;
  descripcion: string;
  precioVenta: number;
  precioCompra: number;
  porcentajeGanancia: number;
  activo: boolean;
  stockMinimo: number;
  stock: number;
  categoriaId: number;
}

export interface ProductoCrearDTO {
  nombre: string;
  descripcion: string;
  codigoBarra: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
  categoriaId: number;
} 