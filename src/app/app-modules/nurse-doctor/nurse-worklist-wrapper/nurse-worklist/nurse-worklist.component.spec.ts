import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

import { Md2Module } from 'md2';
import { MaterialModule } from '../../../app-modules/core/material.module';
import { NurseWorklistComponent } from './nurse-worklist.component';

import { CameraService, BeneficiaryDetailsService, ConfirmationService } from '../../../app-modules/core/services';
import { MasterdataService, NurseService } from '../shared/services';

import { nurseWorklist } from '../shared/mocks/mock-data';
import { RouterStub } from '../shared/mocks/router-stub';
import { NurseServiceStub } from '../shared/mocks/nurse-service-stub';
import { MasterdataServiceStub } from '../shared/mocks/masterdata-service-stub';
import { BeneficiaryDetailsServiceStub } from '../../../app-modules/core/mocks/beneficiary-details-service-stub';

import { Observable } from 'rxjs/Rx';

describe('NurseWorklistComponent', () => {
  let component: NurseWorklistComponent;
  let fixture: ComponentFixture<NurseWorklistComponent>;
  let debugElement: DebugElement;
  let nurseService: NurseService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ BrowserAnimationsModule, Md2Module, MaterialModule ],
      declarations: [ NurseWorklistComponent ],
      providers: [
        {
          provide: Router, useClass: RouterStub
        },
        {
          provide: NurseService, useClass: NurseServiceStub
        },
        {
          provide: BeneficiaryDetailsService, useClass: BeneficiaryDetailsServiceStub
        },
        CameraService, ConfirmationService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NurseWorklistComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    nurseService = debugElement.injector.get(NurseService);

    spyOn(nurseService, 'getNurseWorklist')
      .and
      .returnValue(Observable.of(nurseWorklist));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
