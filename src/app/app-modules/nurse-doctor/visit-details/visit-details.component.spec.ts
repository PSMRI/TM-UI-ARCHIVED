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


import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MaterialModule } from '../../core/material.module';

import { VisitDetailUtils } from '../shared/utility';

import { ConfirmationService } from '../../core/services/confirmation.service';
import { DoctorService } from '../shared/services';
import { DoctorServiceStub } from '../shared/mocks/doctor-service-stub';

import { VisitDetailsComponent } from './visit-details.component';

describe('VisitDetailsComponent', () => {
  let component: VisitDetailsComponent;
  let fixture: ComponentFixture<VisitDetailsComponent>;
  let debugElement;
  let fb;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, ReactiveFormsModule, MaterialModule],
      declarations: [VisitDetailsComponent],
      providers: [
        ConfirmationService,
        { provide: DoctorService, useClass: DoctorServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitDetailsComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
   
    fb = debugElement.injector.get(FormBuilder);
    component.patientVisitForm = new VisitDetailUtils(fb).createPatientVisitForm();
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show Visit Details', () => {
    fixture.detectChanges();
    let de = fixture.debugElement.query(By.css('patient-visit-details'));
    expect(de.nativeElement).toBeTruthy();
  });

  it('should not show Chief Complaints', () => {
    fixture.detectChanges();
    let de = fixture.debugElement.query(By.css('patient-chief-complaints'));
    expect(de).not.toBeTruthy();
  });

  it('should show Chief Complaints after selected visit category is General OPD', () => {
    component.patientVisitForm.controls['patientVisitDetailsForm'].patchValue({visitCategory: 'General OPD'});
    fixture.detectChanges();
    let de = fixture.debugElement.query(By.css('patient-chief-complaints'));
    expect(de.nativeElement).toBeTruthy();
  });

  it('should call conditionCheck when  visit category is selected', () => {
    spyOn(component, 'conditionCheck');
    component.patientVisitForm.controls['patientVisitDetailsForm'].patchValue({visitCategory: 'General OPD'});
    expect(component.conditionCheck).toHaveBeenCalled();
  });

  it('should call getVisitCategory On Initialisation', () => {
    spyOn(component, 'getVisitCategory');
    component.ngOnInit();
    expect(component.getVisitCategory).toHaveBeenCalled();
  });

});
