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

import { GastroIntestinalSystemComponent } from './gastro-intestinal-system.component';

describe('GastroIntestinalSystemComponent', () => {
  let component: GastroIntestinalSystemComponent;
  let fixture: ComponentFixture<GastroIntestinalSystemComponent>;
  let fb;
  let debugElement: DebugElement;
  let el: HTMLElement;
  let spy: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GastroIntestinalSystemComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule, FormsModule, MaterialModule, NoopAnimationsModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GastroIntestinalSystemComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fb = debugElement.injector.get(FormBuilder);
    component.gastroIntestinalSystemForm = new GeneralUtils(fb).createGastroIntestinalSystemForm();
    fixture.detectChanges();
  });

  it('should create GastroIntestinalSystemComponent', () => {
    expect(component).toBeTruthy();
  });

  it('Should initialize the component', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should enable Location of tenderness when Tenderness is present ', () => {
    component.gastroIntestinalSystemForm.patchValue({ palpation_Tenderness: 'Present' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#palpation_LocationOfTenderness'));
    expect(debugElement).toBeTruthy();
  });

  it('should disable Location of tenderness when Tenderness is Absent ', () => {
    component.gastroIntestinalSystemForm.patchValue({ palpation_Tenderness: 'Absent' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#palpation_LocationOfTenderness'));
    expect(debugElement).not.toBeTruthy();
  });

  it('should check Tenderness and make dependentfield null', async(() => {
    spyOn(component, 'checkWithTenderness').and.callThrough();
    component.gastroIntestinalSystemForm.patchValue({ palpation_Tenderness: 'Present' })
    component.gastroIntestinalSystemForm.patchValue({ palpation_LocationOfTenderness: "jhfgfhjhjhg" })
    debugElement = fixture.debugElement.query(By.css('#palpation_Tenderness'));
    debugElement.nativeElement.value = "Present";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.palpation_Tenderness).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkWithTenderness).toHaveBeenCalled();
    expect(component.palpation_LocationOfTenderness).toEqual(null);
  }));

});
