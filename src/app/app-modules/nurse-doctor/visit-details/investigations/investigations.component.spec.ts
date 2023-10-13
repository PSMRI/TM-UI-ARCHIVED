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
import { MaterialModule } from '../../../core/material.module';

import { VisitDetailUtils } from '../../shared/utility';

import { ConfirmationService } from '../../../core/services/confirmation.service';
import { DoctorService, MasterdataService } from '../../shared/services';

import { MasterdataServiceStub } from '../../shared/mocks/masterdata-service-stub';
import { DoctorServiceStub } from '../../shared/mocks/doctor-service-stub';

import * as data from '../../shared/mocks/mock-data';
import { Observable } from 'rxjs/Rx';

import { InvestigationsComponent } from './investigations.component';

describe('InvestigationsComponent', () => {
  let component: InvestigationsComponent;
  let fixture: ComponentFixture<InvestigationsComponent>;
  let debugElement: DebugElement;
  let fb: FormBuilder;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ReactiveFormsModule, MaterialModule],
      declarations: [InvestigationsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        ConfirmationService,
        { provide: MasterdataService, useClass: MasterdataServiceStub },
        { provide: DoctorService, useClass: DoctorServiceStub },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigationsComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    fb = debugElement.injector.get(FormBuilder);
    component.patientInvestigationsForm = new VisitDetailUtils(fb).createPatientInvestigationsForm();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getNurseMasterData on Initialisation', inject([MasterdataService], (masterdataService) => {
    masterdataService.nurseMasterDataSource.next(data.generalOPDNurseMasterdata.data);
    spyOn(component, 'getNurseMasterData');
    component.ngOnInit();
    expect(component.getNurseMasterData).toHaveBeenCalled();
    expect(component.selectLabTest).toEqual(data.generalOPDNurseMasterdata.data.labTests.filter(item => {
      return item.isRadiologyImaging != true;
    }));
  }));

});
