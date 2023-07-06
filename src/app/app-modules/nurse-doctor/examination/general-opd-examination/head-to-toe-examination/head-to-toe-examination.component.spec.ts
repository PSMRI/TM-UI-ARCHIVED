import { async, ComponentFixture, tick, inject, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../../../core/material.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { HeadToToeExaminationComponent } from './head-to-toe-examination.component';
import { GeneralUtils } from '../../../shared/utility';

import { ConfirmationService } from '../../../../core/services/confirmation.service';
import { DoctorService } from '../../../shared/services';

import { DoctorServiceStub } from '../../../shared/mocks/doctor-service-stub';

import * as data from '../../../shared/mocks/mock-data';
import { Observable } from 'rxjs/Observable';

import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('HeadToToeExaminationComponent', () => {
  let component: HeadToToeExaminationComponent;
  let fixture: ComponentFixture<HeadToToeExaminationComponent>;
  let doctorService: DoctorService;
  let confirmationService: ConfirmationService;
  let fb;
  let debugElement: DebugElement;
  let el: HTMLElement;
  let spy: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeadToToeExaminationComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule, FormsModule, MaterialModule, NoopAnimationsModule],
      providers: [
        ConfirmationService,
        { provide: DoctorService, useClass: DoctorServiceStub }],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadToToeExaminationComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fb = debugElement.injector.get(FormBuilder);
    component.headToToeExaminationForm = new GeneralUtils(fb).createHeadToToeExaminationForm();
    fixture.detectChanges();
  });

  it('should create HeadToToeExaminationComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize HeadToToeExaminationComponent', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should check head to toe examination and make dependentfield null', async(() => {
    spyOn(component, 'checkWithHeadToToe').and.callThrough();
    component.headToToeExaminationForm.patchValue({ headtoToeExam: 'Abnormal' });
    component.headToToeExaminationForm.patchValue({ head: "Head" });
    component.headToToeExaminationForm.patchValue({ eyes: "Eyes" });
    component.headToToeExaminationForm.patchValue({ ears: "Ears" });
    component.headToToeExaminationForm.patchValue({ nose: "Nose" });
    component.headToToeExaminationForm.patchValue({ oralCavity: "Oral Cavity" });
    component.headToToeExaminationForm.patchValue({ throat: "Throat" });
    component.headToToeExaminationForm.patchValue({ breastAndNipples: "Breast" });
    component.headToToeExaminationForm.patchValue({ trunk: "Trunk" });
    component.headToToeExaminationForm.patchValue({ upperLimbs: "Upper Limbs" });
    component.headToToeExaminationForm.patchValue({ lowerLimbs: "Lower Limbs" });
    component.headToToeExaminationForm.patchValue({ skin: "Skin" });
    component.headToToeExaminationForm.patchValue({ hair: "Hairs" });
    component.headToToeExaminationForm.patchValue({ nails: "Nails" });
    debugElement = fixture.debugElement.query(By.css('#headtoToeExam'));
    debugElement.nativeElement.value = "Abnormal";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.headtoToeExam).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkWithHeadToToe).toHaveBeenCalled();
    expect(component.head).toEqual(null);
    expect(component.eyes).toEqual(null);
    expect(component.ears).toEqual(null);
    expect(component.nose).toEqual(null);
    expect(component.oralCavity).toEqual(null);
    expect(component.throat).toEqual(null);
    expect(component.breastAndNipples).toEqual(null);
    expect(component.trunk).toEqual(null);
    expect(component.upperLimbs).toEqual(null);
    expect(component.lowerLimbs).toEqual(null);
    expect(component.skin).toEqual(null);
    expect(component.hair).toEqual(null);
    expect(component.nails).toEqual(null);
  }));

  it('should enable head  when headtoToeExam is Abnormal ', () => {
    component.headToToeExaminationForm.patchValue({ headtoToeExam: 'Abnormal' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#head'));
    expect(debugElement).toBeTruthy();
  });

  it('should enable eyes  when headtoToeExam is Abnormal ', () => {
    component.headToToeExaminationForm.patchValue({ headtoToeExam: 'Abnormal' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#eyes'));
    expect(debugElement).toBeTruthy();
  });

  it('should enable ears  when headtoToeExam is Abnormal ', () => {
    component.headToToeExaminationForm.patchValue({ headtoToeExam: 'Abnormal' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#ears'));
    expect(debugElement).toBeTruthy();
  });

  it('should enable nose  when headtoToeExam is Abnormal ', () => {
    component.headToToeExaminationForm.patchValue({ headtoToeExam: 'Abnormal' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#nose'));
    expect(debugElement).toBeTruthy();
  });

  it('should enable oralCavity  when headtoToeExam is Abnormal ', () => {
    component.headToToeExaminationForm.patchValue({ headtoToeExam: 'Abnormal' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#oralCavity'));
    expect(debugElement).toBeTruthy();
  });

  it('should enable throat  when headtoToeExam is Abnormal ', () => {
    component.headToToeExaminationForm.patchValue({ headtoToeExam: 'Abnormal' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#throat'));
    expect(debugElement).toBeTruthy();
  });

  it('should enable breastAndNipples  when headtoToeExam is Abnormal ', () => {
    component.headToToeExaminationForm.patchValue({ headtoToeExam: 'Abnormal' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#breastAndNipples'));
    expect(debugElement).toBeTruthy();
  });

  it('should enable trunk  when headtoToeExam is Abnormal ', () => {
    component.headToToeExaminationForm.patchValue({ headtoToeExam: 'Abnormal' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#trunk'));
    expect(debugElement).toBeTruthy();
  });

  it('should enable upperLimbs  when headtoToeExam is Abnormal ', () => {
    component.headToToeExaminationForm.patchValue({ headtoToeExam: 'Abnormal' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#upperLimbs'));
    expect(debugElement).toBeTruthy();
  });

  it('should enable lowerLimbs  when headtoToeExam is Abnormal ', () => {
    component.headToToeExaminationForm.patchValue({ headtoToeExam: 'Abnormal' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#lowerLimbs'));
    expect(debugElement).toBeTruthy();
  });

  it('should enable skin  when headtoToeExam is Abnormal ', () => {
    component.headToToeExaminationForm.patchValue({ headtoToeExam: 'Abnormal' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#skin'));
    expect(debugElement).toBeTruthy();
  });
  it('should enable hair  when headtoToeExam is Abnormal ', () => {
    component.headToToeExaminationForm.patchValue({ headtoToeExam: 'Abnormal' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#hair'));
    expect(debugElement).toBeTruthy();
  });
  it('should enable nails  when headtoToeExam is Abnormal ', () => {
    component.headToToeExaminationForm.patchValue({ headtoToeExam: 'Abnormal' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#nails'));
    expect(debugElement).toBeTruthy();
  });

  it('should disable head  when headtoToeExam is Normal ', () => {
    component.headToToeExaminationForm.patchValue({ headtoToeExam: 'Normal' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#head'));
    expect(debugElement).not.toBeTruthy();
  });

  it('should disable eyes  when headtoToeExam is Normal ', () => {
    component.headToToeExaminationForm.patchValue({ headtoToeExam: 'Normal' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#eyes'));
    expect(debugElement).not.toBeTruthy();
  });

  it('should disable ears  when headtoToeExam is Normal ', () => {
    component.headToToeExaminationForm.patchValue({ headtoToeExam: 'Normal' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#ears'));
    expect(debugElement).not.toBeTruthy();
  });

  it('should disable nose  when headtoToeExam is Normal ', () => {
    component.headToToeExaminationForm.patchValue({ headtoToeExam: 'Normal' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#nose'));
    expect(debugElement).not.toBeTruthy();
  });

  it('should disable oralCavity  when headtoToeExam is Normal ', () => {
    component.headToToeExaminationForm.patchValue({ headtoToeExam: 'Normal' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#oralCavity'));
    expect(debugElement).not.toBeTruthy();
  });

  it('should disable throat  when headtoToeExam is Normal ', () => {
    component.headToToeExaminationForm.patchValue({ headtoToeExam: 'Normal' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#throat'));
    expect(debugElement).not.toBeTruthy();
  });

  it('should disable breastAndNipples  when headtoToeExam is Normal ', () => {
    component.headToToeExaminationForm.patchValue({ headtoToeExam: 'Normal' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#breastAndNipples'));
    expect(debugElement).not.toBeTruthy();
  });

  it('should disable trunk  when headtoToeExam is Normal ', () => {
    component.headToToeExaminationForm.patchValue({ headtoToeExam: 'Normal' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#trunk'));
    expect(debugElement).not.toBeTruthy();
  });

  it('should disable upperLimbs  when headtoToeExam is Normal ', () => {
    component.headToToeExaminationForm.patchValue({ headtoToeExam: 'Normal' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#upperLimbs'));
    expect(debugElement).not.toBeTruthy();
  });

  it('should disable lowerLimbs  when headtoToeExam is Normal ', () => {
    component.headToToeExaminationForm.patchValue({ headtoToeExam: 'Normal' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#lowerLimbs'));
    expect(debugElement).not.toBeTruthy();
  });

  it('should disable skin  when headtoToeExam is Normal ', () => {
    component.headToToeExaminationForm.patchValue({ headtoToeExam: 'Normal' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#skin'));
    expect(debugElement).not.toBeTruthy();
  });
  it('should disable hair  when headtoToeExam is Normal ', () => {
    component.headToToeExaminationForm.patchValue({ headtoToeExam: 'Normal' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#hair'));
    expect(debugElement).not.toBeTruthy();
  });
  it('should disable nails  when headtoToeExam is Normal ', () => {
    component.headToToeExaminationForm.patchValue({ headtoToeExam: 'Normal' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#nails'));
    expect(debugElement).not.toBeTruthy();
  });


});
