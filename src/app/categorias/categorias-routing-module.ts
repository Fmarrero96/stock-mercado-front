import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Listado } from './listado/listado';

const routes: Routes = [
  { path: '', component: Listado },
  { path: 'listado', component: Listado }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriasRoutingModule { }
