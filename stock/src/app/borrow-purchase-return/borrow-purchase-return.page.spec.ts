import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowPurchaseReturnPage } from './borrow-purchase-return.page';

describe('BorrowPurchaseReturnPage', () => {
  let component: BorrowPurchaseReturnPage;
  let fixture: ComponentFixture<BorrowPurchaseReturnPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BorrowPurchaseReturnPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowPurchaseReturnPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
