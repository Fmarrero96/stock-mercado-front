import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { authGuard } from './auth/auth-guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule) },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'productos', loadChildren: () => import('./productos/productos-routing-module').then(m => m.ProductosRoutingModule) },
      { path: 'ventas', loadChildren: () => import('./ventas/ventas-module').then(m => m.VentasModule) },
      { path: 'usuarios', loadChildren: () => import('./usuarios/usuarios-module').then(m => m.UsuariosModule) },
      { path: 'proveedores', loadChildren: () => import('./proveedores/proveedores-module').then(m => m.ProveedoresModule) },
      { path: 'categorias', loadChildren: () => import('./categorias/categorias-module').then(m => m.CategoriasModule) },
      { path: 'clientes', loadChildren: () => import('./clientes/clientes-module').then(m => m.ClientesModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 