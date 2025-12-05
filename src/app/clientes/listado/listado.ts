import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../cliente.interface';
import { ClientesService } from '../clientes';

@Component({
  selector: 'app-listado',
  standalone: false,
  templateUrl: './listado.html',
  styleUrl: './listado.scss'
})
export class ListadoComponent implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  mostrarModal = false;
  mostrarConfirmacionEliminar = false;
  clienteForm: FormGroup;
  clienteSeleccionado: Cliente | null = null;
  modoEdicion = false;
  filtro = '';
  clienteAEliminar: Cliente | null = null;

  constructor(
    private clientesService: ClientesService,
    private fb: FormBuilder
  ) {
    this.clienteForm = this.fb.group({
      dni: ['', [Validators.pattern(/^\d{7,8}$/)]],
      nombreApellido: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.pattern(/^\d{10,15}$/)]],
      direccion: ['']
    });
  }

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.clientesService.obtenerClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.aplicarFiltro();
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    });
  }

  aplicarFiltro(): void {
    const filtroLower = this.filtro.toLowerCase().trim();
    this.clientesFiltrados = this.clientes.filter(cliente =>
      cliente.nombreApellido.toLowerCase().includes(filtroLower) ||
      (cliente.dni && cliente.dni.includes(filtroLower)) ||
      (cliente.telefono && cliente.telefono.includes(filtroLower))
    );
  }

  abrirModal(cliente?: Cliente): void {
    this.modoEdicion = !!cliente;
    this.clienteSeleccionado = cliente || null;
    this.mostrarModal = true;

    if (cliente) {
      this.clienteForm.patchValue({
        dni: cliente.dni,
        nombreApellido: cliente.nombreApellido,
        telefono: cliente.telefono,
        direccion: cliente.direccion
      });
    } else {
      this.clienteForm.reset();
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.clienteSeleccionado = null;
    this.modoEdicion = false;
    this.clienteForm.reset();
  }

  guardarCliente(): void {
    if (this.clienteForm.valid) {
      const datosCliente = this.clienteForm.value;

      if (this.modoEdicion && this.clienteSeleccionado) {
        this.clientesService.actualizarCliente(this.clienteSeleccionado.id!, datosCliente).subscribe({
          next: (cliente) => {
            console.log('Cliente actualizado:', cliente);
            this.cargarClientes();
            this.cerrarModal();
          },
          error: (error) => {
            console.error('Error al actualizar cliente:', error);
          }
        });
      } else {
        this.clientesService.agregarCliente(datosCliente).subscribe({
          next: (cliente) => {
            console.log('Cliente creado:', cliente);
            this.cargarClientes();
            this.cerrarModal();
          },
          error: (error) => {
            console.error('Error al crear cliente:', error);
          }
        });
      }
    }
  }

  confirmarEliminar(cliente: Cliente): void {
    this.clienteAEliminar = cliente;
    this.mostrarConfirmacionEliminar = true;
  }

  eliminarCliente(): void {
    if (this.clienteAEliminar) {
      this.clientesService.eliminarCliente(this.clienteAEliminar.id!).subscribe({
        next: () => {
          console.log('Cliente eliminado:', this.clienteAEliminar!.id);
          this.cargarClientes();
          this.cancelarEliminar();
        },
        error: (error) => {
          console.error('Error al eliminar cliente:', error);
          this.cancelarEliminar();
        }
      });
    }
  }

  cancelarEliminar(): void {
    this.clienteAEliminar = null;
    this.mostrarConfirmacionEliminar = false;
  }

  onFiltroChange(): void {
    this.aplicarFiltro();
  }

  get nombreApellido() { return this.clienteForm.get('nombreApellido'); }
  get dni() { return this.clienteForm.get('dni'); }
  get telefono() { return this.clienteForm.get('telefono'); }
  get direccion() { return this.clienteForm.get('direccion'); }
}
