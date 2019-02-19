import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPermitPage } from './add-permit.page';

describe('AddPermitPage', () => {
  let component: AddPermitPage;
  let fixture: ComponentFixture<AddPermitPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPermitPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPermitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
