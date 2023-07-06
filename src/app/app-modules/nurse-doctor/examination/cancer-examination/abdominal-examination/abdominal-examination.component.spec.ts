import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { MaterialModule } from '../../../../core/material.module';

import { CameraService } from '../../../../core/services/camera.service';
import { CameraServiceStub } from '../../../../core/mocks/camera-service-stub';
import { CancerUtils } from '../../../shared/utility';

import * as data from '../../../shared/mocks/mock-data';
import { Observable } from 'rxjs/Rx';

import { AbdominalExaminationComponent } from './abdominal-examination.component';

describe('AbdominalExaminationComponent', () => {
  let component: AbdominalExaminationComponent;
  let fixture: ComponentFixture<AbdominalExaminationComponent>;
  let debugElement: any;
  let fb: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ReactiveFormsModule, MaterialModule],
      declarations: [AbdominalExaminationComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CameraService, useClass: CameraServiceStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbdominalExaminationComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    fb = debugElement.injector.get(FormBuilder);
    component.abdominalExaminationForm = new CancerUtils(fb).createAbdominalExaminationForm();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show lymph nodes', () => {
    debugElement = fixture.debugElement.query(By.css('#lymphNodesTable'));
    expect(debugElement).toBeFalsy();
  });

  it('should show lymph nodes when lymph nodes is enlarged', () => {
    component.abdominalExaminationForm.patchValue({lymphNodes_Enlarged: true});
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#lymphNodesTable'));
    expect(debugElement).toBeTruthy;
  });

  it('should call annotateImage when image is clicked', () => {
    spyOn(component, 'annotateImage');
    debugElement = fixture.debugElement.query(By.css('#annotateAbdominalImg'));
    debugElement.triggerEventHandler('click', null);
    expect(component.annotateImage).toHaveBeenCalled();
  });

});
