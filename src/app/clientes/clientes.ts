import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Cliente } from './cliente.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private api = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) { }

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

  obtenerClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.api).pipe(
      tap(clientes => console.log('Clientes obtenidos:', clientes)),
      catchError(this.handleError)
    );
  }

  obtenerClientePorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.api}/${id}`).pipe(
      tap(cliente => console.log('Cliente obtenido:', cliente)),
      catchError(this.handleError)
    );
  }

  agregarCliente(cliente: Omit<Cliente, 'id'>): Observable<Cliente> {
    return this.http.post<Cliente>(this.api, cliente).pipe(
      tap(nuevoCliente => console.log('Cliente creado:', nuevoCliente)),
      catchError(this.handleError)
    );
  }

  actualizarCliente(id: number, clienteActualizado: Omit<Cliente, 'id'>): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.api}/${id}`, clienteActualizado).pipe(
      tap(cliente => console.log('Cliente actualizado:', cliente)),
      catchError(this.handleError)
    );
  }

  eliminarCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`).pipe(
      tap(() => console.log('Cliente eliminado:', id)),
      catchError(this.handleError)
    );
  }
}
