import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Producto {
  id: number;
  nombre: string;
  codigoBarra: string;
}

export interface DetalleVentaDTO {
  productoId: number;
  producto?: Producto;
  cantidad: number;
}

export interface VentaDTO {
  usuarioId: number;
  clienteId?: number;
  detalles: DetalleVentaDTO[];
}

export interface Venta {
  id: number;
  fecha: string;
  usuarioId: number;
  total: number;
  detalles: DetalleVentaDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private api = `${environment.apiUrl}/ventas`;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error en la llamada HTTP:', error);
    let mensaje = 'Error al procesar la solicitud';
    
    if (error.error instanceof ErrorEvent) {
      mensaje = `Error de red: ${error.error.message}`;
    } else {
      mensaje = `Error del servidor (${error.status}): ${error.error?.message || error.statusText}`;
    }
    
    return throwError(() => new Error(mensaje));
  }

  getVentas(): Observable<Venta[]> {
    console.log('Solicitando ventas al servidor...');
    return this.http.get<Venta[]>(this.api).pipe(
      tap(response => {
        console.log('Respuesta cruda del servidor:', response);
        if (!Array.isArray(response)) {
          throw new Error('La respuesta no es un array de ventas');
        }
      }),
      catchError(this.handleError)
    );
  }

  crearVenta(data: VentaDTO): Observable<Venta> {
    return this.http.post<Venta>(this.api, data).pipe(
      tap(venta => console.log('Venta creada:', venta)),
      catchError(this.handleError)
    );
  }
}
