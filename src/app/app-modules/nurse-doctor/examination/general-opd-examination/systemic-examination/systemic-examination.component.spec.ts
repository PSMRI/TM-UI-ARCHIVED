import { async, ComponentFixture, tick, inject, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../../../core/material.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { SystemicExaminationComponent } from './systemic-examination.component';

import { GeneralUtils } from '../../../shared/utility';

import * as data from '../../../shared/mocks/mock-data';
import { Observable } from 'rxjs/Observable';

import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('SystemicExaminationComponent', () => {
  let component: SystemicExaminationComponent;
  let fixture: ComponentFixture<SystemicExaminationComponent>;
  let fb;
  let debugElement: DebugElement;
  let el: HTMLElement;
  let spy: any

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SystemicExaminationComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule, FormsModule, MaterialModule, NoopAnimationsModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemicExaminationComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fb = debugElement.injector.get(FormBuilder);
    component.systemicExaminationForm = new GeneralUtils(fb).createSystemicExaminationForm();
    fixture.detectChanges();
  });

  it('should create SystemicExaminationComponent', () => {
    expect(component).toBeTruthy();
  });

  it('Should initialize the component', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  })

  it('should execute on changes of SystemicExaminationComponent', () => {
    component.ngOnChanges();
    expect(component).toBeTruthy();
  });

  it('Should check visit category while initializing', () => {
    component.visitCategory = 'ANC'
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.displayANC).toEqual(true);
  });

  it('Should check visit category while initializing and enable obtestric examination', () => {
    component.visitCategory = 'ANC'
    component.ngOnInit();
    fixture.detectChanges();
    let de = fixture.debugElement.query(By.css('nurse-anc-obstetric-examination'));
    expect(component.displayANC).toEqual(true);
    expect(de.nativeElement).toBeTruthy();
  });

  it('Should check visit category while initializing and disable obtestric examination', () => {
    component.visitCategory = 'General OPD'
    component.ngOnInit();
    fixture.detectChanges();
    let de = fixture.debugElement.query(By.css('nurse-anc-obstetric-examination'));
    expect(component.displayANC).toEqual(false);
    expect(component.displayGeneral).toEqual(true);
    expect(de).not.toBeTruthy();
  });

  it('Should check visit category while on changes and enable obtestric examination', () => {
    component.visitCategory = 'ANC'
    component.ngOnChanges();
    fixture.detectChanges();
    let de = fixture.debugElement.query(By.css('nurse-anc-obstetric-examination'));
    expect(component.displayANC).toEqual(true);
    expect(de.nativeElement).toBeTruthy();
  });

  it('Should check visit category while on changes and disable obtestric examination', () => {
    component.visitCategory = 'General OPD'
    component.ngOnChanges();
    fixture.detectChanges();
    let de = fixture.debugElement.query(By.css('nurse-anc-obstetric-examination'));
    expect(component.displayANC).toEqual(false);
    expect(component.displayGeneral).toEqual(true);
    expect(de).not.toBeTruthy();
  });

  it('Should check visit category while on changes and enable Gastro intestinal examination', () => {
    component.visitCategory = 'General OPD'
    component.ngOnChanges();
    fixture.detectChanges();
    let de = fixture.debugElement.query(By.css('nurse-gastro-intestinal-system'));
    expect(component.displayANC).toEqual(false);
    expect(component.displayGeneral).toEqual(true);
    expect(de.nativeElement).toBeTruthy();
  });

  it('Should check visit category while on changes and disable Gastro intestinal examination', () => {
    component.visitCategory = 'ANC'
    component.ngOnChanges();
    fixture.detectChanges();
    let de = fixture.debugElement.query(By.css('nurse-gastro-intestinal-system'));
    expect(component.displayANC).toEqual(true);
    expect(component.displayGeneral).toEqual(false);
    expect(de).not.toBeTruthy();
  });

});
