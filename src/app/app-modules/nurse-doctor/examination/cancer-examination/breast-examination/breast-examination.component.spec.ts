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
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { MaterialModule } from '../../../../core/material.module';

import { CameraService } from '../../../../core/services/camera.service';
import { BeneficiaryDetailsService } from '../../../../core/services/beneficiary-details.service';

import { CameraServiceStub } from '../../../../core/mocks/camera-service-stub';
import { BeneficiaryDetailsServiceStub } from '../../../../core/mocks/beneficiary-details-service-stub';

import { CancerUtils } from '../../../shared/utility';

import * as data from '../../../shared/mocks/mock-data';
import { Observable } from 'rxjs/Rx';

import { BreastExaminationComponent } from './breast-examination.component';

describe('BreastExaminationComponent', () => {
  let component: BreastExaminationComponent;
  let fixture: ComponentFixture<BreastExaminationComponent>;
  let debugElement: any;
  let fb: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ReactiveFormsModule, MaterialModule],
      declarations: [BreastExaminationComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CameraService, useClass: CameraServiceStub },
        { provide: BeneficiaryDetailsService, useClass: BeneficiaryDetailsServiceStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreastExaminationComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    fb = debugElement.injector.get(FormBuilder);
    component.breastExaminationForm = new CancerUtils(fb).createBreastExaminationForm();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show duration of breast feeding symptom', () => {
    debugElement = fixture.debugElement.query(By.css('#breastFeedingDurationGTE6months'));
    expect(debugElement).toBeFalsy();
  });

  it('should not show duration of breast feeding symptom when ever breast fed a child is true', () => {
    component.everBreastFed.patchValue({ everBreastFed: true });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#breastFeedingDurationGTE6months'));
    expect(debugElement).toBeTruthy();
  });

  it('should not show lump size symptom', () => {
    debugElement = fixture.debugElement.query(By.css('#lumpSize'));
    expect(debugElement).toBeFalsy();
  });

  it('should not show lump shape symptom', () => {
    debugElement = fixture.debugElement.query(By.css('#lumpShape'));
    expect(debugElement).toBeFalsy();
  });

  it('should not show lump texture symptom', () => {
    debugElement = fixture.debugElement.query(By.css('#lumpTexture'));
    expect(debugElement).toBeFalsy();
  });

  it('should show lump size symptom when any lump in breast is true', () => {
    component.breastExaminationForm.patchValue({lumpInBreast: true});
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#lumpSize'));
    expect(debugElement).toBeTruthy();
  });

  it('should show lump shape symptom when any lump in breast is true', () => {
    component.breastExaminationForm.patchValue({lumpInBreast: true});
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#lumpShape'));
    expect(debugElement).toBeTruthy();
  });

  it('should show lump texture symptom when any lump in breast is true', () => {
    component.breastExaminationForm.patchValue({lumpInBreast: true});
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#lumpTexture'));
    expect(debugElement).toBeTruthy();
  });

  it('should call annotateImage when image is clicked', () => {
    spyOn(component, 'annotateImage');
    debugElement = fixture.debugElement.query(By.css('#annotateBreastImg'));
    debugElement.triggerEventHandler('click', null);
    expect(component.annotateImage).toHaveBeenCalled();
  });
});
