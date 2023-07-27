/* 
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/


import { async, inject, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MaterialModule } from '../../../core/material.module';

import { CancerUtils } from '../../shared/utility';

import { ConfirmationService } from '../../../core/services/confirmation.service';
import { DoctorService } from '../../shared/services';
import { BeneficiaryDetailsService } from '../../../core/services/beneficiary-details.service';

import { DoctorServiceStub } from '../../shared/mocks/doctor-service-stub';
import { BeneficiaryDetailsServiceStub } from '../../../core/mocks/beneficiary-details-service-stub';
import { ConfirmationServiceStub } from '../../../core/mocks/confirmation-service-stub';

import * as data from '../../shared/mocks/mock-data';
import { Observable } from 'rxjs/Rx';

import { CancerExaminationComponent } from './cancer-examination.component';

describe('CancerExaminationComponent', () => {
  let component: CancerExaminationComponent;
  let fixture: ComponentFixture<CancerExaminationComponent>;
  let debugElement: any;
  let fb: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ReactiveFormsModule, MaterialModule],
      declarations: [CancerExaminationComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DoctorService, useClass: DoctorServiceStub },
        { provide: ConfirmationService, useClass: ConfirmationServiceStub },
        { provide: BeneficiaryDetailsService, useClass: BeneficiaryDetailsServiceStub },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancerExaminationComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    fb = debugElement.injector.get(FormBuilder);
    component.cancerForm = new CancerUtils(fb).createCancerExaminationForm();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getBenificiaryDetails on Initialisation', () => {
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    expect(component.getBeneficiaryDetails).toHaveBeenCalled();
  });

  it('should show breast examination tab for female beneficiary', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#breastExamination'));
    expect(component.female).toBe(true);
    expect(debugElement).toBeTruthy();
  })));

  it('should not show breast examination tab for male beneficiary by deafult', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.maleBeneficiary);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#breastExamination'));
    expect(component.female).toBe(false);
    expect(debugElement).not.toBeTruthy();
  })));

  it('should show breast examination tab for male beneficiary if selected breast enlargement', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.maleBeneficiary);
    component.cancerForm.controls['signsForm'].patchValue({breastEnlargement: true});
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#breastExamination'));
    expect(component.female).toBe(false);
    expect(debugElement).toBeTruthy();
  })));
  
  it('should get Cancer Examination Details when mode is view', () => {
    spyOn(component, 'fetchCancerExaminationDetails');
    component.mode = new String('view');
    component.ngOnChanges();
    expect(component.fetchCancerExaminationDetails).toHaveBeenCalled();
  });

  it('should get Cancer Examination Details when mode is view', async(inject([DoctorService], (doctorService) => {
    spyOn(component, 'fetchCancerExaminationDetails').and.callThrough();
    spyOn(doctorService, 'getCancerExaminationDetails').and.returnValue(Observable.of(data.cancerExaminationDetails));

    component.mode = new String('view');
    component.ngOnChanges();

    expect(component.fetchCancerExaminationDetails).toHaveBeenCalled();
    expect(doctorService.getCancerExaminationDetails).toHaveBeenCalled();
  })));

  it('should patch examionationDetails to form when mode is view', async(inject([DoctorService], (doctorService) => {
    spyOn(component, 'fetchCancerExaminationDetails').and.callThrough();
    spyOn(doctorService, 'getCancerExaminationDetails').and.returnValue(Observable.of(data.cancerExaminationDetails));

    component.mode = new String('view');
    component.ngOnChanges();

    expect(component.fetchCancerExaminationDetails).toHaveBeenCalled();
    expect(doctorService.getCancerExaminationDetails).toHaveBeenCalled();
    expect((<FormGroup>component.cancerForm.controls.breastExaminationForm).controls['everBreastFed'].value).toEqual(data.cancerExaminationDetails.data.breastExamination.everBreastFed);
  })));

  it('should upadte Cancer Examination Details when mode is update', () => {
    spyOn(component, 'upadteCancerExaminationDetails');
    component.mode = new String('update');
    component.ngOnChanges();
    expect(component.upadteCancerExaminationDetails).toHaveBeenCalled();
  });

  it('should get upadte Cancer Examination Details when mode is update', async(inject([DoctorService], (doctorService) => {
    spyOn(component, 'upadteCancerExaminationDetails').and.callThrough();
    spyOn(doctorService, 'updateCancerExaminationDetails').and.returnValue(Observable.of(data.updateCancerExaminationSuccessResponse));
    
    component.mode = new String('update');
    component.ngOnChanges();
    expect(component.upadteCancerExaminationDetails).toHaveBeenCalled();
  })));
});
