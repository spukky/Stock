import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawItemPage } from './withdraw-item.page';

describe('WithdrawItemPage', () => {
  let component: WithdrawItemPage;
  let fixture: ComponentFixture<WithdrawItemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawItemPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
