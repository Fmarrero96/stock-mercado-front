import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'stock-mercado';

  constructor(private router: Router) {}

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'F1':
        event.preventDefault();
        this.router.navigate(['/ventas']);
        break;
      case 'F2':
        event.preventDefault();
        this.router.navigate(['/ventas/resumen']);
        break;
      case 'F3':
        event.preventDefault();
        this.router.navigate(['/productos']);
        break;
      case 'F4':
        event.preventDefault();
        this.router.navigate(['/categorias']);
        break;
      case 'F5':
        event.preventDefault();
        this.router.navigate(['/proveedores']);
        break;
      case 'F6':
        event.preventDefault();
        this.router.navigate(['/usuarios']);
        break;
    }
  }
} 