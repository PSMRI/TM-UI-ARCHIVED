import { async, inject, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { MaterialModule } from '../../../../core/material.module';

import { GeneralUtils } from '../../../shared/utility';

import { ConfirmationService } from '../../../../core/services/confirmation.service';
import { DoctorService, NurseService, MasterdataService } from '../../../shared/services';
import { BeneficiaryDetailsService } from '../../../../core/services/beneficiary-details.service';

import { MasterdataServiceStub } from '../../../shared/mocks/masterdata-service-stub';
import { DoctorServiceStub } from '../../../shared/mocks/doctor-service-stub';
import { BeneficiaryDetailsServiceStub } from '../../../../core/mocks/beneficiary-details-service-stub';
import { NurseServiceStub } from '../../../shared/mocks/nurse-service-stub';

import * as data from '../../../shared/mocks/mock-data';
import { Observable } from 'rxjs/Rx';

import { ComorbidityConcurrentConditionsComponent } from './comorbidity-concurrent-conditions.component';

describe('ComorbidityConcurrentConditionsComponent', () => {
  let component: ComorbidityConcurrentConditionsComponent;
  let fixture: ComponentFixture<ComorbidityConcurrentConditionsComponent>;
  let debugElement: DebugElement;
  let fb: FormBuilder;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ReactiveFormsModule, MaterialModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ComorbidityConcurrentConditionsComponent],
      providers: [
        ConfirmationService,
        { provide: MasterdataService, useClass: MasterdataServiceStub },
        { provide: DoctorService, useClass: DoctorServiceStub },
        { provide: BeneficiaryDetailsService, useClass: BeneficiaryDetailsServiceStub },
        { provide: NurseService, useClass: NurseServiceStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComorbidityConcurrentConditionsComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    fb = debugElement.injector.get(FormBuilder);
    component.comorbidityConcurrentConditionsForm = new GeneralUtils(fb).createComorbidityConcurrentConditionsForm();
    window.console.log = () => { };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getBeneficiaryDetails on Initialisation', inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    expect(component.getBeneficiaryDetails).toHaveBeenCalled();
    expect(component.beneficiary).toEqual(data.femaleBeneficiary);
  }));

  it('should call getMasterData on Initialisation', inject([MasterdataService], (masterdataService) => {
    masterdataService.nurseMasterDataSource.next(data.generalOPDNurseMasterdata.data);
    spyOn(component, 'getMasterData');
    component.ngOnInit();
    expect(component.getMasterData).toHaveBeenCalled();
    expect(component.comorbidityMasterData).toEqual(data.generalOPDNurseMasterdata.data.comorbidConditions);
  }));

  // it('should intialise comorbidity FormArray with comorbidity FormGroup on Initialisation', inject([MasterdataService], (masterdataService) => {
  //   masterdataService.nurseMasterDataSource.next(data.generalOPDNurseMasterdata.data);
  //   spyOn(component, 'getMasterData').and.callThrough();
  //   spyOn(component, 'addComorbidityConcurrentConditions');
  //   component.ngOnInit();
  //   expect(component.getMasterData).toHaveBeenCalled();
  //   expect(component.addComorbidityConcurrentConditions).toHaveBeenCalled();
  //   expect((<FormArray>component.comorbidityConcurrentConditionsForm.controls.comorbidityConcurrentConditionsList).controls.length).toBe(1);
  // }));

  // it('should call getGeneralHistory when mode is view', async(inject([MasterdataService], (masterdataService) => {
  //   masterdataService.nurseMasterDataSource.next(data.generalOPDNurseMasterdata.data);
  //   spyOn(component, 'getMasterData').and.callThrough();
  //   spyOn(component, 'getGeneralHistory');
  //   component.mode = "view";
  //   fixture.detectChanges();
  //   component.ngOnInit();
  //   expect(component.getMasterData).toHaveBeenCalled();
  //   expect(component.getGeneralHistory).toHaveBeenCalled();
  // })));

});
