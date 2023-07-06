import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { PreviousDetailsComponent } from '../../../../core/components/previous-details/previous-details.component';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { MasterdataService, NurseService, DoctorService } from '../../../shared/services';
import { ConfirmationService } from '../../../../core/services/confirmation.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'general-menstrual-history',
  templateUrl: './menstrual-history.component.html',
  styleUrls: ['./menstrual-history.component.css']
})
export class MenstrualHistoryComponent implements OnInit, DoCheck {

  @Input('menstrualHistory')
  menstrualHistoryForm: FormGroup;

  @Input('mode')
  mode: string;

  @Input('visitCategory')
  visitType: any;

  menstrualHistoryData: any;
  masterData: any;
  today: any;
  minimumLMPDate: any;
  currentLanguageSet: any;
  constructor(
    private fb: FormBuilder,
    private dialog: MdDialog,
    private nurseService: NurseService,
    public httpServiceService: HttpServiceService,
    private doctorService: DoctorService,
    private confirmationService: ConfirmationService,
    private masterdataService: MasterdataService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.getMasterData();
    this.today = new Date();
    this.minimumLMPDate = new Date(this.today.getTime() - (365 * 24 * 60 * 60 * 1000));
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
      if (masterData && masterData.menstrualCycleStatus && masterData.menstrualCycleLengths && masterData.menstrualCycleBloodFlowDuration && masterData.menstrualProblem) {
        this.nurseMasterDataSubscription.unsubscribe();
        this.masterData = masterData;
        this.checkVisitType()
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

  checkVisitType() {

    if (this.visitType == 'ANC') {
      let temp = 'Amenorrhea';
      temp = this.masterData.menstrualCycleStatus.filter(item => {
        return item.name == temp;
      })[0];
      this.menstrualHistoryForm.patchValue({ menstrualCycleStatus: temp })
    }

  }

  generalHistorySubscription: any;
  getGeneralHistory(benRegID, visitID) {
    this.generalHistorySubscription = this.doctorService.getGeneralHistoryDetails(benRegID, visitID).subscribe(history => {
      if (history != null && history.statusCode == 200 && history.data != null && history.data.MenstrualHistory) {
        let temp = history.data.MenstrualHistory;
        console.log('history.data.MenstrualHistory', temp);

        temp.menstrualCycleStatus = this.masterData.menstrualCycleStatus.filter(item => {
          return item.name == temp.menstrualCycleStatus;
        })[0];
        // this.menstrualHistoryForm.controls['menstrualCycleStatus'].setValue(status[0]);
        temp.cycleLength = this.masterData.menstrualCycleLengths.filter(item => {
          return item.menstrualCycleRange == temp.cycleLength;
        })[0];
        temp.bloodFlowDuration = this.masterData.menstrualCycleBloodFlowDuration.filter(item => {
          return item.menstrualCycleRange == temp.bloodFlowDuration;
        })[0];
        // temp.problemName = this.masterData.menstrualProblem.filter(item => {
        //   return item.name == temp.problemName;
        // })[0];
        let tempMenstrualProblem = [];
        if (temp.menstrualProblemList && temp.menstrualProblemList.length > 0) {
          this.masterData.menstrualProblem.forEach(menstrualProblem => {
            temp.menstrualProblemList.forEach((menstrualProblemValue) => {
              if (menstrualProblem.problemName == menstrualProblemValue.problemName) {
                tempMenstrualProblem.push(menstrualProblem);
              }
            })
          });
        }


        temp.menstrualProblemList = tempMenstrualProblem.slice();
        temp.lMPDate = new Date(temp.lMPDate);

        this.menstrualHistoryForm.patchValue(temp);
      }
    })
  }

  getPreviousMenstrualHistory() {
    let benRegID = localStorage.getItem('beneficiaryRegID');
    this.nurseService.getPreviousMenstrualHistory(benRegID, this.visitType)
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
      data: { 'dataList': data, title: this.currentLanguageSet.historyData.Previousmenstrualhistory.previousmenstrualhistory }
    });
  }

  get menstrualCycleStatus() {
    return this.menstrualHistoryForm.controls['menstrualCycleStatus'].value;
  }

  get lMPDate() {
    return this.lMPDate.controls['lMPDate'].value;
  }
  checkMenstrualCycleStatus() {
    console.log('here in to check');

    if (this.visitType == 'ANC') {
      this.menstrualHistoryForm.patchValue({
        menstrualCycleStatusID: null,
        regularity: null,
        cycleLength: null,
        menstrualCyclelengthID: null,
        menstrualFlowDurationID: null,
        bloodFlowDuration: null,
        menstrualProblemID: null,
        problemName: null,
      })
    } else {
      this.menstrualHistoryForm.patchValue({
        menstrualCycleStatusID: null,
        regularity: null,
        cycleLength: null,
        menstrualCyclelengthID: null,
        menstrualFlowDurationID: null,
        bloodFlowDuration: null,
        menstrualProblemID: null,
        problemName: null,
        lMPDate: null
      })
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
