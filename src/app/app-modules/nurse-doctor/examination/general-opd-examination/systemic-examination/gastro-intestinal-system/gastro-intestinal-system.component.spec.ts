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
