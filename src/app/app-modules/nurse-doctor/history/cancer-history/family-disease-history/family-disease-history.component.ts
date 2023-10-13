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


import { Component, OnInit, Input, OnChanges, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { MasterdataService, DoctorService, NurseService } from '../../../shared/services';
import { BeneficiaryDetailsService } from '../../../../core/services/beneficiary-details.service'

import { ConfirmationService } from '../../../../core/services/confirmation.service';

import { PreviousDetailsComponent } from '../../../../core/components/previous-details/previous-details.component';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { CancerUtils } from '../../../shared/utility/cancer-utility';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';


@Component({
  selector: 'nurse-cancer-family-disease-history',
  templateUrl: './family-disease-history.component.html',
  styleUrls: ['./family-disease-history.component.css']
})
export class FamilyDiseaseHistoryComponent implements OnInit, DoCheck {
  @Input('cancerPatientFamilyMedicalHistoryForm')
  cancerPatientFamilyMedicalHistoryForm: FormGroup;

  @Input('mode')
  mode: string;

  familyHistoryData: any;
  beneficiary: any;
  templateNurseMasterData;
  templateCancerDiseaseType;
  templateFamilyMemberType;

  filterCancerDiseaseType;
  filterFamilyMemebers: any;
  temp = [];
  previousValue = [];
  otherDiseaseType: any;

  formUtils: CancerUtils;
  currentLanguageSet: any;

  constructor(private fb: FormBuilder,
    private masterdataService: MasterdataService,
    private doctorService: DoctorService,
    private dialog: MdDialog,
    private nurseService: NurseService,
    private confirmationService: ConfirmationService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    public httpServiceService: HttpServiceService
  ) {
    this.formUtils = new CancerUtils(this.fb);
  }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.getNurseMasterData();
    this.getBenificiaryDetails();
  }

  ngOnChanges() {

  }

  handleFamilyHistoryData() {

    let formArray = this.cancerPatientFamilyMedicalHistoryForm.controls['diseases'] as FormArray;
    let temp = this.familyHistoryData.slice();

    for (let i = 0; i < temp.length; i++) {
      let cancerType = this.templateCancerDiseaseType.filter(item => {
        return item.cancerDiseaseType == temp[i].cancerDiseaseType;
      })

      let otherCancerObj = this.templateCancerDiseaseType.filter(item => {
        return item.cancerDiseaseType == 'Any other Cancer';
      })

      if (cancerType.length > 0)
        temp[i].cancerDiseaseType = cancerType[0];
      else if (temp[i].cancerDiseaseType) {
        temp[i].otherDiseaseType = temp[i].cancerDiseaseType;
        temp[i].cancerDiseaseType = otherCancerObj[0];
      }

      if (temp[i].cancerDiseaseType) {
        let k = formArray.get('' + i);
        k.patchValue(temp[i]);
        k.markAsTouched();
        this.filterFamilyMember(temp[i].cancerDiseaseType, i);
      }

      if (i + 1 < temp.length)
        this.addFamilyDisease();
    }
  }

  ngOnDestroy() {
    if (this.nurseMasterDataSubscription)
      this.nurseMasterDataSubscription.unsubscribe();

    if (this.beneficiaryDetailSubscription)
      this.beneficiaryDetailSubscription.unsubscribe();

    if (this.cancerHistorySubscription)
      this.cancerHistorySubscription.unsubscribe();
  }

  nurseMasterDataSubscription: any;
  getNurseMasterData() {
    this.nurseMasterDataSubscription = this.masterdataService.nurseMasterData$.subscribe((nurseMasterData) => {
      if (nurseMasterData) {
        this.nurseMasterDataSubscription.unsubscribe();
        this.templateNurseMasterData = nurseMasterData;
        this.templateCancerDiseaseType = this.templateNurseMasterData.CancerDiseaseType;
        this.filterCancerDiseaseType = this.templateCancerDiseaseType.slice();
        this.templateFamilyMemberType = this.templateNurseMasterData.familyMemberTypes;
        this.filterFamilyMemebers = this.templateFamilyMemberType;
        this.temp[0] = { diseaseType: this.templateCancerDiseaseType.slice() };

        if (this.mode == 'view') {
          let visitID = localStorage.getItem('visitID');
          let benRegID = localStorage.getItem('beneficiaryRegID')
          this.getCancerHistory(benRegID, visitID);
        }
        if(parseInt(localStorage.getItem("specialistFlag")) == 100)
        {
           let visitID = localStorage.getItem('visitID');
          let benRegID = localStorage.getItem('beneficiaryRegID')
          this.getCancerHistory(benRegID, visitID);
        }
      
      }
    });
  }

  cancerHistorySubscription: any;
  getCancerHistory(benRegID, visitID) {
    this.cancerHistorySubscription = this.doctorService.getCancerHistoryDetails(benRegID, visitID).subscribe(history => {
      if (history != null && history.statusCode == 200 && history.data != null) {
        let cancerHistoryData = history.data;
        this.familyHistoryData = cancerHistoryData.benFamilyHistory;
        this.handleFamilyHistoryData();
      }
    })
  }

  beneficiaryDetailSubscription: any;
  getBenificiaryDetails() {
    this.beneficiaryDetailSubscription = this.beneficiaryDetailsService.beneficiaryDetails$
      .subscribe(beneficiaryDetails => {
        if (beneficiaryDetails)
          console.log('beneficiary', beneficiaryDetails);
      })
  }

  filterFamilyMember(type, i, familyDiseaseForm?: FormGroup) {
    let arr = this.templateCancerDiseaseType.filter(item => {
      return item.cancerDiseaseType == type.cancerDiseaseType;
    })

    if (this.previousValue[i]) {
      this.temp.map((item, t) => {
        if (t != i && item.diseaseType.indexOf(this.previousValue[i]) < 0) {
          item.diseaseType = item.diseaseType.concat([this.previousValue[i]]);
          this.sortDiseaseList(item.diseaseType);
        }
      });
    }

    if (familyDiseaseForm) {
      if (type.cancerDiseaseType != 'Any other Cancer') {
        familyDiseaseForm.patchValue({ snomedCode: type.snomedCode, snomedTerm: type.snomedTerm });
      this.temp.map((item, t) => {
        let index = item.diseaseType.indexOf(arr[0]);
        if (index >= 0 && t != i)
          item.diseaseType.splice(index, 1);
      });
    }
    else {
      familyDiseaseForm.patchValue({ snomedCode: null, snomedTerm: null });
    }
  }

    this.filterFamilyMemebers = this.templateFamilyMemberType.filter(item => {
      return (type.gender == 'unisex' || item.gender == type.gender)
    })
    this.temp[i].familyMemebers = this.filterFamilyMemebers;
    this.previousValue[i] = type;
  }

  addFamilyDisease() {
    const newDisease = <FormArray>this.cancerPatientFamilyMedicalHistoryForm.controls['diseases'];

    let result = [];
    let i, j;
    let array1 = newDisease.value;
    for (i = 0; i < this.filterCancerDiseaseType.length; i++) {
      let flag = false;
      for (j = 0; j < array1.length; j++) {
        if (array1[j].cancerDiseaseType != null && array1[j].cancerDiseaseType.cancerDiseaseType != 'Any other Cancer' && this.filterCancerDiseaseType[i].cancerDiseaseType == array1[j].cancerDiseaseType.cancerDiseaseType) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        result.push(this.filterCancerDiseaseType[i]);
      }
    }

    this.temp.push({ diseaseType: result.slice() });
    newDisease.push(this.formUtils.initDiseases());
  }

  removeDisease(i: number, diseaseForm?: FormGroup) {
    this.confirmationService.confirm(`warn`, this.currentLanguageSet.alerts.info.warn).subscribe(result => {
      if (result) {
        const newDisease = <FormArray>this.cancerPatientFamilyMedicalHistoryForm.controls['diseases'];

        this.cancerPatientFamilyMedicalHistoryForm.markAsDirty();
        if (newDisease.length == 1) {
          diseaseForm.reset();
        } else {
          let arr = this.templateCancerDiseaseType.filter(item => {
            if (newDisease.value[i].cancerDiseaseType)
              return item.cancerDiseaseType == newDisease.value[i].cancerDiseaseType.cancerDiseaseType;
          })

          if (arr.length >= 1 && arr[0].cancerDiseaseType != 'Any other Cancer') {
            this.temp.map(item => {
              if (item.diseaseType.indexOf(arr[0]) < 0) {
                item.diseaseType = item.diseaseType.concat(arr);
                this.sortDiseaseList(item.diseaseType);
              }
            });
          }

          this.previousValue.splice(i, 1);
          newDisease.removeAt(i);
          this.temp.splice(i, 1);
        }
      }
    });

  }

  getPreviousCancerFamilyHistory() {
    let benRegID = localStorage.getItem('beneficiaryRegID');
    this.nurseService.getPreviousCancerFamilyHistory(benRegID)
      .subscribe(data => {
        if (data != null && data.data != null) {
          if (data.data.data.length > 0) {
            this.viewPreviousData(data.data);
          } else {
            this.confirmationService.alert(this.currentLanguageSet.alerts.info.previousInfo);
          }
        } else {
          this.confirmationService.alert(data.errorStatus, 'error');
        }
      }, err => {
        this.confirmationService.alert(err, 'error');
      })
  }

  viewPreviousData(data) {
    this.dialog.open(PreviousDetailsComponent, {
      data: { 'dataList': data, title: this.currentLanguageSet.historyData.familyhistory.previousfamilyhistory }
    });
  }

  sortDiseaseList(diseaseList) {
    diseaseList.sort((a, b) => {
      if (a.cancerDiseaseType == b.cancerDiseaseType) return 0;
      if (a.cancerDiseaseType < b.cancerDiseaseType) return -1;
      else return 1;
    })
  }

  checkValidity(diseaseForm) {
    let temp = diseaseForm.value;
    if (temp.cancerDiseaseType && temp.familyMemberList) {
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
