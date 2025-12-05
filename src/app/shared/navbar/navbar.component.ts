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
  // Definimos todos los items del menú con sus permisos requeridos
  allMenuItems = [
    { path: '/ventas', label: 'Inicio', permission: 'inicio', shortcut: 'F1' },
    { path: '/ventas/resumen', label: 'Ventas', permission: 'ventas', shortcut: 'F2' },
    { path: '/productos', label: 'Productos', permission: 'productos', shortcut: 'F3' },
    { path: '/categorias', label: 'Categorías', permission: 'productos', shortcut: 'F6' },
    { path: '/proveedores', label: 'Proveedores', permission: 'proveedores', shortcut: 'F4' },
    { path: '/usuarios', label: 'Usuarios', permission: 'usuarios', shortcut: 'F5' }
  ];

  menuItems: any[] = []; // Los items que se mostrarán en el menú
  nombreUsuario: string | null = null;
  mostrarMenuUsuario: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.cargarNombreUsuario();
    this.filterMenuItems(); // Llamar al nuevo método para filtrar
  }

  cargarNombreUsuario(): void {
    const usuario = this.authService.usuarioActual;
    console.log("que usuario llega usuario",usuario);
    if (usuario) {
      this.nombreUsuario = usuario;
    } else {
      this.nombreUsuario = 'Usuario';
    }
  }

  filterMenuItems(): void {
    // Por ahora mostrar todos los items, después implementar filtros por rol
    this.menuItems = this.allMenuItems;
  }

  toggleMenuUsuario(): void {
    this.mostrarMenuUsuario = !this.mostrarMenuUsuario;
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirigir a la página de login
  }
} 