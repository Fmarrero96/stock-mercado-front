import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  menuItems = [
    { path: '/', icon: '🏠', label: 'Inicio' },
    { path: '/ventas', icon: '💰', label: 'Ventas' },
    { path: '/productos', icon: '📦', label: 'Productos' },
    { path: '/proveedores', icon: '🤝', label: 'Proveedores' },
    { path: '/usuarios', icon: '👥', label: 'Usuarios' }
  ];
} 