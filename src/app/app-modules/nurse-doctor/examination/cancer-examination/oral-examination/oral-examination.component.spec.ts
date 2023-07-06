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

import { OralExaminationComponent } from './oral-examination.component';

describe('OralExaminationComponent', () => {
  let component: OralExaminationComponent;
  let fixture: ComponentFixture<OralExaminationComponent>;
  let debugElement: any;
  let fb: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ReactiveFormsModule, MaterialModule],
      declarations: [OralExaminationComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CameraService, useClass: CameraServiceStub },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OralExaminationComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    fb = debugElement.injector.get(FormBuilder);
    component.oralExaminationForm = new CancerUtils(fb).createOralExaminationForm();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show type of premalignant lesion', () => {
    debugElement = fixture.debugElement.query(By.css('#preMalignantLesionTypeList'));
    expect(debugElement).toBeFalsy();
  });

  it('should not show other lesion', () => {
    debugElement = fixture.debugElement.query(By.css('#otherLesionType'));
    expect(debugElement).toBeFalsy();
  });

  it('should show other lesion when preMalignantLesionTypeList contians Any other lesion', () => {
    component.oralExaminationForm.patchValue({ premalignantLesions: true });
    component.oralExaminationForm.patchValue({ preMalignantLesionTypeList: ['Any other lesion'] });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#otherLesionType'));
    expect(debugElement).toBeTruthy();
  });

  it('should show type of premalignant lesion when premalignant lesions is true', () => {
    component.oralExaminationForm.patchValue({ premalignantLesions: true });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#preMalignantLesionTypeList'));
    expect(debugElement).toBeTruthy();
  });

  it('should call annotateImage when image is clicked', () => {
    spyOn(component, 'annotateImage');
    debugElement = fixture.debugElement.query(By.css('#annotateOralImg'));
    debugElement.triggerEventHandler('click', null);
    expect(component.annotateImage).toHaveBeenCalled();
  });

});
