import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CategoriasRoutingModule } from './categorias-routing-module';
import { Listado } from './listado/listado';

@NgModule({
  declarations: [
    Listado
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CategoriasRoutingModule
  ]
})
export class CategoriasModule { }
