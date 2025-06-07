import { Component, OnInit } from '@angular/core';
import { UsuarioService, Usuario } from '../usuario.service';
import { RolService, Rol } from '../rol.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-listado',
  standalone: false,
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})
export class ListadoComponent implements OnInit {
  usuarios: Usuario[] = [];
  filtrados: Usuario[] = [];
  error = '';
  termino = '';
  rol = '';
  mostrarModal = false;
  formAlta!: FormGroup;

  rolesDisponibles: Rol[] = [];

  paginaActual = 1;
  usuariosPorPagina = 5;

  constructor(
    private usuarioService: UsuarioService, 
    private rolService: RolService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cargarRoles();
    this.cargarUsuarios();
  }

  cargarRoles(): void {
    this.rolService.getRoles().subscribe({
      next: (roles) => {
        this.rolesDisponibles = roles;
      },
      error: () => {
        this.error = 'Error al cargar roles';
      }
    });
  }

  cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: data => {
        this.usuarios = data;
        this.aplicarFiltros();
      },
      error: () => this.error = 'Error al cargar usuarios'
    });
  }

  abrirModal(): void {
    this.mostrarModal = true;
    this.formAlta = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rolId: ['', Validators.required]
    });
  }
  
  cerrarModal(): void {
    this.mostrarModal = false;
  }
  
  guardarNuevoUsuario(): void {
    if (this.formAlta.invalid) return;

    // Validar email duplicado antes de enviar
    const emailExiste = this.usuarios.some(u => u.email.toLowerCase() === nuevoUsuario.email.toLowerCase());
    if (emailExiste) {
      alert('Ya existe un usuario con ese email 📧');
      return;
    }
  
    const formValue = this.formAlta.value;
    const nuevoUsuario = {
      ...formValue,
      rol: this.rolesDisponibles.find(r => r.id === formValue.rolId)
    };
  
    this.usuarioService.crearUsuario(nuevoUsuario).subscribe({
      next: () => {
        this.cerrarModal();
        this.cargarUsuarios();
      },
      error: () => alert('Error al crear usuario')
    });
  }

  aplicarFiltros(): void {
    this.filtrados = this.usuarios.filter(u => {
      const coincideTermino = this.termino === '' || (
        u.nombre.toLowerCase().includes(this.termino.toLowerCase()) ||
        u.email.toLowerCase().includes(this.termino.toLowerCase())
      );
      const coincideRol = this.rol === '' || u.rol.id?.toString() === this.rol;
      return coincideTermino && coincideRol;
    });
  }


  toast(mensaje: string): void {
    const div = document.createElement('div');
    div.textContent = mensaje;
    div.style.position = 'fixed';
    div.style.bottom = '20px';
    div.style.left = '50%';
    div.style.transform = 'translateX(-50%)';
    div.style.background = '#323232';
    div.style.color = 'white';
    div.style.padding = '10px 20px';
    div.style.borderRadius = '8px';
    div.style.zIndex = '1000';
    div.style.opacity = '0.9';
  
    document.body.appendChild(div);
  
    setTimeout(() => document.body.removeChild(div), 3000);
  }

get totalPaginas(): number {
  return Math.ceil(this.filtrados.length / this.usuariosPorPagina);
}

get usuariosPaginados(): Usuario[] {
  const inicio = (this.paginaActual - 1) * this.usuariosPorPagina;
  return this.filtrados.slice(inicio, inicio + this.usuariosPorPagina);
}
  
}
