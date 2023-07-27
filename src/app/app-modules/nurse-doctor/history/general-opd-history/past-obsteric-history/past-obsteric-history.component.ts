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


import { Component, OnInit, Input, ViewChildren, QueryList, ElementRef,SimpleChanges, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';

import { PreviousDetailsComponent } from '../../../../core/components/previous-details/previous-details.component';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { MasterdataService, NurseService, DoctorService } from '../../../shared/services';
import { ConfirmationService } from '../../../../core/services/confirmation.service';
import { GeneralUtils } from '../../../shared/utility';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { BeneficiaryDetailsService } from 'app/app-modules/core/services';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'general-past-obsteric-history',
  templateUrl: './past-obsteric-history.component.html',
  styleUrls: ['./past-obsteric-history.component.css']
})
export class PastObstericHistoryComponent implements OnInit, DoCheck {

  @Input('pastObstericHistory')
  pastObstericHistoryForm: FormGroup;

  @Input('mode')
  mode: string;

  @Input('visitCategory')
  visitType: any;

  masterData: any;
  formUtility: any;
  pastObstericHistoryData: any;

  complicationOptionConstraints = [];
  currentLanguageSet: any;


  constructor(
    private fb: FormBuilder,
    private dialog: MdDialog,
    private nurseService: NurseService,
    private doctorService: DoctorService,
    public httpServiceService: HttpServiceService,
    private confirmationService: ConfirmationService,
    private masterdataService: MasterdataService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,) {
    this.formUtility = new GeneralUtils(this.fb);
  }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.subscribeTotalNoofPregChanges();
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.currentLanguageSet = response);
    this.getMasterData();
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.pastObstericHistoryForm) {
      for (let i = 0; i < (<FormArray>this.pastObstericHistoryForm.controls['pastObstericHistoryList']).length; i++) {
        this.complicationOptionConstraints.push({
          showOtherPregnancyComplication: false,
          disableNonePregnancyComplication: false,
          showAllPregComplication: true,

          showOtherDeliveryComplication: false,
          disableNoneDeliveryComplication: false,
          showAllDeliveryComplication: true,

          showOtherPostpartumComplication: false,
          disableNonePostpartumComplication: false,
          showAllPostpartumComplication: true,

          showOtherPostComplication: false,
          disableNonePostComplication: false,
          showAllPostComplication: true

        })
      }
    }
  }

  ngOnDestroy() {
    if (this.nurseMasterDataSubscription)
      this.nurseMasterDataSubscription.unsubscribe();

    if (this.totalNoofPregChangeSubs)
      this.totalNoofPregChangeSubs.unsubscribe();

    if (this.generalHistorySubscription)
      this.generalHistorySubscription.unsubscribe();

    let temp = this.pastObstericHistoryForm.controls['pastObstericHistoryList'] as FormArray;
    this.clearFormArray(temp);

    let temp1 = this.pastObstericHistoryForm.controls['complicationPregList'] as FormArray;
    this.clearFormArray(temp1);

    if (localStorage.getItem('serviceLineDetails')) {
      let vanID = JSON.parse(localStorage.getItem('serviceLineDetails')).vanID;
      let parkingPlaceID = JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID

      this.pastObstericHistoryForm.reset({
        vanID, parkingPlaceID
      });
    }

  }

  clearFormArray(formArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  selectDeliveryTypes: any;
  nurseMasterDataSubscription: any;
  getMasterData() {
    this.nurseMasterDataSubscription = this.masterdataService.nurseMasterData$.subscribe(masterData => {
      if (masterData) {
        this.nurseMasterDataSubscription.unsubscribe();
        this.masterData = masterData;
        this.selectDeliveryTypes = this.masterData.deliveryTypes;

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
    this.generalHistorySubscription = this.doctorService.getGeneralHistoryDetails(benRegID, visitID)
      .subscribe(history => {
        if (history != null && history.statusCode == 200 && history.data != null && history.data.FemaleObstetricHistory) {
          this.pastObstericHistoryData = history.data.FemaleObstetricHistory;
          this.handlePastObstetricHistoryData();
        }
      })
  }

  handlePastObstetricHistoryData() {
    if (this.pastObstericHistoryData.totalNoOfPreg)
      this.pastObstericHistoryForm.patchValue({ totalNoOfPreg: this.pastObstericHistoryData.totalNoOfPreg });

    let formArray = this.pastObstericHistoryForm.controls['pastObstericHistoryList'] as FormArray;
    let complicationPregList = <FormArray>this.pastObstericHistoryForm.controls['complicationPregList'];

    let temp = JSON.parse(JSON.stringify(this.pastObstericHistoryData.femaleObstetricHistoryList));

    for (let i = 0; i < temp.length; i++) {

      if (temp[i].pregOrder) {
        this.togglePastObstericHistory({ checked: true }, i + 1);

        let temp1 = [];
        this.masterData.pregComplicationTypes.forEach(item => {
          temp[i].pregComplicationList.forEach(p => {
            if (p.pregComplicationType == item.pregComplicationType) {
              temp1.push(item);
            }
          });
        });

        temp[i].pregComplicationList = temp1.slice();

        temp[i].durationType = this.masterData.pregDuration.filter(item => {
          return temp[i].durationType == item.durationType
        })[0];

        temp[i].deliveryType = this.masterData.deliveryTypes.filter(item => {
          return temp[i].deliveryType == item.deliveryType
        })[0];

        temp[i].deliveryPlace = this.masterData.deliveryPlaces.filter(item => {
          return temp[i].deliveryPlace == item.deliveryPlace
        })[0];

        // temp[i].deliveryComplicationType = this.masterData.deliveryComplicationTypes.filter(item => {
        //   return temp[i].deliveryComplicationType == item.complicationValue
        // })[0];

        let temp2 = [];
        this.masterData.deliveryComplicationTypes.forEach(item => {
          temp[i].deliveryComplicationList.forEach(p => {
            if (p.deliveryComplicationType == item.deliveryComplicationType) {
              temp2.push(item);
            }
          });
        });

        temp[i].deliveryComplicationList = temp2.slice();

        // temp[i].postpartumComplicationType = this.masterData.postpartumComplicationTypes.filter(item => {
        //   return temp[i].postpartumComplicationType == item.complicationValue
        // })[0];

        let temp3 = [];
        this.masterData.postpartumComplicationTypes.forEach(item => {
          temp[i].postpartumComplicationList.forEach(p => {
            if (p.postpartumComplicationType == item.postpartumComplicationType) {
              temp3.push(item);
            }
          });
        });

        temp[i].postpartumComplicationList = temp3.slice();

        temp[i].pregOutcome = this.masterData.pregOutcomes.filter(item => {
          return temp[i].pregOutcome == item.pregOutcome
        })[0];

        // temp[i].postNatalComplication = this.masterData.postNatalComplications.filter(item => {
        //   return temp[i].postNatalComplication == item.complicationValue
        // })[0];

        temp[i].newBornComplication = this.masterData.newBornComplications.filter(item => {
          return temp[i].newBornComplication == item.complicationValue
        })[0];

        if (temp[i].pregOutcome && temp[i].pregOutcome.pregOutcome == "Abortion") {
          temp[i].abortionType = this.masterData.typeOfAbortion.filter(item => {
            return temp[i].typeOfAbortionValue == item.complicationValue
          })[0];

          temp[i].typeofFacility = this.masterData.serviceFacilities.filter(item => {
            return temp[i].serviceFacilityValue == item.facilityName
          })[0];
          if (temp[i].postAbortionComplication) {
            let temp4 = [];
            this.masterData.postAbortionComplications.forEach(item => {
              temp[i].postAbortionComplication.forEach(p => {
                if (p.complicationValue == item.complicationValue) {
                  temp4.push(item);
                }
              });
            });

            temp[i].postAbortionComplication = temp4.slice();
          }
        }
        
        let k = formArray.get('' + i) as FormGroup;
        k.patchValue(temp[i]);

        this.resetOtherDeliveryComplication(k, i);
        this.resetOtherPregnancyComplication(k, i);
        this.resetOtherPostpartumComplicationType(k, i);
        if (temp[i].pregOutcome && temp[i].pregOutcome.pregOutcome == "Abortion")
          this.resetPostComplicationType(k, i);

        if (complicationPregList.get('' + (temp[i].pregOrder - 1)))
          complicationPregList.get('' + (temp[i].pregOrder - 1)).patchValue({ value: true });
      }
    }

  }

  togglePastObstericHistory(event, i) {
    let pastObstericHistoryList = <FormArray>this.pastObstericHistoryForm.controls['pastObstericHistoryList'];

    if (event.checked) {
      pastObstericHistoryList.push(this.formUtility.initPastObstericHistory(i));
      this.complicationOptionConstraints.push({
        showOtherPregnancyComplication: false,
        disableNonePregnancyComplication: false,
        showAllPregComplication: true,

        showOtherDeliveryComplication: false,
        disableNoneDeliveryComplication: false,
        showAllDeliveryComplication: true,

        showOtherPostComplication: false,
        disableNonePostComplication: false,
        showAllPostComplication: true,

        showOtherPostpartumComplication: false,
        disableNonePostpartumComplication: false,
        showAllPostpartumComplication: true,
      });
    } else {
      let index = this.findPastObstericHistory(i);
      if (index > -1) {
        this.removePastObstericHistory(index, event, i);
        if (this.pastObstericHistoryData && this.pastObstericHistoryData.femaleObstetricHistoryList)
          this.pastObstericHistoryData.femaleObstetricHistoryList.splice(index, 1);
      }
    
    }
  }

  findPastObstericHistory(i) {
    let pastObstericHistoryList = <FormArray>this.pastObstericHistoryForm.controls['pastObstericHistoryList'];
    let temp = -1;
    pastObstericHistoryList.value.map((item, index) => {
      if (item.pregOrder == i) {
        temp = index;
      }
    })
    return temp;
  }

  removePastObstericHistory(i, event?: any, index?: any) {
    this.confirmationService.confirm(`warn`, this.currentLanguageSet.alerts.info.warn).subscribe(result => {
      if (result) {

        let pastObstericHistoryList = <FormArray>this.pastObstericHistoryForm.controls['pastObstericHistoryList'];
        this.pastObstericHistoryForm.markAsDirty();
        pastObstericHistoryList.removeAt(i);
     
      } else {
        let complicationPregList = <FormArray>this.pastObstericHistoryForm.controls['complicationPregList'];
        complicationPregList.at(index - 1).patchValue({ value: true });
      }
      this.complicationOptionConstraints.splice(index, 1);
    });
  }

  getPreviousObstetricHistory() {
    let benRegID = localStorage.getItem('beneficiaryRegID');
    this.nurseService.getPreviousObstetricHistory(benRegID, this.visitType)
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
      data: { 'dataList': data, title: this.currentLanguageSet.historyData.obstetrichistory.previousobstetrichistory }
    });
  }

  createPregnancyWithComplList(number) {
    let complicationPregList = <FormArray>this.pastObstericHistoryForm.controls['complicationPregList'];

    if (complicationPregList.length < number) {
      for (let i = complicationPregList.length; i < number; i++)
        complicationPregList.push(this.fb.group({ value: null }));
    } else {
      for (let i = complicationPregList.length - 1; i >= number; i--) {
        complicationPregList.removeAt(i);
        this.togglePastObstericHistory({ checked: false }, i + 1);
      }
    }
  }

  totalNoofPregChangeSubs: any;
  subscribeTotalNoofPregChanges() {
    this.totalNoofPregChangeSubs = this.pastObstericHistoryForm.controls['totalNoOfPreg'].valueChanges
      .subscribe(value => {
        console.log("%c status", "color:green", value);
        
        if (!!value) {
          if(this.visitType == 'ANC'){
            this.createPregnancyWithComplList(value - 1);
          }else{
            this.createPregnancyWithComplList(value);
          }
        };
      })
  }

  get totalNoOfPreg() {
    return this.pastObstericHistoryForm.controls['totalNoOfPreg'].value;
  }

  checkTotalPregnancy(totalNoOfPreg) {
    if (totalNoOfPreg == 0 && (this.visitType == 'ANC' || this.visitType == 'PNC')) {
      this.confirmationService.alert(this.currentLanguageSet.totalNumberOfPastPregnancyFor + " ", this.visitType, " " + this.currentLanguageSet.cannotBeZero);
    }
    // if (this.visitType == 'ANC' && totalNoOfPreg == 0)
    //   this.confirmationService.alert("Total number of past pregnancy for ANC(MultiGravida) can not be zero(0)");
  }


  resetOtherPregnancyComplication(pastObstericHistoryForm: FormGroup, index) {
    let pregComplicationList = pastObstericHistoryForm.value.pregComplicationList;
    let flag = false;

    pregComplicationList.forEach(item => {
      if (item.pregComplicationType == 'Other') {
        flag = true;
      }
    })

    this.complicationOptionConstraints[index].showOtherPregnancyComplication = flag;

    if (pregComplicationList.length > 1) {
      this.complicationOptionConstraints[index].disableNonePregnancyComplication = true;
      this.complicationOptionConstraints[index].showAllPregComplication = false;
    }
    else if (pregComplicationList.length == 1) {
      let t = pregComplicationList[0].pregComplicationType == 'None' ? false : true;
      this.complicationOptionConstraints[index].disableNonePregnancyComplication = t;
      this.complicationOptionConstraints[index].showAllPregComplication = false;
    }
    else {
      this.complicationOptionConstraints[index].disableNonePregnancyComplication = false;
      this.complicationOptionConstraints[index].showAllPregComplication = true;
    }

    if (!flag)
      pastObstericHistoryForm.patchValue({ otherPregComplication: null });
  }

  resetOtherDeliveryPlace(pastObstericHistoryForm) {
    if (pastObstericHistoryForm.value.deliveryPlace.deliveryPlace == 'Home-Supervised' || pastObstericHistoryForm.value.deliveryPlace.deliveryPlace == 'Home-Unsupervised') {
      let tempDeliveryTypes = this.masterData.deliveryTypes.filter(item => {
        return item.deliveryType != "Assisted Delivery" && item.deliveryType != "Cesarean Section (LSCS)";
      })
      this.selectDeliveryTypes = tempDeliveryTypes;
    } else {
      this.selectDeliveryTypes = this.masterData.deliveryTypes;
    }
    if (pastObstericHistoryForm.value.deliveryPlace.deliveryPlace == 'Other')
      pastObstericHistoryForm.patchValue({ otherDeliveryPlace: null });
  }

  showOtherDeliveryComplication = false;
  resetOtherDeliveryComplication(pastObstericHistoryForm, index) {
    let deliveryComplicationList = pastObstericHistoryForm.value.deliveryComplicationList;
    let flag = false;

    deliveryComplicationList.forEach(item => {
      if (item.deliveryComplicationType == 'Other') {
        flag = true;
      }
    })

    this.complicationOptionConstraints[index].showOtherDeliveryComplication = flag;

    if (deliveryComplicationList.length > 1) {
      this.complicationOptionConstraints[index].disableNoneDeliveryComplication = true;
      this.complicationOptionConstraints[index].showAllDeliveryComplication = false;
    }
    else if (deliveryComplicationList.length == 1) {
      let t = deliveryComplicationList[0].deliveryComplicationType == 'None' ? false : true;
      this.complicationOptionConstraints[index].disableNoneDeliveryComplication = t;
      this.complicationOptionConstraints[index].showAllDeliveryComplication = false;
    }
    else {
      this.complicationOptionConstraints[index].disableNoneDeliveryComplication = false;
      this.complicationOptionConstraints[index].showAllDeliveryComplication = true;
    }

    if (!flag)
      pastObstericHistoryForm.patchValue({ otherDeliveryComplication: null });
  }

  showOtherPostpartumComplication = false;
  resetOtherPostpartumComplicationType(pastObstericHistoryForm, index) {
    let postpartumComplicationList = pastObstericHistoryForm.value.postpartumComplicationList;

    let flag = false;

    postpartumComplicationList.forEach(item => {
      if (item.postpartumComplicationType == 'Other') {
        flag = true;
      }
    })

    this.complicationOptionConstraints[index].showOtherPostpartumComplication = flag;

    if (postpartumComplicationList.length > 1) {
      this.complicationOptionConstraints[index].disableNonePostpartumComplication = true;
      this.complicationOptionConstraints[index].showAllPostpartumComplication = false;
    }
    else if (postpartumComplicationList.length == 1) {
      let t = postpartumComplicationList[0].postpartumComplicationType == 'None' ? false : true;
      this.complicationOptionConstraints[index].disableNonePostpartumComplication = t;
      this.complicationOptionConstraints[index].showAllPostpartumComplication = false;
    }
    else {
      this.complicationOptionConstraints[index].disableNonePostpartumComplication = false;
      this.complicationOptionConstraints[index].showAllPostpartumComplication = true;
    }

    if (!flag)
      pastObstericHistoryForm.patchValue({ otherPostpartumCompType: null });
  }

  // resetOtherPostNatalComplication(pastObstericHistoryForm) {
  //   if (pastObstericHistoryForm.value.postNatalComplication.complicationValue == 'Other')
  //     pastObstericHistoryForm.patchValue({ otherPostNatalComplication: null });
  // }

  resetOtherNewBornComplications(pastObstericHistoryForm) {
    if (pastObstericHistoryForm.value.newBornComplication.complicationValue == 'Other')
      pastObstericHistoryForm.patchValue({ otherNewBornComplication: null });
  }
  resetPostComplicationType(pastObstericHistoryForm, index) {
    let postpartumComplicationList = pastObstericHistoryForm.value.postAbortionComplication;
    
    if (postpartumComplicationList.length > 1) {
      this.complicationOptionConstraints[index].disableNonePostComplication = true;
      this.complicationOptionConstraints[index].showAllPostComplication = false;
    }
    else if (postpartumComplicationList.length == 1) {
      let t = postpartumComplicationList[0].complicationValue == 'None' ? false : true;
      this.complicationOptionConstraints[index].disableNonePostComplication = t;
      this.complicationOptionConstraints[index].showAllPostComplication = false;
    }
    else {
      this.complicationOptionConstraints[index].disableNonePostComplication = false;
      this.complicationOptionConstraints[index].showAllPostComplication = true;
    }
  }

  trackComplication(complication, i) {
    return complication ? complication.value : undefined;
  }

  checkPregnancyOutcome(pastObstericHistoryForm) {
    if (pastObstericHistoryForm.value.pregOutcome.pregOutcome == 'Abortion') {
      pastObstericHistoryForm.patchValue({
        durationType: null,
        deliveryPlace: null,
        otherDeliveryPlace: null,
        deliveryType: null,
        deliveryComplicationList: null,
        otherDeliveryComplication: null,
        newBornComplication: null,
        otherNewBornComplication: null,
        congenitalAnomalies: null,
        abortionType:null,
        typeofFacility:null,
        pregDuration:null,
        postAbortionComplication:null
      })
    }

    if (pastObstericHistoryForm.value.pregOutcome.pregOutcome == 'Stillbirth') {
      pastObstericHistoryForm.patchValue({
        newBornComplication: null,
        otherNewBornComplication: null,
        congenitalAnomalies: null
      })
    }

  
  }

 
  onAbortionType(pastObstericHistoryForm: FormGroup,name)
  {
    if(name != "Induced")
    {
      pastObstericHistoryForm.patchValue({ typeofFacility: null }); 
    }    
  }
  checkDurationType(pastObstericHistoryForm: FormGroup) {
    if (Number(pastObstericHistoryForm.value.pregDuration) > 24 || Number(pastObstericHistoryForm.value.pregDuration < 4)) {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.pregnancyRange);
      pastObstericHistoryForm.patchValue({ pregDuration: null });
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
