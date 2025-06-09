import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../producto.service';
import { Producto , ProductoCrearDTO } from '../producto.model';

@Component({
  selector: 'app-stock-bajo',
  standalone: false,
  templateUrl: './stock-bajo.component.html',
  styleUrls: ['./stock-bajo.component.scss']
})
export class StockBajoComponent implements OnInit {
  productos: Producto[] = [];
  cargando = true;
  error = '';

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.productoService.getStockBajo().subscribe({
      next: data => {
        this.productos = data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar productos con stock bajo';
        this.cargando = false;
      }
    });
  }
}

