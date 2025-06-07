import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoComponent } from './listado/listado.component';
import { EditarComponent } from './editar/editar.component';

const routes: Routes = [{ path: '', component: ListadoComponent }, { path: 'editar/:id', component: EditarComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
