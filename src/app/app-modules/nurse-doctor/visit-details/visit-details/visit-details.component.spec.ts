import { async, inject, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MaterialModule } from '../../../core/material.module';

import { VisitDetailUtils } from '../../shared/utility';

import { ConfirmationService } from '../../../core/services/confirmation.service';
import { DoctorService, MasterdataService } from '../../shared/services';
import { BeneficiaryDetailsService } from '../../../core/services/beneficiary-details.service';

import { MasterdataServiceStub } from '../../shared/mocks/masterdata-service-stub';
import { DoctorServiceStub } from '../../shared/mocks/doctor-service-stub';
import { BeneficiaryDetailsServiceStub } from '../../../core/mocks/beneficiary-details-service-stub';

import * as data from '../../shared/mocks/mock-data';
import { Observable } from 'rxjs/Rx';

import { VisitDetailsComponent } from './visit-details.component';

describe('VisitDetailsComponent', () => {
  let component: VisitDetailsComponent;
  let fixture: ComponentFixture<VisitDetailsComponent>;
  let debugElement: any;
  let fb: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ReactiveFormsModule, MaterialModule],
      declarations: [VisitDetailsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: MasterdataService, useClass: MasterdataServiceStub },
        { provide: DoctorService, useClass: DoctorServiceStub },
        { provide: BeneficiaryDetailsService, useClass: BeneficiaryDetailsServiceStub },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitDetailsComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    fb = debugElement.injector.get(FormBuilder);
    component.patientVisitDetailsForm = new VisitDetailUtils(fb).createPatientVisitDetails();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getVisitReasonAndCategory on Initialisation', () => {
    spyOn(component, 'getVisitReasonAndCategory');
    component.ngOnInit();
    expect(component.getVisitReasonAndCategory).toHaveBeenCalled();
  });

  it('should call getBenificiaryDetails on Initialisation', () => {
    spyOn(component, 'getBenificiaryDetails');
    component.ngOnInit();
    expect(component.getBenificiaryDetails).toHaveBeenCalled();
  });

  it('should show pregnancyStatus for female beneficiary', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    component.patientVisitDetailsForm.patchValue({ visitReason: 'FollowUp', visitCategory: 'General OPD' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#pregnancyStatus'));
    expect(component.beneficiary).toEqual(data.femaleBeneficiary);
    expect(debugElement).toBeTruthy();
  })));

  it('should not show pregnancyStatus for male beneficiary', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.maleBeneficiary);
    component.patientVisitDetailsForm.patchValue({ visitReason: 'FollowUp', visitCategory: 'General OPD' });
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#pregnancyStatus'));
    expect(component.beneficiary).toEqual(data.maleBeneficiary);
    expect(debugElement).not.toBeTruthy();
  })));

  it('should get Visit Reason and Category Master Data', inject([MasterdataService], (masterdataService) => {
    masterdataService.visitDetailMasterDataSource.next(data.visitReasonAndCategory);
    expect(component.templateNurseMasterData).toEqual(data.visitReasonAndCategory);
  }));

  it('should get VisitDetails when mode is view', () => {
    spyOn(component, 'getVisitDetails');
    component.mode = new String('view');
    component.ngOnChanges();
    expect(component.getVisitDetails).toHaveBeenCalled();
  });

  it('should patch visitDetails to form when mode is view', inject([DoctorService], (doctorService) => {
    localStorage.setItem('visitCategory', 'General OPD');
    spyOn(doctorService, 'getVisitComplaintDetails').and.returnValue(Observable.of(data.generalOPDVisitDetails));
    spyOn(component, 'getVisitDetails').and.callThrough();
    component.mode = new String('view');
    component.ngOnChanges();
    expect(doctorService.getVisitComplaintDetails).toHaveBeenCalled();
    fixture.detectChanges();
    expect(component.patientVisitDetailsForm.value.visitReason).toEqual(data.generalOPDVisitDetails.data.GOPDNurseVisitDetail.visitReason);
    expect(component.patientVisitDetailsForm.value.visitCategory).toEqual(data.generalOPDVisitDetails.data.GOPDNurseVisitDetail.visitCategory);
    expect(component.patientVisitDetailsForm.value.pregnancyStatus).toEqual(data.generalOPDVisitDetails.data.GOPDNurseVisitDetail.pregnancyStatus);
    expect(component.patientVisitDetailsForm.value.rCHID).toEqual(data.generalOPDVisitDetails.data.GOPDNurseVisitDetail.rCHID);
  }));

});
