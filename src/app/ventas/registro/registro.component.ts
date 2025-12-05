import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
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
export class RegistroComponent implements OnInit, AfterViewInit {
  seleccionados: ItemVenta[] = [];
  total = 0;
  formBusqueda!: FormGroup;
  toastMensaje = '';
  mostrarToast = false;
  productoEncontrado: Producto | null = null;
  @ViewChild('codigoBarrasInput') codigoBarrasInput!: ElementRef;
  @ViewChild('modalSearchInput') modalSearchInput!: ElementRef;
  productosFiltrados: Producto[] = [];
  mostrarModalBusqueda = false;
  mostrarModalConfirmacion = false;
  filtroNombre = '';
  todosLosProductos: Producto[] = [];

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

  ngAfterViewInit(): void {
    // Enfocar automáticamente el input de código de barras cuando se carga el componente
    setTimeout(() => {
      if (this.codigoBarrasInput) {
        this.codigoBarrasInput.nativeElement.focus();
      }
    }, 100);
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
    const nuevaCantidad = parseFloat(input.value);
    const item = this.seleccionados[index];
    
    if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
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

  abrirModalConfirmacion(): void {
    if (!this.puedeConfirmar) {
      this.toast('Debe agregar al menos un producto válido.');
      return;
    }
    this.mostrarModalConfirmacion = true;
  }

  cerrarModalConfirmacion(): void {
    this.mostrarModalConfirmacion = false;
  }

  confirmarVentaFinal(): void {
    this.mostrarModalConfirmacion = false;
    this.confirmarVenta();
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
        this.productoEncontrado = null;
        // Reenfocar el input para la siguiente venta
        setTimeout(() => {
          if (this.codigoBarrasInput) {
            this.codigoBarrasInput.nativeElement.focus();
          }
        }, 100);
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

  abrirModalBusqueda(): void {
    this.filtroNombre = '';
    this.productosFiltrados = [];
    this.mostrarModalBusqueda = true;
    // Enfocar el input del modal después de que se renderice
    setTimeout(() => {
      const modalInput = document.getElementById('modalSearchInput') as HTMLInputElement;
      if (modalInput) {
        console.log('Enfocando modal input con getElementById');
        modalInput.focus();
      } else {
        console.log('Modal input no encontrado con getElementById');
        // Intento con querySelector como respaldo
        const modalInputClass = document.querySelector('.input-busqueda-centrado') as HTMLInputElement;
        if (modalInputClass) {
          console.log('Enfocando modal input con querySelector como respaldo');
          modalInputClass.focus();
        }
      }
    }, 500);
    this.productoService.obtenerProductos().subscribe(productos => {
      this.todosLosProductos = productos;
      this.productosFiltrados = productos.slice(0, 10);
    });
  }

  cerrarModalBusqueda(): void {
    this.mostrarModalBusqueda = false;
    // Reenfocar el input de código de barras después de cerrar el modal
    setTimeout(() => {
      if (this.codigoBarrasInput) {
        this.codigoBarrasInput.nativeElement.focus();
      }
    }, 100);
  }

  filtrarProductosPorNombre(): void {
    const filtro = this.filtroNombre.trim().toLowerCase();
    if (filtro.length === 0) {
      this.productosFiltrados = this.todosLosProductos.slice(0, 10);
    } else {
      this.productosFiltrados = this.todosLosProductos
        .filter(p => p.nombre.toLowerCase().includes(filtro))
        .slice(0, 10);
    }
  }

  agregarProductoDesdeModal(producto: Producto): void {
    this.productoEncontrado = producto;
    this.agregarProductoEncontrado();
    this.cerrarModalBusqueda();
    // El focus se maneja en cerrarModalBusqueda()
  }
}
