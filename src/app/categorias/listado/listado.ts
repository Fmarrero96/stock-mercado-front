import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriaService } from '../categoria';
import { Categoria, CategoriaCrearDTO } from '../categoria.model';

@Component({
  selector: 'app-listado',
  standalone: false,
  templateUrl: './listado.html',
  styleUrl: './listado.scss'
})
export class Listado implements OnInit {
  categorias: Categoria[] = [];
  categoriasFiltradas: Categoria[] = [];
  terminoBusqueda: string = '';
  
  mostrarModal = false;
  modoEdicion = false;
  categoriaSeleccionada: Categoria | null = null;
  
  categoriaForm!: FormGroup;
  guardando = false;
  error: string | null = null;

  constructor(
    private categoriaService: CategoriaService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarCategorias();
  }

  inicializarFormulario(): void {
    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      descripcion: ['', [Validators.maxLength(200)]],
      activo: [true]
    });
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.categoriasFiltradas = categorias;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.mostrarError('Error al cargar las categorías');
      }
    });
  }

  filtrarCategorias(): void {
    if (!this.terminoBusqueda.trim()) {
      this.categoriasFiltradas = this.categorias;
    } else {
      const termino = this.terminoBusqueda.toLowerCase();
      this.categoriasFiltradas = this.categorias.filter(categoria =>
        categoria.nombre.toLowerCase().includes(termino) ||
        (categoria.descripcion && categoria.descripcion.toLowerCase().includes(termino))
      );
    }
  }

  abrirModalCrear(): void {
    this.modoEdicion = false;
    this.categoriaSeleccionada = null;
    this.categoriaForm.reset({
      nombre: '',
      descripcion: '',
      activo: true
    });
    this.mostrarModal = true;
    this.error = null;
  }

  abrirModalEditar(categoria: Categoria): void {
    this.modoEdicion = true;
    this.categoriaSeleccionada = categoria;
    this.categoriaForm.patchValue({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || '',
      activo: categoria.activo
    });
    this.mostrarModal = true;
    this.error = null;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.categoriaSeleccionada = null;
    this.modoEdicion = false;
    this.guardando = false;
    this.error = null;
    this.categoriaForm.reset();
  }

  guardarCategoria(): void {
    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.error = null;

    const categoriaData: CategoriaCrearDTO = this.categoriaForm.value;

    if (this.modoEdicion && this.categoriaSeleccionada) {
      // Actualizar categoría existente
      this.categoriaService.actualizarCategoria(this.categoriaSeleccionada.id!, categoriaData).subscribe({
        next: () => {
          this.cargarCategorias();
          this.cerrarModal();
          this.mostrarMensaje('Categoría actualizada correctamente ✅');
        },
        error: (error) => {
          console.error('Error al actualizar categoría:', error);
          this.error = 'Error al actualizar la categoría';
          this.guardando = false;
        }
      });
    } else {
      // Crear nueva categoría
      this.categoriaService.crearCategoria(categoriaData).subscribe({
        next: () => {
          this.cargarCategorias();
          this.cerrarModal();
          this.mostrarMensaje('Categoría creada correctamente ✅');
        },
        error: (error) => {
          console.error('Error al crear categoría:', error);
          this.error = 'Error al crear la categoría';
          this.guardando = false;
        }
      });
    }
  }

  eliminarCategoria(categoria: Categoria): void {
    if (!categoria.id) return;

    const confirmar = confirm(`¿Está seguro de eliminar la categoría "${categoria.nombre}"?\n\nEsta acción no se puede deshacer.`);
    
    if (confirmar) {
      this.categoriaService.eliminarCategoria(categoria.id).subscribe({
        next: () => {
          this.cargarCategorias();
          this.mostrarMensaje(`Categoría "${categoria.nombre}" eliminada correctamente ✅`);
        },
        error: (error) => {
          console.error('Error al eliminar categoría:', error);
          this.mostrarError('Error al eliminar la categoría. Puede que tenga productos asociados.');
        }
      });
    }
  }

  toggleActivarCategoria(categoria: Categoria): void {
    if (!categoria.id) return;

    const nuevoEstado = !categoria.activo;
    const accion = nuevoEstado ? 'activar' : 'desactivar';
    
    const confirmar = confirm(`¿Está seguro de ${accion} la categoría "${categoria.nombre}"?`);
    
    if (confirmar) {
      this.categoriaService.toggleActivarCategoria(categoria.id, nuevoEstado).subscribe({
        next: () => {
          this.cargarCategorias();
          this.mostrarMensaje(`Categoría ${nuevoEstado ? 'activada' : 'desactivada'} correctamente ✅`);
        },
        error: (error) => {
          console.error('Error al cambiar estado de categoría:', error);
          this.mostrarError(`Error al ${accion} la categoría`);
        }
      });
    }
  }

  private mostrarMensaje(mensaje: string): void {
    // Implementar toast/notificación
    console.log(mensaje);
  }

  private mostrarError(mensaje: string): void {
    this.error = mensaje;
    setTimeout(() => {
      this.error = null;
    }, 5000);
  }

  // Métodos de utilidad para el template
  get nombreControl() { return this.categoriaForm.get('nombre'); }
  get descripcionControl() { return this.categoriaForm.get('descripcion'); }
  get activoControl() { return this.categoriaForm.get('activo'); }
}
