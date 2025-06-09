import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroComponent } from './registro/registro.component';
import { VentasRoutingModule } from './ventas-routing-module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ResumenComponent } from './resumen/resumen.component';

@NgModule({
  declarations: [
    RegistroComponent,
    ResumenComponent
  ],
  imports: [
    CommonModule,
    VentasRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    RegistroComponent,
    ResumenComponent
  ]
})
export class VentasModule { }
