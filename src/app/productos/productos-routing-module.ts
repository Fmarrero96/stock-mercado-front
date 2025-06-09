import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoListadoComponent } from './listado/listado.component';
import { StockBajoComponent } from './stock-bajo/stock-bajo.component';

const routes: Routes = [
  { path: '', component: ProductoListadoComponent },
  { path: 'stock-bajo', component: StockBajoComponent } // accede como /productos/stock-bajo
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosRoutingModule {}
