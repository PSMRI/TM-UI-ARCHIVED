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

import { MasterdataService } from '../../../../shared/services';

import { MasterdataServiceStub } from '../../../../shared/mocks/masterdata-service-stub';
import { MusculoskeletalSystemComponent } from './musculoskeletal-system.component';

describe('MusculoskeletalSystemComponent', () => {
  let component: MusculoskeletalSystemComponent;
  let fixture: ComponentFixture<MusculoskeletalSystemComponent>;
  let fb;
  let debugElement: DebugElement;
  let el: HTMLElement;
  let spy: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MusculoskeletalSystemComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule, FormsModule, MaterialModule, NoopAnimationsModule],
      providers: [
        { provide: MasterdataService, useClass: MasterdataServiceStub },]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MusculoskeletalSystemComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fb = debugElement.injector.get(FormBuilder);
    component.musculoSkeletalSystemForm = new GeneralUtils(fb).createMusculoSkeletalSystemForm();
    fixture.detectChanges();
  });

  it('should create MusculoskeletalSystemComponent', () => {
    expect(component).toBeTruthy();
  });

  it('Should initialize the component', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('Should call getMasterData ', async () => {
    spyOn(component, 'getMasterData');
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.getMasterData).toHaveBeenCalled();
  });

  it('Should call getMasterData and get master Data ', async(inject([MasterdataService], (masterdataService) => {
    spyOn(component, 'getMasterData').and.callThrough();
    spyOn(masterdataService, 'getNurseMasterData').and.returnValue(Observable.of(data.generalOPDNurseMasterdata.data)).and.callThrough();;
    masterdataService.nurseMasterDataSource.next(data.generalOPDNurseMasterdata.data);
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.getMasterData).toHaveBeenCalled();
    fixture.detectChanges();
    expect(component.selectTypeOfJoint).toEqual(data.generalOPDNurseMasterdata.data.jointTypes);
  })));

});
