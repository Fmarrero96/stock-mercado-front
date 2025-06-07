import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductoService, Producto } from '../../productos/producto.service';
import { VentaService, DetalleVentaDTO, VentaDTO } from '../venta.service';

interface ItemVenta {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  productos: Producto[] = [];
  seleccionados: ItemVenta[] = [];
  total = 0;
  formBusqueda!: FormGroup;
  toastMensaje = '';
  mostrarToast = false;

  constructor(private productoService: ProductoService, private fb: FormBuilder, private ventaService: VentaService) {}

  ngOnInit(): void {
    this.productoService.getProductos().subscribe({
      next: data => this.productos = data,
      error: () => alert('Error al cargar productos')
    });

    this.formBusqueda = this.fb.group({
      productoId: [''],
      cantidad: [1]
    });
  }

  agregarProducto(): void {
    const id = this.formBusqueda.value.productoId;
    const cantidad = this.formBusqueda.value.cantidad;

    if (!id || cantidad <= 0) return;

    const prod = this.productos.find(p => p.id === +id);
    if (!prod) return;

    const yaAgregado = this.seleccionados.find(s => s.producto.id === prod.id);
    if (yaAgregado) {
      yaAgregado.cantidad += cantidad;
      yaAgregado.subtotal = yaAgregado.cantidad * prod.precioVenta;
    } else {
      this.seleccionados.push({
        producto: prod,
        cantidad,
        subtotal: cantidad * prod.precioVenta
      });
    }

    this.formBusqueda.reset({ productoId: '', cantidad: 1 });
    this.calcularTotal();
  }

  quitarItem(index: number): void {
    this.seleccionados.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal(): void {
    this.total = this.seleccionados.reduce((acc, item) => acc + item.subtotal, 0);
  }
  

  confirmarVenta(): void {
    if (this.seleccionados.length === 0) {
      alert('Debe agregar al menos un producto.');
      return;
    }

    // 🔴 Validación de stock
    const sinStock = this.seleccionados.find(item => item.cantidad > item.producto.stock);
    if (sinStock) {
      this.toast(`Stock insuficiente para "${sinStock.producto.nombre}". Stock disponible: ${sinStock.producto.stock}`);
      return;
    }
  
    const detalles: DetalleVentaDTO[] = this.seleccionados.map(item => ({
      productoId: item.producto.id!,
      cantidad: item.cantidad,
      precioUnitario: item.producto.precioVenta
    }));
    
    const venta: VentaDTO = { usuarioId: 1, detalles };
    
    this.ventaService.crearVenta(venta).subscribe({
      next: () => {
        this.toast('Venta registrada correctamente ✅');
        this.seleccionados = [];
        this.total = 0;
      },
      error: () => {
        this.toast('Error al registrar venta ❌');
      }
    });
  }
  toast(msg: string): void {
    this.toastMensaje = msg;
    this.mostrarToast = true;
    setTimeout(() => this.mostrarToast = false, 3000);
  }
}
