import { async, ComponentFixture, tick, inject, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../../../core/material.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { GeneralExaminationComponent } from './general-examination.component';

import { GeneralUtils } from '../../../shared/utility';

import { ConfirmationService } from '../../../../core/services/confirmation.service';
import { DoctorService } from '../../../shared/services';

import { DoctorServiceStub } from '../../../shared/mocks/doctor-service-stub';

import * as data from '../../../shared/mocks/mock-data';
import { Observable } from 'rxjs/Observable';

import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('GeneralExaminationComponent', () => {
  let component: GeneralExaminationComponent;
  let fixture: ComponentFixture<GeneralExaminationComponent>;
  let doctorService: DoctorService;
  let confirmationService: ConfirmationService;
  let fb;
  let debugElement: DebugElement;
  let el: HTMLElement;
  let spy: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralExaminationComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule, FormsModule, MaterialModule, NoopAnimationsModule],
      providers: [
        ConfirmationService,
        { provide: DoctorService, useClass: DoctorServiceStub }],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralExaminationComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fb = debugElement.injector.get(FormBuilder);
    component.generalExaminationForm = new GeneralUtils(fb).createGeneralExaminationForm()
    window.console.log = () => { };
    fixture.detectChanges();
  });

  it('should create GeneralExaminationComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize GeneralExaminationComponent', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should check value of danger sign and make null to dependent fields', async(() => {
    spyOn(component, 'checkWithDangerSign').and.callThrough();
    component.generalExaminationForm.patchValue({ dangerSigns: 'Yes' });
    component.generalExaminationForm.patchValue({ typeOfDangerSigns: ['1', '2'] });
    debugElement = fixture.debugElement.query(By.css('#dangerSigns'));
    debugElement.nativeElement.value = "Yes";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.dangerSigns).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkWithDangerSign).toHaveBeenCalled();
    expect(component.typeOfDangerSigns).toEqual(null);
  }))

  it('should check value of lymphadenopathy and make null to dependent fields', async(() => {
    spyOn(component, 'checkWithLymphadenopathy').and.callThrough();
    component.generalExaminationForm.patchValue({ lymphadenopathy: 'Present' });
    component.generalExaminationForm.patchValue({ lymphnodesInvolved: 'Cervical LN' });
    component.generalExaminationForm.patchValue({ typeOfLymphadenopathy: 'Soft' });
    debugElement = fixture.debugElement.query(By.css('#lymphadenopathy'));
    debugElement.nativeElement.value = "Present";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.lymphadenopathy).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkWithLymphadenopathy).toHaveBeenCalled();
    expect(component.lymphnodesInvolved).toEqual(null);
    expect(component.typeOfLymphadenopathy).toEqual(null);
  }))

  it('should check value of edema and make null to dependent fields', async(() => {
    spyOn(component, 'checkWithEdema').and.callThrough();
    component.generalExaminationForm.patchValue({ edema: 'Present' });
    component.generalExaminationForm.patchValue({ extentOfEdema: 'Foot' });
    component.generalExaminationForm.patchValue({ edemaType: 'Pitting' });
    debugElement = fixture.debugElement.query(By.css('#edema'));
    debugElement.nativeElement.value = "Present";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.edema).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkWithEdema).toHaveBeenCalled();
    expect(component.extentOfEdema).toEqual(null);
    expect(component.edemaType).toEqual(null);
  }));

  it('should disable type of danger sign when dangerSigns is No', () => {
    component.generalExaminationForm.patchValue({ dangerSigns: 'No' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#typeOfDangerSigns'));
    expect(debugElement).not.toBeTruthy();
  });

  it('should able type of danger sign when dangerSigns is Yes', () => {
    component.generalExaminationForm.patchValue({ dangerSigns: 'Yes' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#typeOfDangerSigns'));
    expect(debugElement).toBeTruthy();
  });

  it('should disable type of danger sign when dangerSigns is No', () => {
    component.generalExaminationForm.patchValue({ dangerSigns: 'No' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#typeOfDangerSigns'));
    expect(debugElement).not.toBeTruthy();
  });

  it('should able lymphnodesInvolved  when lymphadenopathy is Present ', () => {
    component.generalExaminationForm.patchValue({ lymphadenopathy: 'Present' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#lymphnodesInvolved'));
    expect(debugElement).toBeTruthy();
  });

  it('should disable type of danger sign when dangerSigns is Absent', () => {
    component.generalExaminationForm.patchValue({ lymphadenopathy: 'Absent' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#lymphnodesInvolved'));
    expect(debugElement).not.toBeTruthy();
  });

  it('should able typeOfLymphadenopathy  when lymphadenopathy is Present ', () => {
    component.generalExaminationForm.patchValue({ lymphadenopathy: 'Present' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#typeOfLymphadenopathy'));
    expect(debugElement).toBeTruthy();
  });

  it('should disable typeOfLymphadenopathy  when lymphadenopathy is is Absent', () => {
    component.generalExaminationForm.patchValue({ lymphadenopathy: 'Absent' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#typeOfLymphadenopathy'));
    expect(debugElement).not.toBeTruthy();
  });

  it('should able edemaType  when edema is Present ', () => {
    component.generalExaminationForm.patchValue({ edema: 'Present' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#edemaType'));
    expect(debugElement).toBeTruthy();
  });

  it('should able extentOfEdema  when edema is Present ', () => {
    component.generalExaminationForm.patchValue({ edema: 'Present' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#extentOfEdema'));
    expect(debugElement).toBeTruthy();
  });

  it('should able edemaType  when edema is Absent ', () => {
    component.generalExaminationForm.patchValue({ edema: 'Absent' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#edemaType'));
    expect(debugElement).not.toBeTruthy();
  });

  it('should able extentOfEdema  when edema is Absent ', () => {
    component.generalExaminationForm.patchValue({ edema: 'Absent' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#extentOfEdema'));
    expect(debugElement).not.toBeTruthy();
  });

});
