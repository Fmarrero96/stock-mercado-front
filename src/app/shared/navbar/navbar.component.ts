import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  menuItems = [
    { path: '/ventas', icon: '🏠', label: 'Inicio' },
    { path: '/ventas/resumen', icon: '💰', label: 'Ventas' },
    { path: '/productos', icon: '📦', label: 'Productos' },
    { path: '/proveedores', icon: '🤝', label: 'Proveedores' },
    { path: '/usuarios', icon: '👥', label: 'Usuarios' }
  ];

  nombreUsuario: string | null = null;
  mostrarMenuUsuario: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.cargarNombreUsuario();
  }

  cargarNombreUsuario(): void {
    const usuario = this.authService.usuarioActual;
    if (usuario) {
      this.nombreUsuario = usuario;
    } else {
      this.nombreUsuario = 'Usuario';
    }
  }

  toggleMenuUsuario(): void {
    this.mostrarMenuUsuario = !this.mostrarMenuUsuario;
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirigir a la página de login
  }
} 