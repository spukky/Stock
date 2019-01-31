import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPermitStockPage } from './list-permit-stock.page';

describe('ListPermitStockPage', () => {
  let component: ListPermitStockPage;
  let fixture: ComponentFixture<ListPermitStockPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPermitStockPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPermitStockPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
