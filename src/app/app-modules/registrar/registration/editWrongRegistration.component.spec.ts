/* 
* AMRIT � Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/


import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationComponent } from './registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { CameraService } from '../../core/services/camera.service';
import { RegistrarService } from '../shared/services/registrar.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/throw';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
// import { Location } from '@angular/common';
// import { fakeAsync, tick } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { MaterialModule } from '../../core/material.module';



class RouterStub {
  // navigateByUrl(url: string) { return url; }

  navigate(url) {
   }
}

class RegistrarServiceMock {

  registrationMaster = { "occupationMaster": [{ "occupationID": 2, "occupationType": "Agricultural labour" }, { "occupationID": 3, "occupationType": "Business" }, { "occupationID": 1, "occupationType": "Cultivation(Agriculture)" }, { "occupationID": 5, "occupationType": "Govt employee" }, { "occupationID": 9, "occupationType": "Housewife or Homemaker" }, { "occupationID": 8, "occupationType": "Not Applicable" }, { "occupationID": 7, "occupationType": "Other" }, { "occupationID": 6, "occupationType": "Private employee" }, { "occupationID": 4, "occupationType": "Student" }], "incomeMaster": [{ "incomeStatusID": 1, "incomeStatus": "APL" }, { "incomeStatusID": 2, "incomeStatus": "BPL" }, { "incomeStatusID": 3, "incomeStatus": "Don't Know" }], "maritalStatusMaster": [{ "maritalStatusID": 3, "status": "Divorced" }, { "maritalStatusID": 2, "status": "Married" }, { "maritalStatusID": 7, "status": "Not Applicable" }, { "maritalStatusID": 4, "status": "Seperated" }, { "maritalStatusID": 1, "status": "Unmarried" }, { "maritalStatusID": 5, "status": "Widow" }, { "maritalStatusID": 6, "status": "Widower" }], "religionMaster": [{ "religionID": 5, "religionType": "Buddhism" }, { "religionID": 1, "religionType": "Hinduism" }, { "religionID": 2, "religionType": "Islam" }, { "religionID": 6, "religionType": "Jainism" }, { "religionID": 3, "religionType": "Judaism" }, { "religionID": 7, "religionType": "Other" }, { "religionID": 4, "religionType": "Sikhism" }], "communityMaster": [{ "communityID": 4, "communityType": "BC" }, { "communityID": 7, "communityType": "Dont' Know" }, { "communityID": 5, "communityType": "OBC" }, { "communityID": 6, "communityType": "OC" }, { "communityID": 2, "communityType": "SC" }, { "communityID": 3, "communityType": "ST" }], "qualificationMaster": [{ "educationID": 6, "educationType": "Diploma / Under Graduate" }, { "educationID": 7, "educationType": "Graduate" }, { "educationID": 8, "educationType": "Post Graduate & Above" }, { "educationID": 2, "educationType": "Primary (1st to 5th Std)" }, { "educationID": 4, "educationType": "Secondary (9th to 10th)" }, { "educationID": 5, "educationType": "Senior Secondary (11th to 12th/Intermediate)" }, { "educationID": 3, "educationType": "Upper Primary (6th to 8th Std)" }], "govIdEntityMaster": [{ "govtIdentityTypeID": 1, "identityType": "Aadhar" }, { "govtIdentityTypeID": 3, "identityType": "Driving License" }, { "govtIdentityTypeID": 4, "identityType": "PAN" }, { "govtIdentityTypeID": 5, "identityType": "Passport" }, { "govtIdentityTypeID": 6, "identityType": "Ration Card" }, { "govtIdentityTypeID": 2, "identityType": "Voter ID" }], "genderMaster": [{ "genderID": 2, "genderName": "Female" }, { "genderID": 1, "genderName": "Male" }, { "genderID": 3, "genderName": "Transgender" }], "otherGovIdEntityMaster": [{ "govtIdentityTypeID": 7, "identityType": "Assam Arogya Nidhi (AAN)" }, { "govtIdentityTypeID": 8, "identityType": "Atal Amrit Abhiyan" }, { "govtIdentityTypeID": 9, "identityType": "Janani Shishu Suraksha Karyakram (JSSK)" }, { "govtIdentityTypeID": 10, "identityType": "Janani Suraksha Yojana (JSY)" }, { "govtIdentityTypeID": 11, "identityType": "KAYAKALP" }, { "govtIdentityTypeID": 12, "identityType": "RMNCH+A" }, { "govtIdentityTypeID": 13, "identityType": "Sanjeevani - Village Health Outreach Programme" }, { "govtIdentityTypeID": 14, "identityType": "Sneha Sparsha" }] };  

  registrationMasterDetails = new BehaviorSubject<any>(null);
  registrationMasterDetails$ = this.registrationMasterDetails.asObservable();

  beneficiaryDetails = new BehaviorSubject<any>(null);
  beneficiaryDetails$ = this.beneficiaryDetails.asObservable();


  getRegistrationMaster(spID: any) {
    this.registrationMasterDetails.next(this.registrationMaster);
  }

  getPatientDataAsObservable(benRegID: any) {
    //this.beneficiaryDetails.next(this.benDetails);
  }


}

class cameraServiceMock{

}
class confirmationServiceMock{

  alert(){}

}

describe('RegisterComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let registrarService;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule, FormsModule, MaterialModule, NoopAnimationsModule] ,
      declarations: [ RegistrationComponent ],
      providers: [{provide: RegistrarService, useClass: RegistrarServiceMock},
        {provide: CameraService, useClass: cameraServiceMock},
        {provide: ConfirmationService, useClass: confirmationServiceMock},
        {
          provide: Router, useClass: class {
            navigate = jasmine.createSpy("navigate");
          } },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { 'beneficiaryRegID': '7878'}}}}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    registrarService = TestBed.get(RegistrarService);
    // component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create edit Beneficiary Component', () => {
    expect(component).toBeTruthy();
  });

  it('should load form for edit Beneficiary', () => {
    // component.ngOnInit();
    const form = component.beneficiaryRegistrationForm;
    expect(form).toBeTruthy();

  });

  it('should load component in Edit Beneficiary Mode  ', () => {
   // component.ngOnInit();
    const buttonText = component.postButtonText;
    expect(component.patientRevisit).toBe(true);

  });

  it('should set Post button text to Update', () => {
   // component.ngOnInit();
    const buttonText = component.postButtonText;
    expect(buttonText).toBe('Update');

  });

    it('should redirect to Search Component as there is no Beneficiary data available', () => {
    let router = fixture.debugElement.injector.get(Router);
    // spyOn(router, 'navigate')
    
    expect(router.navigate).toHaveBeenCalledWith(['/registrar/search/']);


  });

});
