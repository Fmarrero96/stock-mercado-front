import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBajoComponent } from './stock-bajo.component';

describe('StockBajoComponent', () => {
  let component: StockBajoComponent;
  let fixture: ComponentFixture<StockBajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockBajoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockBajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
