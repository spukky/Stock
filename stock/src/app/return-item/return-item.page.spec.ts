import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnItemPage } from './return-item.page';

describe('ReturnItemPage', () => {
  let component: ReturnItemPage;
  let fixture: ComponentFixture<ReturnItemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnItemPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
