/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UntoweredComponent } from './untowered.component';

describe('UntoweredComponent', () => {
  let component: UntoweredComponent;
  let fixture: ComponentFixture<UntoweredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UntoweredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UntoweredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
