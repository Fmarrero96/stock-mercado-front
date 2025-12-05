import { Injectable } from '@angular/core';
import { Cliente } from './cliente.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private clientes: Cliente[] = [
    {
      id: 1,
      dni: '12345678',
      nombreApellido: 'Juan Pérez',
      telefono: '1234567890',
      direccion: 'Calle Falsa 123'
    },
    {
      id: 2,
      dni: '87654321',
      nombreApellido: 'María González',
      telefono: '0987654321',
      direccion: 'Av. Principal 456'
    }
  ];

  private nextId = 3;

  constructor() { }

  obtenerClientes(): Cliente[] {
    return [...this.clientes];
  }

  obtenerClientePorId(id: number): Cliente | undefined {
    return this.clientes.find(cliente => cliente.id === id);
  }

  agregarCliente(cliente: Omit<Cliente, 'id'>): Cliente {
    const nuevoCliente: Cliente = {
      ...cliente,
      id: this.nextId++
    };
    this.clientes.push(nuevoCliente);
    return nuevoCliente;
  }

  actualizarCliente(id: number, clienteActualizado: Omit<Cliente, 'id'>): boolean {
    const index = this.clientes.findIndex(cliente => cliente.id === id);
    if (index !== -1) {
      this.clientes[index] = { ...clienteActualizado, id };
      return true;
    }
    return false;
  }

  eliminarCliente(id: number): boolean {
    const index = this.clientes.findIndex(cliente => cliente.id === id);
    if (index !== -1) {
      this.clientes.splice(index, 1);
      return true;
    }
    return false;
  }
}
