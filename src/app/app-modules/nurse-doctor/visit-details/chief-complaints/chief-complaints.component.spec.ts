import { async, inject, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
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

import { ChiefComplaintsComponent } from './chief-complaints.component';

describe('ChiefComplaintsComponent', () => {
    let component: ChiefComplaintsComponent;
    let fixture: ComponentFixture<ChiefComplaintsComponent>;
    let debugElement: DebugElement;
    let fb: FormBuilder;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule, ReactiveFormsModule, MaterialModule],
            declarations: [ChiefComplaintsComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                ConfirmationService,
                { provide: MasterdataService, useClass: MasterdataServiceStub },
                { provide: DoctorService, useClass: DoctorServiceStub },
                { provide: BeneficiaryDetailsService, useClass: BeneficiaryDetailsServiceStub },
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChiefComplaintsComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        fb = debugElement.injector.get(FormBuilder);
        component.patientChiefComplaintsForm = new VisitDetailUtils(fb).createANCPatientChiefComplaintArrayForm();
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

    // it('should call getNurseMasterData on Initialisation', inject([MasterdataService], (masterdataService) => {
    //     masterdataService.nurseMasterDataSource.next(data.generalOPDNurseMasterdata.data);
    //     spyOn(component, 'getNurseMasterData');
    //     component.ngOnInit();
    //     expect(component.getNurseMasterData).toHaveBeenCalled();
    //     expect(component.selectChiefComplaint).toEqual(data.generalOPDNurseMasterdata.data.chiefComplaintMaster);
    // }));

    it('should clear ChiefComplaintsForm when total complaints is one and remove button is clicked', () => {
        let complaint = component.patientChiefComplaintsForm.controls['complaints'] as FormArray;
        complaint.controls[0].patchValue({
            "chiefComplaint": {
                "chiefComplaintID": 1,
                "chiefComplaint": "Abdominal Bloating"
            },
            "beneficiaryRegID": 7416,
            "benVisitID": 863,
            "providerServiceMapID": 1320,
            "duration": 12,
            "unitOfDuration": "Hours",
            "description": "hghgjhgjh",
            "createdBy": null
        });
        fixture.detectChanges();
        component.removeCheifComplaint(0, complaint.controls[0] as FormGroup);
        expect(complaint.value.length).toBe(1);
        expect(component.patientChiefComplaintsForm.value.complaints[0]).not.toEqual({
            "chiefComplaint": {
                "chiefComplaintID": 1,
                "chiefComplaint": "Abdominal Bloating"
            },
            "chiefComplaintID": null,
            "beneficiaryRegID": 7416,
            "benVisitID": 863,
            "providerServiceMapID": 1320,
            "duration": 12,
            "unitOfDuration": "Hours",
            "description": "hghgjhgjh",
            "createdBy": null
        });
    });

    it('should remove ChiefComplaintsForm when total complaints is more than one and remove button is clicked', inject([MasterdataService], (masterdataService) => {
        masterdataService.nurseMasterDataSource.next(data.generalOPDNurseMasterdata.data);
        let complaint = component.patientChiefComplaintsForm.controls['complaints'] as FormArray;
        component.addCheifComplaint();
        component.addCheifComplaint();
        complaint.controls[0].markAsDirty();
        complaint.controls[1].markAsDirty();
        fixture.detectChanges();
        let de = fixture.debugElement.query(By.css('#removeBtn0'));
        de.triggerEventHandler('click', null);
        // component.removeCheifComplaint(1, complaint.controls[1] as FormGroup);
        expect(complaint.value.length).toBe(1);
    }));

    it('should add ChiefComplaintsForm when add button is clicked', inject([MasterdataService], (masterdataService) => {
        masterdataService.nurseMasterDataSource.next(data.generalOPDNurseMasterdata.data);
        let complaint = component.patientChiefComplaintsForm.controls['complaints'] as FormArray;
        let de = fixture.debugElement.query(By.css('#addBtn0'));
        de.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(complaint.value.length).toBe(2);
    }));

    it('should get ChiefComplaintsDetails when mode is view', async(inject([DoctorService, MasterdataService], (doctorService, masterdataService) => {
        component.mode = new String('view');
        spyOn(component, 'getChiefComplaints').and.callThrough();
        spyOn(doctorService, 'getVisitComplaintDetails').and.returnValue(Observable.of(data.generalOPDVisitDetails));
        masterdataService.nurseMasterDataSource.next(data.generalOPDNurseMasterdata.data);
        expect(component.getChiefComplaints).toHaveBeenCalled();
        expect(doctorService.getVisitComplaintDetails).toHaveBeenCalled();
    })));

    it('should patch ChiefComplaintsDetails to form when mode is view', async(inject([DoctorService, MasterdataService], (doctorService, masterdataService) => {
        spyOn(doctorService, 'getVisitComplaintDetails').and.returnValue(Observable.of(data.generalOPDVisitDetails));
        component.mode = new String('view');
        masterdataService.nurseMasterDataSource.next(data.generalOPDNurseMasterdata.data);
        fixture.detectChanges();
        expect(component.patientChiefComplaintsForm.value.complaints.length).toBe(2);
    })));

});
