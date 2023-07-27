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


import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { BeneficiaryDetailsService } from '../../core/services/beneficiary-details.service';
import { MasterdataService, NurseService, DoctorService } from '../shared/services';
import { NCDScreeningUtils } from '../shared/utility';

import { flatMap } from 'rxjs/operators'
import { Observable } from 'rxjs/Observable';
import { MdDialog } from '@angular/material';
import { IotcomponentComponent } from 'app/app-modules/core/components/iotcomponent/iotcomponent.component';
import { environment } from "environments/environment";
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'nurse-ncd-screening',
  templateUrl: './ncd-screening.component.html',
  styleUrls: ['./ncd-screening.component.css']
})
export class NcdScreeningComponent implements OnInit {

  @Input('patientMedicalForm')
  patientMedicalForm: FormGroup;



  @Input('ncdScreeningMode')
  mode: String;

  today: Date;
  nextScreeningDate: Date;
  age: any;

  utils = new NCDScreeningUtils(this.fb);
  bloodPressureStatus: any;
  diabeticStatus: any;
  ncdScreeningConditions: any;
  ncdScreeningReasons: any;
  ncdScreeningDetails: any;

  startWeightTest=environment.startWeighturl;
  startBloodGlucose=environment.startBloodGlucoseurl;
  startBPTest=environment.startBPurl;
  // ncdTests: any;
  laboratoryList = [
    {
      procedureID: 31,
      procedureName: "BP Measurement",
    },
    {
      procedureID: 31,
      procedureName: "Blood Glucose Measurement",
    }
  ]
  currentLanguageSet: any;

  constructor(private fb: FormBuilder,
    private dialog: MdDialog,
    private confirmationService: ConfirmationService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private masterdataService: MasterdataService,
    private doctorService: DoctorService,
    private nurseService: NurseService,
    private router: Router,
    public httpServiceService: HttpServiceService) { }

  NCDScreeningForm: FormGroup
  patientVisitForm: FormGroup
  ngOnInit() {
    this.assignSelectedLanguage();
    this.NCDScreeningForm = <FormGroup>this.patientMedicalForm.controls['NCDScreeningForm']
    this.patientVisitForm = <FormGroup>this.patientMedicalForm.controls['patientVisitForm']
    this.getBeneficiaryDetails();
    this.getNurseMasterData();
    this.today = new Date();
    this.nextScreeningDate = new Date();
    this.nextScreeningDate.setDate(this.today.getDate() + 1)
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  ngOnChanges() {
    if (this.mode == 'update') {
      this.updateNCDScreeningDetails();
    }
    
  }

  ngOnDestroy() {
    if (this.nurseMasterDataSubscription)
      this.nurseMasterDataSubscription.unsubscribe();
    if (this.beneficiaryDetailSubscription)
      this.beneficiaryDetailSubscription.unsubscribe();
  }

  nurseMasterDataSubscription: any;
  getNurseMasterData() {
    this.nurseMasterDataSubscription = this.masterdataService.nurseMasterData$
      .subscribe(data => {
        if (data) {
          this.nurseMasterDataSubscription.unsubscribe();
          this.bloodPressureStatus = data.bloodPressureStatus;
          this.diabeticStatus = data.diabeticStatus;
          this.ncdScreeningConditions = data.ncdScreeningConditions;
          this.ncdScreeningReasons = this.filterNCDScreeningReasons(Object.assign([], data.ncdScreeningReasons));
          // this.ncdTests = data.ncdTests;

          if (this.mode == 'view') {
            let visitID = localStorage.getItem('visitID');
            let benRegID = localStorage.getItem('beneficiaryRegID')
            this.getNCDScreeingDetails(benRegID, visitID);
          }
          if(parseInt(localStorage.getItem("specialistFlag")) == 100)
    {
       let visitID = localStorage.getItem('visitID');
      let benRegID = localStorage.getItem('beneficiaryRegID')
      this.getNCDScreeingDetails(benRegID, visitID);
    }
         
        }
      })
  }

  filterNCDScreeningReasons(reasons) {
    console.log(reasons)
    let filteredReasons = [];
    reasons.forEach(element => {
      if (this.age < 30 && element.ncdScreeningReasonID == 1) {

      } else {
        filteredReasons.push(element);
      }

    });
    return filteredReasons;
  }

  ncdScreeningVisitCount: any;

  beneficiaryDetailSubscription: any;
  getBeneficiaryDetails() {
    this.beneficiaryDetailSubscription = this.beneficiaryDetailsService.beneficiaryDetails$
      .flatMap(beneficiary => {
        if (beneficiary) {
          if (beneficiary.ageVal) {
            this.age = beneficiary.ageVal;
          } else {
            this.age = 0;
          }
          if (beneficiary.genderName && beneficiary.genderName.toLowerCase() == 'female') {
            this.female = true;
          }
          return this.nurseService.getNcdScreeningVisitCount(beneficiary.beneficiaryRegID);
        } else {
          return Observable.of(null);
        }
      }).subscribe(res => {
        if (res && res.statusCode == 200 && res.data) {
          this.ncdScreeningVisitCount = res.data.ncdScreeningVisitCount;
          if (this.mode != 'view')
            this.NCDScreeningForm.patchValue({ ncdScreeningVisitNo: this.ncdScreeningVisitCount });
        }
      })
  }

  getNCDScreeingDetails(beneficiaryRegID, benVisitID) {
    this.doctorService.getNcdScreeningDetails(beneficiaryRegID, benVisitID)
      .subscribe(res => {
        if (res.statusCode == 200 && res.data != null) {
          this.ncdScreeningDetails = Object.assign({}, res.data.anthropometryDetails, res.data.ncdScreeningDetails, res.data.vitalDetails);

          this.ncdScreeningDetails.nextScreeningDate = new Date(this.ncdScreeningDetails.nextScreeningDate);
          // this.ncdScreeningDetails.screeningCondition = this.ncdScreeningConditions.filter(item => item.ncdScreeningConditionID == this.ncdScreeningDetails.ncdScreeningConditionID)[0];
          this.ncdScreeningDetails.reasonForScreening = this.ncdScreeningReasons.filter(item => item.ncdScreeningReasonID == this.ncdScreeningDetails.ncdScreeningReasonID)[0];
          this.ncdScreeningDetails.bloodPressureStatus = this.bloodPressureStatus.filter(item => item.bpAndDiabeticStatusID == this.ncdScreeningDetails.bloodPressureStatusID)[0];
          this.ncdScreeningDetails.diabeticStatus = this.diabeticStatus.filter(item => item.bpAndDiabeticStatusID == this.ncdScreeningDetails.diabeticStatusID)[0];

          let temp = [];
          if (this.ncdScreeningDetails.isBPPrescribed) {
            let bp = this.laboratoryList.filter(item => {
              return item.procedureName == 'BP Measurement';
            })
            if (bp.length > 0)
              temp.push(bp[0]);
          }

          if (this.ncdScreeningDetails.isBloodGlucosePrescribed) {
            let bg = this.laboratoryList.filter(item => {
              return item.procedureName == 'Blood Glucose Measurement';
            })
            if (bg.length > 0)
              temp.push(bg[0]);
          }
          let tempNCDScreeningConditionList = [];


          if (this.ncdScreeningConditions) {
            this.ncdScreeningConditions.forEach((screeningCondition) => {
              if (this.ncdScreeningDetails && this.ncdScreeningDetails.ncdScreeningConditionList) {
                this.ncdScreeningDetails.ncdScreeningConditionList.forEach((ncdScreening) => {
                  if (screeningCondition.ncdScreeningConditionID == ncdScreening.ncdScreeningConditionID) {
                    tempNCDScreeningConditionList.push(screeningCondition);
                  }
                })
              }
            })
          }

          this.ncdScreeningDetails.ncdScreeningConditionList = tempNCDScreeningConditionList.slice()

          this.ncdScreeningDetails.labTestOrders = temp.slice();
          this.NCDScreeningForm.patchValue(this.ncdScreeningDetails, { emitEvent: true });
          this.calculateBMI();
          this.checkScreeningTest();
          this.calculateAverageDiastolicBP();
          this.calculateAverageSystolicBP();
        }
      })
  }

  checkNCDScreeningRequiredData() {
    let NCDScreeningForm = this.NCDScreeningForm;
    const required = [];

    if (NCDScreeningForm.controls['height_cm'].errors) {
      required.push(this.currentLanguageSet.vitalsDetails.height);
    }
    if (NCDScreeningForm.controls['weight_Kg'].errors) {
      required.push(this.currentLanguageSet.vitalsDetails.weight);
    }
    if (NCDScreeningForm.controls['isScreeningComplete'].errors) {
      required.push(this.currentLanguageSet.screeningComplete);
    }

    if (required.length) {
      this.confirmationService.notify(this.currentLanguageSet.alerts.info.mandatoryFields, required);
      return false;
    } else {
      return true;
    }
  }

  updateNCDScreeningDetails() {
    if (this.checkNCDScreeningRequiredData()) {
      this.doctorService.updateNCDScreeningDetails(this.NCDScreeningForm.value, this.patientVisitForm.value)
        .subscribe(res => {
          if (res.statusCode == 200 && res.data != null) {
            this.NCDScreeningForm.markAsPristine();
            this.confirmationService.alert(res.data.response, 'success');
            this.router.navigate(['/common/nurse-worklist']);
          } else {
            this.confirmationService.alert(res.errorMessage, 'error');
          }
        }, err => {
          this.confirmationService.alert(err, 'error');
        })
    }
  }

  female = false;
  BMI = null;
  checkBloodPressure = false;
  checkBloodGlucose = false;

  checkScreeningTest() {
    let screeningTestListName = [];

    this.screeningTestList.map(item => {
      screeningTestListName.push(item.procedureName)
    })
    if (screeningTestListName && screeningTestListName.indexOf('BP Measurement') >= 0) {
      this.checkBloodPressure = true;
    } else {
      this.checkBloodPressure = false;
      this.NCDScreeningForm.patchValue({ systolicBP_1stReading: null, systolicBP_2ndReading: null, systolicBP_3rdReading: null, averageSystolicBP_Reading: null });
      this.NCDScreeningForm.patchValue({ diastolicBP_1stReading: null, diastolicBP_2ndReading: null, diastolicBP_3rdReading: null, averageDiastolicBP_Reading: null });
      this.NCDScreeningForm.patchValue({ bloodPressureStatus: null });
    }
    if (screeningTestListName && screeningTestListName.indexOf('Blood Glucose Measurement') >= 0) {
      this.checkBloodGlucose = true;
    } else {
      this.checkBloodGlucose = false;
      this.NCDScreeningForm.patchValue({ bloodGlucose_Fasting: null, bloodGlucose_Random: null, bloodGlucose_2hr_PP: null, bloodGlucose_NotSpecified: null })
      this.NCDScreeningForm.patchValue({ diabeticStatus: null });
    }
  }

  normalBMI = true;
  calculateBMI() {
    if (this.height_cm && this.weight_Kg) {
      this.BMI = (this.weight_Kg / (this.height_cm * this.height_cm)) * 10000;
      this.BMI = +this.BMI.toFixed(1);
      this.NCDScreeningForm.patchValue({ bMI: this.BMI })
    } else {
      this.BMI = null;
      this.NCDScreeningForm.patchValue({ bMI: this.BMI })
    }
    if (this.BMI >= 18.5 && this.BMI <= 24.9)
      this.normalBMI = true;
    else
      this.normalBMI = false;
  }

  checkHeight() {
    if (this.height_cm < 120 || this.height_cm > 200) {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.recheckValue);
    }
  }

  checkWeight() {
    if (this.weight_Kg < 25 || this.weight_Kg > 150) {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.recheckValue);
    }
  }

  patientWaistHipRatio: any;
  normalWaistHipRatio = true;
  hipWaistRatio() {
    if (this.hipCircumference_cm && this.waistCircumference_cm) {
      this.patientWaistHipRatio = (this.waistCircumference_cm / this.hipCircumference_cm).toFixed(2);
      this.NCDScreeningForm.patchValue({ waistHipRatio: this.patientWaistHipRatio });
      if (this.female) {
        this.normalWaistHipRatio = this.patientWaistHipRatio < 0.80 ? true : false;
      } else this.normalWaistHipRatio = this.patientWaistHipRatio < 0.90 ? true : false;
    }
  }

  normalHip = true;
  checkHip() {
    if (this.female)
      this.normalHip = this.hipCircumference_cm >= 97 && this.hipCircumference_cm <= 108 ? true : false;
    else
      this.normalHip = this.hipCircumference_cm >= 94 && this.hipCircumference_cm <= 105 ? true : false;
  }

  normalWaist = true;
  checkWaist() {
    this.normalWaist = this.waistCircumference_cm >= 50 && this.waistCircumference_cm <= 150 ? true : false;
  }

  checkSystolicBP1() {
    if (this.systolicBP_1stReading < 90 || this.systolicBP_1stReading > 170) {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.recheckValue);
    }
  }

  checkDiastolicBP1() {
    if (this.diastolicBP_1stReading < 50 || this.diastolicBP_1stReading > 110) {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.recheckValue);
    }
  }

  checkSystolicBP2() {
    if (this.systolicBP_2ndReading < 90 || this.systolicBP_2ndReading > 170) {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.recheckValue);
    }
  }

  checkDiastolicBP2() {
    if (this.diastolicBP_2ndReading < 50 || this.diastolicBP_2ndReading > 110) {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.recheckValue);
    }
  }

  checkSystolicBP3() {
    if (this.systolicBP_3rdReading < 90 || this.systolicBP_3rdReading > 170) {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.recheckValue);
    }
  }

  checkDiastolicBP3() {
    if (this.diastolicBP_3rdReading < 50 || this.diastolicBP_3rdReading > 110) {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.recheckValue);
    }
  }

  calculateAverageSystolicBP() {
    if (this.systolicBP_1stReading != null && this.systolicBP_2ndReading != null && this.systolicBP_3rdReading != null) {
      let averageSystolicBP;
      averageSystolicBP = ((parseInt(this.systolicBP_1stReading) + parseInt(this.systolicBP_2ndReading) + parseInt(this.systolicBP_3rdReading)) / 3).toFixed(0);
      this.NCDScreeningForm.patchValue({ averageSystolicBP_Reading: averageSystolicBP });
    }
  }

  calculateAverageDiastolicBP() {
    if (this.diastolicBP_1stReading != null && this.diastolicBP_2ndReading != null && this.diastolicBP_3rdReading != null) {
      let averageDiastolicBP;
      averageDiastolicBP = ((parseInt(this.diastolicBP_1stReading) + parseInt(this.diastolicBP_2ndReading) + parseInt(this.diastolicBP_3rdReading)) / 3).toFixed(0);
      this.NCDScreeningForm.patchValue({ averageDiastolicBP_Reading: averageDiastolicBP });
    }
  }

  checkBloodSugarFasting() {
    if (this.bloodGlucose_Fasting < 50 || this.bloodGlucose_Fasting > 700) {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.recheckValue);
    }
  }

  checkBloodSugarRandom() {
    if (this.bloodGlucose_Random < 50 || this.bloodGlucose_Random > 700) {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.recheckValue);
    }
  }

  checkBloodSugar2HrPostPrandial() {
    if (this.bloodGlucose_2hr_PP < 50 || this.bloodGlucose_2hr_PP > 700) {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.recheckValue);
    }
  }

  checkBloodSugarNotSpecified() {
    if (this.bloodGlucose_NotSpecified < 50 || this.bloodGlucose_NotSpecified > 700) {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.recheckValue);
    }
  }

  checkSystolicGreater1(systolic1, diastolic1) {
    console.log(systolic1, diastolic1);
    if (systolic1 && diastolic1) {
      if (parseInt(systolic1) <= parseInt(diastolic1)) {
        this.confirmationService.alert(this.currentLanguageSet.alerts.info.sysBp);
        this.NCDScreeningForm.patchValue({
          systolicBP_1stReading: null
        })
      }
    }
    this.calculateAverageSystolicBP();
  }

  checkSystolicGreater2(systolic2, diastolic2) {
    console.log(systolic2, diastolic2);
    if (systolic2 && diastolic2) {
      if (parseInt(systolic2) <= parseInt(diastolic2)) {
        this.confirmationService.alert(this.currentLanguageSet.alerts.info.sysBp);
        this.NCDScreeningForm.patchValue({
          systolicBP_2ndReading: null
        })
      }
    }
    this.calculateAverageSystolicBP();
  }

  checkSystolicGreater3(systolic3, diastolic3) {
    console.log(systolic3, diastolic3);
    if (systolic3 && diastolic3) {
      if (parseInt(systolic3) <= parseInt(diastolic3)) {
        this.confirmationService.alert(this.currentLanguageSet.alerts.info.sysBp);
        this.NCDScreeningForm.patchValue({
          systolicBP_3rdReading: null
        })
      }
    }
    this.calculateAverageSystolicBP();
  }

  checkDiastolicLesser1(systolic1, diastolic1) {
    console.log(systolic1, diastolic1);
    if (systolic1 && diastolic1) {
      if (parseInt(systolic1) <= parseInt(diastolic1)) {
        this.confirmationService.alert(this.currentLanguageSet.alerts.info.DiaBp);
        this.NCDScreeningForm.patchValue({
          diastolicBP_1stReading: null
        })
      }

    }
    this.calculateAverageDiastolicBP();
  }

  checkDiastolicLesser2(systolic2, diastolic2) {
    console.log(systolic2, diastolic2);
    if (systolic2 && diastolic2) {
      if (parseInt(systolic2) <= parseInt(diastolic2)) {
        this.confirmationService.alert(this.currentLanguageSet.alerts.info.DiaBp);
        this.NCDScreeningForm.patchValue({
          diastolicBP_2ndReading: null
        })
      }
    }
    this.calculateAverageDiastolicBP();
  }

  checkDiastolicLesser3(systolic3, diastolic3) {
    console.log(systolic3, diastolic3);
    if (systolic3 && diastolic3) {
      if (parseInt(systolic3) <= parseInt(diastolic3)) {
        this.confirmationService.alert(this.currentLanguageSet.alerts.info.DiaBp);
        this.NCDScreeningForm.patchValue({
          diastolicBP_3rdReading: null
        })
      }
    }
    this.calculateAverageDiastolicBP();
  }

  get screeningTestList() {
    return this.NCDScreeningForm.controls['labTestOrders'].value;
  }

  get height_cm() {
    return this.NCDScreeningForm.controls['height_cm'].value;
  }

  get weight_Kg() {
    return this.NCDScreeningForm.controls['weight_Kg'].value;
  }

  get hipCircumference_cm() {
    return this.NCDScreeningForm.controls['hipCircumference_cm'].value;
  }
  get waistHipRatio() {
    return this.NCDScreeningForm.controls['waistHipRatio'].value;
  }
  get waistCircumference_cm() {
    return this.NCDScreeningForm.controls['waistCircumference_cm'].value;
  }

  get systolicBP_1stReading() {
    return this.NCDScreeningForm.controls['systolicBP_1stReading'].value;
  }

  get diastolicBP_1stReading() {
    return this.NCDScreeningForm.controls['diastolicBP_1stReading'].value;
  }

  get systolicBP_2ndReading() {
    return this.NCDScreeningForm.controls['systolicBP_2ndReading'].value;
  }

  get diastolicBP_2ndReading() {
    return this.NCDScreeningForm.controls['diastolicBP_2ndReading'].value;
  }

  get systolicBP_3rdReading() {
    return this.NCDScreeningForm.controls['systolicBP_3rdReading'].value;
  }

  get diastolicBP_3rdReading() {
    return this.NCDScreeningForm.controls['diastolicBP_3rdReading'].value;
  }

  get averageDiastolicBP_Reading() {
    return this.NCDScreeningForm.controls['averageDiastolicBP_Reading'].value;
  }

  get averageSystolicBP_Reading() {
    return this.NCDScreeningForm.controls['averageDiastolicBP_Reading'].value;
  }

  get bloodGlucose_Fasting() {
    return this.NCDScreeningForm.controls['bloodGlucose_Fasting'].value;
  }

  get bloodGlucose_Random() {
    return this.NCDScreeningForm.controls['bloodGlucose_Random'].value;
  }

  get bloodGlucose_2hr_PP() {
    return this.NCDScreeningForm.controls['bloodGlucose_2hr_PP'].value;
  }

  get bloodGlucose_NotSpecified() {
    return this.NCDScreeningForm.controls['bloodGlucose_NotSpecified'].value;
  }

  get bMI() {
    return this.NCDScreeningForm.controls['bMI'].value;
  }

  openIOTWeightModel(){
    let dialogRef = this.dialog.open(IotcomponentComponent, {
	  "width": "600px",
      "height":"180px",
      "disableClose":true,
      data:{"startAPI":this.startWeightTest}
  
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("he;;p",result,result['result']);
      if(result!=null){
        //result['result']
        this.NCDScreeningForm.patchValue({
          'weight_Kg':result['result']
        })
        this.calculateBMI();
      }
        });
  }
  openIOTBGFastingModel(){
    let dialogRef = this.dialog.open(IotcomponentComponent, {
	  "width": "600px",
      "height":"180px",	
      "disableClose":true,
      data:{"startAPI":this.startBloodGlucose}
  
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("blood_glucose",result['sys'],result['dia']);
      if(result!=null){
        this.NCDScreeningForm.patchValue({
          'bloodGlucose_Fasting':result['result']
        })
      }
        });
  }
  openIOTBGRandomModel(){
    let dialogRef = this.dialog.open(IotcomponentComponent, {
	  "width": "600px",
      "height":"180px",	
      "disableClose":true,
      data:{"startAPI":this.startBloodGlucose}
  
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("blood_glucose",result['sys'],result['dia']);
      if(result!=null){
        this.NCDScreeningForm.patchValue({
          'bloodGlucose_Random':result['result']
        })
      }
        });
  }
  openIOTBGPostPrandialModel(){
    let dialogRef = this.dialog.open(IotcomponentComponent, {
	  "width": "600px",
      "height":"180px",	
      "disableClose":true,
      data:{"startAPI":this.startBloodGlucose}
  
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("blood_glucose",result['sys'],result['dia']);
      if(result!=null){
        this.NCDScreeningForm.patchValue({
          'bloodGlucose_2hr_PP':result['result']
        })
      }
        });
  }
  openIOTBGNotSpecifiedModel(){
    let dialogRef = this.dialog.open(IotcomponentComponent, {
	  "width": "600px",
      "height":"180px",	
      "disableClose":true,
      data:{"startAPI":this.startBloodGlucose}
  
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("blood_glucose",result['sys'],result['dia']);
      if(result!=null){
        this.NCDScreeningForm.patchValue({
          'bloodGlucose_NotSpecified':result['result']
        })
      }
        });
  }
  openIOTBP1Model(){
    let dialogRef = this.dialog.open(IotcomponentComponent, {
	  "width": "600px",
      "height":"180px",	
      "disableClose":true,
      data:{"startAPI":this.startBPTest}
  
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("blood_pressure",result['sys'],result['dia']);
      if(result!=null){
        this.NCDScreeningForm.patchValue({
          'systolicBP_1stReading':result['sys'],
          'diastolicBP_1stReading':result['dia']
        })
      }
        });
  }
  openIOTBP2Model(){
    let dialogRef = this.dialog.open(IotcomponentComponent, {
	  "width": "600px",
      "height":"180px",	
      "disableClose":true,
      data:{"startAPI":this.startBPTest}
  
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("blood_pressure",result['sys'],result['dia']);
      if(result!=null){
        this.NCDScreeningForm.patchValue({
          'systolicBP_2ndReading':result['sys'],
          'diastolicBP_2ndReading':result['dia']
        })
      }
        });
  }
  openIOTBP3Model(){
    let dialogRef = this.dialog.open(IotcomponentComponent, {
	  "width": "600px",
      "height":"180px",	
      "disableClose":true,
      data:{"startAPI":this.startBPTest}
  
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("blood_pressure",result['sys'],result['dia']);
      if(result!=null){
        this.NCDScreeningForm.patchValue({
          'systolicBP_3rdReading':result['sys'],
          'diastolicBP_3rdReading':result['dia']
        })
      }
        });
  }
}
