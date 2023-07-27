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


import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { MasterdataService, DoctorService } from '../../../../shared/services';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'app/app-modules/core/services';
import { GeneralUtils } from 'app/app-modules/nurse-doctor/shared/utility';

@Component({
  selector: 'app-ncd-care-diagnosis',
  templateUrl: './ncd-care-diagnosis.component.html',
  styleUrls: ['./ncd-care-diagnosis.component.css']
})
export class NcdCareDiagnosisComponent implements OnInit {
  utils = new GeneralUtils(this.fb);

  @Input('generalDiagnosisForm')
  generalDiagnosisForm: FormGroup;

  @Input('caseRecordMode')
  caseRecordMode: string;

  ncdCareConditions: any;
  ncdCareTypes: any;
  current_language_set: any;
  designation : any;
  specialist : boolean;
  isNcdScreeningConditionOther: boolean=false;
  temp:any=[];
  visitCategory: string;
  attendantType: any;
  enableNCDCondition: boolean = false;
  constructor(
    private fb: FormBuilder,
    private masterdataService: MasterdataService,
    public httpServiceService: HttpServiceService,
    private doctorService: DoctorService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.getDoctorMasterData();
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
    this.designation = localStorage.getItem('designation');
    if(this.designation == "TC Specialist"){
      this.generalDiagnosisForm.controls['specialistDiagnosis'].enable();
      this.specialist = true;
    } else {
      this.generalDiagnosisForm.controls['specialistDiagnosis'].disable();
      this.specialist = false;
    }
   this.visitCategory =localStorage.getItem('visitCategory');
   this.attendantType = this.route.snapshot.params['attendant'];
   if(this.attendantType == "doctor"){
     this.enableNCDCondition= true;
   }
   if(this.designation == "TC Specialist"){
      this.enableNCDCondition= false;
   }
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }

  getDoctorMasterData() {
    this.masterdataService.doctorMasterData$.subscribe(masterData => {
      if (masterData) {
        if(masterData.ncdCareConditions)
        this.ncdCareConditions = masterData.ncdCareConditions.slice();
        if(masterData.ncdCareTypes)
        this.ncdCareTypes = masterData.ncdCareTypes.slice();

        if (this.caseRecordMode == 'view') {
          let beneficiaryRegID = localStorage.getItem('beneficiaryRegID');
          let visitID = localStorage.getItem('visitID');
          let visitCategory = localStorage.getItem('visitCategory');
          this.getDiagnosisDetails(beneficiaryRegID, visitID, visitCategory);
        }
      }
    })
  }

  diagnosisSubscription: any;
  getDiagnosisDetails(beneficiaryRegID, visitID, visitCategory) {
    this.diagnosisSubscription = this.doctorService.getCaseRecordAndReferDetails(beneficiaryRegID, visitID, visitCategory)
      .subscribe(res => {
        if (res && res.statusCode == 200 && res.data && res.data.diagnosis) {
          this.patchDiagnosisDetails(res.data.diagnosis);
          if (res.data.diagnosis.provisionalDiagnosisList){
            this.patchProvisionalDiagnosisDetails(res.data.diagnosis.provisionalDiagnosisList);
          }
        }
      })
  }

  patchDiagnosisDetails(diagnosis) {
    console.log('diagnosis',diagnosis);
    
    // let ncdScreeningCondition = this.ncdCareConditions.filter(item => {
    //   console.log('item',item);
    //   return item.screeningCondition == diagnosis.ncdScreeningCondition
    // });
    // if (ncdScreeningCondition.length > 0)
    //   diagnosis.ncdScreeningCondition = ncdScreeningCondition[0];
    if(diagnosis!=undefined && diagnosis.ncdScreeningConditionArray !=undefined && diagnosis.ncdScreeningConditionArray !=null)
    {
      this.temp=diagnosis.ncdScreeningConditionArray;
    }
    if(diagnosis!=undefined && diagnosis.ncdScreeningConditionOther !=undefined && diagnosis.ncdScreeningConditionOther !=null)
    {
      this.isNcdScreeningConditionOther=true;
    }
    let ncdCareType = this.ncdCareTypes.filter(item => {
      return item.ncdCareType == diagnosis.ncdCareType
    });
    if (ncdCareType.length > 0)
      diagnosis.ncdCareType = ncdCareType[0];

    this.generalDiagnosisForm.patchValue(diagnosis);
  }
  patchProvisionalDiagnosisDetails(provisionalDiagnosis) {
    let savedDiagnosisData = provisionalDiagnosis;
    let diagnosisArrayList = this.generalDiagnosisForm.controls['provisionalDiagnosisList'] as FormArray;
    console.log("from diagnosis" + provisionalDiagnosis[0].term );
    if(provisionalDiagnosis[0].term != "" && provisionalDiagnosis[0].conceptID != "")
    {
      console.log("from diagnosis second" + provisionalDiagnosis[0].term );
      
      for (let i = 0; i < savedDiagnosisData.length; i++) {

        diagnosisArrayList.at(i).patchValue({
          "viewProvisionalDiagnosisProvided": savedDiagnosisData[i].term,
          "term": savedDiagnosisData[i].term,
          "conceptID": savedDiagnosisData[i].conceptID
        });
        (<FormGroup>diagnosisArrayList.at(i)).controls['viewProvisionalDiagnosisProvided'].disable();
        if (diagnosisArrayList.length < savedDiagnosisData.length)
          this.addDiagnosis();
      }
    }
  }

  addDiagnosis() {
    let diagnosisArrayList = this.generalDiagnosisForm.controls['provisionalDiagnosisList'] as FormArray;
    if (diagnosisArrayList.length <= 29) {
      diagnosisArrayList.push(this.utils.initProvisionalDiagnosisList());
    } else {
      this.confirmationService.alert(this.current_language_set.alerts.info.maxDiagnosis);
    }
  }

  removeDiagnosisFromList(index, diagnosisListForm?: FormGroup) {
    let diagnosisListArray = this.generalDiagnosisForm.controls['provisionalDiagnosisList'] as FormArray;
    if (diagnosisListArray.at(index).valid) {
      this.confirmationService.confirm(`warn`, this.current_language_set.alerts.info.warn).subscribe(result => {
        if (result) {
          let diagnosisListArray = this.generalDiagnosisForm.controls['provisionalDiagnosisList'] as FormArray;
          if (diagnosisListArray.length > 1) {
            diagnosisListArray.removeAt(index);
          }
          else {
            diagnosisListForm.reset();
            diagnosisListForm.controls['viewProvisionalDiagnosisProvided'].enable();
          }
          this.generalDiagnosisForm.markAsDirty();
        }
      });
    } else {
      if (diagnosisListArray.length > 1) {
        diagnosisListArray.removeAt(index);
      }
      else {
        diagnosisListForm.reset();
        diagnosisListForm.controls['viewProvisionalDiagnosisProvided'].enable();
      }
    }

  }

  checkProvisionalDiagnosisValidity(provisionalDiagnosis) {
    let temp = provisionalDiagnosis.value;
    if (temp.term && temp.conceptID) {
      return false;
    } else {
      return true;
    }
  }

  changeNcdScreeningCondition(value,event)
  {
    let flag=false;
    if(value !=undefined && value !=null &&  value.length >0)
    {
    value.forEach(element => {
      if(element == 'Other')
      flag=true;
    });
  }
    if(flag)
    this.isNcdScreeningConditionOther=true;
    else
    {
      this.generalDiagnosisForm.controls['ncdScreeningConditionOther'].patchValue(null);
      this.isNcdScreeningConditionOther=false;
    }
    // console.log(value);
    // if(event.checked)
    // {
    //   this.addToTemp(value);
    //   if(value == "Other")
    //   {
    //     this.isNcdScreeningConditionOther=true;
    //   }
    // }
    // else{
    //   this.removeTemp(value);
    //   if(value == "Other")
    //   {
    //     this.generalDiagnosisForm.controls['ncdScreeningConditionOther'].patchValue(null);
    //     this.isNcdScreeningConditionOther=false;
    //   }
    // }
    this.temp=value;
    this.generalDiagnosisForm.controls['ncdScreeningConditionArray'].patchValue(value);
  }
}
