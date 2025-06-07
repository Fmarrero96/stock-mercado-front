import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Usuario mock para pruebas
  private mockUser = {
    email: 'test@test.com',
    password: '123456'
  };

  constructor() {}

  login(data: { email: string; password: string }): Observable<{ token: string }> {
    // Simulamos la validación de credenciales
    if (data.email === this.mockUser.email && data.password === this.mockUser.password) {
      // Simulamos un token JWT
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock';
      
      // Guardamos el token en localStorage
      localStorage.setItem('token', mockToken);
      
      // Simulamos un delay de red de 1 segundo
      return of({ token: mockToken }).pipe(delay(1000));
    } else {
      // Simulamos un error de credenciales inválidas
      return new Observable(subscriber => {
        setTimeout(() => {
          subscriber.error(new Error('Credenciales inválidas'));
        }, 1000);
      });
    }
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  get usuarioActual(): any {
    const raw = localStorage.getItem('usuario');
    return raw ? JSON.parse(raw) : null;
  }
}
