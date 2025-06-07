import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './auth/admin-guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule) },
  { path: 'productos', loadChildren: () => import('./productos/productos-routing-module').then(m => m.ProductosRoutingModule) },
  { path: 'ventas', loadChildren: () => import('./ventas/ventas-routing-module').then(m => m.VentasRoutingModule) },
  { path: 'usuarios', loadChildren: () => import('./usuarios/usuarios-module').then(m => m.UsuariosModule),},
  { path: 'proveedores', loadChildren: () => import('./proveedores/proveedores-module').then(m => m.ProveedoresModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
