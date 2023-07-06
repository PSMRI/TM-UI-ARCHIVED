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

import { GynecologicalExaminationComponent } from './gynecological-examination.component';

describe('GynecologicalExaminationComponent', () => {
  let component: GynecologicalExaminationComponent;
  let fixture: ComponentFixture<GynecologicalExaminationComponent>;
  let debugElement: any;
  let fb: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ReactiveFormsModule, MaterialModule],
      declarations: [GynecologicalExaminationComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CameraService, useClass: CameraServiceStub },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GynecologicalExaminationComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    fb = debugElement.injector.get(FormBuilder);
    component.gynecologicalExaminationForm = new CancerUtils(fb).createGynecologicalExaminationForm();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show RTI/STI suffered (if reports available)', () => {
    debugElement = fixture.debugElement.query(By.css('#rTIOrSTIDetail'));
    expect(debugElement).toBeFalsy();
  });

  it('should not show select file', () => {
    debugElement = fixture.debugElement.query(By.css('#files'));
    expect(debugElement).toBeFalsy();
  });

  it('should show RTI/STI suffered (if reports available) when suffered from any RTI/STI is true', () => {
    component.gynecologicalExaminationForm.patchValue({ sufferedFromRTIOrSTI: true });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#rTIOrSTIDetail'));
    expect(debugElement).toBeTruthy();
  });

  it('should show select file when suffered from any RTI/STI is true', () => {
    component.gynecologicalExaminationForm.patchValue({ sufferedFromRTIOrSTI: true });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#files'));
    expect(debugElement).toBeTruthy();
  });

  it('should call annotateImage when image is clicked', () => {
    spyOn(component, 'annotateImage');
    debugElement = fixture.debugElement.query(By.css('#annotateGynecologicalImg'));
    debugElement.triggerEventHandler('click', null);
    expect(component.annotateImage).toHaveBeenCalled();
  });
});
