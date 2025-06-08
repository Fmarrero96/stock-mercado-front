import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductoService } from '../../productos/producto.service';
import { Producto ,  ProductoCrearDTO} from '../../productos/producto.model';
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
  seleccionados: ItemVenta[] = [];
  total = 0;
  formBusqueda!: FormGroup;
  toastMensaje = '';
  mostrarToast = false;
  productoEncontrado: Producto | null = null;
  @ViewChild('codigoBarrasInput') codigoBarrasInput!: ElementRef;

  constructor(
    private productoService: ProductoService, 
    private fb: FormBuilder, 
    private ventaService: VentaService
  ) {}

  ngOnInit(): void {
    this.formBusqueda = this.fb.group({
      codigoBarras: ['']
    });

    // Suscribirse a cambios en el código de barras
    this.formBusqueda.get('codigoBarras')?.valueChanges.subscribe(codigo => {
      if (codigo && codigo.length >= 3) {
        this.buscarProducto(codigo);
      } else {
        this.productoEncontrado = null;
      }
    });
  }

  buscarProducto(codigo: string): void {
    this.productoService.buscarPorCodigo(codigo).subscribe({
      next: (producto: Producto) => {
        this.productoEncontrado = producto;
        this.agregarProductoEncontrado();
      },
      error: () => {
        this.productoEncontrado = null;
        this.toast('Producto no encontrado');
      }
    });
  }

  buscarYAgregar(): void {
    const codigo = this.formBusqueda.get('codigoBarras')?.value;
    if (codigo) {
      this.buscarProducto(codigo);
    }
    this.formBusqueda.reset();
    this.codigoBarrasInput.nativeElement.focus();
  }

  agregarProductoEncontrado(): void {
    if (!this.productoEncontrado) return;

    const yaAgregado = this.seleccionados.find(s => s.producto.id === this.productoEncontrado!.id);
    if (yaAgregado) {
      if (yaAgregado.cantidad < yaAgregado.producto.stock) {
        yaAgregado.cantidad += 1;
        yaAgregado.subtotal = yaAgregado.cantidad * yaAgregado.producto.precioVenta;
        this.calcularTotal();
      } else {
        this.toast('Stock insuficiente');
      }
    } else {
      this.seleccionados.push({
        producto: this.productoEncontrado,
        cantidad: 1,
        subtotal: this.productoEncontrado.precioVenta
      });
      this.calcularTotal();
    }

    // Limpiar y enfocar
    this.formBusqueda.reset();
    this.codigoBarrasInput.nativeElement.focus();
  }

  actualizarCantidad(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const nuevaCantidad = parseInt(input.value);
    const item = this.seleccionados[index];
    
    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
      input.value = item.cantidad.toString();
      return;
    }

    item.cantidad = nuevaCantidad;
    item.subtotal = item.cantidad * item.producto.precioVenta;
    this.calcularTotal();
  }

  quitarItem(index: number): void {
    this.seleccionados.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal(): void {
    this.total = this.seleccionados.reduce((acc, item) => acc + item.subtotal, 0);
  }

  get puedeConfirmar(): boolean {
    return this.seleccionados.length > 0 && 
           !this.seleccionados.some(item => item.cantidad > item.producto.stock);
  }

  confirmarVenta(): void {
    if (this.seleccionados.length === 0) {
      this.toast('Debe agregar al menos un producto.');
      return;
    }

    if (!this.puedeConfirmar) {
      this.toast('Hay productos con cantidad mayor al stock disponible');
      return;
    }

    const detalles: DetalleVentaDTO[] = this.seleccionados.map(item => ({
      productoId: item.producto.id!,
      cantidad: item.cantidad
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
