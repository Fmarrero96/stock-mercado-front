import { Component, OnInit } from '@angular/core';
import { Proveedor, ProveedorService } from '../proveedor.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

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
  editandoId: number | null = null;
  formEdicion!: FormGroup;
  mostrarModal = false;
  formAlta!: FormGroup;

  constructor(private proveedorService: ProveedorService, private fb: FormBuilder) {
    this.formEdicion = this.fb.group({
      nombre: new FormControl(''),
      email: new FormControl(''),
      telefono: new FormControl(''),
      direccion: new FormControl('')
    });
  }

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

  abrirModal(): void {
    this.formAlta = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: ['']
    });
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardarProveedor(): void {
    if (this.formAlta.invalid) return;
    this.proveedorService.crearProveedor(this.formAlta.value).subscribe({
      next: () => {
        this.cerrarModal();
        this.cargar();
      },
      error: () => alert('Error al crear proveedor')
    });
  }

  comenzarEdicion(p: Proveedor): void {
    this.editandoId = p.id;
    this.formEdicion = this.fb.group({
      nombre: [p.nombre],
      email: [p.email],
      telefono: [p.telefono],
      direccion: [p.direccion]
    });
  }

  guardarEdicion(id: number): void {
    if (this.formEdicion.invalid) return;
    this.proveedorService.actualizarProveedor(id, this.formEdicion.value).subscribe({
      next: () => {
        this.editandoId = null;
        this.cargar();
      },
      error: () => alert('Error al guardar proveedor')
    });
  }

  cancelarEdicion(): void {
    this.editandoId = null;
  }
}
