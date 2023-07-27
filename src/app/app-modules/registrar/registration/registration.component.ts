/* 
* AMRIT – Accessible Medical Records via Integrated Technology 
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


import { RegisterDemographicDetailsComponent } from './register-demographic-details/register-demographic-details.component';
import {
  Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewChecked,
  OnDestroy
} from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Params, RouterModule, Routes, Router, ActivatedRoute } from '@angular/router'
import { HealthIdValidateComponent, RegisterOtherDetailsComponent } from './register-other-details/register-other-details.component';
import { RegisterPersonalDetailsComponent } from './register-personal-details/register-personal-details.component';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { ConfirmationService } from '../../core/services/confirmation.service';
import { CameraService } from '../../core/services/camera.service';
import { RegistrarService } from '../shared/services/registrar.service';
import { RegistrationUtils } from '../shared/utility/registration-utility';

import { CanComponentDeactivate } from '../../core/services/can-deactivate-guard.service';

import { Observable } from 'rxjs/Observable'
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { HealthIdOtpGenerationComponent } from '../health-id-otp-generation/health-id-otp-generation.component';
import { HealthIdDisplayModalComponent } from 'app/app-modules/core/components/health-id-display-modal/health-id-display-modal.component';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, AfterViewChecked, OnDestroy, CanComponentDeactivate {
  @ViewChild(RegisterOtherDetailsComponent)
  private otherDetails: RegisterOtherDetailsComponent;

  @ViewChild(RegisterPersonalDetailsComponent)
  private personalDetails: RegisterPersonalDetailsComponent;

  @ViewChild(RegisterDemographicDetailsComponent)
  private demographicDetails: RegisterDemographicDetailsComponent;

  utils = new RegistrationUtils(this.fb);

  beneficiaryRegistrationForm: FormGroup;
  patientRevisit: Boolean;
  postButtonText: any;
  revisitData: any;
  revisitDataSubscription: any;
  emergencyRegistration: Boolean = false;
  step = 0;
  currentLanguageSet:any;

  // Health ID card
  genrateHealthIDCard: boolean = false;

  // for ID Manpulation
  masterData: any;
  masterDataSubscription: any;
  govIDMaster: any;
  otherGovIDMaster: any;
  // ENDS for ID Manpulation

  country = { id: 1, Name: 'India' }
  disableGenerateOTP: boolean=false;

  constructor(
    private confirmationService: ConfirmationService,
    private registrarService: RegistrarService,
    private fb: FormBuilder,
    private cameraService: CameraService,
    private router: Router,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    public httpServiceService: HttpServiceService,
    private dialog: MdDialog,
  ) { }

  ngOnInit() {
    this.registrarService.clearHealthIdMobVerification();
    // Initialize Registration Form
    this.beneficiaryRegistrationForm = new RegistrationUtils(this.fb).createRegistrationDetailsForm();
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.currentLanguageSet = response);
    // Call For MAster Data which will be loaded in Sub Components
    this.callMasterDataObservable();
 
    // Decide To Go for Submit or Update Mode
    this.checkPatientRevisit();

    this.registrarService.healthIdMobVerificationCheck$.subscribe(responseMob => {
      if(responseMob !== null && responseMob !== undefined) {
        this.setHealthIdAfterGeneration(responseMob);
      }
     
    });

    
//  this.registrarService.GenerateOTP$.subscribe(response => (response == true ? this.disableGenerateOTP = true : this.disableGenerateOTP = false));
 

  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    this.resetBeneficiaryForm();
    if (this.patientRevisit && this.revisitDataSubscription) {
      this.revisitDataSubscription.unsubscribe();
      this.registrarService.clearBeneficiaryEditDetails();
    }
  }

  setHealthIdAfterGeneration(result) {
    (<FormGroup>this.beneficiaryRegistrationForm.controls['otherDetailsForm']).patchValue({ healthId: result.healthId });
    (<FormGroup>this.beneficiaryRegistrationForm.controls['otherDetailsForm']).patchValue({ healthIdNumber: result.healthIdNumber });

    (<FormGroup>this.beneficiaryRegistrationForm.controls['otherDetailsForm']).controls['healthId'].disable();
    // (<FormGroup>this.beneficiaryRegistrationForm.controls['otherDetailsForm']).controls['healthIdNumber'].disable();
    this.disableGenerateOTP=true;
  }

  /**
   * Accordion Expand
   */
  setStep(index: number) {
    this.step = index;
  }

  /**
  *
  * Check Patient Revisit
  */
  checkPatientRevisit() {
    if (this.route.snapshot.params['beneficiaryID'] !== undefined) {
      this.patientRevisit = true;
      this.callBeneficiaryDataObservable(this.route.snapshot.params['beneficiaryID']);
    } else if (this.route.snapshot.params['beneficiaryID'] === undefined) {
      this.patientRevisit = false;
    }
    // Call This Method To Check for Text to be displayed on Post Form Button
    // this.decidePostButtonText();
  }

  /**
  *
  * Decide Post Button Text, Submit or Update
  */
  // decidePostButtonText() {
  //   this.postButtonText = this.patientRevisit ? 'Update' : 'Submit';
  // }

  /**
  *
  * Call Master Data Observable
  */
  callMasterDataObservable() {
    this.registrarService.getRegistrationMaster(1);
    this.loadMasterDataObservable();
  }

  /**
   *
   * Load Master Data of Id Cards as Observable
   */
  loadMasterDataObservable() {
    this.masterDataSubscription = this.registrarService.registrationMasterDetails$
      .subscribe(res => {
        console.log('Registrar master data', res);
        if (res != null) {
          this.masterData = Object.assign({}, res);
          this.govIDMaster = Object.assign({}, res);
          this.otherGovIDMaster = Object.assign({}, res);
          this.govIDMaster = this.govIDMaster.govIdEntityMaster;
          this.otherGovIDMaster = this.otherGovIDMaster.otherGovIdEntityMaster;
        }
      })
  }

  /**
  *
  * Loading Data of Beneficiary as Observable
  */
  callBeneficiaryDataObservable(benID) {
    // this.registrarService.getPatientDataAsObservable(benRegID);
    this.revisitDataSubscription = this.registrarService.beneficiaryEditDetails$
      .subscribe(res => {
        console.log(JSON.stringify(res, null, 4), 'subject data here...')
        if (res != null && benID == res.beneficiaryID) {
          this.revisitData = Object.assign({}, res);
        } else {
          this.redirectToSearch();
        }
      })
  }

  /**
  *
  * Redirect to Search
  */
  redirectToSearch() {
    setTimeout(() => this.confirmationService.alert(this.currentLanguageSet.alerts.info.issueInFetchDetails, 'info'))
    this.router.navigate(['/registrar/search/']);
  }

  /**
  *
  * Reset Registration Form
  */
  resetBeneficiaryForm() {
    this.beneficiaryRegistrationForm.reset();
    this.ageUnitReset();
    this.govIDReset();
    this.otherDetails.resetForm();
    this.demographicDetails.setDemographicDefaults();
    this.personalDetails.setPhoneSelectionEnabledByDefault();
    this.personalDetails.enableMaritalStatus = false;
    this.personalDetails.enableMarriageDetails = false;
    this.setStep(0); //open personal details in accordian
    (<FormGroup>this.beneficiaryRegistrationForm.controls['otherDetailsForm']).controls['healthId'].enable();
    this.disableGenerateOTP = false;
    this.otherDetails.setcheckBoxEnabledByDefault();
  }

  confirmFormReset(reset) {
    // let resetflag = reset;
    if (this.beneficiaryRegistrationForm.dirty) {
      if (reset == true) {
        this.confirmationService.confirm('warn', this.currentLanguageSet.alerts.info.resetDetails)
          .subscribe((res) => {
            if (res) {
              this.resetBeneficiaryForm();
            }
          })
      } else {
        if (reset == false) {
          this.confirmationService.confirm(`info`,this.currentLanguageSet.alerts.info.navigateFurtherAlert, 'Yes', 'No').subscribe((res) => {
            if (res) {
              this.router.navigate(['/registrar/search/']);
            }
          });
        }
      }
    } else {
      if (reset == false) {
        this.router.navigate(['/registrar/search/']);
      }
    }
  }

  /**
  *
  * Gov ID Reset to 0
  */
  govIDReset() {
    const otherDetailsForm = (<FormGroup>this.beneficiaryRegistrationForm.controls['otherDetailsForm']);
    //  govID.pop();
    const govID = <FormArray>otherDetailsForm.controls['govID'];
    const otherGovID = <FormArray>otherDetailsForm.controls['otherGovID'];
    if(govID !== undefined && govID !== null && govID.length > 0) {
    for(let i = govID.length - 1; i > 0; i--) {
      govID.removeAt(i);
    }
  }
  if(otherGovID !== undefined && otherGovID !== null && otherGovID.length > 0) {
    for(let i = otherGovID.length - 1; i > 0; i--) {
      otherGovID.removeAt(i);
    }
  }
    // otherDetailsForm.setControl('govID', new FormArray([this.utils.initGovID()]));
    // otherDetailsForm.setControl('otherGovID', new FormArray([this.utils.initGovID()]));

  
 }

  /**
  *
  * Cancel Updation, Go Back to Search
  */
  cancelBeneficiaryChanges() {
    this.confirmationService.confirm('info',this.currentLanguageSet.alerts.info.unsavedChanges)
      .subscribe((res) => {
        if (res) {
          this.router.navigate(['/registrar/search/']);
        }
      })
  }

  /**
  *
  * Resetting Age Unit to 'Years' by default
  */
  ageUnitReset() {
    (<FormGroup>this.beneficiaryRegistrationForm.controls['personalDetailsForm']).patchValue({ ageUnit: 'Years' });
  }


  /**
  *
  * Validate component values
  */

  checkValids(registrationForm) {
    let valid = false;
    const required = [];



    const personalForm = <FormGroup>registrationForm.controls['personalDetailsForm'];
    const demographicsForm = <FormGroup>registrationForm.controls['demographicDetailsForm'];
    const otherDetailsForm = <FormGroup>registrationForm.controls['otherDetailsForm'];

    console.log(personalForm, 'personalForm');
    // const govtIds = otherDetailsForm.value.govID;
    // let idsCount = 0;
    // const otherGovtIds = otherDetailsForm.value.otherGovID;
    // let otherIdsCount = 0;

    Object.keys(personalForm.controls)
      .forEach(control => {
        // console.log(control, 'control')
        // console.log(personalForm.controls[control].valid, 'valid hai');
        if (!personalForm.controls[control].valid) {
          if (control == 'maritalStatus') {
            if (personalForm.value.age >= 12 && personalForm.value.ageUnit == 'Years') {
              required.push(this.currentLanguageSet.ro.personalInfo.maritalStatus)
            }
          } else if (control == 'firstName') {
            required.push(this.currentLanguageSet.ro.personalInfo.firstName)
          } else if (control == 'gender') {
            required.push(this.currentLanguageSet.ro.personalInfo.gender)
          } else if (control == 'phoneNo') {
            required.push(this.currentLanguageSet.bendetails.phoneNo)
          } else if (control == 'age') {
            required.push(this.currentLanguageSet.bendetails.age)
            // required.push(this.currentLanguageSet.ro.personalInfo.firstName)
          } else if (control == 'phoneNo') {
            required.push(this.currentLanguageSet.bendetails.phoneNo)
          }
          
          else if (control == 'ageAtMarriage') {
            if (personalForm.value.age >= 12 && personalForm.value.ageUnit == 'Years' && personalForm.value.maritalStatus != 1 && personalForm.value.maritalStatus != 7)
              required.push(this.currentLanguageSet.ro.personalInfo.ageAtMarriage)
          }
          else if (control == 'spouseName') {
            if (personalForm.value.age >= 12 && personalForm.value.ageUnit == 'Years' && personalForm.value.maritalStatus == 2)
             required.push(this.currentLanguageSet.ro.personalInfo.spouseName)
          }

          else if (control == 'occupationOther') { required.push(this.currentLanguageSet.ro.personalInfo.otherOccupation) }
          else if (control == 'educationQualification') {
            if (personalForm.value.literacyStatus && personalForm.value.literacyStatus == 'Literate')
              required.push(this.currentLanguageSet.ro.personalInfo.educationalQualification)
          }
          // else { required.push(control) }
        }
      })
    Object.keys(demographicsForm.controls)
      .forEach(control => {
        // console.log(control, 'control')
        // console.log(personalForm.controls[control].valid, 'valid hai');
        if (!demographicsForm.controls[control].valid) {
          if (control == 'stateID') { required.push(this.currentLanguageSet.ro.locInfo.state); }
          else if (control == 'districtID') { required.push(this.currentLanguageSet.ro.locInfo.district_Town_City); }
          else if (control == 'blockID') { required.push(this.currentLanguageSet.ro.locInfo.taluk); }
          else if (control == 'villageID') { required.push(this.currentLanguageSet.ro.locInfo.street); }
          else if (control == 'parkingPlace') { /* required.push('Parking Place'); */ }
          else if (control == 'zoneID') {/*  required.push('Zone'); */ }
          else if (control == 'servicePoint') { /* required.push('Service Point'); */ }
          // else { required.push(control) }
        }
      })
    let govCount = 0;
    Object.keys(otherDetailsForm.controls)
      .forEach(control => {
        if (!otherDetailsForm.controls[control].valid) {
          if (control == 'emailID') { required.push(this.currentLanguageSet.emailAddress); }
          else if (control == 'blockID') { required.push(this.currentLanguageSet.block); }
          else if (control == 'religionOther') { required.push(this.currentLanguageSet.otherReligionName); }
          else if (control == 'govID') { govCount++; }
          else if (control == 'otherGovID') { required.push(this.currentLanguageSet.otherGovtID); }
          else if (control == 'fatherName') {required.push(this.currentLanguageSet.ro.otherInfo.fName);}
          else if (control == 'community') {required.push(this.currentLanguageSet.ro.otherInfo.community);}
        }
      })
    otherDetailsForm.value.govID.forEach((element) => {
      if (element.idValue && element.type !== 3 && element.idValue.length < element.maxLength) {
        govCount++;
      }
      if (element.idValue && element.type === 3 && element.idValue.length < element.minLength) {
        govCount++;
      }
    })
    if (govCount) {
      required.push(this.currentLanguageSet.govID);
    }
    
    if (required.length) {
      this.confirmationService.notify(this.currentLanguageSet.alerts.info.mandatoryFields, required);
      return valid;
    } else {
      return valid = true;
    }


  }

  checkgenerateOtpValids(registrationForm) {
    let valid = false;
    const required = [];

    let c=0;
    let cflag=false;
    const personalForm = <FormGroup>registrationForm.controls['personalDetailsForm'];
    const demographicsForm = <FormGroup>registrationForm.controls['demographicDetailsForm'];
    const otherDetailsForm = <FormGroup>registrationForm.controls['otherDetailsForm'];

    console.log(personalForm, 'personalForm');
    Object.keys(personalForm.controls)
      .forEach(control => {
       
        if (!personalForm.controls[control].valid) {
         
          if (control === 'firstName' && otherDetailsForm.controls['healthIdMode'].value !==undefined && otherDetailsForm.controls['healthIdMode'].value === 'MOBILE') {
            required.push(this.currentLanguageSet.ro.personalInfo.firstName)
          
        } else if (control === 'gender' && otherDetailsForm.controls['healthIdMode'].value !==undefined && otherDetailsForm.controls['healthIdMode'].value === 'MOBILE') {
          required.push(this.currentLanguageSet.bendetails.gender)
        }
       
        else if (control === 'age' && otherDetailsForm.controls['healthIdMode'].value !==undefined && otherDetailsForm.controls['healthIdMode'].value === 'MOBILE') {
          required.push(this.currentLanguageSet.bendetails.age)
        }
         
        }
        let authMode=null;
        if ((otherDetailsForm.controls['healthIdMode'].valid) && otherDetailsForm.controls['healthIdMode'].value !=undefined && otherDetailsForm.controls['healthIdMode'].value != null || otherDetailsForm.controls['healthIdMode'].value != "")
        authMode=otherDetailsForm.controls['healthIdMode'].value;
        if (control === 'phoneNo' && personalForm.controls[control].value == null
         && authMode === 'MOBILE') {          
    
          required.push(this.currentLanguageSet.bendetails.phoneNo)
        }
      })
      if ((!personalForm.controls['lastName'].valid) || personalForm.controls['lastName'].value == null || personalForm.controls['lastName'].value == "" ) {
        if(otherDetailsForm.controls['healthIdMode'].value !=undefined && otherDetailsForm.controls['healthIdMode'].value === 'MOBILE')

        required.push(this.currentLanguageSet.ro.personalInfo.lastName)
      }
    
      if ((!otherDetailsForm.controls['healthId'].valid)||otherDetailsForm.controls['healthId'].value == null || otherDetailsForm.controls['healthId'].value == "") {
        required.push(this.currentLanguageSet.aBHA)
      }
      if(otherDetailsForm.controls['healthId'].value != "" && otherDetailsForm.controls['healthId'].value != undefined
      && otherDetailsForm.controls['healthId'].value != null)
      {
        let hid=otherDetailsForm.controls['healthId'].value;
        for(var i=0;i<hid.length;i++)
        {
          if(!this.is_numeric(hid.charAt(i)))
        {
          if(!this.isLetter(hid.charAt(i)))
          {
            if(hid.charAt(i)=='.') {
            c++;
            if(i <= 3) {
              cflag=true;
              break;
            }
            }
            else
            {
              cflag=true;
              break;
            }
          }
        }
         
        }
        if((c>1 || c==0) ||cflag) {
        this.confirmationService.alert(this.currentLanguageSet.validHealthIDMessage, 'error');
        return false;
        }
      }
      if ((!otherDetailsForm.controls['healthIdMode'].valid)||otherDetailsForm.controls['healthIdMode'].value == null || otherDetailsForm.controls['healthIdMode'].value == "") {
        required.push(this.currentLanguageSet.aBHAGenerationMode)
      }    
      if (otherDetailsForm.controls['healthIdMode'].value === 'AADHAR') {
        let govtypeCount = 0;
        let aadharCount = 0;
        otherDetailsForm.controls['govID'].value
          .forEach(control => {
            if (control.type == null && aadharCount == 0) {
              required.push(this.currentLanguageSet.aadhar);                    
            }
            if(control.type == 1){
              aadharCount++;
            }
            if (control.type != null){
              govtypeCount++;
            }     
          });
          if(aadharCount == 0 && !required.includes('Aadhar'))
            required.push(this.currentLanguageSet.aadhar);
        if (govtypeCount) {
          let govAadharCount = 0;
          otherDetailsForm.value.govID.forEach((element) => {
            if (element.idValue == null) {
              govAadharCount++;
            }
            else if (element.idValue && element.idValue.length < element.maxLength) {
              govAadharCount++;
            }
          })
          if (govAadharCount) {
            required.push(this.currentLanguageSet.govID);
          }
        }
      }
    // otherDetailsForm.value.govID.forEach((element) => {
    //   if (element.idValue && element.idValue.length < element.maxLength) {
    //     govCount++;
    //   }
    // })
    // if (govCount) {
    //   required.push('Gov ID');
    // }


    if (required.length) {
      this.confirmationService.notify(this.currentLanguageSet.alerts.info.mandatoryFields, required);
      return valid;
    } else {
      if(c<=1)
      return valid = true;
    }


  }

   isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
  }
  is_numeric(str){
    return /^\d+$/.test(str);
  }
  /**
  *
  * Post Form Button Called, Decide whether to Submit or Update
  */
  postButtonCall() {
    const valid = this.checkValids(this.beneficiaryRegistrationForm);

    if (valid && this.checkValidHealthID(null)) {
        if (this.patientRevisit) { this.updateBeneficiarynPassToNurse(); } else
          if (!this.patientRevisit) { this.submitBeneficiaryDetails(); }
    }
  }
  checkValidHealthID(type) {
    const otherDetailsForm = <FormGroup>this.beneficiaryRegistrationForm.controls['otherDetailsForm'];
    let healthid = otherDetailsForm.controls['healthId'].value;
    let healthIdNumber =  otherDetailsForm.controls['healthIdNumber'].value;
    if (type) {
      if (healthid || healthIdNumber)
        if (!this.disableGenerateOTP)
          return false;
        else
          return true;
      else
        return false;
    }
    else {
      if (healthid) {
        if (!this.disableGenerateOTP) {
          this.confirmationService.alert(this.currentLanguageSet.validHealthIDMessage, 'info');
          otherDetailsForm.controls['healthId'].patchValue(null);
          return false;
        }
        else {
          return true;
        }
      }
      else {
        return true;
      }
    }
  }

  generateABHACard() {
    // this.getOTP();
    let validValue = false;
    validValue = this.checkgenerateOtpValids(this.beneficiaryRegistrationForm);

    if (validValue === true) {
      this.generateHealthIDCard();
      this.getOTP();
      
    }
    // if (this.patientRevisit) { this.getOTP(); } else
    //     if (!this.patientRevisit) { this.getOTP(); }
  }

  generateHealthIDCard() {
    const id = {
      "healthId"     : this.beneficiaryRegistrationForm.controls['otherDetailsForm'].value.healthId,
      "healthIdMode" : this.beneficiaryRegistrationForm.controls['otherDetailsForm'].value.healthIdMode
    }
    this.registrarService.passIDsToFetchOtp(id);
  }




  /**
   *
  * Submit Registration Form
  */
  submitBeneficiaryDetails() {
    const newDate = this.dateFormatChange();
    const valueToSend = this.beneficiaryRegistrationForm.value;
    valueToSend.personalDetailsForm.dob = newDate;
    const iEMRForm = this.iEMRForm();
    const phoneMaps = iEMRForm.benPhoneMaps;
    const otherDetailsForm = <FormGroup>this.beneficiaryRegistrationForm.controls['otherDetailsForm'];

    // createdBy, vanID, servicePointID
    let servicePointDetails = JSON.parse(localStorage.getItem("serviceLineDetails"));
    iEMRForm['vanID'] = servicePointDetails.vanID;
    iEMRForm['parkingPlaceID'] = servicePointDetails.parkingPlaceID;
    iEMRForm['createdBy'] = localStorage.getItem('userName');
    phoneMaps[0]['vanID'] = servicePointDetails.vanID;
    phoneMaps[0]['parkingPlaceID'] = servicePointDetails.parkingPlaceID;
    phoneMaps[0]['createdBy'] = localStorage.getItem('userName');

    console.log(JSON.stringify(iEMRForm, null, 4), ' biEMRFOrm');
    this.registrarService.submitBeneficiary(iEMRForm)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.confirmationService.alert(res.data.response, 'success');
          if (this.checkValidHealthID("save")){
          var txt = res.data.response;
          var numb = txt.replace(/\D/g,'');
          let reqObj={
            "beneficiaryRegID": null,
            "beneficiaryID": numb,
            "healthId": otherDetailsForm.controls['healthId'].value,
            "healthIdNumber": otherDetailsForm.controls['healthIdNumber'].value,
            'providerServiceMapId': parseInt(localStorage.getItem('providerServiceID')),
            "authenticationMode":otherDetailsForm.controls['healthIdMode'].value,
            "createdBy": localStorage.getItem('userName')
          }
          if((otherDetailsForm.controls['healthId'].value !== undefined && otherDetailsForm.controls['healthId'].value !== null) ||
          (otherDetailsForm.controls['healthIdNumber'].value !== undefined && otherDetailsForm.controls['healthIdNumber'].value !== null))
          {
          this.registrarService.mapHealthId(reqObj)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          
        } else {
          this.confirmationService.alert(this.currentLanguageSet.alerts.info.issueInSavngData, 'error');
        }
      });
    }
     }
          this.resetBeneficiaryForm();
          this.disableGenerateOTP = false;
        } else {
          this.confirmationService.alert(this.currentLanguageSet.alerts.info.issueInSavngData, 'error');
        }
      });
  }

  /**
  *
  * Update Beneficiary Form & Move the Beneficiary To Nurse Worklist
  */

  updateBeneficiarynPassToNurse(passToNurse = true) {
    const iEMRForm = this.updateBenDataManipulation();
    iEMRForm['passToNurse'] = passToNurse;
    console.log(JSON.stringify(iEMRForm, null, 4), 'iEMRFOrm');
    const otherDetailsForm = <FormGroup>this.beneficiaryRegistrationForm.controls['otherDetailsForm'];
    const personalForm = Object.assign({}, this.beneficiaryRegistrationForm.value.personalDetailsForm);

    this.registrarService.updateBeneficiary(iEMRForm).subscribe((res) => {
      if (res && res.statusCode == 200) {
        this.confirmationService.alert(res.data.response, 'success');
        let reqObj={
          "beneficiaryRegID": null,
          "beneficiaryID": personalForm.beneficiaryID,
          "healthId": otherDetailsForm.controls['healthId'].value,
          "healthIdNumber": otherDetailsForm.controls['healthIdNumber'].value,
          "authenticationMode":otherDetailsForm.controls['healthIdMode'].value,
          'providerServiceMapId': parseInt(localStorage.getItem('providerServiceID')),
          "createdBy": localStorage.getItem('userName')
        }

        if((otherDetailsForm.controls['healthId'].value !== undefined && otherDetailsForm.controls['healthId'].value !== null) ||
        (otherDetailsForm.controls['healthIdNumber'].value !== undefined && otherDetailsForm.controls['healthIdNumber'].value !== null))
          {
          this.registrarService.mapHealthId(reqObj)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          
        } else {
          this.confirmationService.alert(this.currentLanguageSet.alerts.info.issueInSavngData, 'error');
        }
      });
    }
        this.router.navigate(['/registrar/search/']);
      } else {
        this.confirmationService.alert(res.errorMessage, 'error');
      }
    });
  }

  /**
  *
  * Update Beneficiary Form & Don't Move the Beneficiary To Nurse Worklist
  */
  updateBeneficiaryDetails(passToNurse = false) {

    const valid = this.checkValids(this.beneficiaryRegistrationForm);
    const otherDetailsForm = <FormGroup>this.beneficiaryRegistrationForm.controls['otherDetailsForm'];
    const personalForm = Object.assign({}, this.beneficiaryRegistrationForm.value.personalDetailsForm);
    if (valid && this.checkValidHealthID(null)) {
      const iEMRForm = this.updateBenDataManipulation();
      iEMRForm['passToNurse'] = passToNurse;

      console.log(JSON.stringify(iEMRForm, null, 4), 'iEMRFOrm');
      this.registrarService.updateBeneficiary(iEMRForm).subscribe((res) => {
        if (res && res.statusCode == 200) {
          this.confirmationService.alert(res.data.response, 'success');
          // var txt = res.data.response;
          // var numb = txt.replace(/\D/g,'');
          if (this.checkValidHealthID("save")){
          let reqObj={
            "beneficiaryRegID": null,
            "beneficiaryID": personalForm.beneficiaryID,
            "healthId": otherDetailsForm.controls['healthId'].value,
            "healthIdNumber": otherDetailsForm.controls['healthIdNumber'].value,
            "authenticationMode":otherDetailsForm.controls['healthIdMode'].value,
            'providerServiceMapId': parseInt(localStorage.getItem('providerServiceID')),
            "createdBy": localStorage.getItem('userName')
          }
          if((otherDetailsForm.controls['healthId'].value !== undefined && otherDetailsForm.controls['healthId'].value !== null) ||
          (otherDetailsForm.controls['healthIdNumber'].value !== undefined && otherDetailsForm.controls['healthIdNumber'].value !== null))
          {
          this.registrarService.mapHealthId(reqObj)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          
        } else {
          this.confirmationService.alert(this.currentLanguageSet.alerts.info.issueInSavngData, 'error');
        }
      });
    }
    }
          this.router.navigate(['/registrar/search/']);

        } else {
          this.confirmationService.alert(res.errorMessage, 'error');
        }
      });
    }

  }

  /**
   * creating model for update or save for edit
   */
  updateBenDataManipulation() {
    let newDate = this.dateFormatChange();
    let valueToSend = this.beneficiaryRegistrationForm.value;
    valueToSend.personalDetailsForm.dob = newDate;
    const iEMRForm = this.iEMRFormUpdate();
    const phoneMaps = iEMRForm.benPhoneMaps;

    let servicePointDetails = JSON.parse(localStorage.getItem("serviceLineDetails"));

    iEMRForm['vanID'] = servicePointDetails.vanID;
    iEMRForm['parkingPlaceID'] = servicePointDetails.parkingPlaceID;
    iEMRForm['createdBy'] = localStorage.getItem('userName');
    phoneMaps[0]['vanID'] = servicePointDetails.vanID;
    phoneMaps[0]['parkingPlaceID'] = servicePointDetails.parkingPlaceID;
    phoneMaps[0]['modifiedBy'] = localStorage.getItem('userName');
    console.log(JSON.stringify(iEMRForm, null, 4), 'iEMRFOrmupdate');
    return iEMRForm;
  }

  /**
   * Update object for iEMR
   */

  iEMRFormUpdate() {
    const personalForm = Object.assign({}, this.beneficiaryRegistrationForm.value.personalDetailsForm);
    const demographicsForm = Object.assign({}, this.beneficiaryRegistrationForm.value.demographicDetailsForm);
    const othersForm = Object.assign({}, this.beneficiaryRegistrationForm.value.otherDetailsForm);
    const removedIDs = this.otherDetails.getRemovedIDs();
    const iEMRids = this.iEMRidsUpdate(othersForm.govID, othersForm.otherGovID, removedIDs.removedGovIDs, removedIDs.removedOtherGovIDs);
    const finalForm = {
      'beneficiaryRegID': personalForm.beneficiaryRegID,
      'i_bendemographics': {
        'beneficiaryRegID': personalForm.beneficiaryRegID,
        'educationID': personalForm.educationQualification || undefined,
        'educationName': personalForm.educationQualificationName || undefined,
        'i_beneficiaryeducation': {
          'educationID': personalForm.educationQualification || undefined,
          'educationType': personalForm.educationQualificationName || undefined
        },
        'occupationID': personalForm.occupation || undefined,
        'occupationName': personalForm.occupationOther || undefined,
        'communityID': othersForm.community || undefined,
        'communityName': othersForm.communityName || undefined,
        'm_community': {
          'communityID': othersForm.community || undefined,
          'communityType': othersForm.communityName || undefined
        },
        'religionID': othersForm.religion || undefined,
        'religionName': othersForm.religionOther || undefined,
        'addressLine1': demographicsForm.addressLine1 || undefined,
        'addressLine2': demographicsForm.addressLine2 || undefined,
        'addressLine3': demographicsForm.addressLine3 || undefined,
        'stateID': demographicsForm.stateID,
        'stateName': demographicsForm.stateName,
        'm_state': {
          'stateID': demographicsForm.stateID,
          'stateName': demographicsForm.stateName,
          'stateCode': demographicsForm.stateCode,
          'countryID': demographicsForm.countryID
        },
        'districtID': demographicsForm.districtID,
        'districtName': demographicsForm.districtName,
        'm_district': {
          'districtID': demographicsForm.districtID,
          'stateID': demographicsForm.stateID,
          'districtName': demographicsForm.districtName
        },
        'blockID': demographicsForm.blockID,
        'blockName': demographicsForm.blockName,
        'm_districtblock': {
          'blockID': demographicsForm.blockID,
          'districtID': demographicsForm.districtID,
          'blockName': demographicsForm.blockName,
          'stateID': demographicsForm.stateID
        },
        'districtBranchID': demographicsForm.villageID,
        'districtBranchName': demographicsForm.villageName,
        'm_districtbranchmapping': {
          'districtBranchID': demographicsForm.villageID,
          'blockID': demographicsForm.blockID,
          'villageName': demographicsForm.villageName
        },
        'pinCode': demographicsForm.pincode || undefined,
        'createdBy': localStorage.getItem('userName'),
        'zoneID': demographicsForm.zoneID,
        'zoneName': demographicsForm.zoneName,
        'parkingPlaceID': demographicsForm.parkingPlace,
        'parkingPlaceName': demographicsForm.parkingPlaceName,
        'servicePointID': demographicsForm.servicePoint,
        'servicePointName': demographicsForm.servicePointName,
        'habitation': demographicsForm.habitation || undefined,
        'incomeStatusID': personalForm.income || undefined ,
        'incomeStatus': personalForm.incomeName || undefined,
        'incomeStatusName': personalForm.incomeName || undefined
      },
      'benPhoneMaps': [
        {
          'benPhMapID': this.getBenPhMapID(personalForm.benPhMapID),
          'benificiaryRegID': personalForm.beneficiaryRegID,
          'parentBenRegID': personalForm.parentRegID,
          'benRelationshipID': personalForm.parentRelation,
          'benRelationshipType': {
            'benRelationshipID': personalForm.parentRelation,
            'benRelationshipType': this.getRelationTypeForUpdate(personalForm.parentRelation, personalForm.benRelationshipType),
          },
          'phoneNo': personalForm.phoneNo
        }
      ],
      'beneficiaryID': personalForm.beneficiaryID,
      'm_title': {},
      'firstName': personalForm.firstName,
      'lastName': personalForm.lastName || undefined,
      'genderID': personalForm.gender,
      'm_gender': {
        'genderID': personalForm.gender,
        'genderName': personalForm.genderName
      },
      'maritalStatusID': personalForm.maritalStatus || undefined,
      'maritalStatus': {
        'maritalStatusID': personalForm.maritalStatus || undefined,
        'status': personalForm.maritalStatusName || undefined
      },
      'dOB': personalForm.dob,
      'fatherName': othersForm.fatherName || undefined,
      'spouseName': personalForm.spouseName || undefined,
      /*     'govtIdentityNo': '451328465465',
          'govtIdentityTypeID': 1,
          'govtIdentityType': {
              'govtIdentityTypeID': 1,
              'identityType': 'Aadhar',
              'isGovtID': true
          }, */
      'changeInSelfDetails': true,
      'changeInAddress': true,
      'changeInContacts': true,
      'changeInIdentities': true,
      'changeInOtherDetails': true,
      'changeInFamilyDetails': true,
      'changeInAssociations': true,
      'is1097': false,
      'createdBy': localStorage.getItem('userName'),
      // 'createdDate': '2018-04-27T14:37:15.000Z',
      'changeInBankDetails': true,
      'beneficiaryIdentities': iEMRids,
      // 'marriageDate': '2017-04-27T14:38:26.000Z',
      'ageAtMarriage': personalForm.ageAtMarriage || undefined,
      'literacyStatus': personalForm.literacyStatus || undefined,
      'motherName': othersForm.motherName || undefined,
      'email': othersForm.emailID || undefined,
      'bankName': othersForm.bankName || undefined,
      'branchName': othersForm.branchName || undefined,
      'ifscCode': othersForm.ifscCode || undefined,
      'accountNo': othersForm.accountNo || undefined,
      'benAccountID': personalForm.benAccountID,
      'benImage': personalForm.image,
      'changeInBenImage': personalForm.imageChangeFlag,
      'occupationId': personalForm.occupation || undefined,
      'occupation': personalForm.occupationOther || undefined,
      'incomeStatus': personalForm.incomeName || undefined,
      'religionId': othersForm.religion || undefined,
      'religion': othersForm.religionOther || undefined,
      'providerServiceMapId': localStorage.getItem('providerServiceID'),
      'providerServiceMapID': localStorage.getItem('providerServiceID'),
    }

    return finalForm;


  }

  getBenPhMapID(benPhMapID) {
    if (benPhMapID == "null") {
      return null;
    } else {
      return benPhMapID;
    }

  }
  getRelationTypeForUpdate(parentRelation, benRelationshipType) {
    if (parentRelation == 1) {
      return 'Self';
    } else if (parentRelation == 11) {
      return 'Other';
    } else {
      return null;
    }
  }

  iEMRidsUpdate(govID, otherGovID, removedGovID, removedOtherGovIDs) {

    const iEMRids = [];
    const govArr = [];
    const otherGovArr = [];
    console.log(this.govIDMaster, 'govMaster', this.otherGovIDMaster, 'otherGovMaster');
    this.govIDMaster.filter(function (item) {
      let i = govArr.findIndex(x => x.govtIdentityTypeID == item.govtIdentityTypeID);
      if (i <= -1) {
        govArr.push(item);
      }
      return null;
    });

    this.otherGovIDMaster.filter(function (item) {
      let j = otherGovArr.findIndex(x => x.govtIdentityTypeID == item.govtIdentityTypeID);
      if (j <= -1) {
        otherGovArr.push(item);
      }
      return null;
    });
    console.log(govArr, 'new', otherGovArr, 'nw');

    govID.forEach((gov) => {
      govArr.forEach((id) => {
        if (gov.type && gov.idValue && gov.type === id.govtIdentityTypeID && gov.deleted == false && gov.benIdentityId) {
          iEMRids.push(
            {
              govtIdentityType: {
                govtIdentityTypeID: gov.type,
                identityType: id.identityType,
                isGovtID: true
              },
              govtIdentityNo: gov.idValue,
              govtIdentityTypeID: gov.type,
              deleted: gov.deleted,
              benIdentityId: gov.benIdentityId || undefined,
              createdBy: localStorage.getItem('userName')
            }
          )
        }
      })
    });

    otherGovID.forEach((othergov) => {
      otherGovArr.forEach((id) => {
        if (othergov.type && othergov.idValue && othergov.deleted == false && othergov.benIdentityId) {
          if (othergov.type === id.govtIdentityTypeID) {
            iEMRids.push({
              govtIdentityType: {
                govtIdentityTypeID: othergov.type,
                identityType: id.identityType,
                isGovtID: false
              },
              govtIdentityNo: othergov.idValue,
              benIdentityId: othergov.benIdentityId || undefined,
              govtIdentityTypeID: othergov.type,
              deleted: othergov.deleted,
              createdBy: localStorage.getItem('userName')
            })
          }
        }
      })
    });

    removedGovID.forEach(element => {
      govArr.forEach((id) => {
        if (element.type === id.govtIdentityTypeID) {

          iEMRids.push({
            govtIdentityType: {
              govtIdentityTypeID: element.type,
              identityType: id.identityType,
              isGovtID: true
            },
            govtIdentityNo: element.idValue,
            govtIdentityTypeID: element.type,
            benIdentityId: element.benIdentityId,
            deleted: true,
            createdBy: element.createdBy
          })
        }
      })
    });

    removedOtherGovIDs.forEach(element => {
      otherGovArr.forEach((id) => {
        if (element.type === id.govtIdentityTypeID) {
          iEMRids.push({
            govtIdentityType: {
              govtIdentityTypeID: element.type,
              identityType: id.identityType,
              isGovtID: false
            },
            govtIdentityNo: element.idValue,
            govtIdentityTypeID: element.type,
            benIdentityId: element.benIdentityId,
            deleted: true,
            createdBy: element.createdBy
          })
        }
      });
    });


    govID.forEach((gov) => {
      govArr.forEach((id) => {
        if (gov.type && gov.idValue && gov.type === id.govtIdentityTypeID && !gov.deleted && !gov.benIdentityId) {
          iEMRids.push(
            {
              govtIdentityType: {
                govtIdentityTypeID: gov.type,
                identityType: id.identityType,
                isGovtID: true
              },
              govtIdentityNo: gov.idValue,
              govtIdentityTypeID: gov.type,
              deleted: false,
              benIdentityId: gov.benIdentityId || undefined,
              createdBy: localStorage.getItem('userName')
            }
          )
        }
      })
    });

    otherGovID.forEach((othergov) => {
      otherGovArr.forEach((id) => {
        if (othergov.type && othergov.idValue && !othergov.deleted && !othergov.benIdentityId) {
          if (othergov.type === id.govtIdentityTypeID) {
            iEMRids.push({
              govtIdentityType: {
                govtIdentityTypeID: othergov.type,
                identityType: id.identityType,
                isGovtID: false
              },
              govtIdentityNo: othergov.idValue,
              benIdentityId: othergov.benIdentityId || undefined,
              govtIdentityTypeID: othergov.type,
              deleted: false,
              createdBy: localStorage.getItem('userName')
            })
          }
        }
      })
    });

    console.log('before return', iEMRids);
    if (iEMRids.length) {
      return iEMRids;
    } else {
      return undefined;
    }
  }

  /**
   * Update object for GovtIDs
   */

  /**
  * change date format to ISO
  *
  */
  dateFormatChange() {
    const dob = new Date((<FormGroup>this.beneficiaryRegistrationForm.controls['personalDetailsForm']).value.dob);
    return dob.toISOString();
  }



  iEMRForm() {
    const personalForm = Object.assign({}, this.beneficiaryRegistrationForm.value.personalDetailsForm);
    const demographicsForm = Object.assign({}, this.beneficiaryRegistrationForm.value.demographicDetailsForm);
    const othersForm = Object.assign({}, this.beneficiaryRegistrationForm.value.otherDetailsForm);
    const iEMRids = this.iEMRids(othersForm.govID, othersForm.otherGovID);
    console.log(iEMRids, 'ids our');
    console.log(personalForm, demographicsForm, othersForm, 'forms');
    console.log('submiting form', this.beneficiaryRegistrationForm.value);
 
    const finalForm = {
      'firstName': personalForm.firstName,
      'lastName': personalForm.lastName,
      'dOB': personalForm.dob,
      'fatherName': othersForm.fatherName,
      'spouseName': personalForm.spouseName,
      'motherName': othersForm.motherName,
      'govtIdentityNo': null,
      'govtIdentityTypeID': null,
      'emergencyRegistration': false,
      'titleId': null,
      'benImage': personalForm.image,
      'bankName': othersForm.bankName,
      'branchName': othersForm.branchName,
      'ifscCode': othersForm.ifscCode,
      'accountNo': othersForm.accountNo,
      'maritalStatusID': personalForm.maritalStatus,
      'maritalStatusName': personalForm.maritalStatusName,
      'ageAtMarriage': personalForm.ageAtMarriage,
      'genderID': personalForm.gender,
      'genderName': personalForm.genderName,
      'literacyStatus': personalForm.literacyStatus,
      'email': othersForm.emailID,
      'providerServiceMapId': localStorage.getItem('providerServiceID'),
      'providerServiceMapID':localStorage.getItem('providerServiceID'),

      'i_bendemographics': {
        'incomeStatusID': personalForm.income,
        'incomeStatusName': personalForm.incomeName,
        'occupationID': personalForm.occupation,
        'occupationName': personalForm.occupationOther,
        'educationID': personalForm.educationQualification,
        'educationName': personalForm.educationQualificationName,
        'communityID': othersForm.community,
        'communityName': othersForm.communityName,
        'religionID': othersForm.religion,
        'religionName': othersForm.religionOther,
        'countryID': this.country.id,
        'countryName': this.country.Name,
        'stateID': demographicsForm.stateID,
        'stateName': demographicsForm.stateName,
        'districtID': demographicsForm.districtID,
        'districtName': demographicsForm.districtName,
        'blockID': demographicsForm.blockID,
        'blockName': demographicsForm.blockName,
        'districtBranchID': demographicsForm.villageID,
        'districtBranchName': demographicsForm.villageName,
        'zoneID': demographicsForm.zoneID,
        'zoneName': demographicsForm.zoneName,
        'parkingPlaceID': demographicsForm.parkingPlace,
        'parkingPlaceName': demographicsForm.parkingPlaceName,
        'servicePointID': demographicsForm.servicePoint,
        'servicePointName': demographicsForm.servicePointName,
        'habitation': demographicsForm.habitation,
        'pinCode': demographicsForm.pincode,
        'addressLine1': demographicsForm.addressLine1,
        'addressLine2': demographicsForm.addressLine2,
        'addressLine3': demographicsForm.addressLine3

      },
      'benPhoneMaps': [
        {
          'parentBenRegID': personalForm.parentRegID,
          'phoneNo': personalForm.phoneNo,
          'phoneTypeID': this.makePhoneTypeID(personalForm.phoneNo),
          'benRelationshipID': personalForm.parentRelation,
        }
      ],
      'beneficiaryIdentities': iEMRids
    }
    return finalForm;
  }

  makePhoneTypeID(phoneNo) {
    if (phoneNo) { return 1; } else { return null }
  }

  iEMRids(govID, otherGovID) {
    const iEMRids = [];

    govID.forEach((gov) => {
      this.govIDMaster.forEach((id) => {
        if (gov.type && gov.idValue) {
          if (gov.type === id.govtIdentityTypeID) {
            iEMRids.push({
              govtIdentityNo: gov.idValue,
              govtIdentityTypeID: gov.type,
              govtIdentityTypeName: id.identityType,
              identityType: 'National ID',
              issueDate: null,
              expiryDate: null,
              isVerified: null,
              identityFilePath: null,
              createdBy: localStorage.getItem('userName')
            })
          }
        }
      })
    });

    otherGovID.forEach((othergov) => {
      this.otherGovIDMaster.forEach((id) => {
        if (othergov.type && othergov.idValue) {
          if (othergov.type === id.govtIdentityTypeID) {
            iEMRids.push({
              govtIdentityNo: othergov.idValue,
              govtIdentityTypeID: othergov.type,
              govtIdentityTypeName: id.identityType,
              identityType: 'State ID',
              issueDate: null,
              expiryDate: null,
              isVerified: null,
              identityFilePath: null,
              createdBy: localStorage.getItem('userName')
            })
          }
        }
      })
    });
    console.log('before return', iEMRids);
    return iEMRids;
  }

  canDeactivate(): Observable<boolean> {
    console.log("deactivate called");
    if (this.beneficiaryRegistrationForm.dirty)
      return this.confirmationService.confirm(`info`, this.currentLanguageSet.alerts.info.navigateFurtherAlert, 'Yes', 'No');
    else
      return Observable.of(true);
  }

  getOTP() {
    const personalForm = <FormGroup>this.beneficiaryRegistrationForm.controls['personalDetailsForm'];
    const demographicsForm = <FormGroup>this.beneficiaryRegistrationForm.controls['demographicDetailsForm'];
    const otherDetailsForm = <FormGroup>this.beneficiaryRegistrationForm.controls['otherDetailsForm'];
    // let date= new Date(personalForm.controls['dob'].value);
    // personalForm.controls['dob'].value.Now.ToString("MM/dd/yyyy hh:mm:ss");
    var date = new Date(personalForm.controls['dob'].value),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  let newDate=[date.getFullYear(), mnth, day].join("-");
  var date1 = new Date(newDate);
  
  console.log("value1",demographicsForm.controls['addressLine3'].value)
  //combining address
  let addessValue=null;
if(demographicsForm.controls['addressLine2'].value==null && demographicsForm.controls['addressLine3'].value==null)
{
  addessValue=demographicsForm.controls['addressLine1'].value;
}
else if(demographicsForm.controls['addressLine2'].value==null)
{
  addessValue=demographicsForm.controls['addressLine1'].value + "|" + demographicsForm.controls['addressLine3'].value;
}
else  if(demographicsForm.controls['addressLine3'].value==null || demographicsForm.controls['addressLine3'].value==undefined || demographicsForm.controls['addressLine3'].value=="")
{
  addessValue=demographicsForm.controls['addressLine1'].value + "|" + demographicsForm.controls['addressLine2'].value;
}
else
{
  addessValue=demographicsForm.controls['addressLine1'].value + "|" + demographicsForm.controls['addressLine2'].value+ "|" + demographicsForm.controls['addressLine3'].value;
}
    if (otherDetailsForm.controls['healthIdMode'].value == 'AADHAR') {
      var aadharNumber = null;
      otherDetailsForm.value.govID.forEach((element) => {
        if (element.type == 1) {
          aadharNumber = element.idValue
        }
      })
    }

  
    console.log("date1",personalForm.controls['gender'].value);
    let dialogRef = this.dialog.open(HealthIdOtpGenerationComponent, {
      height: '250px',
      width: '420px',
      data: {
        "firstName": personalForm.controls['firstName'].value,
        "lastName": personalForm.controls['lastName'].value,
        "fullName": personalForm.controls['fullName'].value,
        "gender": (personalForm.controls['genderName'].value == "Female")? "F":(personalForm.controls['genderName'].value == "Male"?"M":"O"),
        "dayOfBirth": date1.getDate().toString(),
        "monthOfBirth": (date1.getMonth()+1).toString(),
        "yearOfBirth": date1.getFullYear().toString(),
        "mobileNumber": personalForm.controls['phoneNo'].value,
        "address": addessValue,
        "pincode": demographicsForm.controls['pincode'].value==null?0:demographicsForm.controls['pincode'].value,
        "email": otherDetailsForm.controls['emailID'].value,
        "healthId": otherDetailsForm.controls['healthId'].value,
        "healthIdMode":otherDetailsForm.controls['healthIdMode'].value,
        "aadharNumber":aadharNumber,
        "profilePhoto": personalForm.controls['image'].value
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('result', result)
      if (result) {
        (<FormGroup>this.beneficiaryRegistrationForm.controls['otherDetailsForm']).patchValue({ healthId: result.healthId });
        (<FormGroup>this.beneficiaryRegistrationForm.controls['otherDetailsForm']).patchValue({ healthIdNumber: result.healthIdNumber });

        (<FormGroup>this.beneficiaryRegistrationForm.controls['otherDetailsForm']).controls['healthId'].disable();
        // (<FormGroup>this.beneficiaryRegistrationForm.controls['otherDetailsForm']).controls['healthIdNumber'].disable();
        this.disableGenerateOTP=true;
      
      }
    
     
      

  })
  }

  viewHealthIdData() {
      let reqObj={
        "beneficiaryRegID": this.revisitData.beneficiaryRegID,
        "beneficiaryID": this.revisitData.beneficiaryID
      };
      this.registrarService.getHealthIdDetails(reqObj)
      .subscribe((res) => {
        if (res.statusCode == 200) {
           this.dialog.open(HealthIdDisplayModalComponent, {
    data: { 'dataList': res }
      
    });
  
        } else {
          this.confirmationService.alert(this.currentLanguageSet.issueInGettingBeneficiaryABHADetails, 'error');
        }
      }, err => {
              this.confirmationService.alert(this.currentLanguageSet.issueInGettingBeneficiaryABHADetails, 'error');
      
            })
  

    }

    disableGenerateHealthID(){
      this.disableGenerateOTP = true;
    }
    
    healthIdSearch(){
      let dialogRef = this.dialog.open(HealthIdValidateComponent, {
        height: '250px',
        width: '420px',
        disableClose: true,
        data: {
          "healthId": "NO",
          "generateHealthIDCard": this.genrateHealthIDCard
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('result', result)
        if (result) {
          if (result.clearHealthID === true) {
            (<FormGroup>this.beneficiaryRegistrationForm.controls['otherDetailsForm']).controls['healthId'].patchValue(null);
            (<FormGroup>this.beneficiaryRegistrationForm.controls['otherDetailsForm']).controls['healthIdMode'].patchValue(null);
          }
          else {
            (<FormGroup>this.beneficiaryRegistrationForm.controls['otherDetailsForm']).patchValue({ healthId: result.healthIdNumber });
            (<FormGroup>this.beneficiaryRegistrationForm.controls['otherDetailsForm']).patchValue({ healthIdMode: result.healthIdMode });
            (<FormGroup>this.beneficiaryRegistrationForm.controls['otherDetailsForm']).controls['healthId'].disable();
            (<FormGroup>this.beneficiaryRegistrationForm.controls['otherDetailsForm']).markAsDirty();
            this.registrarService.changePersonalDetailsData(result)
            // this.disableValidateHealthID = false;
            this.disableGenerateOTP = true;
            
          }
        }
      });
    }
  
    printHealthIDCard() {
      this.genrateHealthIDCard = true;
      this.healthIdSearch();
    }

    openHealthIDSearch() {
      this.genrateHealthIDCard = false;
      this.healthIdSearch();
    }
    
}
