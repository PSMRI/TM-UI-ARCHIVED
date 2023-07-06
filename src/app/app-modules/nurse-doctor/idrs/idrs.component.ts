import { Component, OnInit, Input, EventEmitter, Output, DoCheck } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import {
  BeneficiaryDetailsService,
  ConfirmationService,
} from "app/app-modules/core/services";
import { Observable, Subject, Subscription } from "rxjs";
import {
  NurseService,
  MasterdataService,
  DoctorService,
} from "../shared/services";
import { NCDScreeningUtils } from "../shared/utility";
import { IdrsscoreService } from "../shared/services/idrsscore.service";
import { MdDialog } from "@angular/material";
import { PreviousDetailsComponent } from "app/app-modules/core/components/previous-details/previous-details.component";
import { ActivatedRoute } from "@angular/router";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";

@Component({
  selector: "app-idrs",
  templateUrl: "./idrs.component.html",
  styleUrls: ["./idrs.component.css"],
})
export class IdrsComponent implements OnInit, DoCheck {
  @Input("idrsScreeningForm")
  idrsScreeningForm: FormGroup;

  @Input("patientMedicalForm")
  patientMedicalForm: FormGroup;

  @Input("ncdScreeningMode")
  mode: string;

  @Input("visitCategory")
  visitType: any;

  utils = new NCDScreeningUtils(this.fb);
  diseases: any = [];
  questions: any = [];
  beneficiaryDetailSubscription: any;
  age: number;
  idrsScore: number = 0;
  form: any;
  questGroup: FormGroup;
  arr: any = [];
  suspect: any = [];
  confirmDiseaseArray: any = [];
  questions1: any = [];
  idrsScoreWaist: number = 0; //private idrsScoreService : IdrsscoreService,
  idrsScoreFamily: number = 0;
  IRDSscorePhysicalActivity: number = 0;
  doctorScreen: boolean = false;
  @Output() IDRSChanged: EventEmitter<any> = new EventEmitter<any>();
  scoreFlag: any = 0;
  required: any = [];
  isDiabetic: boolean = false;
  isVision: boolean = false;
  isEpilepsy: boolean = false;
  chronicDisabled: boolean = false;
  chronicData: any;
  revisit: boolean = false;
  nurse: string;
  rev: any = [];
  confirmed: any = [];
  unchecked: any;
  systolicValueFromVital: number = 0;
  diastolicValueFromVital: number = 0;
  hypertensionChecked: boolean;

  /*Subscription */
  IDRSScoreFlagCheckSubscription: Subscription;
  visitDiseaseSubscription: Subscription;
  systolicBpValueSubscription: Subscription;
  diastolicBpValueSubscription: Subscription;
  hypertensionSelectedFlagSubscription: Subscription;
  currentLanguageSet: any;
 

  constructor(
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private route: ActivatedRoute,
    private dialog: MdDialog,
    private confirmationService: ConfirmationService,
    private idrsScoreService: IdrsscoreService,
    private masterdataService: MasterdataService,
    private fb: FormBuilder,
    private nurseService: NurseService,
    private doctorService: DoctorService,
    private httpServiceService: HttpServiceService
  ) { }

  ngOnInit() {
    this.suspect=[];
    this.confirmDiseaseArray=[];
    this.questions1=[];
    this.idrsScoreService.clearScoreFlag();
    this.idrsScoreService.clearDiabetesSelected();
    //this.idrsScoreService.clearDiseaseSelected();
    this.idrsScoreService.clearUnchecked();
    // this.idrsScoreService.clearDiastolicBp();
    // this.idrsScoreService.clearSystolicBp();
    this.idrsScoreService.clearHypertensionSelected();
    this.idrsScoreService.finalDiagnosisDiabetesConfirm(null);
    this.idrsScoreService.finalDiagnosisHypertensionConfirm(null);
    this.assignSelectedLanguage();
    console.log("currentMode", this.mode);
    /* Load disease questions and disease names master data  */
    this.getNurseMasterData();
    this.getBeneficiaryDetails();
    this.idrsWaistScore();
    this.idrsFamilyHistoryScore();
    this.idrsPhysicalScoreActivity();
    this.uncheckedDiseases();
    this.visitDiseases();
    this.idrsFlagScore();
    this.hypDiaAndSysBPObs();
    this.finalDiagnosis();
    this.finalDiagnosisHyper();

  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  /* Vitals and history */
  idrsWaistScore() {
    this.idrsScoreService.IDRSWaistScore$.subscribe((response) => {
      response === undefined
        ? (this.idrsScoreWaist = 0)
        : (this.idrsScoreWaist = response);
      this.patchIdrsScoreValue();
    });
  }
  idrsFamilyHistoryScore() {
    this.idrsScoreService.IDRSFamilyScore$.subscribe((response) => {
      response == undefined
        ? (this.idrsScoreFamily = 0)
        : (this.idrsScoreFamily = response);
      this.patchIdrsScoreValue();
    });
  }
  idrsPhysicalScoreActivity() {
    this.idrsScoreService.IDRSPhysicalActivityScore$.subscribe((response) => {
      response == undefined
        ? (this.IRDSscorePhysicalActivity = 0)
        : (this.IRDSscorePhysicalActivity = response);
      this.patchIdrsScoreValue();
    });
  }
  patchIdrsScoreValue() {
    this.idrsScreeningForm.patchValue({
      idrsScore:
        this.idrsScore +
        this.idrsScoreWaist +
        this.idrsScoreFamily +
        this.IRDSscorePhysicalActivity,
    });
  }
  /* Ends Vitals and History */

  /*Observable for adding suspected diseases  */
  uncheckedDiseases() {
    this.idrsScoreService.uncheckedDiseases$.subscribe((response) => {
      this.unchecked = response;
      if (this.unchecked !== undefined && this.unchecked !== null) {
        let flag = false;
        for (let value of this.questions1) {
          if (
            value.diseaseQuestionType === this.unchecked &&
            value.answer === "yes"
          )
            flag = true;
        }
        this.diseaseConfirmationBasedOnFlagValue(flag);
        this.pushUnCheckedDiseasesInArray();
      }
    });
  }
  diseaseConfirmationBasedOnFlagValue(flag) {
    if (!flag) {
      this.removeConfirmDiseaseArray(this.unchecked);
      for (let value of this.diseases) {
        if (value.disease.indexOf(this.unchecked) > -1) value.confirmed = false;
      }
    } else {
      this.removeConfirmDiseaseArray(this.unchecked);
      this.addToSuspected(this.unchecked);
      // this.suspect.push(this.unchecked);
      for (let value of this.diseases) {
        if (value.disease.indexOf(this.unchecked) > -1) {
          value.confirmed = false;
          value.false = false;
        }
      }
    }
  }
  pushUnCheckedDiseasesInArray() {
    this.required = [];
    for (let value of this.diseases) {
      if (
        value !== undefined &&
        value.flag !== undefined &&
        value.flag !== null &&
        value.confirmed === false &&
        value.flag === true
      )
        this.required.push(value.disease);
    }
    this.idrsScreeningForm.patchValue({ requiredList: this.required });
  }
  /*Ends Observable for adding suspected diseases  */

  /* Observable for adding Confirm Diseases */
  visitDiseases() {
    this.visitDiseaseSubscription =
      this.idrsScoreService.visitDiseases$.subscribe((response) => {
        this.confirmed = response;

        console.log("idrs confirmed", this.confirmed, this.confirmDiseaseArray);
        if (
          this.confirmed !== undefined &&
          this.confirmed !== null &&
          this.confirmed.length > 0
        ) {
          this.idrsScoreService.enableDiseaseConfirmation(true);
          for (let value of this.diseases) {
            value.confirmed = false;
          }
          for (let confirmDisease of this.confirmed) {
            for (let disease of this.diseases) {
              if (disease.disease.indexOf(confirmDisease) > -1)
                disease.confirmed = true;
            }
          }
          this.required = [];
          for (let value of this.diseases) {
            if (
              value !== undefined &&
              value.flag !== undefined &&
              value.flag !== null &&
              value.confirmed === false &&
              value.flag === true
            )
              this.required.push(value.disease);
          }
          console.log("confirmed", this.diseases);
          let flag = false;
          this.updateDiabetesQuestionValue();

          for (const confirmDisease of this.confirmed) {
            this.addToconfirmDiseaseArray(confirmDisease);
          }
          console.log("diseaseListSuspect", this.diseases);
          this.suspect.forEach((element) => {
            this.confirmDiseaseArray.forEach((element1) => {
              if (element1 === element) {
                this.removeSuspect(element);
              }

              if (element1 === "Diabetes") {
                this.idrsScoreService.clearDiabetesSelected();
              }
            });
          });
        }
      });
  }
  /*  Ends Observable for adding Confirm Diseases */
  updateDiabetesQuestionValue() {
    this.required.forEach((val, index) => {
      if (val === "Diabetes") {
        if (this.idrsScore + this.idrsScoreWaist + this.idrsScoreFamily + this.IRDSscorePhysicalActivity < 60) this.required.splice(index, 1);
      }
    });
    this.idrsScreeningForm.patchValue({ requiredList: this.required });
  }

  /* This observable for Vitals and history */
  idrsFlagScore() {
    this.IDRSScoreFlagCheckSubscription =
      this.idrsScoreService.IDRSScoreFlagCheck$.subscribe((response) => {
        this.scoreFlag = response;
        if (response == 1) {
          this.patchIdrsScoreValue();
          this.IDRSChanged.emit(false);
          let check = false;
          if (this.revisit) {
            if (this.isDiabetic === false) check = true;
          } else if (this.isDiabetic) {
            check = false;
          } else check = true;
          if (
            this.idrsScoreWaist +
            this.idrsScore +
            this.idrsScoreFamily +
            this.IRDSscorePhysicalActivity >=
            60 &&
            check == true
          ) {
            this.required = [];
            for (const disease of this.diseases) {
              if (disease.disease.indexOf("Diabetes") > -1) {
                let Rflag = false;
                for (let question of this.questions1) {
                  if (
                    question.diseaseQuestionType === "Diabetes" &&
                    question.answer === null
                  ) {
                    Rflag = true;
                    break;
                  }
                }
                if (!Rflag) disease.flag = false;
                else disease.flag = true;
              }
              if (
                disease !== undefined &&
                disease.flag !== undefined &&
                disease.flag !== null &&
                disease.confirmed === false &&
                disease.flag === true
              )
                this.required.push(disease.disease);
            }
            this.updateDiabetesQuestionValue();
            console.log(
              "requi",
              this.idrsScreeningForm.controls.requiredList.value
            );
          } else {
            this.required = [];
            for (const disease of this.diseases) {
              if (disease.disease.indexOf("Diabetes") > -1)
                disease.flag = false;
              if (
                disease != undefined &&
                disease.flag != undefined &&
                disease.flag != null &&
                disease.confirmed == false &&
                disease.flag == true
              )
                this.required.push(disease.disease);
            }
            this.updateDiabetesQuestionValue();
          }
        } else {
          this.IDRSChanged.emit(true);
        }
      });
  }
  finalDiagnosis() {
    this.idrsScoreService.finalDiagnosisDiseaseconfirm$.subscribe(
      (confirmation) => {
        if (confirmation === true) {
          this.addToconfirmDiseaseArray("Diabetes");
          if (this.suspect.includes("Diabetes")) {
            this.removeSuspect("Diabetes");
          }
          for (let confirmDisease of this.diseases) {
            if (confirmDisease.disease.indexOf("Diabetes") > -1)
              confirmDisease.confirmed = true;
          }
        } else {
          this.removeConfirmDiseaseArray("Diabetes");
          this.checkQuestionsToAddInSuspect("Diabetes");
          for (let confirmDisease of this.diseases) {
            if (confirmDisease.disease.indexOf("Diabetes") > -1)
              confirmDisease.confirmed = false;
          }
          // if (this.suspect.includes("Diabetes")) {
          //   this.checkQuestionsToAddInSuspect("Diabetes");
          // }
        }
      }
    );
  }
  checkQuestionsToAddInSuspect(disease) {
    for (let question of this.questions1) {
      if (
        question.diseaseQuestionType === disease &&
        question.answer === "yes"
      ) {
        this.addToSuspected("Diabetes");
        for (let value of this.diseases) {
          if (value.disease.indexOf("Diabetes") > -1) value.confirmed = false;
        }
        break;
      }
    }
  }
  finalDiagnosisHyper() {
    this.idrsScoreService.finalDiagnosisHypertensionConfirmation$.subscribe(
      (hyperConfirm) => {
        if (hyperConfirm === true) {
          this.addToconfirmDiseaseArray("Hypertension");
          if (this.suspect.includes("Hypertension")) {
            this.removeSuspect("Hypertension");
          }
        } else {
          this.removeConfirmDiseaseArray("Hypertension");
          this.hypDiaAndSysBPObs();
        }
      }
    );
  }
  hypDiaAndSysBPObs() {
    this.hypertensionSelectedFlagSubscription =
      this.idrsScoreService.hypertensionSelectedFlag$.subscribe((respone) => {
        if (respone === 1) {
          this.hypertensionChecked = true;
        }
        // else {
        //   this.addHypertensionToSuspectedArray();
        // }
      });
    this.addHypertensionToSuspectedArray();
  }
  addHypertensionToSuspectedArray() {
    // adding hypertension to the suspected array according to the value of systolic BP
    this.systolicBpValueSubscription =
      this.idrsScoreService.systolicBpValue$.subscribe((response) => {
        if (response !== undefined) {
          if (!this.hypertensionChecked) this.systolicBPObs(response);
        }
      });

    // adding hypertension to suspected array according to the value of diastolic BP
    this.diastolicBpValueSubscription =
      this.idrsScoreService.diastolicBpValue$.subscribe((response) => {
        if (response !== undefined) {
          if (!this.hypertensionChecked) this.diastolicBPObs(response);
        }
      });
  }
  systolicBPObs(response) {
    this.systolicValueFromVital = response;
    let hypertensionFound = false;
    if (response !== null && response >= 140) {
      this.suspect.forEach((element) => {
        if (element === "Hypertension") {
          hypertensionFound = true;
        }
      });
      if (!hypertensionFound) this.addToSuspected("Hypertension");
    } else if (this.diastolicValueFromVital < 90) {
      if (this.suspect.length > 0) this.removeSuspected("Hypertension");
    }
  }
  diastolicBPObs(response) {
    this.diastolicValueFromVital = response;
    let hypertensionFound = false;
    if (response !== null && response >= 90) {
      this.suspect.forEach((element) => {
        if (element === "Hypertension") {
          hypertensionFound = true;
        }
      });
      if (!hypertensionFound) this.addToSuspected("Hypertension");
    } else {
      if (this.systolicValueFromVital < 140)
        if (this.suspect.length > 0) this.removeSuspected("Hypertension");
    }
  }
  ngOnDestroy() {
    this.suspect=[];
    this.confirmDiseaseArray=[];
    this.questions1=[];

    this.idrsScoreService.clearDiabetesSelected();
    this.idrsScoreService.clearDiseaseSelected();
    this.idrsScoreService.clearDiastolicBp();
    this.idrsScoreService.clearSystolicBp();
    this.idrsScoreService.clearHypertensionSelected();
    
    this.IDRSScoreFlagCheckSubscription.unsubscribe();
    this.visitDiseaseSubscription.unsubscribe();
    this.systolicBpValueSubscription.unsubscribe();
    this.diastolicBpValueSubscription.unsubscribe();
    this.hypertensionSelectedFlagSubscription.unsubscribe();
    // this.idrsScoreService.clearScoreFlag();

  }
  getPreviousVisit() {
    let obj = {
      benRegID: localStorage.getItem("beneficiaryRegID"),
    };
    this.nurseService.getPreviousVisitData(obj).subscribe(
      (res: any) => {
        if (res.statusCode == 200 && res.data != null) {
          console.log("visit", res);
          this.isDiabetic = res.data.isDiabetic;
          this.isVision = res.data.isDefectiveVision;
          this.isEpilepsy = res.data.isEpilepsy;
          if (
            res.data.questionariesData != null &&
            res.data.questionariesData.length > 0
          ) {
            if (this.age >= 30) {
              for (let disease of this.diseases) {
                if (
                  disease.disease.indexOf("Diabetes") > -1 &&
                  this.isDiabetic
                ) {
                  disease.flag = false;
                  disease.disabled = true;
                } else if (
                  disease.disease.indexOf("Diabetes") > -1 &&
                  this.idrsScore + this.idrsScoreWaist + this.idrsScoreFamily + this.IRDSscorePhysicalActivity < 60
                ) {
                  disease.flag = false;
                } else if (
                  disease.disease.indexOf("Vision Screening") > -1 &&
                  this.isVision
                ) {
                  disease.flag = false;
                  if (this.isVision) disease.disabled = true;
                } else if (
                  disease.disease.indexOf("Epilepsy") > -1 &&
                  this.isEpilepsy
                ) {
                  disease.flag = false;
                  if (this.isEpilepsy) disease.disabled = true;
                }

                if (
                  disease !== undefined &&
                  disease.flag !== undefined &&
                  disease.flag !== null &&
                  disease.confirmed === false &&
                  disease.flag === true
                )
                  this.required.push(disease.disease);
              }

              console.log("diseaseList", this.diseases);
              this.chronicDisabled = true;
              this.chronicDiseaseQuestions(res);
            }
            console.log("chronic", this.chronicDisabled);
            if (
              this.chronicData !== undefined &&
              this.chronicData.length > 0 &&
              this.chronicDisabled === true
            ) {
              if (
                this.confirmDiseaseArray !== undefined &&
                this.confirmDiseaseArray.length === 0 && 
                res.data.confirmedDisease != undefined && 
                res.data.confirmedDisease != null
              ) {
                this.confirmDiseaseArray = res.data.confirmedDisease.split(",");
                console.log("diseaseList", this.diseases);
              }
              if (this.isDiabetic) {
                this.addToconfirmDiseaseArray("Diabetes");
                this.idrsScoreService.clearDiabetesSelected();
              }
              if (this.isEpilepsy) this.addToconfirmDiseaseArray("Epilepsy");
              if (this.isVision)
                this.addToconfirmDiseaseArray("Vision Screening");

              console.log("diseaseList", this.diseases);
              console.log("chronic1", this.questions1);
              this.required = [];
              for (let diseaseObj of this.diseases) {
                if (diseaseObj.flag === null && !this.chronicDisabled)
                  diseaseObj.flag = true;

                if (
                  diseaseObj !== undefined &&
                  diseaseObj.flag !== undefined &&
                  diseaseObj.flag !== null &&
                  diseaseObj.confirmed === false &&
                  diseaseObj.flag === true
                )
                  this.required.push(diseaseObj.disease);
              }
              this.updateDiabetesQuestionValue();
            }
          }
        }
      },
      (err) => {
        this.confirmationService.alert(err, "error");
        this.IDRSChanged.emit(false);
      }
    );
    this.updateFormWithSuspectConfirmQuestionArray();
  }
  chronicDiseaseQuestions(res) {
    if (res.data.confirmedDisease)
      var confirmedDisease = res.data.confirmedDisease.split(",");
    console.log("confirmedDisease", confirmedDisease);
    this.diseases.forEach((value) => {
      if (value.disease.indexOf("Tuberculosis Screening") > -1) {
        if (confirmedDisease != undefined && confirmedDisease != null) {
          confirmedDisease.forEach((element) => {
            if (element === "Tuberculosis Screening") {
              value.disabled = true;
              value.flag = false;
            }
          });
        }
      } else if (value.disease.indexOf("Malaria Screening") > -1) {
        if (confirmedDisease != undefined && confirmedDisease != null) {
          confirmedDisease.forEach((element) => {
            if (element === "Malaria Screening") {
              value.disabled = true;
              value.flag = false;
            }
          });
        }

      } else if (value.disease.indexOf("Asthma") > -1) {
        if (confirmedDisease != undefined && confirmedDisease != null) {
          confirmedDisease.forEach((element) => {
            if (element === "Asthma") {
              value.disabled = true;
              value.flag = false;
            }
          });
        }

      }
    });
    this.chronicData = res.data.questionariesData;
  }
  updateFormWithSuspectConfirmQuestionArray() {
    if (
      (this.route.snapshot.params["attendant"] === "doctor" ||
        this.route.snapshot.params["attendant"] === "tcspecialist") &&
      this.revisit
    ) {
      this.arr = [];
      for (let question of this.questions1) {
        if (question.answer != null) this.arr.push(question);
      }
      this.idrsScreeningForm.patchValue({ questionArray: this.arr });
      this.idrsScreeningForm.patchValue({ suspectArray: this.suspect });
      this.idrsScreeningForm.patchValue({
        confirmArray: this.confirmDiseaseArray,
      });
      this.updateDiabetesQuestionValue();
      console.log("diseaseList", this.diseases);
    }
  }
  ngOnChanges() {
   
    if (this.mode == "view") {
      this.doctorScreen = true;
      let visitID = localStorage.getItem("visitID");
      let benRegID = localStorage.getItem("beneficiaryRegID");
      this.getBeneficiaryDetails();
      if (visitID != null && benRegID != null) {
        this.getIDRSDetailsFrmNurse(visitID, benRegID);
      }
    }

    if (parseInt(localStorage.getItem("specialistFlag")) == 100) {
      this.doctorScreen = true;
      let visitID = localStorage.getItem("visitID");
      let benRegID = localStorage.getItem("beneficiaryRegID");
      this.getBeneficiaryDetails();
      if (visitID != null && benRegID != null) {
        this.getIDRSDetailsFrmNurse(visitID, benRegID);
      }
    }
    if (this.mode == "update") {
      let visitCategory = localStorage.getItem("visitCategory");
      this.doctorScreen = true;
      this.updateIDRSDetails(this.idrsScreeningForm, visitCategory);
    }
  }
  updateIDRSDetails(idrsScreeningForm, visitCategory) {
    this.IDRSChanged.emit("check");
    this.doctorService
      .updateIDRSDetails(idrsScreeningForm, visitCategory)
      .subscribe(
        (res: any) => {
          if (res.statusCode == 200 && res.data != null) {
            this.confirmationService.alert(res.data.response, "success");
            this.IDRSChanged.emit(true);
            this.idrsScreeningForm.markAsPristine();
          } else {
            this.confirmationService.alert(res.errorMessage, "error");
            this.IDRSChanged.emit(false);
          }
        },
        (err) => {
          this.confirmationService.alert(err, "error");
          this.IDRSChanged.emit(false);
        }
      );
  }
  IDRSDetailsSubscription: any;
  questionArray = [];
  getIDRSDetailsFrmNurse(visitID, benRegID) {
    this.IDRSDetailsSubscription = this.doctorService
      .getIDRSDetails(benRegID, visitID)
      .subscribe((value) => {
        if (value !== null && value.statusCode === 200 && value.data !== null) {
          if ((value.data.IDRSDetail.suspectedDisease !== undefined && value.data.IDRSDetail.suspectedDisease !== null) || (value.data.IDRSDetail.idrsDetails !== undefined && value.data.IDRSDetail.idrsDetails !== null)) {
            if (value.data.IDRSDetail.suspectedDisease && value.data.IDRSDetail.suspectedDisease !== undefined && value.data.IDRSDetail.suspectedDisease !== null) {
             
              let suspectArray =
                value.data.IDRSDetail.suspectedDisease.split(",");
              suspectArray.forEach((element) => {
                this.addToSuspected(element);
              });
              // clearing suspect array observable according to suspect array
              // this.settingSuspectedObservable();
            }
          }
          let IdrsArray = value.data.IDRSDetail.idrsDetails;
          for (let j = 0; j < IdrsArray.length; j++) {
            this.questionArray[j] = IdrsArray[j];
          }
          if (
            this.questionArray != undefined &&
            this.questionArray.length > 0
          ) {
            let cflag = true;
            for (const questionArray of this.questions1) {
              for (const selectedQuestion of this.questionArray) {
                if (
                  questionArray.idrsQuestionID ===
                  selectedQuestion.idrsQuestionId
                ) {
                  cflag = false;
                  break;
                }
              }
            }
            this.revisit = cflag;
            if (
              this.age < 30 ||
              (this.questions1 != undefined && this.questions1.length == 0)
            )
              this.revisit = false;
            console.log("revisit", this.revisit);
            for (let question of this.questions1) {
              for (let selectedQuestion of this.questionArray) {
                if (
                  question.idrsQuestionID === selectedQuestion.idrsQuestionId &&
                  (selectedQuestion.answer != null ||
                    selectedQuestion.answer != "")
                ) {
                  question.answer = selectedQuestion.answer.toLowerCase();
                  for (let disease of this.diseases) {
                    if (disease.disease === question.diseaseQuestionType)
                      disease.flag = false;
                  }
                  question.id = selectedQuestion.ID;
                }
              }
            }
            console.log("q1", this.questions1);
            this.required = [];
            for (let disease of this.diseases) {
              if (
                disease !== undefined &&
                disease.flag !== undefined &&
                disease.flag !== null &&
                disease.confirmed === false &&
                disease.flag === true
              )
                this.required.push(disease.disease);
            }
          }
          this.arr = [];
          for (let question of this.questions1) {
            if (question.answer != null) this.arr.push(question);
          }
          this.idrsScreeningForm.patchValue({ questionArray: this.arr });
          this.idrsScreeningForm.patchValue({ suspectArray: this.suspect });
          this.idrsScreeningForm.patchValue({
            confirmArray: this.confirmDiseaseArray,
          });
          this.updateDiabetesQuestionValue();
          this.idrsScreeningForm.patchValue({
            idrsScore:
              this.idrsScore +
              this.idrsScoreWaist +
              this.idrsScoreFamily +
              this.IRDSscorePhysicalActivity,
          });
          let flag = false;
          for (const suspectDisease of this.suspect) {
            if (suspectDisease.indexOf("Diabetes") > -1) flag = true;
          }
          this.idrsScreeningForm.patchValue({ isDiabetic: flag });
          console.log("questions1Array", this.idrsScreeningForm);

          this.rev = [];
          for (const question of this.questions1) {
            if (question.answer != null) this.rev.push(question);
          }
          this.getPreviousVisit();

          this.hypDiaAndSysBPObs();
        }
      });
  }
  /**
   * @author = Du20091017
   * clearing
   */
  settingSuspectedObservable() {
    var loopBreak = false;
    this.suspect.forEach((element) => {
      if (!loopBreak) {
        if (
          element === "Vision Screening" ||
          element === "Epilepsy" ||
          element === "Asthma" ||
          element === "Tuberculosis Screening" ||
          element === "Malaria Screening"
        ) {
          this.idrsScoreService.setSuspectedArrayValue();
          loopBreak = true;
        }
      }
    });
  }
  nurseMasterDataSubscription: any;
  getNurseMasterData() {
    this.nurseMasterDataSubscription =
      this.masterdataService.nurseMasterData$.subscribe((data) => {
        if (data) {
          this.nurseMasterDataSubscription.unsubscribe();
          this.questions = data.IDRSQuestions;
          if (this.questions != undefined && this.questions.length > 0) {
            for (let question of this.questions) {
              this.questions1.push({
                id: null,
                idrsQuestionID: question.idrsQuestionID,
                question: question.question,
                diseaseQuestionType: question.DiseaseQuestionType,
                answer: null,
              });
            }

            for (var i = 0; i < this.questions.length; i++) {
              if (i != 0) {
                console.log(
                  this.questions.DiseaseQuestionType !==
                  this.questions[i - 1].DiseaseQuestionType
                );
                if (
                  this.questions[i].DiseaseQuestionType !==
                  this.questions[i - 1].DiseaseQuestionType
                )
                  this.diseases.push({
                    disease: this.questions[i].DiseaseQuestionType,
                    flag: null,
                    confirmed: false,
                    disabled: false,
                  });
              } else
                this.diseases.push({
                  disease: this.questions[i].DiseaseQuestionType,
                  flag: null,
                  confirmed: false,
                  disabled: false,
                });
            }
            if (this.age >= 30) {
              this.required = [];
              for (let disease of this.diseases) {
                if (!this.chronicDisabled) disease.flag = true;
                if (
                  disease.disease.indexOf("Diabetes") > -1 &&
                  this.idrsScore + this.idrsScoreWaist + this.idrsScoreFamily + this.IRDSscorePhysicalActivity < 60
                ) {
                  disease.flag = false;
                  // disease.disabled = true;
                }
                if (
                  disease !== undefined &&
                  disease.flag !== undefined &&
                  disease.flag !== null &&
                  disease.confirmed === false &&
                  disease.flag === true
                ) {
                  this.required.push(disease.disease);
                }
              }
            }
            this.required.forEach((val, index) => {
              if (val === "Diabetes") {
                if (this.idrsScore + this.idrsScoreWaist + this.idrsScoreFamily + this.IRDSscorePhysicalActivity < 60)
                  this.required.splice(index, 1);
              }
            })
            console.log("req", this.required);
            this.updateDiabetesQuestionValue();
            console.log("attendant", this.route.snapshot.params["attendant"]);
            if (
              this.route.snapshot.params["attendant"] !== "doctor" &&
              this.route.snapshot.params["attendant"] !== "tcspecialist"
            )
              this.getPreviousVisit();
          }
          if (this.mode == "view") {
            let visitID = localStorage.getItem("visitID");
            let benRegID = localStorage.getItem("beneficiaryRegID");
            if (visitID != null && benRegID != null) {
              this.getIDRSDetailsFrmNurse(visitID, benRegID);
            }
          }
          if (parseInt(localStorage.getItem("specialistFlag")) == 100) {
            let visitID = localStorage.getItem("visitID");
            let benRegID = localStorage.getItem("beneficiaryRegID");
            if (visitID != null && benRegID != null) {
              this.getIDRSDetailsFrmNurse(visitID, benRegID);
            }
          }
        }
      });
    console.log("checking", this.questions1);
  }
  radioChange(q, value, d) {
    this.IDRSChanged.emit(false);
    for (const question of this.questions1) {
      if (question.idrsQuestionID === q.idrsQuestionID) question.answer = value;
    }

    if (value == "yes") this.addToSuspected(q.diseaseQuestionType);
    else {
      if (this.suspect.length > 0) this.removeSuspected(q.diseaseQuestionType);
    }
    this.removeConfirmDiseaseArray(q.diseaseQuestionType);
    let NCDScreeningForm = <FormGroup>(
      this.patientMedicalForm.controls["idrsScreeningForm"]
    );
    console.log("idrsForm", NCDScreeningForm);
    NCDScreeningForm.patchValue({
      idrsScore:
        this.idrsScore +
        this.idrsScoreWaist +
        this.idrsScoreFamily +
        this.IRDSscorePhysicalActivity,
    });
    this.arr = [];
    for (var a = 0; a < this.rev.length; a++) {
      if (this.rev[a].idrsQuestionID === q.idrsQuestionID)
        this.rev.splice(a, 1);
    }
    if (
      this.chronicDisabled == true &&
      ((this.route.snapshot.params["attendant"] !== "doctor" &&
        this.route.snapshot.params["attendant"] !== "tcspecialist") ||
        this.revisit)
    ) {
      for (let question of this.questions1) {
        if (
          question.answer !== null &&
          question.idrsQuestionID === q.idrsQuestionID
        )
          this.rev.push(question);
      }
    } else {
      for (let questionValue of this.questions1) {
        if (questionValue.answer != null) this.arr.push(questionValue);
      }
    }
    this.required = [];
    console.log("disease", d);
    for (let disease of this.diseases) {
      if (disease.disease === d) {
        let Rflag = false;
        for (let question of this.questions1) {
          if (question.diseaseQuestionType === d && question.answer === null) {
            Rflag = true;
            break;
          }
        }
        if (!Rflag) disease.flag = false;
      }
      console.log("dis", disease);
      if (
        disease != undefined &&
        disease.flag != undefined &&
        disease.flag != null &&
        disease.confirmed == false &&
        disease.flag == true
      ) {
        this.required.push(disease.disease);
      }
    }
    if (
      this.chronicDisabled == true &&
      ((this.route.snapshot.params["attendant"] !== "doctor" &&
        this.route.snapshot.params["attendant"] !== "tcspecialist") ||
        this.revisit)
    ) {
      NCDScreeningForm.patchValue({ questionArray: this.rev });
    } else NCDScreeningForm.patchValue({ questionArray: this.arr });
    NCDScreeningForm.patchValue({ suspectArray: this.suspect });
    NCDScreeningForm.patchValue({ confirmArray: this.confirmDiseaseArray });
    this.required.forEach((val, index) => {
      if (val === "Diabetes") {
        if (this.idrsScore + this.idrsScoreWaist + this.idrsScoreFamily + this.IRDSscorePhysicalActivity < 60) this.required.splice(index, 1);
      }
    });
    NCDScreeningForm.patchValue({ requiredList: this.required });
    let flag = false;
    for (let suspectDisease of this.suspect) {
      if (suspectDisease.indexOf("Diabetes") > -1) flag = true;
    }
    NCDScreeningForm.patchValue({ isDiabetic: flag });
  }
  addToSuspected(val) {
    let suspectflag = false;
    let confirmflag = false;
    for (const suspectDisease of this.suspect) {
      if (suspectDisease === val) suspectflag = true;
    }
    for (const confirmDisease of this.confirmDiseaseArray) {
      if (confirmDisease === val) confirmflag = true;
    }
    if (!suspectflag && !confirmflag) {
      this.suspect.push(val);
      if (val === "Diabetes"){ this.idrsScoreService.setDiabetesSelected();}
      this.settingSuspectedObservable();
    }
  }
  addToconfirmDiseaseArray(val) {
    console.log("addtoconfirmDiseaseArray", this.confirmDiseaseArray);
    let flag = false;
    for (const confirmDisease of this.confirmDiseaseArray) {
      if (confirmDisease === val) flag = true;
    }
    if (!flag) {
      this.confirmDiseaseArray.push(val);
      this.idrsScreeningForm.patchValue({ suspectArray: this.suspect });
      this.idrsScreeningForm.patchValue({
        confirmArray: this.confirmDiseaseArray,
      });
      this.updateDiabetesQuestionValue();
    }
  }
  removeSuspected(val) {
    let flag = false;
    for (let question of this.questions1) {
      if (question.diseaseQuestionType === val && question.answer === "yes")
        flag = true;
    }
    if (!flag) {
      for (var i = 0; i < this.suspect.length; i++) {
        if (this.suspect[i] === val) this.suspect.splice(i, 1);
      }
      if (!this.suspect.includes("Diabetes")) {
        this.idrsScoreService.clearDiabetesSelected();
      }
      else {
        if (this.suspect.includes("Diabetes"))
          this.idrsScoreService.setDiabetesSelected();
      }
      if (this.suspect.length == 0) {
        this.idrsScoreService.clearSuspectedArrayFlag();
        this.idrsScoreService.clearDiabetesSelected();
      } else {
        if (
          !(
            this.suspect.includes("Vision Screening") ||
            this.suspect.includes("Epilepsy") ||
            this.suspect.includes("Asthma") ||
            this.suspect.includes("Tuberculosis Screening") ||
            this.suspect.includes("Malaria Screening")
          )
        ) {
          this.idrsScoreService.clearSuspectedArrayFlag();
        } else {
          this.idrsScoreService.setSuspectedArrayValue();
        }
      }
    }
  }
  removeSuspect(val) {
    let flag = false;
    for (const disease of this.questions1) {
      flag = true; // when the suspect disease becomes confirm disease , questions should get disable and values will be removed.
    }
    if (flag) {
      for (var i = 0; i < this.suspect.length; i++) {
        if (this.suspect[i] === val) this.suspect.splice(i, 1);
      }
      if (!this.suspect.includes("Diabetes")) {
        this.idrsScoreService.clearDiabetesSelected();
      }
      if (this.suspect.length === 0) {
        this.idrsScoreService.clearSuspectedArrayFlag();
        this.idrsScoreService.clearDiabetesSelected();
      } else {
        if (
          !(
            this.suspect.includes("Vision Screening") ||
            this.suspect.includes("Epilepsy") ||
            this.suspect.includes("Asthma") ||
            this.suspect.includes("Tuberculosis Screening") ||
            this.suspect.includes("Malaria Screening")
          )
        ) {
          this.idrsScoreService.clearSuspectedArrayFlag();
        } else {
          this.idrsScoreService.setSuspectedArrayValue();
        }
      }
    }
  }
  removeConfirmDiseaseArray(val) {
    let flag = false;
    if (!flag) {
      for (let i = 0; i < this.confirmDiseaseArray.length; i++) {
        if (this.confirmDiseaseArray[i] === val)
          this.confirmDiseaseArray.splice(i, 1);
      }
      this.idrsScreeningForm.patchValue({ suspectArray: this.suspect });
      this.idrsScreeningForm.patchValue({
        confirmArray: this.confirmDiseaseArray,
      });
      this.required.forEach((val, index) => {
        if (val === "Diabetes") {
          if (this.idrsScore + this.idrsScoreWaist + this.idrsScoreFamily + this.IRDSscorePhysicalActivity
            < 60)
            this.required.splice(index, 1);
        }
      })
      this.updateDiabetesQuestionValue();
    }
  }
  getBeneficiaryDetails() {
    this.beneficiaryDetailSubscription =
      this.beneficiaryDetailsService.beneficiaryDetails$
        .flatMap((beneficiary) => {
          console.log("idrs", beneficiary);
          if (beneficiary) {
            if (beneficiary.ageVal) {
              this.age = beneficiary.ageVal;

              if (this.age < 35) this.idrsScore = 0;
              else if (this.age >= 35 && this.age < 50) this.idrsScore = 20;
              else this.idrsScore = 30;
            } else {
              this.age = 0;
            }
            console.log("required", this.required);
            return this.nurseService.getNcdScreeningVisitCount(
              beneficiary.beneficiaryRegID
            );
          } else {
            return Observable.of(null);
          }
        })
        .subscribe((res) => { });
  }
  getPreviousDiabetesHistory() {
    let benRegID = localStorage.getItem("beneficiaryRegID");
    this.nurseService
      .getPreviousDiabetesHistory(benRegID, this.visitType)
      .subscribe(
        (res) => {
          if (res.statusCode === 200 && res.data !== null) {
            if (res.data.data.length > 0) {
              this.viewPreviousData(res.data);
            } else {
              this.confirmationService.alert(
                this.currentLanguageSet.pastDiabetesHistoryNotAvailable
              );
            }
          } else {
            this.confirmationService.alert(
              this.currentLanguageSet.alerts.info.errorFetchingHistory,
              "error"
            );
          }
        },
        (err) => {
          this.confirmationService.alert(
            this.currentLanguageSet.alerts.info.errorFetchingHistory,
            "error"
          );
        }
      );
  }

  viewPreviousData(data) {
    this.dialog.open(PreviousDetailsComponent, {
      data: { dataList: data, title: this.currentLanguageSet.previousDiabetesHistoryDetails },
    });
  }
}
