import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialItemPage } from './serial-item.page';

describe('SerialItemPage', () => {
  let component: SerialItemPage;
  let fixture: ComponentFixture<SerialItemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerialItemPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerialItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
