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


import { Component, OnInit, Input, ChangeDetectorRef, DoCheck } from '@angular/core';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';

import { MdDialog } from '@angular/material';
import { PreviousDetailsComponent } from '../../../../core/components/previous-details/previous-details.component';

import { BeneficiaryDetailsService } from '../../../../core/services/beneficiary-details.service';
import { ConfirmationService } from '../../../../core/services/confirmation.service';

import { MasterdataService, NurseService, DoctorService } from '../../../shared/services';
import { ValidationUtils } from '../../../shared/utility/validation-utility';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'general-past-history',
  templateUrl: './past-history.component.html',
  styleUrls: ['./past-history.component.css']
})
export class PastHistoryComponent implements OnInit, DoCheck {

  @Input('pastHistory')
  pastHistoryForm: FormGroup;

  @Input('mode')
  mode: string;

  @Input('visitCategory')
  visitType: any;

  surgeryMasterData: any;
  filteredSurgeryMasterData: any;
  pastSurgerySelectList = [];
  previousSelectedSurgeryTypeList = [];

  illnessMasterData: any;
  filteredIllnessMasterData: any;
  pastIllnessSelectList = [];
  previousSelectedIllnessTypeList = [];

  pastHistoryData: any;
  currentLanguageSet: any;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private dialog: MdDialog,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private confirmationService: ConfirmationService,
    private nurseService: NurseService,
    public httpServiceService: HttpServiceService,
    private doctorService: DoctorService,
    private masterdataService: MasterdataService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.getBeneficiaryDetails();
    // if(parseInt(sessionStorage.getItem("specialistFlag")) == 100)
    // {
    //   this.getMMUMasterData();
    // }
    // else
    // {
       this.getMasterData();
    // }
   
   
  
  }
  // patchHistory()
  // {
  //   if(parseInt(sessionStorage.getItem("specialistFlag")) == 100 && this.filteredIllnessMasterData)
  //   {
  //   //   this.addPastIllness();
  //   // this.addPastSurgery();
  //      let visitID = localStorage.getItem('visitID');
  //     let benRegID = localStorage.getItem('beneficiaryRegID')
  //     this.getGeneralHistory(benRegID, visitID);
  //   }
  // }
  ngOnChanges() {
    // if(parseInt(sessionStorage.getItem("specialistFlag")) == 100)
    // {
    //    let visitID = localStorage.getItem('visitID');
    //   let benRegID = localStorage.getItem('beneficiaryRegID')
    //   this.getGeneralHistory(benRegID, visitID);
    // }
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
        if (beneficiary) {
          this.beneficiary = beneficiary;
        }
      })
  }

  nurseMasterDataSubscription: any;
  femaleSurgeryList = ["Uterine Surgery", "Surgery on Vagina", "Surgery on Cervix", "Dilatation & Curettage (D&C)", "Cesarean Section"];
  getMasterData() {
  
  
    this.nurseMasterDataSubscription = this.masterdataService.nurseMasterData$
    .subscribe(masterData => {

        if (masterData && masterData.illnessTypes && masterData.surgeryTypes) {
          this.nurseMasterDataSubscription.unsubscribe();
          console.log("Nurse Master Called==")

          this.illnessMasterData = masterData.illnessTypes.slice();
          this.filteredIllnessMasterData = masterData.illnessTypes.slice();

          this.surgeryMasterData = masterData.surgeryTypes.slice();

          if (this.beneficiary && (this.beneficiary.genderName.toLowerCase() != "female" || this.beneficiary.ageVal <= 18)) {
            let temp = this.surgeryMasterData.filter(item => {
              return this.femaleSurgeryList.indexOf(item.surgeryType) < 0;
            });
            this.surgeryMasterData = temp;
          }
          this.filteredSurgeryMasterData = this.surgeryMasterData.slice();
          this.addPastIllness();
          this.addPastSurgery();

          console.log("Add Past Illness Called==")
          // if (this.mode == 'view' || parseInt(localStorage.getItem("specialistFlag")) != 100) {
          //   this.addPastIllness();
          //   this.addPastSurgery();
          // }

          this.changeDetectorRef.detectChanges();

          if(parseInt(localStorage.getItem("specialistFlag")) == 100)
          {
           
             let visitID = localStorage.getItem('visitID');
            let benRegID = localStorage.getItem('beneficiaryRegID')
            this.getGeneralHistory(benRegID, visitID);

            console.log("General History Called==")
          }

          if (this.mode == 'view') {
            let visitID = localStorage.getItem('visitID');
            let benRegID = localStorage.getItem('beneficiaryRegID')
            this.getGeneralHistory(benRegID, visitID);
          }


         
        
         
        }
      })
  }

  // getMMUMasterData() {
  

  

  //   this.nurseMasterDataSubscription = this.masterdataService.nurseMasterData$
  //     .subscribe(masterData => {
  //       if (masterData && masterData.illnessTypes && masterData.surgeryTypes) {
  //         this.illnessMasterData = masterData.illnessTypes.slice();
  //         this.filteredIllnessMasterData = masterData.illnessTypes.slice();

  //         console.log("filteredIllnessMasterData",this.filteredIllnessMasterData)

  //         this.surgeryMasterData = masterData.surgeryTypes.slice();

  //         if (this.beneficiary && (this.beneficiary.genderName.toLowerCase() != "female" || this.beneficiary.ageVal <= 18)) {
  //           let temp = this.surgeryMasterData.filter(item => {
  //             return this.femaleSurgeryList.indexOf(item.surgeryType) < 0;
  //           });
  //           this.surgeryMasterData = temp;
  //         }

  //         this.filteredSurgeryMasterData = this.surgeryMasterData.slice();
         

  //         // if (this.mode == 'view' || parseInt(localStorage.getItem("specialistFlag")) != 100) {
  //         //   this.addPastIllness();
  //         //   this.addPastSurgery();
  //         // }
  //         this.addPastIllness();
  //         this.addPastSurgery();

  //         this.changeDetectorRef.detectChanges();

  //       // this.patchHistory();
         
  //         if(parseInt(sessionStorage.getItem("specialistFlag")) == 100)
  //         {
           
  //            let visitID = localStorage.getItem('visitID');
  //           let benRegID = localStorage.getItem('beneficiaryRegID')
  //           this.getGeneralHistory(benRegID, visitID);
  //         }
         
  //       }
  //     })
      
  // }

  generalHistorySubscription: any;
  getGeneralHistory(benRegID, visitID) {
    this.generalHistorySubscription = this.doctorService.getGeneralHistoryDetails(benRegID, visitID).subscribe(history => {
      if (history != null && history.statusCode == 200 && history.data != null && history.data.PastHistory) {
        this.pastHistoryData = history.data.PastHistory;
        this.handlePastHistoryIllnessData();
        this.handlePastHistorySurgeryData();

      }
    })
  }

  handlePastHistoryIllnessData() {
    let formArray = this.pastHistoryForm.controls['pastIllness'] as FormArray;
    let temp = [];
    if (this.pastHistoryData && this.pastHistoryData.pastIllness)
      temp = this.pastHistoryData.pastIllness.slice();

    for (let i = 0; i < temp.length; i++) {
      let illnessType = this.illnessMasterData.filter(item => {
        return item.illnessType == temp[i].illnessType;
      });

      if (illnessType.length > 0)
        temp[i].illnessType = illnessType[0];


      if (temp[i].illnessType) {
        let k = formArray.get('' + i);
        k.patchValue(temp[i]);
        k.markAsTouched();
        this.filterPastIllnessType(temp[i].illnessType, i);

       
      }

      if (i + 1 < temp.length)
        this.addPastIllness();
    }
  }

  handlePastHistorySurgeryData() {
    let formArray = this.pastHistoryForm.controls['pastSurgery'] as FormArray;

    let temp = [];
    if (this.pastHistoryData && this.pastHistoryData.pastSurgery)
      temp = this.pastHistoryData.pastSurgery.slice();

    for (let i = 0; i < temp.length; i++) {
      let surgeryType = this.surgeryMasterData.filter(item => {
        return item.surgeryType == temp[i].surgeryType;
      });

      if (surgeryType.length > 0)
        temp[i].surgeryType = surgeryType[0];


      if (temp[i].surgeryType) {
        let k = formArray.get('' + i);
        k.patchValue(temp[i]);
        k.markAsTouched();
        this.filterPastSurgeryType(temp[i].surgeryType, i);
      }

      console.log("FormArray",formArray);

      if (i + 1 < temp.length)
        this.addPastSurgery();
    }
  }

  addPastIllness() {
    let pastIllnessList = <FormArray>this.pastHistoryForm.controls['pastIllness'];
    let temp = pastIllnessList.value;

    if (this.filteredIllnessMasterData) {
      let result = this.filteredIllnessMasterData.filter((item) => {
        let arr = temp.filter((value) => {
          if (value.illnessType != null && value.illnessType.illnessType != "Other")
            return value.illnessType.illnessType == item.illnessType;
          else
            return false;
        });

        if (item.illnessType == "None" && temp.length > 0)
          return false;
        else if (arr.length == 0)
          return true;
        else
          return false;
      });
      this.pastIllnessSelectList.push(result.slice());
    }
    pastIllnessList.push(this.initPastIllness());
  }

  removePastIllness(i, pastIllnessForm?: FormGroup) {
    this.confirmationService.confirm(`warn`, this.currentLanguageSet.alerts.info.warn).subscribe(result => {
      if (result) {
        let pastIllnessList = <FormArray>this.pastHistoryForm.controls['pastIllness'];

        if (pastIllnessList.length == 1 && !!pastIllnessForm) {
          pastIllnessForm.reset();
          this.pastHistoryForm.markAsDirty();
        } else {
          let removedValue = this.previousSelectedIllnessTypeList[i];
          if (removedValue) {
            this.pastIllnessSelectList.map((item, t) => {
              if (t != i && removedValue.illnessType != 'Other') {
                item.push(removedValue);
                this.sortIllnessList(item);
              }
            })
          }

          if (i == 0) {
            let temp = this.pastIllnessSelectList[i].filter(t => t.illnessType == "None");
            if (temp && temp[0]) {
              this.pastIllnessSelectList[i + 1].push(temp[0]);
              this.sortIllnessList(this.pastIllnessSelectList[i + 1]);
            }
          }

          this.previousSelectedIllnessTypeList.splice(i, 1);
          this.pastIllnessSelectList.splice(i, 1);
          pastIllnessList.removeAt(i);
        }
      }
    });
  }

  removeAllIllnessExceptNone() {
    let pastIllnessList = <FormArray>this.pastHistoryForm.controls['pastIllness'];

    while (pastIllnessList.length > 1) {
      let i = pastIllnessList.length - 1;

      let removedValue = this.previousSelectedIllnessTypeList[i];
      if (removedValue)
        this.pastIllnessSelectList[0].push(removedValue);

      pastIllnessList.removeAt(i);
      this.pastIllnessSelectList.splice(i, 1);

      this.previousSelectedIllnessTypeList.splice(i, 1);

    }

    this.sortIllnessList(this.pastIllnessSelectList[0]);
  }

  filterPastIllnessType(illness, i, pastIllnessForm?: FormGroup) {
    let previousValue = this.previousSelectedIllnessTypeList[i];

    if (pastIllnessForm && illness.illnessType != 'Other')
      pastIllnessForm.patchValue({ otherIllnessType: null });

    if (illness.illnessType == "None") {
      this.removeAllIllnessExceptNone();
    } else {
      if (previousValue) {
        this.pastIllnessSelectList.map((item, t) => {
          if (t != i && previousValue.illnessType != 'Other') {
            item.push(previousValue);
            this.sortIllnessList(item);
          }
        })
      }

      this.pastIllnessSelectList.map((item, t) => {
        let index = item.indexOf(illness);
        if (index != -1 && t != i && illness.illnessType != 'Other') {
          item = item.splice(index, 1);
        }
      });

      this.previousSelectedIllnessTypeList[i] = illness;
    }

    console.log("IllnessMaster",this.pastIllnessSelectList)
  }

  addPastSurgery() {
    let pastSurgeryList = <FormArray>this.pastHistoryForm.controls['pastSurgery'];
    let temp = pastSurgeryList.value;

    if (this.filteredSurgeryMasterData) {
      let result = this.filteredSurgeryMasterData.filter((item) => {
        let arr = temp.filter((value) => {
          if (value.surgeryType != null && value.surgeryType.surgeryType != "Other")
            return value.surgeryType.surgeryType == item.surgeryType;
        })

        if (item.surgeryType == "None" && temp.length > 0)
          return false;
        else if (arr.length == 0)
          return true;
        else
          return false;
      });
      this.pastSurgerySelectList.push(result.slice());
    }
    pastSurgeryList.push(this.initPastSurgery());
  }

  removePastSurgery(i, pastSurgeryForm?: FormGroup) {
    this.confirmationService.confirm(`warn`, this.currentLanguageSet.alerts.info.warn).subscribe(result => {
      if (result) {
        let pastSurgeryList = <FormArray>this.pastHistoryForm.controls['pastSurgery'];
        this.pastHistoryForm.markAsDirty();
        if (pastSurgeryList.length == 1 && !!pastSurgeryForm) {
          pastSurgeryForm.reset();
        } else {
          let removedValue = this.previousSelectedSurgeryTypeList[i];
          if (removedValue) {
            this.pastSurgerySelectList.map((item, t) => {
              if (t != i && removedValue.surgeryType != 'Other') {
                item.push(removedValue);
                this.sortSurgeryList(item);
              }
            })
          }

          if (i == 0) {
            let temp = this.pastSurgerySelectList[i].filter(t => t.surgeryType == "None");
            if (temp && temp[0]) {
              this.pastSurgerySelectList[i + 1].push(temp[0]);
              this.sortSurgeryList(this.pastSurgerySelectList[i + 1]);
            }
          }

          this.previousSelectedSurgeryTypeList.splice(i, 1);
          this.pastSurgerySelectList.splice(i, 1);
          pastSurgeryList.removeAt(i);
        }
      }
    });

  }

  removeAllSurgeryExceptNone() {
    let pastSurgeryList = <FormArray>this.pastHistoryForm.controls['pastSurgery'];

    while (pastSurgeryList.length > 1) {
      let i = pastSurgeryList.length - 1;

      let removedValue = this.previousSelectedSurgeryTypeList[i];
      if (removedValue)
        this.pastSurgerySelectList[0].push(removedValue);
        
      this.sortSurgeryList(this.pastSurgerySelectList[0]);
      
      pastSurgeryList.removeAt(i);
      this.previousSelectedSurgeryTypeList.splice(i, 1);
      this.pastSurgerySelectList.splice(i, 1);
    }
  }

  filterPastSurgeryType(surgery, i, pastSurgeryForm?: FormGroup) {
    let previousValue = this.previousSelectedSurgeryTypeList[i];

    if (pastSurgeryForm && surgery.surgeryType != 'Other')
      pastSurgeryForm.patchValue({ otherSurgeryType: null });

    if (surgery && surgery.surgeryType == "None") {
      this.removeAllSurgeryExceptNone();
    } else {

      if (previousValue) {
        this.pastSurgerySelectList.map((item, t) => {
          if (t != i && previousValue.surgeryType != 'Other') {
            item.push(previousValue);
            this.sortSurgeryList(item);
          }
        })
      }

      this.pastSurgerySelectList.map((item, t) => {
        let index = item.indexOf(surgery);
        if (index != -1 && t != i && surgery.surgeryType != 'Other')
          item = item.splice(index, 1);
      })

      this.previousSelectedSurgeryTypeList[i] = surgery;
    }
  }

  initPastIllness() {
    return this.fb.group({
      illnessTypeID: null,
      illnessType: null,
      otherIllnessType: null,
      timePeriodAgo: null,
      timePeriodUnit: null
    })
  }

  initPastSurgery() {
    return this.fb.group({
      surgeryID: null,
      surgeryType: null,
      otherSurgeryType: null,
      timePeriodAgo: null,
      timePeriodUnit: null
    })
  }

  getPreviousPastHistory() {
    let benRegID = localStorage.getItem('beneficiaryRegID');
    this.nurseService.getPreviousPastHistory(benRegID, this.visitType)
      .subscribe(res => {
        if (res.statusCode == 200 && res.data != null) {
          if (res.data.data.length > 0) {
            this.viewPreviousData(res.data);
          } else {
            this.confirmationService.alert(this.currentLanguageSet.alerts.info.pastHistoryNot);
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
      data: { 'dataList': data, title: this.currentLanguageSet.historyData.Previousillness.previouspasthistory }
    });
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

  sortIllnessList(illnessList) {
    illnessList.sort((a, b) => {
      if (a.illnessType == b.illnessType) return 0;
      if (a.illnessType < b.illnessType) return -1;
      else return 1;
    })
  }

  checkIllnessValidity(illnessForm) {
    let temp = illnessForm.value;
    if (temp.illnessType && temp.illnessType != 'None' && temp.timePeriodAgo && temp.timePeriodUnit) {
      return false;
    } else {
      return true;
    }
  }

  sortSurgeryList(surgeryList) {
    surgeryList.sort((a, b) => {
      if (a.surgeryType == b.surgeryType) return 0;
      if (a.surgeryType < b.surgeryType) return -1;
      else return 1;
    })
  }

  checkSurgeryValidity(surgeryForm) {
    let temp = surgeryForm.value;
    if (temp.surgeryType && temp.surgeryType != 'None' && temp.timePeriodAgo && temp.timePeriodUnit) {
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
