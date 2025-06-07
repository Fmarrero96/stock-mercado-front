import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListadoComponent } from './listado/listado.component';
import { ProductosRoutingModule } from './productos-routing-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StockBajoComponent } from './stock-bajo/stock-bajo.component';



@NgModule({
  declarations: [
    ListadoComponent,
    StockBajoComponent
  ],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    FormsModule,
    ReactiveFormsModule 
  ]
})
export class ProductosModule { }
