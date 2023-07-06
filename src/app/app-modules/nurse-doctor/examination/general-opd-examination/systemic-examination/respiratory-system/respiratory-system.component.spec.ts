import { async, ComponentFixture, tick, inject, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../../../../core/material.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GeneralUtils } from '../../../../shared/utility';

import * as data from '../../../../shared/mocks/mock-data';
import { Observable } from 'rxjs/Observable';

import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RespiratorySystemComponent } from './respiratory-system.component';

describe('RespiratorySystemComponent', () => {
  let component: RespiratorySystemComponent;
  let fixture: ComponentFixture<RespiratorySystemComponent>;
  let fb;
  let debugElement: DebugElement;
  let el: HTMLElement;
  let spy: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RespiratorySystemComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule, FormsModule, MaterialModule, NoopAnimationsModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RespiratorySystemComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fb = debugElement.injector.get(FormBuilder);
    component.respiratorySystemForm = new GeneralUtils(fb).createRespiratorySystemForm();
    fixture.detectChanges();
  });

  it('should create RespiratorySystemComponent', () => {
    expect(component).toBeTruthy();
  });

  it('Should initialize the component', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  })
});
