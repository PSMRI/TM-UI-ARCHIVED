import { async, ComponentFixture, tick, inject, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
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
import { SearchComponent } from './search.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Md2Module } from 'md2';
import { MaterialModule } from '../../core/material.module';
import { BeneficiaryDetailsService } from 'app/app-modules/core/services/beneficiary-details.service';



class RouterStub {
  navigateByUrl(url: string) { return url; }

  navigate(someRoute) {

  }
}
class MockActivatedRoute {

  snapshot = {
    params: [null]
  }

}

class CameraStub {

  viewImage(imagedata) {}

}

class BeneficiaryServiceMock {
  getBeneficiaryImage(id) {}

}

class RegistrarServiceMock {

  patientRevisit() {

  }

  quickSearch() {
  }
  // submitBeneficiary = jasmine.createSpy('submitBeneficiary').andCallFake(function () {
  //   return Observable.of(true);
  // });
  // updateBeneficiary = jasmine.createSpy('updateBeneficiary').andCallFake(function () {
  //   return Observable.of(true);
  // });

  registrationMaster = { "occupationMaster": [{ "occupationID": 2, "occupationType": "Agricultural labour" }, { "occupationID": 3, "occupationType": "Business" }, { "occupationID": 1, "occupationType": "Cultivation(Agriculture)" }, { "occupationID": 5, "occupationType": "Govt employee" }, { "occupationID": 9, "occupationType": "Housewife or Homemaker" }, { "occupationID": 8, "occupationType": "Not Applicable" }, { "occupationID": 7, "occupationType": "Other" }, { "occupationID": 6, "occupationType": "Private employee" }, { "occupationID": 4, "occupationType": "Student" }], "incomeMaster": [{ "incomeStatusID": 1, "incomeStatus": "APL" }, { "incomeStatusID": 2, "incomeStatus": "BPL" }, { "incomeStatusID": 3, "incomeStatus": "Don't Know" }], "maritalStatusMaster": [{ "maritalStatusID": 3, "status": "Divorced" }, { "maritalStatusID": 2, "status": "Married" }, { "maritalStatusID": 7, "status": "Not Applicable" }, { "maritalStatusID": 4, "status": "Seperated" }, { "maritalStatusID": 1, "status": "Unmarried" }, { "maritalStatusID": 5, "status": "Widow" }, { "maritalStatusID": 6, "status": "Widower" }], "religionMaster": [{ "religionID": 5, "religionType": "Buddhism" }, { "religionID": 1, "religionType": "Hinduism" }, { "religionID": 2, "religionType": "Islam" }, { "religionID": 6, "religionType": "Jainism" }, { "religionID": 3, "religionType": "Judaism" }, { "religionID": 7, "religionType": "Other" }, { "religionID": 4, "religionType": "Sikhism" }], "communityMaster": [{ "communityID": 4, "communityType": "BC" }, { "communityID": 7, "communityType": "Dont' Know" }, { "communityID": 5, "communityType": "OBC" }, { "communityID": 6, "communityType": "OC" }, { "communityID": 2, "communityType": "SC" }, { "communityID": 3, "communityType": "ST" }], "qualificationMaster": [{ "educationID": 6, "educationType": "Diploma / Under Graduate" }, { "educationID": 7, "educationType": "Graduate" }, { "educationID": 8, "educationType": "Post Graduate & Above" }, { "educationID": 2, "educationType": "Primary (1st to 5th Std)" }, { "educationID": 4, "educationType": "Secondary (9th to 10th)" }, { "educationID": 5, "educationType": "Senior Secondary (11th to 12th/Intermediate)" }, { "educationID": 3, "educationType": "Upper Primary (6th to 8th Std)" }], "govIdEntityMaster": [{ "govtIdentityTypeID": 1, "identityType": "Aadhar" }, { "govtIdentityTypeID": 3, "identityType": "Driving License" }, { "govtIdentityTypeID": 4, "identityType": "PAN" }, { "govtIdentityTypeID": 5, "identityType": "Passport" }, { "govtIdentityTypeID": 6, "identityType": "Ration Card" }, { "govtIdentityTypeID": 2, "identityType": "Voter ID" }], "genderMaster": [{ "genderID": 2, "genderName": "Female" }, { "genderID": 1, "genderName": "Male" }, { "genderID": 3, "genderName": "Transgender" }], "otherGovIdEntityMaster": [{ "govtIdentityTypeID": 7, "identityType": "Assam Arogya Nidhi (AAN)" }, { "govtIdentityTypeID": 8, "identityType": "Atal Amrit Abhiyan" }, { "govtIdentityTypeID": 9, "identityType": "Janani Shishu Suraksha Karyakram (JSSK)" }, { "govtIdentityTypeID": 10, "identityType": "Janani Suraksha Yojana (JSY)" }, { "govtIdentityTypeID": 11, "identityType": "KAYAKALP" }, { "govtIdentityTypeID": 12, "identityType": "RMNCH+A" }, { "govtIdentityTypeID": 13, "identityType": "Sanjeevani - Village Health Outreach Programme" }, { "govtIdentityTypeID": 14, "identityType": "Sneha Sparsha" }] };
  registrationMasterDetails = new BehaviorSubject<any>(null);
  registrationMasterDetails$ = this.registrationMasterDetails.asObservable();


  getRegistrationMaster(spID: any) {
    this.registrationMasterDetails.next(this.registrationMaster);
  }

  submitBeneficiary() {

    return Observable.of(true);
  }
  updateBeneficiary() {

    return Observable.of(false);
  }
}

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let router: Router;
  let route: ActivatedRoute;
  let camera: CameraService;
  let registrarService: RegistrarService;
  let beneficiaryService: BeneficiaryDetailsService;
  let confirmService: ConfirmationService;
  let el: HTMLElement;
  let spy: any;
  let button: DebugElement;
  let quickSearchButton: DebugElement;
  const searchForOm = [{
    "beneficiaryRegID": 7432,
    "benName": "SOMIYA RABHA ",
    "age": "8 months - 10 days"
  },
  {
    "beneficiaryRegID": 7472,
    "benName": "SOMEONE SOMESURNAME",
    "genderID": 2,
    "genderName": "Female",
    "districtName": "BARPETA",
    "villageName": "2 No.Chachara",
    "phoneNo": "5678987654",
    "age": "34 years - 2 months"
  },
  {
    "beneficiaryRegID": 7505,
    "benName": "OMI ",
    "genderID": 2,
    "genderName": "Female",
    "fatherName": "",
    "districtName": "BARPETA",
    "villageName": "2 No.Chachara",
    "phoneNo": "9987654396",
    "age": "23 years - 2 months"
  },
  {
    "beneficiaryRegID": 7928,
    "benName": "OM KUMARI",
    "genderID": 2,
    "genderName": "Female",
    "fatherName": "SKRAO",
    "districtName": "CHITTOOR",
    "villageName": "Ithepalle",
    "phoneNo": "9789678598",
    "age": "41 years - 1 months"
  },
  {
    "beneficiaryRegID": 7930,
    "benName": "OM KUMARI",
    "genderID": 2,
    "genderName": "Female",
    "districtName": "CHITTOOR",
    "villageName": "Chandragiri",
    "phoneNo": "9789678564",
    "age": "41 years - 1 months"
  },
  {
    "beneficiaryRegID": 8040,
    "benName": "RANDOM ",
    "genderID": 2,
    "genderName": "Female",
    "fatherName": "",
    "districtName": "BALOD",
    "phoneNo": "3434343456",
    "age": "22 years - 0 months"
  },
  {
    "beneficiaryRegID": 8040,
    "benName": "RANDOM ",
    "genderID": 2,
    "genderName": "Female",
    "fatherName": "",
    "districtName": "BALOD",
    "age": "22 years - 0 months"
  }];


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule, FormsModule, Md2Module, MaterialModule, NoopAnimationsModule],
      declarations: [ SearchComponent ],
      providers: [{ provide: RegistrarService, useClass: RegistrarServiceMock },
        ConfirmationService,
        {provide: BeneficiaryDetailsService, useClass: BeneficiaryServiceMock},
        {provide: CameraService, useClass: CameraStub},
      { provide: Router, useClass: RouterStub },
      { provide: ActivatedRoute, useClass: MockActivatedRoute }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    registrarService = TestBed.get(RegistrarService);
    confirmService = TestBed.get(ConfirmationService);
    camera = TestBed.get(CameraService);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
    beneficiaryService = TestBed.get(BeneficiaryDetailsService);
    //button = fixture.debugElement.queryAll(By.css('button'));
    //quickSearchButton = button[0];
    fixture.detectChanges();
  });

  it('search component should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should call Quick Search without any search value and give alert to user', () => {
    let spier = spyOn(confirmService, 'alert').and.returnValue(1);
    component.quickSearch();
    expect(spier).toHaveBeenCalledWith('Please enter Beneficiary ID, Name or Phone No first...');
  });

  it('should call Quick Search when search button is clicked', fakeAsync(() => {
    let spier = spyOn(component, 'quickSearch').and.callThrough();
    let compiled = fixture.debugElement.nativeElement;
    compiled.querySelector('button').click();
    tick();
    fixture.detectChanges();
    expect(spier).toHaveBeenCalled();
  }));


  it('should call Quick Search with 1 char in search value and give alert to user', () => {
    let spier = spyOn(confirmService, 'alert').and.returnValue(1);
    component.quickSearch('b');
    expect(spier).toHaveBeenCalledWith('Minimum 2 Character is required to search Beneficiary !!!');
  });

  it('should call registrar service when 2 chars are given for searching', () => {
    let spier = spyOn(registrarService, 'quickSearch').and.returnValue(Observable.of(1));
    component.quickSearch('ab');
    expect(spier).toHaveBeenCalledWith({'benID': 'ab'});
  });

  it('should call alert when nothing is returned by search service', () => {
    let spier = spyOn(registrarService, 'quickSearch').and.returnValue(Observable.of(null));
    let spiAlert = spyOn(confirmService, 'alert').and.returnValue(1);
    component.quickSearch('ab');
    expect(spiAlert).toHaveBeenCalledWith('Beneficiary Not found...');
  });

  it('should load data returned by search service into beneficiarylist', () => {
    let spier = spyOn(registrarService, 'quickSearch').and.returnValue(Observable.of(searchForOm));
    component.quickSearch('OM');
    fixture.autoDetectChanges();
    expect(component.beneficiaryList).toBe(searchForOm);
  });


  it('should set default filtered list to be equal to beneficiarylist', () => {
    let spier = spyOn(registrarService, 'quickSearch').and.returnValue(Observable.of(searchForOm));
    component.quickSearch('OM');
    fixture.autoDetectChanges();
    expect(component.filteredBeneficiaryList).toBe(component.beneficiaryList);
  });


  it('should set filtered list to be equal to beneficiarylist when filter is called without any parameter', () => {
    component.filteredBeneficiaryList = [];
    component.beneficiaryList = searchForOm;
    component.filterBeneficiaryList();
    fixture.autoDetectChanges();
    expect(component.filteredBeneficiaryList).toBe(component.beneficiaryList);
  });

  it('should set filtered list empty as per the searched query as no matching pattern is found', () => {
    component.filteredBeneficiaryList = [];
    component.beneficiaryList = searchForOm;
    component.filterBeneficiaryList('qwertyuiop');
    fixture.autoDetectChanges();
    expect(component.filteredBeneficiaryList).toEqual([]);
  });


  it('should confirm when user tries to submit patient to nurse', () => {
    let spier = spyOn(confirmService,'confirm').and.returnValue(Observable.of(false));
    component.patientRevisited(123);
    fixture.autoDetectChanges();
    expect(spier).toHaveBeenCalledWith(`Confirm Patient Revisit`, `Please Confirm to Submit Beneficiary to Nurse Work-List ?`);
  });


  it('should call sendToNurseWindow function if user confirms for revisit', () => {
    let spi = spyOn(confirmService, 'confirm').and.returnValue(Observable.of(true));
    let spier = spyOn(component, 'sendToNurseWindow').and.returnValue(1);
    component.patientRevisited(123);
    fixture.autoDetectChanges();
    expect(spier).toHaveBeenCalled();
  })

  it('should not call sendToNurseWindow function if user doesnt confirm for revisit', () => {
    let spi = spyOn(confirmService, 'confirm').and.returnValue(Observable.of(false));
    let spier = spyOn(component, 'sendToNurseWindow').and.returnValue(1);
    component.patientRevisited(123);
    fixture.autoDetectChanges();
    expect(spier).not.toHaveBeenCalled();
  })


  it('should ask for confirmation if used wants to edit the registration', () => {
    let spier = spyOn(confirmService, 'confirm').and.returnValue(Observable.of(false));
    component.editPatientInfo(123);
    fixture.autoDetectChanges();
    expect(spier)
    .toHaveBeenCalledWith(`Confirm Beneficiary Editing`, `Please Confirm do you really want to edit details of this Beneficiary?`);
  })

  it('should navigate to editing page if user confirms editing registration', () => {
    let spi = spyOn(confirmService, 'confirm').and.returnValue(Observable.of(true));
    let spier = spyOn(router , 'navigate').and.returnValue(1);
    let benRegID = 123;
    component.editPatientInfo(benRegID);
    fixture.autoDetectChanges();
    expect(spier)
      .toHaveBeenCalledWith(['/registrar/search/' + benRegID]);
  })

  it('should not navigate to editing page if user doesnt confirm editing registration', () => {
    let spi = spyOn(confirmService, 'confirm').and.returnValue(Observable.of(false));
    let spier = spyOn(router, 'navigate').and.returnValue(1);
    let benRegID = 123;
    component.editPatientInfo(benRegID);
    fixture.autoDetectChanges();
    expect(spier).not.toHaveBeenCalled();
  })

  it('should call registrarService.patientRevisit if sendToNurseWindows gets user permission', () => {
    let res = 'sent to nurse window';
    let spi = spyOn(confirmService, 'alert').and.returnValue(1);
    let spier = spyOn(registrarService, 'patientRevisit').and.returnValue(Observable.of({response: res }));
    let benRegID = 123;
    component.sendToNurseWindow(true, benRegID);
    fixture.autoDetectChanges();
    expect(spier).toHaveBeenCalledWith({ beneficiaryRegID: benRegID});
  })

  it('should alert after calling registrarService.patientRevisit if sendToNurseWindows gets user permission', () => {
    let res = 'sent to nurse window';
    let spi = spyOn(registrarService, 'patientRevisit').and.returnValue(Observable.of({ response: res }));
    let spier = spyOn(confirmService, 'alert').and.returnValue(1);
    let benRegID = 123;
    component.sendToNurseWindow(true, benRegID);
    fixture.autoDetectChanges();
    expect(spier).toHaveBeenCalledWith(res);
  })

  it('should not call registrarService.patientRevisit if sendToNurseWindows doenst get user permission', () => {
    let res = 'sent to nurse window';
    let spier = spyOn(registrarService, 'patientRevisit').and.returnValue(Observable.of({ response: res }));
    let benRegID = 123;
    component.sendToNurseWindow(false, benRegID);
    fixture.autoDetectChanges();
    expect(spier).not.toHaveBeenCalled();
  })

  it('should  call beneficiaryDetailsService.getBeneficiaryImage if patientImageView is called', () => {
    let spier = spyOn(beneficiaryService, 'getBeneficiaryImage').and.returnValue(Observable.of(1));
    let benRegID = 123;
    component.patientImageView(benRegID);
    fixture.autoDetectChanges();
    expect(spier).toHaveBeenCalledWith(benRegID);
  })

  it('should  not call beneficiaryDetailsService.getBeneficiaryImage if patientImageView is called with benregID', () => {
    let spier = spyOn(beneficiaryService, 'getBeneficiaryImage').and.returnValue(Observable.of(1));
    component.patientImageView('');
    fixture.autoDetectChanges();
    expect(spier).not.toHaveBeenCalled();
  })

  it('should  call viewImage of Camera when getBeneficiaryImage is called on patientImageView ', () => {
    let imageData = 'wdvsghbfhf3t463yhb';
    let spi = spyOn(beneficiaryService, 'getBeneficiaryImage').and.returnValue(Observable.of(imageData));
    let spier = spyOn(camera, 'viewImage').and.callFake(() => { });
    let benRegID = 123;
    component.patientImageView(benRegID);
    fixture.autoDetectChanges();
    expect(spier).toHaveBeenCalled();
  })

  it('should  call viewImage of Camera with data which getBeneficiaryImage returned on patientImageView call', () => {
    let imageData = 'wdvsghbfhf3t463yhb';
    let spi = spyOn(beneficiaryService, 'getBeneficiaryImage').and.returnValue(Observable.of({benImage:imageData}));
    let spier = spyOn(camera, 'viewImage').and.callFake(() => {});
    let benRegID = 123;
    component.patientImageView(benRegID);
    fixture.autoDetectChanges();
    expect(spier).toHaveBeenCalledWith(imageData);
  })






});
