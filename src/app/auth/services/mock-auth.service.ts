import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { IAuthService, LoginData, LoginResponse } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class MockAuthService implements IAuthService {
  private mockUser = {
    email: 'test@test.com',
    password: '123456'
  };

  constructor() {}

  login(data: LoginData): Observable<LoginResponse> {
    if (data.email === this.mockUser.email && data.password === this.mockUser.password) {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock';
      localStorage.setItem('token', mockToken);
      return of({ token: mockToken }).pipe(delay(1000));
    } else {
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
} 