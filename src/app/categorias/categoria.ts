import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Categoria, CategoriaCrearDTO, CategoriaActualizarDTO, CategoriaResponse } from './categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = 'http://localhost:8080/api/categorias';

  constructor(private http: HttpClient) { }

  // Obtener todas las categorías
  obtenerCategorias(): Observable<Categoria[]> {
    /*
    // Simulación de datos mientras no hay backend
    return of([
      {
        id: 1,
        nombre: 'Bebidas',
        descripcion: 'Bebidas y refrescos',
        activo: true,
        fechaCreacion: new Date('2024-01-15')
      },
      {
        id: 2,
        nombre: 'Lácteos',
        descripcion: 'Productos lácteos y derivados',
        activo: true,
        fechaCreacion: new Date('2024-01-16')
      },
      {
        id: 3,
        nombre: 'Panadería',
        descripcion: 'Pan y productos de panadería',
        activo: true,
        fechaCreacion: new Date('2024-01-17')
      },
      {
        id: 4,
        nombre: 'Carnicería',
        descripcion: 'Productos cárnicos',
        activo: true,
        fechaCreacion: new Date('2024-01-18')
      },
      {
        id: 5,
        nombre: 'Limpieza',
        descripcion: 'Productos de limpieza e higiene',
        activo: true,
        fechaCreacion: new Date('2024-01-19')
      }
    ]);*/

    // Cuando esté el backend, usar:
     return this.http.get<Categoria[]>(this.apiUrl);
  }

  // Obtener categoría por ID
  obtenerCategoriaPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  // Crear nueva categoría
  crearCategoria(categoria: CategoriaCrearDTO): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria);
  }

  // Actualizar categoría
  actualizarCategoria(id: number, categoria: CategoriaActualizarDTO): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoria);
  }

  // Eliminar categoría
  eliminarCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Buscar categorías por nombre
  buscarCategorias(termino: string): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/buscar?q=${termino}`);
  }

  // Activar/Desactivar categoría
  toggleActivarCategoria(id: number, activo: boolean): Observable<Categoria> {
    return this.http.patch<Categoria>(`${this.apiUrl}/${id}/toggle`, { activo });
  }

  // Verificar si una categoría tiene productos asociados
  tieneProductosAsociados(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${id}/tiene-productos`);
  }
}
