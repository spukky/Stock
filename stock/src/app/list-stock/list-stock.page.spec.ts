import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStockPage } from './list-stock.page';

describe('ListStockPage', () => {
  let component: ListStockPage;
  let fixture: ComponentFixture<ListStockPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListStockPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListStockPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
