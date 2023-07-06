import { async, inject, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { MaterialModule } from '../../../core/material.module';

import { VisitDetailUtils } from '../../shared/utility';

import { DoctorService } from '../../shared/services';
import { DoctorServiceStub } from '../../shared/mocks/doctor-service-stub';

import * as data from '../../shared/mocks/mock-data';
import { Observable } from 'rxjs/Rx';

import { AdherenceComponent } from './adherence.component';

describe('AdherenceComponent', () => {
  let component: AdherenceComponent;
  let fixture: ComponentFixture<AdherenceComponent>;
  let debugElement: DebugElement;
  let fb: FormBuilder;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ReactiveFormsModule, MaterialModule],
      declarations: [AdherenceComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DoctorService, useClass: DoctorServiceStub },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdherenceComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    
    fb = debugElement.injector.get(FormBuilder);
    component.patientAdherenceForm = new VisitDetailUtils(fb).createPatientAdherenceForm();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
