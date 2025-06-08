import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService, Producto } from '../producto.service';

@Component({
  selector: 'app-producto-listado',
  standalone: false,
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})
export class ProductoListadoComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: string[] = ['Electrónica', 'Ropa', 'Alimentos', 'Hogar', 'Otros'];
  
  terminoBusqueda: string = '';
  mostrarModal: boolean = false;
  modoEdicion: boolean = false;
  productoEditando: Producto | null = null;
  guardando: boolean = false;
  error: string = '';

  productoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService
  ) {
    this.productoForm = this.fb.group({
      codigo: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (productos: Producto[]) => {
        this.productos = productos;
        this.filtrarProductos();
      },
      error: (error: Error) => {
        this.error = 'Error al cargar los productos: ' + error.message;
      }
    });
  }

  filtrarProductos(): void {
    if (!this.terminoBusqueda) {
      this.productosFiltrados = this.productos;
      return;
    }

    const termino = this.terminoBusqueda.toLowerCase();
    this.productosFiltrados = this.productos.filter(producto => 
      producto.codigoBarra.toLowerCase().includes(termino) ||
      producto.nombre.toLowerCase().includes(termino) ||
      producto.descripcion.toLowerCase().includes(termino)
    );
  }

  abrirModalCrear(): void {
    this.modoEdicion = false;
    this.productoEditando = null;
    this.productoForm.reset({
      precio: 0,
      stock: 0
    });
    this.mostrarModal = true;
  }

  editarProducto(producto: Producto): void {
    this.modoEdicion = true;
    this.productoEditando = producto;
    this.productoForm.patchValue(producto);
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.productoForm.reset();
    this.productoEditando = null;
    this.error = '';
  }

  guardarProducto(): void {
    if (this.productoForm.invalid) return;

    this.guardando = true;
    const producto = this.productoForm.value;

    const operacion = this.modoEdicion && this.productoEditando
      ? this.productoService.actualizarProducto(this.productoEditando.id, producto)
      : this.productoService.crearProducto(producto);

    operacion.subscribe({
      next: () => {
        this.cargarProductos();
        this.cerrarModal();
        this.guardando = false;
      },
      error: (error) => {
        this.error = 'Error al guardar el producto: ' + error.message;
        this.guardando = false;
      }
    });
  }

  eliminarProducto(id: number): void {
    if (!confirm('¿Está seguro de eliminar este producto?')) return;

    this.productoService.eliminarProducto(id).subscribe({
      next: () => {
        this.cargarProductos();
      },
      error: (error) => {
        this.error = 'Error al eliminar el producto: ' + error.message;
      }
    });
  }
}
