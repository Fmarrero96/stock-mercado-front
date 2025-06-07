import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ProductosModule } from './productos/productos-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VentasModule } from './ventas/ventas-module';

@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ProductosModule,
    ReactiveFormsModule,
    FormsModule,
    VentasModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [App]
})
export class AppModule { }
