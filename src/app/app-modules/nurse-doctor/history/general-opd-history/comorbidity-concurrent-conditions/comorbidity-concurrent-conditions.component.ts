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


import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';

import { PreviousDetailsComponent } from '../../../../core/components/previous-details/previous-details.component';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { MasterdataService, NurseService, DoctorService } from '../../../shared/services';
import { ConfirmationService } from '../../../../core/services/confirmation.service';
import { ValidationUtils } from '../../../shared/utility/validation-utility';
import { BeneficiaryDetailsService } from '../../../../core/services/beneficiary-details.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';


@Component({
  selector: 'general-comorbidity-concurrent-conditions',
  templateUrl: './comorbidity-concurrent-conditions.component.html',
  styleUrls: ['./comorbidity-concurrent-conditions.component.css']
})
export class ComorbidityConcurrentConditionsComponent implements OnInit, DoCheck {

  @Input('comorbidityHistory')
  comorbidityConcurrentConditionsForm: FormGroup;

  @Input('mode')
  mode: string;

  @Input('visitCategory')
  visitType: any;

  comorbidtyData: any;
  comorbidityMasterData: any;
  comorbidityFilteredMasterData: any;
  previousSelectedComorbidity = [];
  comorbiditySelectList = [];
  currentLanguageSet: any;
  ComorbidStatus: string="false";

  constructor(
    private fb: FormBuilder,
    private dialog: MdDialog,
    private nurseService: NurseService,
    private doctorService: DoctorService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private confirmationService: ConfirmationService,
    public httpServiceService: HttpServiceService,
    private masterdataService: MasterdataService) {
      this.nurseService.listen().subscribe((m:any) => {
        console.log(m);
        this.onComorbidFilterClick(m);
    });
     }
     onComorbidFilterClick(comorb)
      {
     
        let comorbidstat=localStorage.getItem("setComorbid");

        let visitCat=localStorage.getItem("visiCategoryANC");
        if(comorbidstat == "true" && visitCat == "COVID-19 Screening")
        {
          this.ComorbidStatus="true";
       
        }
        else{
          this.ComorbidStatus="false";
        }
        
      }
     
  ngOnInit() {
    this.assignSelectedLanguage();
    this.getMasterData();
    this.getBeneficiaryDetails();
  }
  ngOnChanges()
  {
   
  }

  ngOnDestroy() {
    if (this.nurseMasterDataSubscription)
      this.nurseMasterDataSubscription.unsubscribe();

    if (this.generalHistorySubscription)
      this.generalHistorySubscription.unsubscribe();

    if (this.beneficiaryDetailSubscription)
      this.beneficiaryDetailSubscription.unsubscribe();
  }

  beneficiaryDetailSubscription: any;
  beneficiary: any;
  getBeneficiaryDetails() {
    this.beneficiaryDetailSubscription = this.beneficiaryDetailsService.beneficiaryDetails$
      .subscribe(beneficiary => {
        this.beneficiary = beneficiary;
      })
  }


  nurseMasterDataSubscription: any;
  getMasterData() {
    this.nurseMasterDataSubscription = this.masterdataService.nurseMasterData$.subscribe(masterData => {
      if (masterData) {
        this.nurseMasterDataSubscription.unsubscribe();
        this.comorbidityMasterData = masterData.comorbidConditions;
        this.comorbidityFilteredMasterData = masterData.comorbidConditions;

       
        this.addComorbidityConcurrentConditions();
   
        if (this.mode == 'view') {
          let visitID = localStorage.getItem('visitID');
          let benRegID = localStorage.getItem('beneficiaryRegID')
          this.getGeneralHistory(benRegID, visitID);
        }
        if(parseInt(localStorage.getItem("specialistFlag")) == 100)
        {
         
           let visitID = localStorage.getItem('visitID');
          let benRegID = localStorage.getItem('beneficiaryRegID')
          this.getGeneralHistory(benRegID, visitID);
        }
       
      }
    })
  }

  generalHistorySubscription: any;
  getGeneralHistory(benRegID, visitID) {
    this.generalHistorySubscription = this.doctorService.getGeneralHistoryDetails(benRegID, visitID).subscribe(history => {
      if (history != null && history.statusCode == 200 && history.data != null && history.data.ComorbidityConditions) {
        this.comorbidtyData = history.data.ComorbidityConditions;
        this.handleComorbidityData();
      }
    })
  }

  handleComorbidityData() {
    let formArray = this.comorbidityConcurrentConditionsForm.controls['comorbidityConcurrentConditionsList'] as FormArray;
    let temp = this.comorbidtyData.comorbidityConcurrentConditionsList.slice();

    for (let i = 0; i < temp.length; i++) {
      let comorbidityTypeArr = this.comorbidityMasterData.filter(item => {
        return item.comorbidCondition == temp[i].comorbidCondition;
      });

      if (comorbidityTypeArr.length > 0)
        temp[i].comorbidConditions = comorbidityTypeArr[0];

      if (temp[i].comorbidCondition) {
        let k = formArray.get('' + i);
        k.patchValue(temp[i]);
        k.markAsTouched();
        this.filterComorbidityConcurrentConditionsType(temp[i].comorbidCondition, i);
      }

      if (i + 1 < temp.length)
        this.addComorbidityConcurrentConditions();
    }
  }

  addComorbidityConcurrentConditions() {
    let comorbidityConcurrentConditionsList = <FormArray>this.comorbidityConcurrentConditionsForm.controls['comorbidityConcurrentConditionsList'];
    let temp = comorbidityConcurrentConditionsList.value;

    if (this.comorbidityFilteredMasterData) {
      let result = this.comorbidityFilteredMasterData.filter((item) => {
        let arr = temp.filter((value) => {
          if (value.comorbidConditions != null && value.comorbidConditions.comorbidCondition != "Other")
            return value.comorbidConditions.comorbidCondition == item.comorbidCondition;
          else
            return false;
        });
        // let flag = arr.length == 0 ? true : false;
        // return flag;
        if (item.comorbidCondition == "None" && temp.length > 0)
          return false;
        else if (arr.length == 0)
          return true;
        else
          return false;
      });

      this.comorbiditySelectList.push(result.slice());
    }
    comorbidityConcurrentConditionsList.push(this.initComorbidityConcurrentConditions());
  }

  removeComorbidityConcurrentConditions(i, comorbidityConcurrentConditionsForm?: FormGroup) {
    this.confirmationService.confirm(`warn`, this.currentLanguageSet.alerts.info.warn).subscribe(result => {
      if (result) {
        let comorbidityConcurrentConditionsList = <FormArray>this.comorbidityConcurrentConditionsForm.controls['comorbidityConcurrentConditionsList'];
        if (comorbidityConcurrentConditionsList.length == 1 && !!comorbidityConcurrentConditionsForm) {
          comorbidityConcurrentConditionsForm.patchValue({
            comorbidConditions: null,
            otherComorbidCondition: null,
            timePeriodAgo: null,
            timePeriodUnit: null,
            isForHistory: null
          })
          // comorbidityConcurrentConditionsForm.reset();
        }
        else {
          let removedValue = this.previousSelectedComorbidity[i];

          this.comorbiditySelectList.map((item, t) => {
            if (t != i && removedValue && removedValue.comorbidCondition != 'Other') {
              item.push(removedValue);
              this.sortComorbidityList(item);
            }
          })

          this.previousSelectedComorbidity.splice(i, 1);
          this.comorbiditySelectList.splice(i, 1);

          comorbidityConcurrentConditionsList.removeAt(i);
        }
        this.comorbidityConcurrentConditionsForm.markAsDirty();
      }
    });

  }

  filterComorbidityConcurrentConditionsType(comorbidityConcurrentConditions, i, comorbidityConcurrentConditionsForm?: FormGroup) {
    let previousValue = this.previousSelectedComorbidity[i];
    if (comorbidityConcurrentConditions.comorbidCondition == 'None') {
      this.removeComorbidityExecptNone();
    }
    if (comorbidityConcurrentConditionsForm && comorbidityConcurrentConditions.comorbidCondition != 'Other')
      comorbidityConcurrentConditionsForm.patchValue({ otherComorbidCondition: null });

    if (previousValue) {
      this.comorbiditySelectList.map((item, t) => {
        if (t != i && previousValue.comorbidCondition != 'Other') {
          item.push(previousValue);
          this.sortComorbidityList(item);
        }
      })
    }

    this.comorbiditySelectList.map((item, t) => {
      let index = item.indexOf(comorbidityConcurrentConditions);
      if (index != -1 && t != i && comorbidityConcurrentConditions.comorbidCondition != 'Other')
        item = item.splice(index, 1);
    })

    this.previousSelectedComorbidity[i] = comorbidityConcurrentConditions;
  }

  removeComorbidityExecptNone() {
    let comorbidityConcurrentConditionsList = <FormArray>this.comorbidityConcurrentConditionsForm.controls['comorbidityConcurrentConditionsList'];

    while (comorbidityConcurrentConditionsList.length > 1) {
      let i = comorbidityConcurrentConditionsList.length - 1;

      let removedValue = this.previousSelectedComorbidity[i];
      if (removedValue)
        this.comorbiditySelectList[0].push(removedValue);
        
      this.sortComorbidityList(this.comorbiditySelectList[0]);
      
      comorbidityConcurrentConditionsList.removeAt(i);
      this.previousSelectedComorbidity.splice(i, 1);
      this.comorbiditySelectList.splice(i, 1);
    }
  }

  getPreviousComorbidityHistory() {
    let benRegID = localStorage.getItem('beneficiaryRegID');
    this.nurseService.getPreviousComorbidityHistory(benRegID, this.visitType)
      .subscribe(res => {
        if (res.statusCode == 200 && res.data != null) {
          if (res.data.data.length > 0) {
            this.viewPreviousData(res.data);
          } else {
            this.confirmationService.alert(this.currentLanguageSet.historyData.ancHistory.previousHistoryDetails.pastHistoryalert);
          }
        } else {
          this.confirmationService.alert(this.currentLanguageSet.alerts.info.errorFetchingHistory, 'error');
        }
      }, err => {
        this.confirmationService.alert(this.currentLanguageSet.alerts.info.errorFetchingHistory, 'error');
      })
  }

  viewPreviousData(data) {
    this.dialog.open(PreviousDetailsComponent, {
      data: { 'dataList': data, title: this.currentLanguageSet.historyData.comorbiditycondition.previouscomorbidityhistory }
    });
  }

  initComorbidityConcurrentConditions() {
    return this.fb.group({
      comorbidConditions: null,
      otherComorbidCondition: null,
      timePeriodAgo: null,
      timePeriodUnit: null,
      isForHistory: null
    })
  }

  validateDuration(formGroup: FormGroup, event?: Event) {
    let duration = null;
    let durationUnit = null;
    let flag = true;

    if (formGroup.value.timePeriodAgo)
      duration = formGroup.value.timePeriodAgo;

    if (formGroup.value.timePeriodUnit)
      durationUnit = formGroup.value.timePeriodUnit;

    if (duration != null && durationUnit != null)
      flag = new ValidationUtils().validateDuration(duration, durationUnit, this.beneficiary.age);

    if (!flag) {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.durationGreaterThanAge);
      formGroup.patchValue({ timePeriodAgo: null, timePeriodUnit: null })
    }
  }

  sortComorbidityList(comorbidityList) {
    comorbidityList.sort((a, b) => {
      if (a.comorbidCondition == b.comorbidCondition) return 0;
      if (a.comorbidCondition < b.comorbidCondition) return -1;
      else return 1;
    })
  }

  checkValidity(comorbidityConcurrentConditions) {
    let temp = comorbidityConcurrentConditions.value;
    if (temp.comorbidConditions && temp.timePeriodAgo && temp.timePeriodUnit) {
      return false;
    } else {
      return true;
    }
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }
}
