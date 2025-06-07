import { Component, OnInit } from '@angular/core';
import { ProductoService, Producto } from '../producto.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

interface ProductoForm {
  nombre: FormControl<string | null>;
  codigoBarra: FormControl<string | null>;
  stock: FormControl<number | null>;
  precioCompra: FormControl<number | null>;
  precioVenta: FormControl<number | null>;
  porcentajeGanancia: FormControl<number | null>;
  estado: FormControl<boolean | null>;
}

@Component({
  selector: 'app-listado',
  standalone: false,
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})
export class ListadoComponent implements OnInit {
  productos: Producto[] = [];
  filtrados: Producto[] = [];
  error = '';
  termino = '';
  editandoId: number | null = null;
  formEdicion!: FormGroup<ProductoForm>;
  formAlta = new FormGroup<ProductoForm>({
    nombre: new FormControl('', { nonNullable: true }),
    codigoBarra: new FormControl('', { nonNullable: true }),
    stock: new FormControl(0, { nonNullable: true }),
    precioCompra: new FormControl(0, { nonNullable: true }),
    precioVenta: new FormControl(0, { nonNullable: true }),
    porcentajeGanancia: new FormControl(0, { nonNullable: true }),
    estado: new FormControl(true, { nonNullable: true })
  });
  mostrarAlta = false;

  constructor(private productoService: ProductoService, private fb: FormBuilder) {}
  

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.filtrados = data;
      },
      error: () => this.error = 'Error al cargar los productos'
    });
  }
  

  filtrar(): void {
    const termino = this.termino.toLowerCase();
    this.filtrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(termino) ||
      p.codigoBarra.toLowerCase().includes(termino)
    );
  }

  comenzarEdicion(producto: Producto): void {
    this.editandoId = producto.id ?? null;
    this.formEdicion = this.fb.group<ProductoForm>({
      nombre: this.fb.control(producto.nombre),
      codigoBarra: this.fb.control(producto.codigoBarra),
      stock: this.fb.control(producto.stock),
      precioCompra: this.fb.control(producto.precioCompra),
      precioVenta: this.fb.control(producto.precioVenta),
      porcentajeGanancia: this.fb.control(producto.porcentajeGanancia),
      estado: this.fb.control(producto.estado)
    });
  }

  guardarEdicion(id: number): void {
    if (this.formEdicion.invalid) return;
    const formValue = this.formEdicion.getRawValue();
    const editado: Producto = {
      id,
      nombre: formValue.nombre ?? '',
      codigoBarra: formValue.codigoBarra ?? '',
      stock: formValue.stock ?? 0,
      precioCompra: formValue.precioCompra ?? 0,
      precioVenta: formValue.precioVenta ?? 0,
      porcentajeGanancia: formValue.porcentajeGanancia ?? 0,
      estado: formValue.estado ?? true
    };
    this.productoService.actualizarProducto(id, editado).subscribe({
      next: () => {
        this.editandoId = null;
        this.cargarProductos();
      },
      error: () => alert('Error al guardar cambios')
    });
  }

  cancelarEdicion(): void {
    this.editandoId = null;
  }

  agregarProducto(): void {
    const nuevo: Producto = {
      id: 0,
      nombre: 'Nuevo producto',
      codigoBarra: '0000000000',
      stock: 0,
      precioCompra: 0,
      precioVenta: 0,
      porcentajeGanancia: 0,
      estado: false
    };
    this.productoService.crearProducto(nuevo).subscribe({
      next: () => this.cargarProductos(),
      error: () => alert('No se pudo agregar el producto')
    });
  }

  abrirAlta(): void {
    this.mostrarAlta = true;
    this.formAlta.reset({
      nombre: '',
      codigoBarra: '',
      stock: 0,
      precioCompra: 0,
      precioVenta: 0,
      porcentajeGanancia: 0,
      estado: true
    });
  }
  
  cerrarAlta(): void {
    this.mostrarAlta = false;
  }
  
  guardarAlta(): void {
    if (this.formAlta.invalid) return;

    const formValue = this.formAlta.getRawValue();
    const nuevo: Producto = {
      nombre: formValue.nombre ?? '',
      codigoBarra: formValue.codigoBarra ?? '',
      stock: formValue.stock ?? 0,
      precioCompra: formValue.precioCompra ?? 0,
      precioVenta: formValue.precioVenta ?? 0,
      porcentajeGanancia: formValue.porcentajeGanancia ?? 0,
      estado: formValue.estado ?? true
    };

    this.productoService.crearProducto(nuevo).subscribe({
      next: () => {
        this.cargarProductos();
        this.cerrarAlta();
      },
      error: () => alert('No se pudo guardar el producto')
    });
  }

  
}
