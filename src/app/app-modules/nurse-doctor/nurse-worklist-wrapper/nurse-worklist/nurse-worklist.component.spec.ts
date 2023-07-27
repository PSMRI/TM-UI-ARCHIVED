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
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

import { Md2Module } from 'md2';
import { MaterialModule } from '../../../app-modules/core/material.module';
import { NurseWorklistComponent } from './nurse-worklist.component';

import { CameraService, BeneficiaryDetailsService, ConfirmationService } from '../../../app-modules/core/services';
import { MasterdataService, NurseService } from '../shared/services';

import { nurseWorklist } from '../shared/mocks/mock-data';
import { RouterStub } from '../shared/mocks/router-stub';
import { NurseServiceStub } from '../shared/mocks/nurse-service-stub';
import { MasterdataServiceStub } from '../shared/mocks/masterdata-service-stub';
import { BeneficiaryDetailsServiceStub } from '../../../app-modules/core/mocks/beneficiary-details-service-stub';

import { Observable } from 'rxjs/Rx';

describe('NurseWorklistComponent', () => {
  let component: NurseWorklistComponent;
  let fixture: ComponentFixture<NurseWorklistComponent>;
  let debugElement: DebugElement;
  let nurseService: NurseService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ BrowserAnimationsModule, Md2Module, MaterialModule ],
      declarations: [ NurseWorklistComponent ],
      providers: [
        {
          provide: Router, useClass: RouterStub
        },
        {
          provide: NurseService, useClass: NurseServiceStub
        },
        {
          provide: BeneficiaryDetailsService, useClass: BeneficiaryDetailsServiceStub
        },
        CameraService, ConfirmationService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NurseWorklistComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    nurseService = debugElement.injector.get(NurseService);

    spyOn(nurseService, 'getNurseWorklist')
      .and
      .returnValue(Observable.of(nurseWorklist));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
