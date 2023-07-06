import { Component, OnInit, Input } from "@angular/core";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";
import * as moment from 'moment';

@Component({
  selector: "app-history-case-sheet",
  templateUrl: "./history-case-sheet.component.html",
  styleUrls: ["./history-case-sheet.component.css"]
})
export class HistoryCaseSheetComponent implements OnInit {
  @Input("previous")
  previous: any;
  @Input("data")
  caseSheetData: any;

  pastIllnessList: any;
  pastSurgeryList: any;
  familyHistory: any;
  childOptionalVaccineList: any;
  comorbidConditionList: any;
  medicationHistoryList: any;
  femaleObstetricHistory: any;
  developmentalHistory: any;
  feedingHistory: any;
  menstrualHistory: any;
  perinatalHistory: any;
  personalHistory: any;
  immunizationHistory: any;
  visitCategory : any;
  beneficiary: any;
  ANCDetailsAndFormula: any;
  generalhistory: any;
  date : any;
  referDetails : any;
  blankRows = [1, 2, 3, 4];
  current_language_set: any;
  serviceList: String = "";
  previousPhysicalList: any;

  constructor(public httpServiceService: HttpServiceService) {}

  ngOnInit() {
    this.visitCategory = localStorage.getItem("caseSheetVisitCategory");
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
    // this.changeLanguage();
    this.assignSelectedLanguage();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }

  ngOnChanges() {
    if (this.caseSheetData && this.caseSheetData.BeneficiaryData) {
      this.beneficiary = this.caseSheetData.BeneficiaryData;
      if (
        this.caseSheetData.nurseData &&
        this.caseSheetData.nurseData.history
      ) {
        this.generalhistory = this.caseSheetData.nurseData.history;
        if (this.caseSheetData.nurseData.anc)
          this.ANCDetailsAndFormula = this.caseSheetData.nurseData.anc.ANCCareDetail;
        if (
          this.caseSheetData.nurseData.history.PastHistory &&
          this.caseSheetData.nurseData.history.PastHistory.pastIllness
        )
          this.pastIllnessList = this.caseSheetData.nurseData.history.PastHistory.pastIllness;
        if (
          this.caseSheetData.nurseData.history.PastHistory &&
          this.caseSheetData.nurseData.history.PastHistory.pastSurgery
        )
          this.pastSurgeryList = this.caseSheetData.nurseData.history.PastHistory.pastSurgery;
        if (this.caseSheetData.nurseData.history.FamilyHistory)
          this.familyHistory = this.caseSheetData.nurseData.history.FamilyHistory;
          if (this.caseSheetData.nurseData.history.PhysicalActivityHistory)
          this.previousPhysicalList = this.caseSheetData.nurseData.history.PhysicalActivityHistory;   
        if (
          this.caseSheetData.nurseData.history.childOptionalVaccineHistory &&
          this.caseSheetData.nurseData.history.childOptionalVaccineHistory
            .childOptionalVaccineList
        )
          this.childOptionalVaccineList = this.caseSheetData.nurseData.history.childOptionalVaccineHistory.childOptionalVaccineList;
        if (
          this.caseSheetData.nurseData.history.ComorbidityConditions &&
          this.caseSheetData.nurseData.history.ComorbidityConditions
            .comorbidityConcurrentConditionsList
        )
          this.comorbidConditionList = this.caseSheetData.nurseData.history.ComorbidityConditions.comorbidityConcurrentConditionsList;
        if (
          this.caseSheetData.nurseData.history.MedicationHistory &&
          this.caseSheetData.nurseData.history.MedicationHistory
            .medicationHistoryList
        )
          this.medicationHistoryList = this.caseSheetData.nurseData.history.MedicationHistory.medicationHistoryList;
        if (this.caseSheetData.nurseData.history.FemaleObstetricHistory)
          this.femaleObstetricHistory = this.caseSheetData.nurseData.history.FemaleObstetricHistory;
        if (this.caseSheetData.nurseData.history.DevelopmentHistory)
          this.developmentalHistory = this.caseSheetData.nurseData.history.DevelopmentHistory;
        if (this.caseSheetData.nurseData.history.FeedingHistory)
          this.feedingHistory = this.caseSheetData.nurseData.history.FeedingHistory;
        if (this.caseSheetData.nurseData.history.MenstrualHistory)
          this.menstrualHistory = this.caseSheetData.nurseData.history.MenstrualHistory;
        if (this.caseSheetData.nurseData.history.PerinatalHistory)
          this.perinatalHistory = this.caseSheetData.nurseData.history.PerinatalHistory;
        if (this.caseSheetData.nurseData.history.PersonalHistory)
          this.personalHistory = this.caseSheetData.nurseData.history.PersonalHistory;
        if (this.caseSheetData.nurseData.history.ImmunizationHistory)
          this.immunizationHistory = this.caseSheetData.nurseData.history.ImmunizationHistory;  
        console.log(
          "generalhistory",
          JSON.stringify(this.generalhistory, null, 4)
        );
      }
    }

    let t = new Date();
    this.date = t.getDate() + "/" + (t.getMonth() + 1) + "/" + t.getFullYear();
    if (this.caseSheetData && this.caseSheetData.doctorData) { 
  this.referDetails = this.caseSheetData.doctorData.Refer;
  if(this.referDetails && this.referDetails.refrredToAdditionalServiceList){
    console.log("institute",this.referDetails.refrredToAdditionalServiceList);
    for(let i  = 0; i <  this.referDetails.refrredToAdditionalServiceList.length;i++){
      if (this.referDetails.refrredToAdditionalServiceList[i].serviceName){
        this.serviceList += this.referDetails.refrredToAdditionalServiceList[i].serviceName;
      if(i>=0 &&
        i < this.referDetails.refrredToAdditionalServiceList.length - 1)
        this.serviceList += ",";
      }          
    }
  }
}
  // console.log("referDetails" , this.referDetails);
  console.log(
    "referDetailsForRefer",
    JSON.stringify(this.referDetails, null, 4)
  );
  
  if(this.caseSheetData && this.caseSheetData.doctorData.Refer && this.referDetails.revisitDate && !(moment(this.referDetails.revisitDate, 'DD/MM/YYYY',true).isValid()))
  {
    let sDate = new Date(this.referDetails.revisitDate);
    this.referDetails.revisitDate = [
      this.padLeft.apply(sDate.getDate()),
      this.padLeft.apply((sDate.getMonth() + 1)),
      this.padLeft.apply(sDate.getFullYear())].join('/')
  }  
  }

  language_file_path: any = "./assets/";
  language: any;

  changeLanguage() {
    this.language = sessionStorage.getItem("setLanguage");

    if (this.language != undefined) {
      this.httpServiceService
        .getLanguage(this.language_file_path + this.language + ".json")
        .subscribe(
          response => {
            if (response) {
              this.current_language_set = response[this.language];
            } else {
              console.log(
                this.current_language_set.alerts.info.comingUpWithThisLang +
                  " " +
                  this.language
              );
            }
          },
          error => {
            console.log(
              this.current_language_set.alerts.info.comingUpWithThisLang +
                " " +
                this.language
            );
          }
        );
    } else {
      this.httpServiceService.currentLangugae$.subscribe(
        response => (this.current_language_set = response)
      );
    }
    
  }
  padLeft() {
    let len = (String(10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join('0') + this : this;
  }
  

}
