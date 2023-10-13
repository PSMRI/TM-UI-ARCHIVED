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


import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  ViewChild,
  HostListener,
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormArray,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { ConfirmationService } from "../../../core/services/confirmation.service";
import { CameraService } from "../../../core/services/camera.service";
import { DateAdapter, NativeDateAdapter } from "@angular/material";
import { RegistrarService } from "../../shared/services/registrar.service";
import { BeneficiaryDetailsService } from "../../../core/services/beneficiary-details.service";
import * as moment from "moment";
import { setTheme } from "ngx-bootstrap/utils";
import { BsDatepickerDirective } from "ngx-bootstrap/datepicker";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";
import { Subscription } from "rxjs";

@Component({
  selector: "register-personal-details",
  templateUrl: "./register-personal-details.component.html",
  styleUrls: ["./register-personal-details.component.css"],
})
export class RegisterPersonalDetailsComponent implements OnInit {
  colorTheme = "theme-dark-blue";

  bsConfig: Partial<BsDatepickerConfig>;
  current_language_set: any;

  _parentBenRegID: any;

  masterData: any;
  masterDataSubscription: any;

  revisitData: any;
  revisitDataSubscription: any;

  @Input("personalDetailsForm")
  personalDetailsForm: FormGroup;

  @Input("patientRevisit")
  patientRevisit: Boolean;

  @ViewChild(BsDatepickerDirective) datepicker: BsDatepickerDirective;
  personalDataOnHealthIDSubscription: Subscription;

  @HostListener("window:scroll")
  onScrollEvent() {
    this.datepicker.hide();
  }

  regexDob =
    /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private cameraService: CameraService,
    private registrarService: RegistrarService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    public httpServiceService: HttpServiceService
  ) // dateAdapter: DateAdapter<NativeDateAdapter>
  {
    // dateAdapter.setLocale('en-IN');
    setTheme("bs3"); // or 'bs4'
  }

  ngOnInit() {
    this.setDateLimits();
    this.setDefaultAgeUnit();
    this.loadMasterDataObservable();
    this.setPhoneSelectionEnabledByDefault();
    this.setImageChangeFlagToFalseByDefault();
    this.setCalendarConfig();
    this.assignSelectedLanguage();
    this.registrarService.changePersonalDetailsData(null);
    this.personalDataOnHealthIDSubscription =
      this.registrarService.dialogResult$.subscribe((res) => {
        if (res != null && res != undefined)
          this.setPersonalDetailsFromHealthId(res);
      });
  }
  setPersonalDetailsFromHealthId(res) {
    this.personalDetailsForm.patchValue({
      firstName: res.firstName,
      lastName: res.lastName,
      gender: res.gender,
    });
    this.onGenderSelected();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
  }

  setCalendarConfig() {
    this.bsConfig = Object.assign(
      {},
      {
        containerClass: this.colorTheme,
        dateInputFormat: "DD/MM/YYYY",
        showWeekNumbers: false,
      }
    );
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.masterDataSubscription) {
      this.masterDataSubscription.unsubscribe();
    }
    if (this.patientRevisit && this.revisitDataSubscription) {
      this.revisitDataSubscription.unsubscribe();
    }
    if (this.personalDataOnHealthIDSubscription) {
      this.personalDataOnHealthIDSubscription.unsubscribe();
    }
  }

  setPhoneSelectionEnabledByDefault() {
    this.isMobileNoRequired = true;
    this.personalDetailsForm.patchValue({
      checked: true,
    });
  }

  setImageChangeFlagToFalseByDefault() {
    this.personalDetailsForm.patchValue({
      imageChangeFlag: false,
    });
  }
  /**
   *
   * Load Basic Master Data Observable
   */
  loadMasterDataObservable() {
    this.masterDataSubscription =
      this.registrarService.registrationMasterDetails$.subscribe((res) => {
        // console.log('res personal', res)
        if (res != null) {
          this.masterData = res;
          if (this.patientRevisit) {
            this.loadPersonalDataForEditing();
          }
        }
      });
  }

  validateMaritalStatusMaster(revisitData) {
    if (revisitData.m_gender.genderID == 3) {
      this.maritalStatusMaster = this.masterData.maritalStatusMaster;
    } else {
      this.maritalStatusMaster = this.masterData.maritalStatusMaster.filter(
        (maritalStatus) => {
          if (
            revisitData.m_gender.genderID == "1" &&
            maritalStatus.maritalStatusID != "5"
          ) {
            return maritalStatus;
          }
          if (
            revisitData.m_gender.genderID == "2" &&
            maritalStatus.maritalStatusID != "6"
          ) {
            return maritalStatus;
          }
        }
      );
    }
  }

  /**
   *
   * Load Personal Details Componen Details
   *
   */
  loadPersonalDataForEditing() {
    this.revisitDataSubscription =
      this.registrarService.beneficiaryEditDetails$.subscribe((res) => {
        if (res && res.beneficiaryID) {
          this.revisitData = Object.assign({}, res);
          this.validateMaritalStatusMaster(this.revisitData);
          this.pushEditingDatatoForm(Object.assign({}, this.revisitData));
          this.getBenImage();
        }
      });
  }

  /***
   *
   * Load Editing Data to Form
   */
  pushEditingDatatoForm(element) {
    console.log(element, "datahere");
    this.dateForCalendar = moment(element.dOB).toDate(); //calendar ngModel
    this.personalDetailsForm.patchValue({
      beneficiaryID: element.beneficiaryID,
      beneficiaryRegID: element.beneficiaryRegID,
      firstName: element.firstName,
      lastName: element.lastName,
      benAccountID: element.benAccountID,
      phoneNo: this.getPhoneMaps(element.benPhoneMaps),
      parentRegID: `${
        (element.benPhoneMaps.length > 0 &&
          element.benPhoneMaps[0].parentBenRegID) ||
        null
      }`,
      parentRelation: `${
        (element.benPhoneMaps.length > 0 &&
          element.benPhoneMaps[0].benRelationshipID) ||
        null
      }`,
      benPhMapID: `${
        (element.benPhoneMaps.length > 0 &&
          element.benPhoneMaps[0].benPhMapID) ||
        null
      }`,
      benRelationshipType: `${
        (element.benPhoneMaps.length > 0 &&
          element.benPhoneMaps[0].benRelationshipType &&
          element.benPhoneMaps[0].benRelationshipType.benRelationshipType) ||
        null
      }`,
      gender: element.m_gender.genderID,
      genderName: element.m_gender.genderName,
      dob: moment(element.dOB).toDate(),
      maritalStatus:
        (element.maritalStatus && element.maritalStatus.maritalStatusID) ||
        null,
      maritalStatusName: `${
        (element.maritalStatus && element.maritalStatus.status) || null
      }`,
      spouseName: element.spouseName || null,
      ageAtMarriage: element.ageAtMarriage || null,
      // income: element.i_bendemographics && element.i_bendemographics.incomeStatus || null,
      incomeName:
        (element.i_bendemographics && element.i_bendemographics.incomeStatus) ||
        null,
      literacyStatus: element.literacyStatus || null,
      educationQualification:
        (element.i_bendemographics &&
          element.i_bendemographics.i_beneficiaryeducation &&
          element.i_bendemographics.i_beneficiaryeducation.educationID) ||
        null,
      educationQualificationName:
        (element.i_bendemographics &&
          element.i_bendemographics.i_beneficiaryeducation &&
          element.i_bendemographics.i_beneficiaryeducation.educationType) ||
        null,
      occupation:
        (element.i_bendemographics && element.i_bendemographics.occupationID) ||
        null,
      occupationOther:
        (element.i_bendemographics &&
          element.i_bendemographics.occupationName) ||
        null,
    });
    this.setFullName();
    // this.onMaritalStatusChanged(); // Marital status Changed
    this.masterData.incomeMaster.forEach((stat) => {
      if (
        element.i_bendemographics.incomeStatus &&
        stat.incomeStatus == element.i_bendemographics.incomeStatus
      ) {
        this.personalDetailsForm.patchValue({
          income: stat.incomeStatusID,
        });
      }
    });
    this.dobChangeByCalender(undefined);

    if (
      element.maritalStatus.maritalStatusID == 1 ||
      element.maritalStatus.maritalStatusID == 7
    ) {
      this.enableMarriageDetails = false;
      this.clearMarriageDetails();
    } else {
      this.enableMarriageDetails = true;
    }

    // console.log(this.personalDetailsForm.value ,'personal data updated ')
    this._parentBenRegID = `${
      (element.benPhoneMaps.length > 0 &&
        element.benPhoneMaps[0].parentBenRegID) ||
      null
    }`;
  }

  /**
   *
   * get ben image from api
   */
  getBenImage() {
    this.beneficiaryDetailsService
      .getBeneficiaryImage(this.revisitData.beneficiaryRegID)
      .subscribe((data) => {
        console.log(data, "imagedata");
        if (data && data.benImage) {
          this.personalDetailsForm.patchValue({
            image: data.benImage,
          });
        }
      });
  }

  getPhoneMaps(phoneMap) {
    if (phoneMap && phoneMap.length && phoneMap.length > 0) {
      return phoneMap[0].phoneNo;
    } else {
      return null;
    }
  }

  /**
   *
   * Capture Image from Webcam
   *
   */
  captureImage() {
    this.cameraService.capture().subscribe((result) => {
      if (result) {
        if (this.patientRevisit) {
          this.personalDetailsForm.patchValue({
            imageChangeFlag: true,
          });
        }
        this.personalDetailsForm.patchValue({ image: result });
      }
    });
  }

  /**
   * set Date Limits for Calendar and Age
   *
   */
  today;
  minDate;
  dateForCalendar;
  ageLimit: number = 120;
  ageforMarriage: number = 12;
  setDateLimits() {
    this.today = new Date();
    this.minDate = new Date();
    this.minDate.setFullYear(this.today.getFullYear() - (this.ageLimit + 1));
  }

  /**
   *
   * set Default value for ageUnit to 'Year'
   */
  setDefaultAgeUnit() {
    this.personalDetailsForm.patchValue({ ageUnit: "Years" });
  }

  /**
   * check if Mobile number is required
   *
   */
  isMobileNoRequired: boolean = true;
  checkMobileNoIsRequired(val: any) {
    if (val.checked == true) {
      this.isMobileNoRequired = true;
    } else {
      this.isMobileNoRequired = false;
    }
  }

  /**
   * check if finger print is required
   *
   */
  isFingerPrintRequired: boolean = true;
  checkFingerPrintIsRequired(val: any) {
    if (val.checked == true) {
      this.isFingerPrintRequired = true;
    } else {
      this.isFingerPrintRequired = false;
    }
  }

  /**
   *
   * Gender Selection - Transgender Confirmation
   */

  maritalStatusMaster = [];
  onGenderSelected() {
    const genderMaster = this.masterData.genderMaster;
    genderMaster.forEach((element, i) => {
      if (element.genderID === this.personalDetailsForm.value.gender) {
        this.personalDetailsForm.patchValue({
          genderName: element.genderName,
        });
      }
    });
    console.log(
      "this.masterData",
      genderMaster,
      this.masterData.maritalStatusMaster
    );

    if (this.personalDetailsForm.value.gender == "3") {
      this.confirmationService
        .confirm("info", this.current_language_set.alerts.info.transGender)
        .subscribe(
          (res) => {
            if (!res) {
              this.personalDetailsForm.patchValue({
                gender: null,
                genderName: null,
              });
            } else {
              this.maritalStatusMaster = this.masterData.maritalStatusMaster;
            }
          },
          (err) => {}
        );
    } else {
      this.maritalStatusMaster = this.masterData.maritalStatusMaster.filter(
        (maritalStatus) => {
          if (
            this.personalDetailsForm.value.gender == "1" &&
            maritalStatus.maritalStatusID != "5"
          ) {
            return maritalStatus;
          }
          if (
            this.personalDetailsForm.value.gender == "2" &&
            maritalStatus.maritalStatusID != "6"
          ) {
            return maritalStatus;
          }
        }
      );
    }
  }

  changeLiteracyStatus() {
    const literacyStatus = this.personalDetailsForm.value.literacyStatus;

    if (literacyStatus != "Literate") {
      console.log(this.personalDetailsForm.controls, "controls");
      // this.personalDetailsForm.controls['educationQualification'].clearValidators();
      console.log(
        this.personalDetailsForm.controls["educationQualification"],
        "controls"
      );
    }
  }

  /**
   * Phone Number Parent Relations
   */
  getParentDetails() {
    const searchTerm = this.personalDetailsForm.value.phoneNo;
    const searchObject = {
      'beneficiaryRegID': null,
      'beneficiaryID': null,
      'phoneNo': null
    }
    if (searchTerm !== undefined && searchTerm !== null && searchTerm && searchTerm.trim().length === 10) {
      searchObject["phoneNo"] = searchTerm;
      this.registrarService.identityQuickSearch(searchObject).subscribe(
        (beneficiaryList) => {
          if (
            beneficiaryList &&
            beneficiaryList.length > 0 &&
            beneficiaryList[0].benPhoneMaps.length > 0
          ) {
            console.log(
              "ta d ad a d a",
              JSON.stringify(beneficiaryList, null, 4)
            );
            this.personalDetailsForm.patchValue({
              parentRegID: beneficiaryList[0].benPhoneMaps[0].parentBenRegID,
              parentRelation: 11,
            });
            console.log(this.personalDetailsForm.value.parentRegID);
          } else {
            this.personalDetailsForm.patchValue({
              parentRegID: null,
              parentRelation: 1,
            });
            console.log(this.personalDetailsForm.value.parentRegID);

            if (this.patientRevisit) {
              this.personalDetailsForm.patchValue({
                parentRegID: this.personalDetailsForm.value.beneficiaryRegID,
              });
              console.log(this.personalDetailsForm.value.parentRegID);
            }
          }
        },
        (error) => {
          this.confirmationService.alert(error, "error");
          this.personalDetailsForm.patchValue({
            parentRegID: null,
            parentRelation: 1,
            phoneNo: null,
          });
        }
      );
    } else {
      if (this.patientRevisit) {
        this.personalDetailsForm.patchValue({
          parentRegID: this._parentBenRegID,
          parentRelation: null,
          phoneNo: null,
        });
      } else {
        this.personalDetailsForm.patchValue({
          parentRegID: null,
          parentRelation: null,
          phoneNo: null,
        });
      }
    }
  }
  /**
   *
   * Age Entered in Input
   */
  enableMaritalStatus: Boolean = false;
  onAgeEntered() {
    let valueEntered = this.personalDetailsForm.value.age;
    if (valueEntered) {
      if (
        valueEntered > this.ageLimit &&
        this.personalDetailsForm.value.ageUnit == "Years"
      ) {
        this.confirmationService.alert(
          `Age can only be set between Today to ${this.ageLimit} Years`,
          "info"
        );
        this.personalDetailsForm.patchValue({ age: null });
      } else {
        console.log(
          moment()
            .subtract(this.personalDetailsForm.value.ageUnit, valueEntered)
            .toDate()
        );
        this.personalDetailsForm.patchValue({
          dob: moment()
            .subtract(this.personalDetailsForm.value.ageUnit, valueEntered)
            .toDate(),
        });
      }
    }
    this.confirmMarriageEligible();
    this.checkAgeAtMarriage();
    //     if (this.personalDetailsForm.value.age != null && this.personalDetailsForm.value.age <= this.ageLimit && this.personalDetailsForm.value.age != 0) {
    //   if (!this.personalDetailsForm.value.ageUnit) {
    //     this.personalDetailsForm.value.ageUnit = 'Years';
    //   }
    //   let age = new Date();
    //   if (this.personalDetailsForm.value.ageUnit == 'Days') { age.setDate(age.getDate() - this.personalDetailsForm.value.age); }
    //   else if (this.personalDetailsForm.value.ageUnit == 'Months') { age.setMonth(age.getMonth() - this.personalDetailsForm.value.age); }
    //   else if (this.personalDetailsForm.value.ageUnit == 'Years') { age.setFullYear(age.getFullYear() - this.personalDetailsForm.value.age); }

    //   this.confirmMarriageEligible();
    //   let newAge = age.toISOString()
    //   this.personalDetailsForm.patchValue({dob : newAge});
    // } else if (this.personalDetailsForm.value.age > this.ageLimit) {
    //   this.confirmationService.alert(`Age can only be between 1 Day to ${this.ageLimit} Years`, 'warn');
    // } else if (this.personalDetailsForm.value.age > this.ageLimit && this.personalDetailsForm.value.ageUnit == 'Years') {
    //   this.confirmationService.alert(`Age can only be between 1 Day to ${this.ageLimit} Years`, 'warn');
    //   this.personalDetailsForm.patchValue({age : null});
    // }  else if(this.personalDetailsForm.value.age == null) {
    //   this.confirmationService.alert(`Please Enter Age of Beneficiary`, 'warn');

    // }
  }

  onAgeUnitEntered() {
    if (this.personalDetailsForm.value.age != null) {
      this.onAgeEntered();
    }
  }

  /**
   *
   * Change Age as per changed in Calendar
   */
  dobChangeByCalender(dobval) {
    const date = new Date(this.dateForCalendar);
    console.log(this.personalDetailsForm.value.dob);
    // console.log(this.dateForCalendar,'fromcalendar');
    // console.log(date,'new')
    if (
      this.dateForCalendar &&
      (!dobval || dobval.length == 10) &&
      this.personalDetailsForm.controls["dob"].valid
    ) {
      const dateDiff = Date.now() - date.getTime();
      const age = new Date(dateDiff);
      const yob = Math.abs(age.getFullYear() - 1970);
      const mob = Math.abs(age.getMonth());
      const dob = Math.abs(age.getDate() - 1);
      if (yob > 0) {
        this.personalDetailsForm.patchValue({ age: yob });
        this.personalDetailsForm.patchValue({ ageUnit: "Years" });
      } else if (mob > 0) {
        this.personalDetailsForm.patchValue({ age: mob });
        this.personalDetailsForm.patchValue({ ageUnit: "Months" });
      } else if (dob > 0) {
        this.personalDetailsForm.patchValue({ age: dob });
        this.personalDetailsForm.patchValue({ ageUnit: "Days" });
      }
      if (date.setHours(0, 0, 0, 0) == this.today.setHours(0, 0, 0, 0)) {
        this.personalDetailsForm.patchValue({ age: 1 });
        this.personalDetailsForm.patchValue({ ageUnit: "Days" });
      }

      this.checkAgeAtMarriage();
      this.confirmMarriageEligible();
    } else if (dobval == "Invalid date") {
      this.personalDetailsForm.patchValue({ dob: null });
      this.dateForCalendar = null;
      this.confirmationService.alert(
        this.current_language_set.alerts.info.invalidData,
        "info"
      );
    } else {
      this.personalDetailsForm.patchValue({ age: null });
    }
  }
  /**
   * Check Marriage Eligibility to enable Field
   *
   */
  confirmMarriageEligible() {
    if (
      this.personalDetailsForm.value.age >= this.ageforMarriage &&
      this.personalDetailsForm.value.ageUnit == "Years"
    ) {
      this.enableMaritalStatus = true;
    } else {
      this.enableMaritalStatus = false;
      this.clearMaritalStatus();
    }
  }

  /**
   *
   * Clear Marital Status if previously entered
   */
  clearMaritalStatus() {
    if (this.personalDetailsForm.value.maritalStatus != null) {
      this.personalDetailsForm.patchValue({
        maritalStatus: null,
        maritalStatusName: null,
      });
      //  this.personalDetailsForm.controls['maritalStatus'].setErrors(null);
      //  this.personalDetailsForm.controls['maritalStatus'].updateValueAndValidity();

      this.enableMarriageDetails = false;
      this.clearMarriageDetails();
    }
  }

  /**
   * Income Status Select and get Name
   */
  onIncomeChanged() {
    const incomeMaster = this.masterData.incomeMaster;
    incomeMaster.forEach((element, i) => {
      if (element.incomeStatusID === this.personalDetailsForm.value.income) {
        this.personalDetailsForm.patchValue({
          incomeName: element.incomeStatus,
        });
      }
    });
  }

    /**
  *
  * Marital Status Changed
  */
    enableMarriageDetails: Boolean = false;
    enableSpouseMandatory:Boolean = false;
    onMaritalStatusChanged() {
      if (this.personalDetailsForm.value.maritalStatus == 1 ||
         this.personalDetailsForm.value.maritalStatus == 7) {
        this.enableMarriageDetails = false;
        this.clearMarriageDetails();
  
      } else { this.enableMarriageDetails = true; }
      if(this.personalDetailsForm.value.maritalStatus == 2){
       this.enableSpouseMandatory = true;
       this.clearMarriageDetails();
      }else{
        this.enableSpouseMandatory = false;
        this.clearMarriageDetails();
      }
  
      const maritalMaster = this.masterData.maritalStatusMaster;
      maritalMaster.forEach((element, i) => {
        if (element.maritalStatusID === this.personalDetailsForm.value.maritalStatus) {
          this.personalDetailsForm.patchValue({
            maritalStatusName: element.status
          })
        }
  
      });
  
    }
  
  /**
   * Clear Marriage Details if Entered
   *
   */
  clearMarriageDetails() {
    if (this.personalDetailsForm.value.spouseName != null) {
      this.personalDetailsForm.patchValue({ spouseName: null });
    }
    if (this.personalDetailsForm.value.ageAtMarriage != null) {
      this.personalDetailsForm.patchValue({ ageAtMarriage: null });
    }
  }

  /**
   *
   * check for validity of Age At Marriage with other Details
   */
  checkAgeAtMarriage() {
    if (this.personalDetailsForm.value.ageAtMarriage != null) {
      if (this.personalDetailsForm.value.age == null) {
        this.confirmationService.alert(
          this.current_language_set.common.PleaseenterBeneficiaryagefirst,
          "info"
        );
        this.personalDetailsForm.patchValue({ ageAtMarriage: null });
      } else if (this.personalDetailsForm.value.ageUnit != "Years") {
        this.confirmationService.alert(
          this.current_language_set.alerts.info.marriageAge +
            " " +
            this.ageforMarriage +
            " " +
            this.current_language_set.alerts.info.years,
          "info"
        );
        this.personalDetailsForm.patchValue({ ageAtMarriage: null });
      } else if (this.personalDetailsForm.value.age < this.ageforMarriage) {
        this.confirmationService.alert(
          this.current_language_set.alerts.info.marriageAge +
            " " +
            this.ageforMarriage +
            " " +
            this.current_language_set.alerts.info.years,
          "info"
        );
        this.personalDetailsForm.patchValue({ ageAtMarriage: null });
      } else if (
        this.personalDetailsForm.value.ageAtMarriage < this.ageforMarriage
      ) {
        this.confirmationService.alert(
          this.current_language_set.alerts.info.marriageAge +
            " " +
            this.ageforMarriage +
            " " +
            this.current_language_set.alerts.info.years,
          "info"
        );
        this.personalDetailsForm.patchValue({ ageAtMarriage: null });
      } else if (
        this.personalDetailsForm.value.age -
          this.personalDetailsForm.value.ageAtMarriage <
        0
      ) {
        this.confirmationService.alert(
          this.current_language_set.common.Marriageatageismorethantheactualage,
          "info"
        );
        this.personalDetailsForm.patchValue({ ageAtMarriage: null });
      }
    }
  }

  /**
   * Occupation Name when ID is selected
   */
  getOccupationName() {
    this.masterData.occupationMaster.forEach((occupation) => {
      if (
        this.personalDetailsForm.value.occupation === occupation.occupationID &&
        this.personalDetailsForm.value.occupation !== 7
      ) {
        this.personalDetailsForm.patchValue({
          occupationOther: occupation.occupationType,
        });
        console.log("reached form");
      }
    });

    if (
      !this.personalDetailsForm.value.occupationOther ||
      this.personalDetailsForm.value.occupation == 7
    ) {
      this.personalDetailsForm.patchValue({
        occupationOther: null,
      });
    }
  }

  /**
   * Education Qualification when ID is selected
   */
  onEducationQualificationChanged() {
    const qualificationMaster = this.masterData.qualificationMaster;
    qualificationMaster.forEach((element, i) => {
      if (
        element.educationID ===
        this.personalDetailsForm.value.educationQualification
      ) {
        this.personalDetailsForm.patchValue({
          educationQualificationName: element.educationType,
        });
      }
    });
  }

  fname: any;
  lname: any;
  setFullName() {
    this.fname = this.personalDetailsForm.controls["firstName"].value;
    this.lname = this.personalDetailsForm.controls["lastName"].value;

    if (this.fname) {
      if (this.fname && (this.lname === undefined || this.lname == null))
        this.personalDetailsForm.patchValue({
          fullName: this.fname,
        });
      else
        this.personalDetailsForm.patchValue({
          fullName: this.fname + " " + this.lname,
        });
    }
    if (this.lname) {
      if (this.lname && (this.fname === undefined || this.fname == null))
        this.personalDetailsForm.patchValue({
          fullName: this.lname,
        });
      else
        this.personalDetailsForm.patchValue({
          fullName: this.fname + " " + this.lname,
        });
    }
  }
}
