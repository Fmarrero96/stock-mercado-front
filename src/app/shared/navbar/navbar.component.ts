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
  // Definimos todos los items del menú, con una propiedad opcional 'adminOnly'
  allMenuItems = [
    { path: '/ventas', icon: '🏠', label: 'Inicio' },
    { path: '/ventas/resumen', icon: '💰', label: 'Ventas' },
    { path: '/productos', icon: '📦', label: 'Productos' },
    { path: '/proveedores', icon: '🤝', label: 'Proveedores' },
    { path: '/usuarios', icon: '👥', label: 'Usuarios'} // Marcar como solo para admin
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