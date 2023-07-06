import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MdDialog } from '@angular/material';
import { PreviousDetailsComponent } from 'app/app-modules/core/components/previous-details/previous-details.component';
import { BeneficiaryDetailsService } from 'app/app-modules/core/services';
import { ConfirmationService } from 'app/app-modules/core/services/confirmation.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { DoctorService, MasterdataService, NurseService } from 'app/app-modules/nurse-doctor/shared/services';
import { IdrsscoreService } from 'app/app-modules/nurse-doctor/shared/services/idrsscore.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'app-physical-activity-history',
  templateUrl: './physical-activity-history.component.html',
  styleUrls: ['./physical-activity-history.component.css']
})
export class PhysicalActivityHistoryComponent implements OnInit, DoCheck {

  @Input('physicalActivityHistory')
  physicalActivityHistory: FormGroup;

  @Input('mode')
  mode: string;

  @Input('visitCategory')
  visitCategory: any;
  masterData: any;
  physicalActivityQuestions: any;
  visitType: any;
  physicalActivityHistoryData: any;
  beneficiaryDetailSubscription: any;
  age: any;
  currentLanguageSet: any;

  constructor(private idrsScoreService: IdrsscoreService,
    private dialog: MdDialog,
    private confirmationService: ConfirmationService,
    private masterdataService: MasterdataService,
    private nurseService: NurseService,
    private doctorService: DoctorService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private httpServiceService: HttpServiceService,) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.getMasterData();
    this.getBeneficiaryDetails();
  }
  

  // getMasterData(){
  //   this.masterData = this.dummy;
  //   this.physicalActivityQuestions = this.masterData.physicalActivitQuestions
  //   console.log("questions", this.physicalActivityQuestions);

  // }
  ngOnChanges() {

    // if (this.mode == 'view') {
    //   let visitID = localStorage.getItem('visitID');
    //   let benRegID = localStorage.getItem('beneficiaryRegID')
    //   this.getGeneralHistory(benRegID, visitID);
    // }

  }
  nurseMasterDataSubscription: any;
  getMasterData() {

    // this.masterData = this.dummy;
    // this.diseaseMasterData = this.masterData.data.DiseaseTypes;
    // this.familyMemeberMasterData = this.masterData.data.familyMemberTypes;
    // this.addFamilyDisease();
    this.nurseMasterDataSubscription = this.masterdataService.nurseMasterData$.subscribe(masterData => {
      if (masterData) {
        this.nurseMasterDataSubscription.unsubscribe();
        this.masterData = masterData;
        this.physicalActivityQuestions = this.masterData.physicalActivity
        console.log("masterData", this.masterData);


        if (this.mode == 'view') {
          let visitID = localStorage.getItem('visitID');
          let benRegID = localStorage.getItem('beneficiaryRegID')
          let visitCategory = localStorage.getItem('visitCategory');
          if (visitID != null && benRegID != null && visitCategory == "NCD screening") {
            this.getGeneralHistory(benRegID, visitID);
          }
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
        this.physicalActivityHistoryData = history.data.PhysicalActivityHistory;
        if(this.physicalActivityHistoryData != undefined)
          this.handlePysicalActivityHistoryData();
      }
    })
  }
  handlePysicalActivityHistoryData() {
    this.physicalActivityHistory.patchValue(this.physicalActivityHistoryData)

    let selectedQuestion = this.physicalActivityQuestions.filter(item => {
      return item.activityType == this.physicalActivityHistoryData.activityType
    })
    if (selectedQuestion.length > 0) {
      this.idrsScoreService.setIRDSscorePhysicalActivity(selectedQuestion[0].score);
      // this.idrsScoreService.setIDRSScoreFlag();
    }

  }
  calculateIDRSScore(event, formGrpup) {
    console.log("event", event);
    console.log("form", formGrpup);

    let selectedQuestion = this.physicalActivityQuestions.filter(item => {
      return item.activityType == event.value
    })

    console.log("questionId", selectedQuestion);
    let questionID = selectedQuestion[0].pAID;
    let IDRSScoreForPhysicalActivity = selectedQuestion[0].score;
    this.physicalActivityHistory.patchValue({ pAID: questionID })
    this.physicalActivityHistory.patchValue({ score: IDRSScoreForPhysicalActivity })

    // this.physicalActivityHistory.patchValue(selectedQuestion);

    this.idrsScoreService.setIRDSscorePhysicalActivity(IDRSScoreForPhysicalActivity);
    this.idrsScoreService.setIDRSScoreFlag();

  }

  getPreviousPhysicalActivityHistory() {
    let benRegID = localStorage.getItem('beneficiaryRegID');
    this.nurseService.getPreviousPhysicalActivityHistory(benRegID, this.visitType)
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
      data: { 'dataList': data, title: this.currentLanguageSet.previousPhyscialActivityHistoryDetails }
    });
  }
  getBeneficiaryDetails() {
    this.beneficiaryDetailSubscription = this.beneficiaryDetailsService.beneficiaryDetails$
      .subscribe(beneficiary => {
        console.log("idrs", beneficiary);
        if (beneficiary) {
          if (beneficiary.ageVal) {
            this.age = beneficiary.ageVal;

          } else {
            this.age = 0;
          }
        }
      })
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
