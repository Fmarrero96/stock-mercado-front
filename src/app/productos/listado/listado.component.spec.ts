import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoListadoComponent } from './listado.component';

describe('ProductoListadoComponent', () => {
  let component: ProductoListadoComponent;
  let fixture: ComponentFixture<ProductoListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductoListadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductoListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
