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

import { CardioVascularSystemComponent } from './cardio-vascular-system.component';

describe('CardioVascularSystemComponent', () => {
  let component: CardioVascularSystemComponent;
  let fixture: ComponentFixture<CardioVascularSystemComponent>;
  let fb;
  let debugElement: DebugElement;
  let el: HTMLElement;
  let spy: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardioVascularSystemComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule, FormsModule, MaterialModule, NoopAnimationsModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardioVascularSystemComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fb = debugElement.injector.get(FormBuilder);
    component.cardioVascularSystemForm = new GeneralUtils(fb).createCardioVascularSystemForm();
    fixture.detectChanges();
  });

  it('should create CardioVascularSystemComponent', () => {
    expect(component).toBeTruthy();
  });

  it('Should initialize the component', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  })
});
