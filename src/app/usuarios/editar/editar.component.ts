import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService, Usuario } from '../usuario.service';
import { RolService, Rol } from '../rol.service';

@Component({
  selector: 'app-editar',
  standalone: false,
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarComponent implements OnInit {
  form!: FormGroup;
  esEdicion = false;
  idUsuario?: number;
  error = '';
  rolesDisponibles: Rol[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarRoles();
    this.idUsuario = +this.route.snapshot.paramMap.get('id')!;
    this.esEdicion = !isNaN(this.idUsuario);

    this.form = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''], // solo requerido si es nuevo
      rolId: ['', Validators.required],
      estado: ['activo', Validators.required]
    });

    if (this.esEdicion) {
      this.usuarioService.getUsuario(this.idUsuario).subscribe({
        next: u => {
          this.form.patchValue({
            ...u,
            password: '',
            rolId: u.rolId
          });
        },
        error: () => this.error = 'No se pudo cargar el usuario'
      });
    }
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

  guardar(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const usuario: Usuario = {
      ...formValue,
      rol: this.rolesDisponibles.find(r => r.id === formValue.rolId)!
    };

    const request = this.esEdicion
      ? this.usuarioService.actualizarUsuario(this.idUsuario!, usuario)
      : this.usuarioService.crearUsuario(usuario);

    request.subscribe({
      next: () => this.router.navigate(['/usuarios']),
      error: () => this.error = 'Error al guardar el usuario'
    });
  }
}
