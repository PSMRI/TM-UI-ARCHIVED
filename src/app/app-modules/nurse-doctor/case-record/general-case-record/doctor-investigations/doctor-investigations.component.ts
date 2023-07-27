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


import { Component, OnInit, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import {
  MasterdataService,
  DoctorService,
  NurseService,
} from "../../../shared/services";
import { MasterDataService } from "app/app-modules/lab/shared/services";
import { IdrsscoreService } from "app/app-modules/nurse-doctor/shared/services/idrsscore.service";
import { environment } from "environments/environment";
import { PreviousDetailsComponent } from "app/app-modules/core/components/previous-details/previous-details.component";
import { ConfirmationService } from "app/app-modules/core/services";
import { MdDialog } from "@angular/material";
import { Subscription } from "rxjs";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";

@Component({
  selector: "app-doctor-investigations",
  templateUrl: "./doctor-investigations.component.html",
  styleUrls: ["./doctor-investigations.component.css"],
})
export class DoctorInvestigationsComponent implements OnInit {
  @Input("generalDoctorInvestigationForm")
  generalDoctorInvestigationForm: FormGroup;

  @Input("caseRecordMode")
  caseRecordMode: string;

  @Input("visitCategory")
  visit: string;

  chiefComplaintMaster: any;
  nonRadiologyMaster: any;
  radiologyMaster: any;
  beneficiaryRegID: string;
  visitID: string;
  visitCategory: string;
  previousLabTestList: any;
  current_language_set: any;
  diabetesSelected: any = 0;
  VisualAcuityMandatory: boolean = false;
  RBSTestDoneInVitals: boolean = false;
  VisualAcuityTestDone: boolean = false;
  diastolicBpValue: any;
  systolicBpValue: any;
  RBSTestScore: number;
  rbsPresent: boolean = false;
  visualAcuityPresent: boolean = false;
  hemoglobbinSelected: boolean = false;
  referredVisitcode: any;
  confirmedDiabeticValue: any;
  hypertensionSelected: any;
  rbsTestResultCurrent: any;
  rbsTestResultCurrentSubscription: any;

  RBSPresentInTM: boolean = false;
  finalHypertension: boolean = false;
  checkForMMUInvestigation = false;
  visitCategoryCheck: string;
  hyperSuspectedSubscription: Subscription;
  finalHypertensionSubscription: Subscription;
  systolicSubscription: Subscription;
  diastolicSubscription: Subscription;
  rbsTestResultSubscription: Subscription;
  rbsSelectedInInvestigationSubscription: Subscription;
  rbsSelectedUnderInvestigation: boolean=false;
  rbsSelectedInInvestigation: boolean=false;
  VisualAcuityTestDoneMMU: boolean=false;
  rbsTestDoneMMU: boolean=false;
  RBSTestScoreInVitals: number;
  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private masterdataService: MasterdataService,
    public httpServiceService: HttpServiceService,
    private idrsScoreService: IdrsscoreService,
    private confirmationService: ConfirmationService,
    private dialog: MdDialog,
    private nurseService: NurseService
  ) {}

  ngOnInit() {
    this.rbsTestDoneMMU=false;
    this.VisualAcuityTestDoneMMU=false;
    this.rbsSelectedInInvestigation=false;
    this.assignSelectedLanguage();
    this.idrsScoreService.clearSystolicBp();
    this.idrsScoreService.clearDiastolicBp();
    this.idrsScoreService.clearHypertensionSelected();
    this.nurseService.clearRbsInVitals();
    this.nurseService.clearRbsSelectedInInvestigation();
    // this.idrsScoreService.diabetesSelectedFlag$.subscribe(response => this.diabetesSelected = response);
    this.hyperSuspectedSubscription =
      this.idrsScoreService.hypertensionSelectedFlag$.subscribe((response) => {
        this.hypertensionSelected = response;
        this.changeOfConfirmedHypertension(this.hypertensionSelected);
      });
    this.visitCategoryCheck = localStorage.getItem("visitCategory");

    this.finalHypertensionSubscription =
      this.idrsScoreService.finalDiagnosisHypertensionConfirmation$.subscribe(
        (res) => {
          this.finalHypertension = res;
          this.sysAndDiaBp();
        }
      );
    this.rbsTestValidation();
    this.ncdScreeningValidations();
    this.sysAndDiaBp();
    this.getDoctorMasterData();
    this.getNurseMasterData();
    if (localStorage.getItem("referredVisitCode")) {
      this.referredVisitcode = localStorage.getItem("referredVisitCode");
    } else {
      this.referredVisitcode = "undefined";
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

  sysAndDiaBp() {
    this.systolicSubscription =
      this.idrsScoreService.systolicBpValue$.subscribe((response) => {
        this.systolicBpValue = response;
        this.changeOfSystolicBp(this.systolicBpValue);
        console.log("score", this.RBSTestScore);
      });
    this.diastolicSubscription =
      this.idrsScoreService.diastolicBpValue$.subscribe((response) => {
        this.diastolicBpValue = response;
        this.changeOdDiastolicBp(this.diastolicBpValue);
      });
  }
  rbsTestValidation() {
    this.rbsSelectedInInvestigationSubscription =
      this.nurseService.rbsSelectedInInvestigation$.subscribe((response) => {
        if (response !== undefined && response !== null) {
          this.rbsSelectedUnderInvestigation = response;
        }
      });
    this.rbsTestResultSubscription =
      this.nurseService.rbsTestResultCurrent$.subscribe((response) => {
        if (response !== undefined && response !== null) {
          // this.RBSTestScore = response;
          this.RBSTestScoreInVitals = response;
          this.RBSTestDoneInVitals = true;
          this.checkRBSScore();
          this.rbsTestResultCurrent = response;
        } else {
          // this.RBSTestScore = response;
          this.RBSTestScoreInVitals = response;
          this.RBSTestDoneInVitals = false;
          this.rbsTestResultCurrent = null;
          this.checkRBSScore();
          // if (this.rbsSelectedUnderInvestigation !== true) {
          //   this.RBSTestDoneInVitals = false;
          // }
        }
      });
  }
  ncdScreeningValidations() {
    if (this.visitCategoryCheck == "NCD screening") {
      this.checkForMMUInvestigation = false;
      this.diabetesSelected = 0;
      this.idrsScoreService.clearDiabetesSelected();
      this.idrsScoreService.diabetesNotPresentInMMU = 0;
      this.diabetesObservable();
      this.getMMUInvestigationDetails();
    }
  }

  ngOnDestroy() {
    this.idrsScoreService.clearDiabetesSelected();
    if (this.nurseMasterDataSubscription)
      this.nurseMasterDataSubscription.unsubscribe();
    if (this.doctorMasterDataSubscription)
      this.doctorMasterDataSubscription.unsubscribe();
    if (this.investigationSubscription)
      this.investigationSubscription.unsubscribe();
    if (this.diabetesSelectedFlagSubscription)
      this.diabetesSelectedFlagSubscription.unsubscribe();
    if (this.hyperSuspectedSubscription)
      this.hyperSuspectedSubscription.unsubscribe();
    if (this.systolicSubscription) this.systolicSubscription.unsubscribe();
    if (this.diastolicSubscription) this.diastolicSubscription.unsubscribe();
    if (this.finalHypertensionSubscription)
      this.finalHypertensionSubscription.unsubscribe();
    if (this.rbsTestResultSubscription) {
      this.rbsTestResultSubscription.unsubscribe();
    if (this.rbsSelectedInInvestigationSubscription)
        this.rbsSelectedInInvestigationSubscription.unsubscribe();
    }
  }

  investigationSubscription: any;
  getInvestigationDetails(beneficiaryRegID, visitID, visitCategory) {
    this.investigationSubscription = this.doctorService
      .getCaseRecordAndReferDetails(beneficiaryRegID, visitID, visitCategory)
      .subscribe((res) => {
        if (
          res &&
          res.statusCode == 200 &&
          res.data &&
          res.data.investigation
        ) {
          console.log(res, "investigations");
          this.patchInvestigationDetails(
            res.data.investigation,
            res.data.diagnosis
          );
          this.checkTestScore(res.data.LabReport);
        }
      });
  }

  patchInvestigationDetails(investigation, diagnosis) {
    let labTest = [];
    let radiologyTest = [];
    let externalInvestigation = "";

    if (investigation.laboratoryList) {
      this.previousLabTestList = investigation.laboratoryList;

      investigation.laboratoryList.map((item) => {
        let temp = this.nonRadiologyMaster.filter((element) => {
          return element.procedureID == item.procedureID;
        });
        if (temp.length > 0) labTest.push(temp[0]);
        //checking RBS test is prescribed or not
        if ((item.procedureName).toLowerCase() == (environment.RBSTest).toLowerCase()) {
          this.rbsSelectedInInvestigation = true;
          this.nurseService.setRbsSelectedInInvestigation(true);
        }
        if ((item.procedureName).toLowerCase() == (environment.haemoglobinTest).toLowerCase()) {
          this.hemoglobbinSelected = true;
        }
        if ((item.procedureName).toLowerCase() == (environment.visualAcuityTest).toLowerCase()) {
          this.VisualAcuityTestDone = true;
          this.idrsScoreService.clearVisualAcuityTestMandatoryFlag();
        }
      });

      investigation.laboratoryList.map((item) => {
        let temp = this.radiologyMaster.filter((element) => {
          return element.procedureID == item.procedureID;
        });
        if (temp.length > 0) radiologyTest.push(temp[0]);
      });
    }

    if (diagnosis && diagnosis.externalInvestigation) {
      externalInvestigation = diagnosis.externalInvestigation;
    }

    this.generalDoctorInvestigationForm.patchValue({
      labTest,
      radiologyTest,
      externalInvestigations: externalInvestigation,
    });
  }

  nurseMasterDataSubscription: Subscription;
  getNurseMasterData() {
    this.nurseMasterDataSubscription =
      this.masterdataService.nurseMasterData$.subscribe((masterData) => {
        if (masterData && masterData.procedures) {
          this.nonRadiologyMaster = masterData.procedures.filter((item) => {
            return item.procedureType == "Laboratory";
          });
          this.radiologyMaster = masterData.procedures.filter((item) => {
            return item.procedureType == "Radiology";
          });

          // checking RBS and Visual acuity is present or not.
          this.nonRadiologyMaster.forEach((element) => {
            if ((element.procedureName).toLowerCase() == (environment.RBSTest).toLowerCase()) {
              this.rbsPresent = true;
              this.idrsScoreService.rBSPresentInMaster();
            }
            if ((element.procedureName).toLowerCase() == (environment.visualAcuityTest).toLowerCase()) {
              this.visualAcuityPresent = true;
              this.idrsScoreService.visualAcuityPresentInMaster();
            }
            if ((element.procedureName).toLowerCase() == (environment.haemoglobinTest).toLowerCase()) {
              this.idrsScoreService.haemoglobinPresentInMaster();
            }
          });
          if (this.caseRecordMode == "view") {
            this.beneficiaryRegID = localStorage.getItem("beneficiaryRegID");
            this.visitID = localStorage.getItem("visitID");
            this.visitCategory = localStorage.getItem("visitCategory");
            this.getInvestigationDetails(
              this.beneficiaryRegID,
              this.visitID,
              this.visitCategory
            );
          }
        }
      });
  }

  doctorMasterDataSubscription: Subscription;
  getDoctorMasterData() {
    this.doctorMasterDataSubscription =
      this.masterdataService.doctorMasterData$.subscribe((masterData) => {
        if (masterData) {
          console.log("doctor master", masterData);
        }
      });
  }

  canDisable(test) {
    if (
      ((this.rbsTestResultCurrent != null &&
        this.rbsTestResultCurrent != undefined) ||
        this.nurseService.rbsTestResultFromDoctorFetch != null) &&
        ((test.procedureName).toLowerCase() == (environment.RBSTest).toLowerCase())
    ) {
      return true;
    }
    // else if(((this.rbsTestResultCurrent == null || this.rbsTestResultCurrent == undefined) &&
    // this.nurseService.rbsTestResultFromDoctorFetch ==null) && test.procedureName == environment.RBSTest)
    // {
    //   test.checked=false;
    // }
    if (this.previousLabTestList) {
      let temp = this.previousLabTestList.filter((item) => {
        return item.procedureID == test.procedureID;
      });

      if (temp.length > 0) test.disabled = true;
      else test.disabled = false;

      return temp.length > 0;
    }
  }
  checkTestScore(labreports) {
    if (labreports !== undefined) {
      labreports.forEach((element) => {
        if ((element.procedureName).toLowerCase() == (environment.RBSTest).toLowerCase()) {
          this.RBSTestScore = element.componentList[0].testResultValue;
        }
      });
    }
    this.checkRBSScore();
  }
  checkRBSScore() {
    if (
      this.RBSTestScore > 200 || this.RBSTestScoreInVitals > 200 ||
      (this.hypertensionSelected === 0 && this.systolicBpValue >= 140) ||
      (this.hypertensionSelected === 0 && this.diastolicBpValue >= 90)
    ) {
      this.VisualAcuityMandatory = true;
      if (this.idrsScoreService.visualAcuityTestInMMU != 0)
        this.idrsScoreService.setVisualAcuityTestMandatoryFlag();
    } else {
        this.VisualAcuityMandatory = false;
        this.idrsScoreService.clearVisualAcuityTestMandatoryFlag();
    }
  }
  checkTestName(event) {
    console.log("testName", event);
   // this.RBSTestDoneInVitals = false;
    this.VisualAcuityTestDone = false;
    let item = event.value;
    let oneSelected = 0;
    this.nurseService.setRbsSelectedInInvestigation(false);
    this.rbsSelectedInInvestigation =false;
    this.hemoglobbinSelected = false;
    item.forEach((element) => {
      if ((element.procedureName).toLowerCase() == (environment.RBSTest).toLowerCase()) {
        // this.RBSTestDoneInVitals = true;
        this.rbsSelectedInInvestigation =true;
        this.nurseService.setRbsSelectedInInvestigation(true);
        oneSelected++;
      }
      if ((element.procedureName).toLowerCase() == (environment.visualAcuityTest).toLowerCase()) {
        this.VisualAcuityTestDone = true;
        this.idrsScoreService.clearVisualAcuityTestMandatoryFlag();
      }
      if ((element.procedureName).toLowerCase() == (environment.haemoglobinTest).toLowerCase()) {
        this.hemoglobbinSelected = true;
      }
    });
  }
  changeOfSystolicBp(systolicBp) {
    if (
      !this.finalHypertension &&
      (this.RBSTestScore > 200 || this.RBSTestScoreInVitals > 200 ||
        (this.hypertensionSelected === 0 && systolicBp >= 140) ||
        (this.hypertensionSelected === 0 && this.diastolicBpValue >= 90))
    ) {
      this.VisualAcuityMandatory = true;
      if (this.idrsScoreService.visualAcuityTestInMMU != 0)
        this.idrsScoreService.setVisualAcuityTestMandatoryFlag();
    } else {
      this.VisualAcuityMandatory = false;
      this.idrsScoreService.clearVisualAcuityTestMandatoryFlag();
    }
  }
  changeOdDiastolicBp(diastolicBp) {
    if (
      !this.finalHypertension &&
      (this.RBSTestScore > 200 || this.RBSTestScoreInVitals > 200 ||
        (this.hypertensionSelected === 0 && this.systolicBpValue >= 140) ||
        (this.hypertensionSelected === 0 && diastolicBp >= 90))
    ) {
      this.VisualAcuityMandatory = true;
      if (this.idrsScoreService.visualAcuityTestInMMU != 0)
        this.idrsScoreService.setVisualAcuityTestMandatoryFlag();
    } else {
      this.VisualAcuityMandatory = false;
      this.idrsScoreService.clearVisualAcuityTestMandatoryFlag();
    }
  }
  changeOfConfirmedDiabetes(confirmedDiabeticVal) {
    if (
      this.RBSTestScore > 200 || this.RBSTestScoreInVitals > 200 ||
      (this.hypertensionSelected === 0 && this.systolicBpValue >= 140) ||
      (this.hypertensionSelected === 0 && this.diastolicBpValue >= 90)
    ) {
      this.VisualAcuityMandatory = true;
      if (this.idrsScoreService.visualAcuityTestInMMU != 0)
        this.idrsScoreService.setVisualAcuityTestMandatoryFlag();
    } else {
      this.VisualAcuityMandatory = false;
      this.idrsScoreService.clearVisualAcuityTestMandatoryFlag();
    }
  }

  changeOfConfirmedHypertension(confirmedHypertensionVal) {
    if (
      this.RBSTestScore > 200 || this.RBSTestScoreInVitals > 200 ||
      (confirmedHypertensionVal === 0 && this.systolicBpValue >= 140) ||
      (confirmedHypertensionVal === 0 && this.diastolicBpValue >= 90)
    ) {
      this.VisualAcuityMandatory = true;
      if (this.idrsScoreService.visualAcuityTestInMMU != 0)
        this.idrsScoreService.setVisualAcuityTestMandatoryFlag();
    } else {
      this.VisualAcuityMandatory = false;
      this.idrsScoreService.clearVisualAcuityTestMandatoryFlag();
    }
  }

  loadMMUInvestigation() {
    let reqObj = {
      benRegID: localStorage.getItem("beneficiaryRegID"),
      visitCode: localStorage.getItem("referredVisitCode"),
      benVisitID: localStorage.getItem("referredVisitID"),
      fetchMMUDataFor: "Investigation",
    };
    if (
      localStorage.getItem("referredVisitCode") !== "undefined" &&
      localStorage.getItem("referredVisitID") !== "undefined"
    ) {
      this.doctorService.getMMUData(reqObj).subscribe(
        (res) => {
          if (res.statusCode == 200 && res.data != null) {
            if (
              res.data.data.laboratoryList != undefined &&
              res.data.data.laboratoryList.length > 0
            ) {
              this.viewPreviousData(res.data);
            } else {
              this.confirmationService.alert(
                this.current_language_set.mmuInvestigationDetailsNotAvailable
              );
            }
          } else {
            this.confirmationService.alert(
              this.current_language_set.errorInFetchingMMUInvestigationDetails,
              "error"
            );
          }
        },
        (err) => {
          this.confirmationService.alert(
            this.current_language_set.errorInFetchingMMUInvestigationDetails,
            "error"
          );
        }
      );
    }
  }

  viewPreviousData(data) {
    this.dialog.open(PreviousDetailsComponent, {
      data: {
        dataList: data,
        title: this.current_language_set.mmuInvestigationDetails,
      },
    });
  }

  getMMUInvestigationDetails() {
    let reqObj = {
      benRegID: localStorage.getItem("beneficiaryRegID"),
      visitCode: localStorage.getItem("referredVisitCode"),
      benVisitID: localStorage.getItem("referredVisitID"),
      fetchMMUDataFor: "Investigation",
    };
    if (
      localStorage.getItem("referredVisitCode") !== "undefined" &&
      localStorage.getItem("referredVisitID") !== "undefined"
    ) {
      this.doctorService.getMMUData(reqObj).subscribe(
        (res) => {
          if (res.statusCode == 200 && res.data != null) {
            if (
              res.data.data.laboratoryList != undefined &&
              res.data.data.laboratoryList.length > 0
            ) {
              var labList = res.data.data.laboratoryList;
              var rbsPresentInList = false;
              var visualAcuityPresentInList = false;
              labList.find((element) => {
                if ((element.procedureName).toLowerCase() == (environment.RBSTest).toLowerCase()) {
                  this.diabetesSelected = 0;
                  this.idrsScoreService.diabetesNotPresentInMMU = 0;
                  this.checkForMMUInvestigation = true;
                  this.rbsTestDoneMMU=true;
                } else {
                  this.diabetesObservable();
                }

                if ((element.procedureName).toLowerCase() == (environment.visualAcuityTest).toLowerCase()) {
                  this.VisualAcuityTestDoneMMU = true;
                  this.idrsScoreService.visualAcuityTestInMMU = 0;
                  visualAcuityPresentInList = true;
                }
              });

              if (!visualAcuityPresentInList) {
                this.idrsScoreService.visualAcuityTestInMMU = 1;
              }
            } else {
              this.diabetesSelected = 0;
              this.idrsScoreService.diabetesNotPresentInMMU = 0;
              this.idrsScoreService.diabetesSelected = 0;
              this.diabetesObservable();

              console.log("No data avaiable from MMU investigations");
            }
          } else {
            this.diabetesSelected = 0;
            this.idrsScoreService.diabetesNotPresentInMMU = 0;
            this.idrsScoreService.clearDiabetesSelected();
            this.diabetesObservable();

            this.confirmationService.alert(
              this.current_language_set.errorInFetchingMMUInvestigationDetails,
              "error"
            );
          }
        },

        (err) => {
          this.diabetesObservable();
          // this.idrsScoreService.diabetesNotPresentInMMU = 1;
          this.confirmationService.alert(
            this.current_language_set.errorInFetchingMMUInvestigationDetails,
            "error"
          );
        }
      );
    }
  }

  diabetesSelectedFlagSubscription: Subscription;
  diabetesObservable() {
    //this.idrsScoreService.clearDiabetesSelected();
    this.diabetesSelectedFlagSubscription =
      this.idrsScoreService.diabetesSelectedFlag$.subscribe((response) => {
        console.log("investigation", response);
        if (!this.checkForMMUInvestigation) {
          this.diabetesSelected = response;

          if (this.diabetesSelected === 1) {
            this.idrsScoreService.diabetesNotPresentInMMU = 1;
           //this.RBSTestDoneInVitals = false;
          }
        }
      });
  }
}
