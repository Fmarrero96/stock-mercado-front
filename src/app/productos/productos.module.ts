import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ProductoListadoComponent } from './listado/listado.component';
import { ProductoService } from './producto.service';

const routes: Routes = [
  { path: '', component: ProductoListadoComponent }
];

@NgModule({
  declarations: [
    ProductoListadoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    ProductoService
  ]
})
export class ProductosModule { } 