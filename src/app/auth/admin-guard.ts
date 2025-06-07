import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

const ADMIN_ROLE_ID = 1; // Asumiendo que el ID 1 es para el rol ADMIN

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.auth.usuarioActual;
    if (user?.rol?.id === ADMIN_ROLE_ID) {
      return true;
    }

    this.router.navigate(['/ventas']); // o cualquier ruta por defecto
    return false;
  }
}