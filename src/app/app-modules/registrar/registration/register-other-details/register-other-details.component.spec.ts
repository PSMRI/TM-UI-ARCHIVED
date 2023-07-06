import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationComponent } from './../registration.component';
import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { CameraService } from '../../../core/services/camera.service';
import { RegistrarService } from '../../shared/services/registrar.service';
import { RegistrationUtils } from '../../shared/utility/registration-utility';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/throw';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { getDOM } from '@angular/platform-browser/src/dom/dom_adapter';
// import { Location } from '@angular/common';
// import { fakeAsync, tick } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { MaterialModule } from '../../../core/material.module';
import { RegisterOtherDetailsComponent } from './register-other-details.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


class RouterStub {
  navigateByUrl(url: string) { return url; }
}
class MockActivatedRoute {

  snapshot = {
    params: [null]
  }

}
class RegistrarServiceMock {
  // submitBeneficiary = jasmine.createSpy('submitBeneficiary() spy').andCallFake(function(){
  //   return Observable.of(true);
  // });
  // updateBeneficiary = jasmine.createSpy('updateBeneficiary');

  registrationMaster = { "occupationMaster": [{ "occupationID": 2, "occupationType": "Agricultural labour" }, { "occupationID": 3, "occupationType": "Business" }, { "occupationID": 1, "occupationType": "Cultivation(Agriculture)" }, { "occupationID": 5, "occupationType": "Govt employee" }, { "occupationID": 9, "occupationType": "Housewife or Homemaker" }, { "occupationID": 8, "occupationType": "Not Applicable" }, { "occupationID": 7, "occupationType": "Other" }, { "occupationID": 6, "occupationType": "Private employee" }, { "occupationID": 4, "occupationType": "Student" }], "incomeMaster": [{ "incomeStatusID": 1, "incomeStatus": "APL" }, { "incomeStatusID": 2, "incomeStatus": "BPL" }, { "incomeStatusID": 3, "incomeStatus": "Don't Know" }], "maritalStatusMaster": [{ "maritalStatusID": 3, "status": "Divorced" }, { "maritalStatusID": 2, "status": "Married" }, { "maritalStatusID": 7, "status": "Not Applicable" }, { "maritalStatusID": 4, "status": "Seperated" }, { "maritalStatusID": 1, "status": "Unmarried" }, { "maritalStatusID": 5, "status": "Widow" }, { "maritalStatusID": 6, "status": "Widower" }], "religionMaster": [{ "religionID": 5, "religionType": "Buddhism" }, { "religionID": 1, "religionType": "Hinduism" }, { "religionID": 2, "religionType": "Islam" }, { "religionID": 6, "religionType": "Jainism" }, { "religionID": 3, "religionType": "Judaism" }, { "religionID": 7, "religionType": "Other" }, { "religionID": 4, "religionType": "Sikhism" }], "communityMaster": [{ "communityID": 4, "communityType": "BC" }, { "communityID": 7, "communityType": "Dont' Know" }, { "communityID": 5, "communityType": "OBC" }, { "communityID": 6, "communityType": "OC" }, { "communityID": 2, "communityType": "SC" }, { "communityID": 3, "communityType": "ST" }], "qualificationMaster": [{ "educationID": 6, "educationType": "Diploma / Under Graduate" }, { "educationID": 7, "educationType": "Graduate" }, { "educationID": 8, "educationType": "Post Graduate & Above" }, { "educationID": 2, "educationType": "Primary (1st to 5th Std)" }, { "educationID": 4, "educationType": "Secondary (9th to 10th)" }, { "educationID": 5, "educationType": "Senior Secondary (11th to 12th/Intermediate)" }, { "educationID": 3, "educationType": "Upper Primary (6th to 8th Std)" }], "govIdEntityMaster": [{ "govtIdentityTypeID": 1, "identityType": "Aadhar" }, { "govtIdentityTypeID": 3, "identityType": "Driving License" }, { "govtIdentityTypeID": 4, "identityType": "PAN" }, { "govtIdentityTypeID": 5, "identityType": "Passport" }, { "govtIdentityTypeID": 6, "identityType": "Ration Card" }, { "govtIdentityTypeID": 2, "identityType": "Voter ID" }], "genderMaster": [{ "genderID": 2, "genderName": "Female" }, { "genderID": 1, "genderName": "Male" }, { "genderID": 3, "genderName": "Transgender" }], "otherGovIdEntityMaster": [{ "govtIdentityTypeID": 7, "identityType": "Assam Arogya Nidhi (AAN)" }, { "govtIdentityTypeID": 8, "identityType": "Atal Amrit Abhiyan" }, { "govtIdentityTypeID": 9, "identityType": "Janani Shishu Suraksha Karyakram (JSSK)" }, { "govtIdentityTypeID": 10, "identityType": "Janani Suraksha Yojana (JSY)" }, { "govtIdentityTypeID": 11, "identityType": "KAYAKALP" }, { "govtIdentityTypeID": 12, "identityType": "RMNCH+A" }, { "govtIdentityTypeID": 13, "identityType": "Sanjeevani - Village Health Outreach Programme" }, { "govtIdentityTypeID": 14, "identityType": "Sneha Sparsha" }] };
  // benDetails =
  benDetails = {
    "beneficiaryRegID": 7878,
    "firstName": "neeraj",
    "lastName": "baba",
    "gender": 1,
    "dob": "Jan 7, 1995",
    "maritalStatus": 3,
    "income": 1,
    "occupation": 2,
    "blockID": 4209,
    "blockName": "North Guwahati (Pt)",
    "stateID": 5,
    "stateName": "Assam",
    "community": 4,
    "religion": 5,
    "fatherName": "father ji",
    "districtID": 54,
    "districtName": "KAMRUP",
    "villageID": 43132,
    "villageName": "Nalgaon",
    "phoneNo": "9876543567",
    "literacyStatus": "Illiterate",
    "motherName": "mother ji",
    "govID": [],
    "otherGovID": [],
    "age": 0
  }

  registrationMasterDetails = new BehaviorSubject<any>(null);
  registrationMasterDetails$ = this.registrationMasterDetails.asObservable();
  beneficiaryDetails = new BehaviorSubject<any>(null);
  beneficiaryDetails$ = this.beneficiaryDetails.asObservable();


  getRegistrationMaster(spID: any) {
    this.registrationMasterDetails.next(this.registrationMaster);
  }


  getPatientDataAsObservable(benRegID: any) {
    this.beneficiaryDetails.next(this.benDetails);
  }

  submitBeneficiary() {

    return Observable.of(true);
  }
  updateBeneficiary() {

    return Observable.of(false);
  }
}

describe('RegisterOtherDetailsComponent', () => {
  let component: RegisterOtherDetailsComponent;
  let fixture: ComponentFixture<RegisterOtherDetailsComponent>;
  let registrarService;
  let cameraService: CameraService;
  let fb = new FormBuilder();
  let confirmationService: ConfirmationService;
  let spy: any;
  

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule, FormsModule, MaterialModule, NoopAnimationsModule],
      declarations: [RegisterOtherDetailsComponent],
      providers: [{ provide: RegistrarService, useClass: RegistrarServiceMock },
        CameraService,
        ConfirmationService,
      { provide: Router, useClass: RouterStub },
      { provide: ActivatedRoute, useClass: MockActivatedRoute }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterOtherDetailsComponent);
    component = fixture.componentInstance;
    registrarService = TestBed.get(RegistrarService);
    cameraService = TestBed.get(CameraService);
    confirmationService = TestBed.get(ConfirmationService);
    // fixture.detectChanges()

    function initGovID(): FormGroup {
      return fb.group({
        type: null,
        value: null
      })
    }
    component.otherDetailsForm = fb.group({
      fatherName: null,
      motherName: null,
      emailID: null,
      bankName: null,
      branchName: null,
      IFSCCode: null,
      accountNumber: null,
      community: null,
      religion: null,
      religionOther: null,
      govID: fb.array([
        initGovID()
      ]),
      otherGovID: fb.array([
        initGovID()
      ]),
    })
    component.patientRevisit = false;

    // fixture.detectChanges();
    registrarService.getRegistrationMaster();
  });

  it('should create other details component for new beneficiary', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

});

