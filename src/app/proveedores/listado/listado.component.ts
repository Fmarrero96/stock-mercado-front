import { Component, OnInit } from '@angular/core';
import { Proveedor, ProveedorService } from '../proveedor.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-listado',
  standalone: false,
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})
export class ListadoComponent implements OnInit {
  proveedores: Proveedor[] = [];
  filtrados: Proveedor[] = [];
  termino = '';
  error = '';
  mostrarModal = false;
  proveedorForm!: FormGroup;
  modoEdicion = false;
  proveedorEditando: Proveedor | null = null;

  constructor(private proveedorService: ProveedorService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.proveedorService.getProveedores().subscribe({
      next: data => {
        this.proveedores = data;
        this.aplicarFiltro();
      },
      error: () => this.error = 'Error al cargar proveedores'
    });
  }

  aplicarFiltro(): void {
    const t = this.termino.toLowerCase();
    this.filtrados = this.proveedores.filter(p =>
      p.nombre.toLowerCase().includes(t) || p.email.toLowerCase().includes(t)
    );
  }

  abrirModal(proveedor?: Proveedor): void {
    this.mostrarModal = true;
    if (proveedor) {
      this.modoEdicion = true;
      this.proveedorEditando = proveedor;
      this.proveedorForm = this.fb.group({
        nombre: [proveedor.nombre, Validators.required],
        email: [proveedor.email, [Validators.required, Validators.email]],
        telefono: [proveedor.telefono],
        direccion: [proveedor.direccion]
      });
    } else {
      this.modoEdicion = false;
      this.proveedorEditando = null;
      this.proveedorForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: ['']
    });
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.proveedorForm.reset();
    this.proveedorEditando = null;
    this.modoEdicion = false;
    this.error = '';
  }

  guardarProveedor(): void {
    if (this.proveedorForm.invalid) return;

    if (this.modoEdicion && this.proveedorEditando) {
      this.proveedorService.actualizarProveedor(this.proveedorEditando.id, this.proveedorForm.value).subscribe({
      next: () => {
        this.cerrarModal();
        this.cargar();
      },
        error: () => this.error = 'Error al actualizar proveedor'
    });
    } else {
      this.proveedorService.crearProveedor(this.proveedorForm.value).subscribe({
      next: () => {
          this.cerrarModal();
        this.cargar();
      },
        error: () => this.error = 'Error al crear proveedor'
    });
  }
  }
}
