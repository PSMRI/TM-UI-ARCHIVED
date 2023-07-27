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
