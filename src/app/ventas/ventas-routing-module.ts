import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './registro/registro.component';
import { ResumenComponent } from './resumen/resumen.component';

const routes: Routes = [
  { path: '', component: RegistroComponent },
  { path: 'resumen', component: ResumenComponent } // /ventas
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule {}
