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
import { GeneralUtils } from "app/app-modules/nurse-doctor/shared/utility";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  NgForm,
} from "@angular/forms";
import { DoctorService, NurseService } from "app/app-modules/nurse-doctor/shared/services";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { ConfirmationService } from "../../../../../core/services/confirmation.service";
import { IdrsscoreService } from "app/app-modules/nurse-doctor/shared/services/idrsscore.service";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";

@Component({
  selector: "app-ncd-screening-diagnosis",
  templateUrl: "./ncd-screening-diagnosis.component.html",
  styleUrls: ["./ncd-screening-diagnosis.component.css"],
})
export class NcdScreeningDiagnosisComponent implements OnInit {
  utils = new GeneralUtils(this.fb);

  @Input("generalDiagnosisForm")
  generalDiagnosisForm: FormGroup;

  @Input("caseRecordMode")
  caseRecordMode: string;
  designation: string;
  specialist: boolean;
  doctorDiagnosis: any;
  current_language_set: any;
  confirmed: any;
  diabetesChecked: boolean;
  hyperTensionChecked: boolean;
  confirmDisease = [];
  confirmHyperTensionDisease = [];
  enableProvisionalDiag: boolean;
  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    public httpServiceService: HttpServiceService,
    private confirmationService: ConfirmationService,
    private idrsScoreService: IdrsscoreService,
    private nurseService: NurseService
  ) {}

  ngOnInit() {
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(
    //   (response) => (this.current_language_set = response)
    // );

    console.log("caseRecordMode", this.caseRecordMode);
    console.log("doctorDiagnosis", this.doctorDiagnosis);
    this.designation = localStorage.getItem("designation");
    // if (this.designation == "TC Specialist") {

    //   this.specialist = true;
    // } else {
    //   this.generalDiagnosisForm.controls['instruction'].disable();
    //   this.specialist = false;
    // }
    if (this.designation == "TC Specialist") {
      this.generalDiagnosisForm.controls["instruction"].enable();
      this.specialist = true;
    } else {
      this.generalDiagnosisForm.controls["instruction"].disable();
      this.specialist = false;
    }
    this.idrsScoreService.enableDiseaseConfirmationOnCaseRecord$.subscribe(
      (confirmDisease) => {
        if (confirmDisease) {
          this.updateIfDiseaseConfirmed();
        }
      }
    );
    this.idrsScoreService.finalDiagnosisDiabetesConfirm(false);
    this.idrsScoreService.finalDiagnosisHypertensionConfirm(false);
    this.nurseService.enableProvisionalDiag$.subscribe(
      (response) => {
        if(response == true) {
          this.enableProvisionalDiag = true;
        } else {
          this.enableProvisionalDiag = false;
        }
      }
    );
  }
  
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }

  get specialistDaignosis() {
    return this.generalDiagnosisForm.get("instruction");
  }

  get doctorDaignosis() {
    return this.generalDiagnosisForm.get("viewProvisionalDiagnosisProvided");
  }

  ngOnChanges() {
    if (this.caseRecordMode == "view") {
      let beneficiaryRegID = localStorage.getItem("beneficiaryRegID");
      let visitID = localStorage.getItem("visitID");
      let visitCategory = localStorage.getItem("visitCategory");
      if (
        localStorage.getItem("referredVisitCode") == "undefined" ||
        localStorage.getItem("referredVisitCode") == null
      ) {
        this.getDiagnosisDetails(beneficiaryRegID, visitID, visitCategory);
      } else if (parseInt(localStorage.getItem("specialist_flag")) == 3) {
        this.getMMUDiagnosisDetails(
          beneficiaryRegID,
          visitID,
          visitCategory,
          localStorage.getItem("visitCode")
        );
      } else {
        this.getMMUDiagnosisDetails(
          beneficiaryRegID,
          localStorage.getItem("referredVisitID"),
          visitCategory,
          localStorage.getItem("referredVisitCode")
        );
      }
    }
  }

  diagnosisSubscription: any;
  getDiagnosisDetails(beneficiaryRegID, visitID, visitCategory) {
    this.diagnosisSubscription = this.doctorService
      .getCaseRecordAndReferDetails(beneficiaryRegID, visitID, visitCategory)
      .subscribe((res) => {
        if (res && res.statusCode == 200 && res.data && res.data.diagnosis) {
          this.generalDiagnosisForm.patchValue(res.data.diagnosis);
          if (res.data.diagnosis.provisionalDiagnosisList) {
            this.patchDiagnosisDetails(
              res.data.diagnosis.provisionalDiagnosisList
            );
          }
        }
      });
  }

  MMUdiagnosisSubscription: any;
  getMMUDiagnosisDetails(beneficiaryRegID, visitID, visitCategory, visitCode) {
    this.MMUdiagnosisSubscription = this.doctorService
      .getMMUCaseRecordAndReferDetails(
        beneficiaryRegID,
        visitID,
        visitCategory,
        visitCode
      )
      .subscribe((res) => {
        if (res && res.statusCode == 200 && res.data && res.data.diagnosis) {
          this.generalDiagnosisForm.patchValue(res.data.diagnosis);
          if (res.data.diagnosis.provisionalDiagnosisList) {
            this.patchDiagnosisDetails(
              res.data.diagnosis.provisionalDiagnosisList
            );
          }
        }
      });
  }

  // MMUdiagnosisSubscription:any;
  // getMMUDiagnosisDetails(beneficiaryRegID, visitID, visitCategory) {
  //   this.diagnosisSubscription = this.doctorService.getMMUCaseRecordAndReferDetails(beneficiaryRegID, visitID, visitCategory,localStorage.getItem("visitCode"))
  //     .subscribe(res => {
  //       if (res && res.statusCode == 200 && res.data && res.data.diagnosis) {
  //         // this.diagnosisSubscription.unsubscribe();
  //         this.generalDiagnosisForm.patchValue(res.data.diagnosis)
  //         let diagnosisRes;
  //         if(res.data.diagnosis.provisionalDiagnosisList)
  //         {
  //         diagnosisRes = res.data.diagnosis.provisionalDiagnosisList;
  //         }
  //         else{
  //           diagnosisRes=[];
  //         }

  //         this.MMUdiagnosisSubscription = this.doctorService.getMMUCaseRecordAndReferDetails(beneficiaryRegID, localStorage.getItem("referredVisitID"), visitCategory,localStorage.getItem("referredVisitCode"))
  //         .subscribe(response => {

  //           if (response && response.statusCode == 200 && response.data && response.data.diagnosis) {
  //             let diagnosisResponse;
  //             if(response.data.diagnosis.provisionalDiagnosisList)
  //             {
  //           diagnosisResponse = response.data.diagnosis.provisionalDiagnosisList;
  //             }
  //             else{
  //               diagnosisResponse=[];
  //             }

  //             for(let i=0,j=diagnosisRes.length;i<diagnosisResponse.length;i++,j++)
  //             {
  //               diagnosisRes[j]=diagnosisResponse[i];
  //             }

  //             this.patchDiagnosisDetails(diagnosisRes);
  //           }

  //         })
  //       }
  //       })

  // }
  patchDiagnosisDetails(provisionalDiagnosis) {
    let savedDiagnosisData = provisionalDiagnosis;
    let diagnosisArrayList = this.generalDiagnosisForm.controls[
      "provisionalDiagnosisList"
    ] as FormArray;
    console.log("from diagnosis" + provisionalDiagnosis[0].term);
    if (
      provisionalDiagnosis[0].term != "" &&
      provisionalDiagnosis[0].conceptID != ""
    ) {
      console.log("from diagnosis second" + provisionalDiagnosis[0].term);

      for (let i = 0; i < savedDiagnosisData.length; i++) {
        diagnosisArrayList.at(i).patchValue({
          viewProvisionalDiagnosisProvided: savedDiagnosisData[i].term,
          term: savedDiagnosisData[i].term,
          conceptID: savedDiagnosisData[i].conceptID,
        });
        (<FormGroup>diagnosisArrayList.at(i)).controls[
          "viewProvisionalDiagnosisProvided"
        ].disable();
        if (diagnosisArrayList.length < savedDiagnosisData.length)
          this.addDiagnosis();
      }
    }
  }

  addDiagnosis() {
    let diagnosisArrayList = this.generalDiagnosisForm.controls[
      "provisionalDiagnosisList"
    ] as FormArray;
    if (diagnosisArrayList.length <= 29) {
      diagnosisArrayList.push(this.utils.initProvisionalDiagnosisList());
    } else {
      this.confirmationService.alert(
        this.current_language_set.alerts.info.maxDiagnosis
      );
    }
  }

  removeDiagnosisFromList(index, diagnosisListForm?: FormGroup) {
    let diagnosisListArray = this.generalDiagnosisForm.controls[
      "provisionalDiagnosisList"
    ] as FormArray;
    if (diagnosisListArray.at(index).valid) {
      this.confirmationService
        .confirm(`warn`, this.current_language_set.alerts.info.warn)
        .subscribe((result) => {
          if (result) {
            let diagnosisListArray = this.generalDiagnosisForm.controls[
              "provisionalDiagnosisList"
            ] as FormArray;
            if (diagnosisListArray.length > 1) {
              diagnosisListArray.removeAt(index);
            } else {
              diagnosisListForm.reset();
              diagnosisListForm.controls[
                "viewProvisionalDiagnosisProvided"
              ].enable();
            }
            this.generalDiagnosisForm.markAsDirty();
          }
        });
    } else {
      if (diagnosisListArray.length > 1) {
        diagnosisListArray.removeAt(index);
      } else {
        diagnosisListForm.reset();
        diagnosisListForm.controls["viewProvisionalDiagnosisProvided"].enable();
      }
    }
  }
  checkProvisionalDiagnosisValidity(provisionalDiagnosis) {
    let temp = provisionalDiagnosis.value;
    if (temp.term && temp.conceptID) {
      return false;
    } else {
      return true;
    }
  }
  updateIfDiseaseConfirmed() {
    this.idrsScoreService.visitDiseases$.subscribe((response) => {
      this.confirmed = response;
      console.log(' this.confirmed',  this.confirmed)
    });
    if (this.confirmed !== null && this.confirmed.length > 0) {
      this.confirmed.forEach((checkForDiabetesAndHyper) => {
        if (
          checkForDiabetesAndHyper === "Diabetes" &&
          checkForDiabetesAndHyper === "Hypertension"
        ) {
          this.generalDiagnosisForm.patchValue({ 'diabetesConfirmed' : true })
          this.diabetesChecked = true;
          this.hyperTensionChecked = true;
          this.generalDiagnosisForm.controls['diabetesConfirmed'].disable();
          this.generalDiagnosisForm.controls['hypertensionConfirmed'].disable();
          this.generalDiagnosisForm.patchValue({ 'hypertensionConfirmed' : true })
          this.generalDiagnosisForm.patchValue({ 'diabetesConfirmed' : true })
        } else if (checkForDiabetesAndHyper === "Diabetes") {
          this.generalDiagnosisForm.patchValue({ 'diabetesConfirmed' : true })
          this.diabetesChecked = true;
          this.generalDiagnosisForm.controls['diabetesConfirmed'].disable();
        } else if (checkForDiabetesAndHyper === "Hypertension") {
          this.generalDiagnosisForm.patchValue({ 'hypertensionConfirmed' : true })
          this.hyperTensionChecked = true;
          this.generalDiagnosisForm.controls['hypertensionConfirmed'].disable();
        } else {
          console.log("confirm diseases");
        }
      });
    } else {
      console.log("No confirmed diseases");
    }
  }
  addToConfirmDisease(diabetesConfirmation) {
    this.idrsScoreService.finalDiagnosisDiabetesConfirm(diabetesConfirmation);
  }
  addHyperTensionToConfirmDisease(hyperConfirmation) {
    this.idrsScoreService.finalDiagnosisHypertensionConfirm(hyperConfirmation);
    // this.idrsScoreService.setHypertensionSelected();
   
  }
 
}
