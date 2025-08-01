import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from '../producto.service';
import { Producto, ProductoCrearDTO } from '../producto.model';
import { CategoriaService } from '../../categorias/categoria.service';
import { Categoria } from '../../categorias/categoria.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-producto-listado',
  standalone: false,
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})
export class ProductoListadoComponent implements OnInit, AfterViewInit {
  @ViewChild('searchInput') searchInput!: ElementRef;
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: string[] = ['Electrónica', 'Ropa', 'Alimentos', 'Hogar', 'Otros'];
  categoriasDisponibles: Categoria[] = [];
  
  terminoBusqueda: string = '';
  mostrarModal: boolean = false;
  modoEdicion: boolean = false;
  productoEditando: Producto | null = null;
  guardando: boolean = false;
  error: string = '';

  mostrarModalStock: boolean = false;
  stockForm: FormGroup;
  productoEncontrado: Producto | null = null;

  productoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private categoriaService: CategoriaService
  ) {
    this.productoForm = this.fb.group({
      codigoBarra: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      descripcion: [''],
      precioCompra: [0, [Validators.required, Validators.min(0)]],
      precioVenta: [0, [Validators.required, Validators.min(0)]],
      gananciaPorcentaje: [0, [Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      stockMinimo: [0, [Validators.required, Validators.min(0)]],
      categoriaId: [null, [Validators.required]]
    });

    this.stockForm = this.fb.group({
      codigoBarra: ['', [Validators.required]],
      cantidadAgregar: [null, [Validators.required, Validators.min(1)]]
    });

    this.setupGananciaCalculations();

    this.stockForm.get('codigoBarra')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(codigoBarra => {
        if (codigoBarra) {
          this.buscarProductoPorCodigo();
        } else {
          this.productoEncontrado = null;
        }
      })
    ).subscribe();
  }

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
  }

  ngAfterViewInit(): void {
    // Enfocar automáticamente el input de búsqueda cuando se carga el componente
    setTimeout(() => {
      if (this.searchInput) {
        this.searchInput.nativeElement.focus();
      }
    }, 200);
  }

  setupGananciaCalculations(): void {
    const precioCompraControl = this.productoForm.get('precioCompra');
    const precioVentaControl = this.productoForm.get('precioVenta');
    const gananciaPorcentajeControl = this.productoForm.get('gananciaPorcentaje');

    precioCompraControl?.valueChanges.pipe(
      debounceTime(300), 
      distinctUntilChanged()
    ).subscribe(precioCompra => {
      if (this.productoForm.get('precioVenta')?.dirty) {
        this.calcularGananciaDesdePrecios(precioCompraControl?.value, precioVentaControl?.value);
      } else if (precioCompraControl?.value !== null && precioCompraControl?.value >= 0) {
        if (gananciaPorcentajeControl?.value !== null && gananciaPorcentajeControl?.value >= 0) {
          const ganancia = gananciaPorcentajeControl?.value;
          const nuevoPrecioVenta = precioCompra * (1 + ganancia / 100);
          precioVentaControl?.patchValue(nuevoPrecioVenta, { emitEvent: false });
        }
      }
    });

    precioVentaControl?.valueChanges.pipe(
      debounceTime(300), 
      distinctUntilChanged()
    ).subscribe(precioVenta => {
      if (precioVentaControl?.dirty) {
        this.calcularGananciaDesdePrecios(precioCompraControl?.value, precioVenta);
      }
    });

    gananciaPorcentajeControl?.valueChanges.pipe(
      debounceTime(300), 
      distinctUntilChanged()
    ).subscribe(gananciaPorcentaje => {
      if (gananciaPorcentajeControl?.dirty) {
        const precioCompra = precioCompraControl?.value;
        if (precioCompra !== null && precioCompra >= 0 && gananciaPorcentaje !== null && gananciaPorcentaje >= 0) {
          const nuevoPrecioVenta = precioCompra * (1 + gananciaPorcentaje / 100);
          precioVentaControl?.patchValue(nuevoPrecioVenta, { emitEvent: false });
        }
      }
    });
  }

  private calcularGananciaDesdePrecios(precioCompra: number, precioVenta: number): void {
    const gananciaPorcentajeControl = this.productoForm.get('gananciaPorcentaje');
    if (precioCompra > 0) {
      const ganancia = ((precioVenta - precioCompra) / precioCompra) * 100;
      gananciaPorcentajeControl?.patchValue(ganancia, { emitEvent: false });
    } else {
      gananciaPorcentajeControl?.patchValue(0, { emitEvent: false });
    }
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
      precioCompra: 0,
      precioVenta: 0,
      gananciaPorcentaje: 0,
      stock: 0,
      stockMinimo: 0,
      categoria: null
    });
    this.productoForm.get('precioCompra')?.markAsPristine();
    this.productoForm.get('precioVenta')?.markAsPristine();
    this.productoForm.get('gananciaPorcentaje')?.markAsPristine();
    this.mostrarModal = true;
  }

  editarProducto(producto: Producto): void {
    this.modoEdicion = true;
    this.productoEditando = producto;
    this.productoForm.patchValue(producto);
    this.productoForm.patchValue({ categoriaId: producto.categoriaId });

    this.calcularGananciaDesdePrecios(producto.precioCompra, producto.precioVenta);
    
    this.productoForm.get('precioCompra')?.markAsPristine();
    this.productoForm.get('precioVenta')?.markAsPristine();
    this.productoForm.get('gananciaPorcentaje')?.markAsPristine();
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
    const productoData = { ...this.productoForm.value };

    delete productoData.gananciaPorcentaje;

    if (this.modoEdicion && this.productoEditando) {
      const ProductoEditado: ProductoCrearDTO = {
        nombre: productoData.nombre,
        descripcion: productoData.descripcion,
        codigoBarra: productoData.codigoBarra,
        precioCompra: productoData.precioCompra,
        precioVenta: productoData.precioVenta,
        stock: productoData.stock,
        stockMinimo: productoData.stockMinimo,
        categoriaId: productoData.categoriaId
      };

      this.productoService.actualizarProducto(this.productoEditando.id, ProductoEditado).subscribe({
        next: () => {
          this.cargarProductos();
          this.cerrarModal();
          this.guardando = false;
        },
        error: (error) => {
          this.error = 'Error al actualizar el producto: ' + error.message;
          this.guardando = false;
        }
      });
    } else {
      const nuevoProducto: ProductoCrearDTO = {
        nombre: productoData.nombre,
        descripcion: productoData.descripcion,
        codigoBarra: productoData.codigoBarra,
        precioCompra: productoData.precioCompra,
        precioVenta: productoData.precioVenta,
        stock: productoData.stock,
        stockMinimo: productoData.stockMinimo,
        categoriaId: productoData.categoriaId
      };

      this.productoService.crearProducto(nuevoProducto).subscribe({
        next: () => {
          this.cargarProductos();
          this.cerrarModal();
          this.guardando = false;
        },
        error: (error) => {
          this.error = 'Error al crear el producto: ' + error.message;
          this.guardando = false;
        }
      });
    }
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

  cargarCategorias(): void {
    this.categoriaService.obtenerCategorias().subscribe({
      next: (categorias: Categoria[]) => {
        this.categoriasDisponibles = categorias;
      },
      error: (error: Error) => {
        this.error = 'Error al cargar las categorías: ' + error.message;
      }
    });
  }

  getNombreCategoria(id: number): string {
    const categoria = this.categoriasDisponibles.find(c => c.id === id);
    return categoria ? categoria.nombre : 'Desconocida';
  }

  abrirModalAgregarStock(): void {
    this.mostrarModalStock = true;
    this.stockForm.reset();
    this.productoEncontrado = null;
    this.error = '';
  }

  cerrarModalStock(): void {
    this.mostrarModalStock = false;
    this.stockForm.reset();
    this.productoEncontrado = null;
    this.error = '';
  }

  buscarProductoPorCodigo(): void {
    const codigoBarra = this.stockForm.get('codigoBarra')?.value;
    this.productoEncontrado = null;
    if (codigoBarra) {
      this.productoService.buscarPorCodigo(codigoBarra).subscribe({
        next: (producto: Producto) => {
          this.productoEncontrado = producto;
          if (producto) {
            this.stockForm.get('cantidadAgregar')?.enable();
          } else {
            this.stockForm.get('cantidadAgregar')?.disable();
          }
        },
        error: (err: any) => {
          console.error('Error al buscar producto:', err);
          this.productoEncontrado = null;
          this.stockForm.get('cantidadAgregar')?.disable();
          this.error = 'Producto no encontrado o error en la búsqueda.';
        }
      });
    }
  }

  guardarStock(): void {
    if (this.stockForm.invalid || !this.productoEncontrado) {
      console.log('Formulario inválido o producto no encontrado.');
      return;
    }

    const cantidadAgregar = this.stockForm.get('cantidadAgregar')?.value;
    const nuevoStock = this.productoEncontrado.stock + cantidadAgregar;

    const productoParaActualizar: Partial<Producto> = {
      codigoBarra: this.productoEncontrado.codigoBarra,
      nombre: this.productoEncontrado.nombre,
      descripcion: this.productoEncontrado.descripcion,
      precioCompra: this.productoEncontrado.precioCompra,
      precioVenta: this.productoEncontrado.precioVenta,
      stock: nuevoStock,
      stockMinimo: this.productoEncontrado.stockMinimo,
      categoriaId: this.productoEncontrado.categoriaId
    };

    this.productoService.actualizarProducto(this.productoEncontrado.id, productoParaActualizar).subscribe({
      next: () => {
        this.cargarProductos();
        this.cerrarModalStock();
      },
      error: (error: any) => {
        this.error = 'Error al actualizar el stock: ' + error.message;
      }
    });
  }
}
