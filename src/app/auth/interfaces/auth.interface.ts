import { Observable } from 'rxjs';

export interface LoginResponse {
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface IAuthService {
  login(data: LoginData): Observable<LoginResponse>;
  logout(): void;
  isLoggedIn(): boolean;
  getToken(): string | null;
} 