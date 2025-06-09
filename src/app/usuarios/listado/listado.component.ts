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
  usuarioForm!: FormGroup;
  modoEdicion = false;
  usuarioEditando: Usuario | null = null;

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

  abrirModal(usuario?: Usuario): void {
    this.mostrarModal = true;
    if (usuario) {
      this.modoEdicion = true;
      this.usuarioEditando = usuario;
      this.usuarioForm = this.fb.group({
        nombre: [usuario.nombre, Validators.required],
        email: [usuario.email, [Validators.required, Validators.email]],
        password: [''],
        rolId: [usuario.rolId as number, Validators.required]
      });
    } else {
      this.modoEdicion = false;
      this.usuarioEditando = null;
      this.usuarioForm = this.fb.group({
        nombre: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        rolId: ['', Validators.required]
      });
    }
  }
  
  cerrarModal(): void {
    this.mostrarModal = false;
    this.usuarioForm.reset();
    this.usuarioEditando = null;
    this.modoEdicion = false;
    this.error = '';
  }
  
  guardarUsuario(): void {
    if (this.usuarioForm.invalid) return;

    const formValue = this.usuarioForm.value;
    
    if (this.modoEdicion && this.usuarioEditando) {
      const usuarioActualizado = {
        ...formValue,
        id: this.usuarioEditando.id,
        rolId: Number(formValue.rolId) 
      };

      if (!formValue.password) {
        delete usuarioActualizado.password; 
      }

      this.usuarioService.actualizarUsuario(this.usuarioEditando.id!, usuarioActualizado).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarUsuarios();
        },
        error: () => alert('Error al actualizar usuario')
      });

    } else {
      const emailExiste = this.usuarios.some(u => u.email.toLowerCase() === formValue.email.toLowerCase());
      if (emailExiste) {
        alert('Ya existe un usuario con ese email 📧');
        return;
      }
    
      const nuevoUsuario = {
        ...formValue,
        rolId: Number(formValue.rolId)
      };
    
      this.usuarioService.crearUsuario(nuevoUsuario).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarUsuarios();
        },
        error: () => alert('Error al crear usuario')
      });
    }
  }

  aplicarFiltros(): void {
    this.filtrados = this.usuarios.filter(u => {
      const coincideTermino = this.termino === '' || (
        u.nombre.toLowerCase().includes(this.termino.toLowerCase()) ||
        u.email.toLowerCase().includes(this.termino.toLowerCase())
      );
      const coincideRol = this.rol === '' || u.rolId === Number(this.rol);
      return coincideTermino && coincideRol;
    });
  }

  getNombreRol(rolId: number): string {
    const rol = this.rolesDisponibles.find(r => r.id === rolId);
    return rol ? rol.nombre : 'Rol no encontrado';
  }

  get totalPaginas(): number {
    return Math.ceil(this.filtrados.length / this.usuariosPorPagina);
  }

  get usuariosPaginados(): Usuario[] {
    const inicio = (this.paginaActual - 1) * this.usuariosPorPagina;
    return this.filtrados.slice(inicio, inicio + this.usuariosPorPagina);
  }
}
