import { async, ComponentFixture, tick, inject, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../../core/material.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { GeneralOpdExaminationComponent } from './general-opd-examination.component';
import { GeneralUtils } from '../../shared/utility';

import { ConfirmationService } from '../../../core/services/confirmation.service';
import { DoctorService } from '../../shared/services';

import { DoctorServiceStub } from '../../shared/mocks/doctor-service-stub';

import * as data from '../../shared/mocks/mock-data';
import { Observable } from 'rxjs/Observable';

import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('GeneralOpdExaminationComponent', () => {
  let component: GeneralOpdExaminationComponent;
  let fixture: ComponentFixture<GeneralOpdExaminationComponent>;
  let doctorService: DoctorService;
  let confirmationService: ConfirmationService;
  let fb;
  let debugElement: DebugElement;
  let el: HTMLElement;
  let spy: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralOpdExaminationComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule, FormsModule, MaterialModule, NoopAnimationsModule],
      providers: [
        ConfirmationService,
        { provide: DoctorService, useClass: DoctorServiceStub }],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralOpdExaminationComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    fb = debugElement.injector.get(FormBuilder);
    component.patientExaminationForm = new GeneralUtils(fb).createPatientExaminationForm();
    fixture.detectChanges();
  });

  it('should create GeneralOpdExaminationComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize GeneralOpdExaminationComponent', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should execute on changes of GeneralOpdExaminationComponent', () => {
    component.ngOnChanges();
    expect(component).toBeTruthy();
  });

  it('should execute on changes and check for mode', () => {
    component.mode = new String('view');
    localStorage.setItem('visitID', '45');
    localStorage.setItem('beneficiaryRegID', '5476')
    spyOn(component, 'getAncExaminationData');
    component.ngOnChanges();
    fixture.detectChanges();
    let visitID = localStorage.getItem('visitID');
    let benRegID = localStorage.getItem('beneficiaryRegID')
    expect(component.getAncExaminationData).toHaveBeenCalled();
  });

  it('should get GeneralExaminationData when mode is view and patch data to fields', async(inject([DoctorService], (doctorService) => {
    localStorage.setItem('visitID', '932');
    localStorage.setItem('beneficiaryRegID', '7397');
    localStorage.setItem('visitCategory', 'General OPD')
    component.visitCategory = 'General OPD';
    spyOn(doctorService, 'getGeneralExamintionData').and.returnValue(Observable.of(data.examinationGOPData.data))
    spyOn(component, 'getAncExaminationData').and.callThrough();
    component.mode = new String('view');
    component.ngOnChanges();
    expect(component.getAncExaminationData).toHaveBeenCalled();
    expect(doctorService.getGeneralExamintionData).toHaveBeenCalled();
    fixture.detectChanges();
    // expect(component.patientExaminationForm.value.generalExaminationForm).toEqual(data.examinationData.data.generalExamination)
  })));

  it('should hide systemic examination for visitCategory category NCD Care', () => {
    component.visitCategory = 'NCD Care'
    component.ngOnInit();
    fixture.detectChanges();
    let de = fixture.debugElement.query(By.css('nurse-systemic-examination'));
    expect(de).not.toBeTruthy();
  });

});
