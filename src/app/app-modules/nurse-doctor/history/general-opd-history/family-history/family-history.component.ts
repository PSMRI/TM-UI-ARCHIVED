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
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';

import { PreviousDetailsComponent } from '../../../../core/components/previous-details/previous-details.component';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { MasterdataService, NurseService, DoctorService } from '../../../shared/services';
import { ConfirmationService } from '../../../../core/services/confirmation.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'general-family-history',
  templateUrl: './family-history.component.html',
  styleUrls: ['./family-history.component.css']
})
export class FamilyHistoryComponent implements OnInit, DoCheck {

  @Input('familyHistory')
  familyHistoryForm: FormGroup;

  @Input('mode')
  mode: string;

  @Input('visitCategory')
  visitType: any;

  masterData: any;
  familyHistoryData: any;

  diseaseMasterData = [];
  familyMemeberMasterData = [];
  previousSelectedDiseaseList = [];
  diseaseSelectList = [];
  currentLanguageSet: any;
  snomedCode: any;
  snomedTerm: any;

  constructor(
    private fb: FormBuilder,
    private dialog: MdDialog,
    private nurseService: NurseService,
    private doctorService: DoctorService,
    private confirmationService: ConfirmationService,
    public httpServiceService: HttpServiceService,
    private masterdataService: MasterdataService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.getMasterData();
  }

  ngOnChanges()
  {
  
  }

  ngOnDestroy() {
    if (this.nurseMasterDataSubscription)
      this.nurseMasterDataSubscription.unsubscribe();

    if (this.generalHistorySubscription)
      this.generalHistorySubscription.unsubscribe();
  }

  nurseMasterDataSubscription: any;
  getMasterData() {
    this.nurseMasterDataSubscription = this.masterdataService.nurseMasterData$.subscribe(masterData => {
      if (masterData) {
        this.nurseMasterDataSubscription.unsubscribe();
        this.masterData = masterData;
        this.diseaseMasterData = masterData.DiseaseTypes;
        // this.snomedCode = masterData.DiseaseTypes.snomedCode;
        // this.snomedTerm = masterData.DiseaseTypes.snomedTerm;
        this.familyMemeberMasterData = masterData.familyMemberTypes;
      
        this.addFamilyDisease();
        
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
      if (history != null && history.statusCode == 200 && history.data != null && history.data.FamilyHistory) {
        this.familyHistoryData = history.data.FamilyHistory;
        this.handleFamilyHistoryData();
      }
    })
  }

  handleFamilyHistoryData() {
    this.familyHistoryForm.patchValue(this.familyHistoryData);
    let formArray = this.familyHistoryForm.controls['familyDiseaseList'] as FormArray;
    let temp = this.familyHistoryData.familyDiseaseList.slice();

    for (let i = 0; i < temp.length; i++) {
      let diseaseType = this.diseaseMasterData.filter(item => {
        return item.diseaseType == temp[i].diseaseType;
      });

      if (diseaseType.length > 0)
        temp[i].diseaseType = diseaseType[0];
        // temp[i].snomedCode = this.snomedCode[0];
        // temp[i].snomedTerm = this.snomedTerm[0];
        // console.log("diseaseType",   temp[i].diseaseType)
        // console.log("snomedTerm", temp[i].snomedTerm)

      if (temp[i].diseaseType) {
        let k = formArray.get('' + i);
        k.patchValue(temp[i]);
        k.markAsTouched();
        this.filterFamilyDiseaseList(temp[i].diseaseType, i);
      }

      if (i + 1 < temp.length)
        this.addFamilyDisease();
    }
  }

  addFamilyDisease() {
    let familyDiseaseList = <FormArray>this.familyHistoryForm.controls['familyDiseaseList'];
    let temp = familyDiseaseList.value;

    if (this.diseaseMasterData) {
      let result = this.diseaseMasterData.filter((item) => {
        let arr = temp.filter((value) => {
          if (value.diseaseType != null && value.diseaseType.diseaseType != "Other")
            return value.diseaseType.diseaseType == item.diseaseType;
            
          else
            return false
        });
        if (item.diseaseType == "None" && temp.length > 0)
          return false;
        else if (arr.length == 0)
          return true;
        else
          return false;
        // let flag = arr.length == 0 ? true : false;
        // return flag;
      });
      this.diseaseSelectList.push(result.slice());
    }
    familyDiseaseList.push(this.initFamilyDiseaseList());
  }

  filterFamilyDiseaseList(disease, i, familyDiseaseForm?: FormGroup) {
    let previousValue = this.previousSelectedDiseaseList[i];
    if (disease.diseaseType == 'None') {
      this.removeFamilyDiseaseExecptNone();
    }

    if (familyDiseaseForm && disease.diseaseType != 'Other')
      familyDiseaseForm.patchValue({ otherDiseaseType: null,snomedCode : disease.snomedCode, snomedTerm : disease.snomedTerm});

    if (previousValue) {
      this.diseaseSelectList.map((item, t) => {
        if (t != i && previousValue.diseaseType != 'Other') {
          item.push(previousValue);
          this.sortDiseaseList(item);
        }
      })
    }

  // if(disease.snomedCode){
  // familyDiseaseForm.patchValue({c})
  // }

    this.diseaseSelectList.map((item, t) => {
      let index = item.indexOf(disease);
      if (index != -1 && t != i && disease.diseaseType != 'Other')
        item = item.splice(index, 1);
    })

    this.previousSelectedDiseaseList[i] = disease;
  }

  removeFamilyDiseaseExecptNone() {
    let familyDiseaseList = <FormArray>this.familyHistoryForm.controls['familyDiseaseList'];
    while (familyDiseaseList.length > 1) {
      let i = familyDiseaseList.length - 1;

      let removedValue = this.previousSelectedDiseaseList[i];
      if (removedValue)
        this.diseaseSelectList[0].push(removedValue);
        
      this.sortDiseaseList(this.diseaseSelectList[0]);
      familyDiseaseList.removeAt(i);
      this.previousSelectedDiseaseList.splice(i, 1);
      this.diseaseSelectList.splice(i, 1);
    }
  }

  removeFamilyDisease(i, familyHistoryForm?: FormGroup) {
    this.confirmationService.confirm(`warn`, this.currentLanguageSet.alerts.info.warn).subscribe(result => {
      if (result) {
        let familyDiseaseList = <FormArray>this.familyHistoryForm.controls['familyDiseaseList'];
        this.familyHistoryForm.markAsDirty();
        if (!!familyHistoryForm && familyDiseaseList.length == 1) {
          familyHistoryForm.reset();
        } else {
          let removedValue = this.previousSelectedDiseaseList[i];
          this.diseaseSelectList.map((item, t) => {
            if (t != i && removedValue && removedValue.diseaseType != 'Other') {
              item.push(removedValue);
              this.sortDiseaseList(item);
            }
          })
          this.previousSelectedDiseaseList.splice(i, 1);
          this.diseaseSelectList.splice(i, 1);
          familyDiseaseList.removeAt(i);
        }
      }
    });
  }

  getPreviousFamilyHistory() {
    let benRegID = localStorage.getItem('beneficiaryRegID');
    this.nurseService.getPreviousFamilyHistory(benRegID, this.visitType)
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
      data: { 'dataList': data, title: this.currentLanguageSet.historyData.ancHistory.familyHistoryDataANC_OPD_NCD_PNC
      .previousFamilyHistory }
    });
  }

  initFamilyDiseaseList() {
    return this.fb.group({
      diseaseTypeID: null,
      diseaseType: null,
      otherDiseaseType: null,
      familyMembers: null,
      snomedCode: null,
      snomedTerm: null
    });
  }

  get isGeneticDisorder() {
    return this.familyHistoryForm.controls['isGeneticDisorder'].value;
  }

  resetOtherGeneticOrder() {
    this.familyHistoryForm.patchValue({ geneticDisorder: null });
  }

  sortDiseaseList(diseaseList) {
    diseaseList.sort((a, b) => {
      if (a.diseaseType == b.diseaseType) return 0;
      if (a.diseaseType < b.diseaseType) return -1;
      else return 1;
    })
  }

  checkValidity(diseaseForm) {
    let temp = diseaseForm.value;
    if (temp.diseaseType && temp.familyMembers) {
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
