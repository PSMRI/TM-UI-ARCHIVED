/* 
* AMRIT - Accessible Medical Records via Integrated Technology 
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


import {
  Component,
  OnInit,
  ViewChild,
  AfterViewChecked,
  Input,
  ChangeDetectorRef,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, FormArray } from "@angular/forms";

import {
  NurseService,
  DoctorService,
  MasterdataService,
} from "../shared/services";
import { ConfirmationService } from "../../core/services/confirmation.service";
import { BeneficiaryDetailsService } from "../../core/services/beneficiary-details.service";

import {
  CancerUtils,
  GeneralUtils,
  QuickConsultUtils,
  VisitDetailUtils,
  NCDScreeningUtils,
} from "../shared/utility";

import { Observable, Subscription } from "rxjs/Rx";
import { environment } from "environments/environment";
import { CanComponentDeactivate } from "../../core/services/can-deactivate-guard.service";
import { MdDialogRef, MdDialog, MdDialogConfig } from "@angular/material";
import { SchedulerComponent } from "./../scheduler/scheduler.component";
import {
  MatSnackBar,
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from "@angular/material";
import { SpecialistLoginComponent } from "../../core/components/specialist-login/specialist-login.component";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { IdrsscoreService } from "../shared/services/idrsscore.service";
import { HealthIdDisplayModalComponent } from "app/app-modules/core/components/health-id-display-modal/health-id-display-modal.component";
import { RegistrarService } from "../../registrar/shared/services/registrar.service";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";
import { OpenPreviousVisitDetailsComponent } from "app/app-modules/core/components/open-previous-visit-details/open-previous-visit-details.component";

@Component({
  selector: "app-workarea",
  templateUrl: "./workarea.component.html",
  styleUrls: ["./workarea.component.css"],
})
export class WorkareaComponent implements OnInit, CanComponentDeactivate {
  @ViewChild("sidenav")
  sidenav: any;

  visitMode: String;
  ancMode: String;
  pncMode: String;
  vitalsMode: String;
  historyMode: String;
  examinationMode: String;
  caseRecordMode: String;
  referMode: String;
  ncdScreeningMode: String;
  quickConsultMode: String;
  newLookupMode: Boolean;

  visitCategory: any;
  visitCategoryList: any;
  enableIDRSUpdate: boolean = true;
  findings: any;
  currentVitals: any;
  imageCords: Array<any> = [];
  pregnancyStatus: any;
  primeGravidaStatus: any;
  beneficiary: any;
  beneficiaryRegID: any;
  visitID: string;

  showHistory = false;
  showVitals = false;
  showQuickConsult = false;
  showAnc = false;
  showExamination = false;
  showNCDScreening = false;
  showPNC = false;
  showCaseRecord = false;
  showRefer = false;

  doctorFlag: any;
  nurseFlag: any;
  specialistFlag: any;
  patientMedicalForm: FormGroup;

  tm: Boolean = false;
  current_language_set: any;
  attendant: any;
  designation: any;
  scoreFlag: any;
  diabetesSelected: any = 0;
  visualAcuityMandatory: any;
  rbsPresent: any = 0;
  visualAcuityPresent: any = 0;
  heamoglobinPresent: any = 0;
  ncdTemperature: boolean = false;
  ismmutc: string;
  beneficiaryAge: number;
  confirmedDiseases: any;
  vitalsRBSTestResults: boolean;
  rbsPresentSubscription: Subscription;
  visualAcuitySubscription: Subscription;
  hemoglobinSubscription: Subscription;
  diabetesSubscription: Subscription;
  ncdTemperatureSubscription: Subscription;
  visualAcuityMandatorySubscription: Subscription;
  mmuReferredSubscription: Subscription;
  enableVitalsButtonSubscription: Subscription;
  // enableCovidVaccinationSaveButtonSubscription: Subscription;
  enableUpdateButtonInVitals: boolean = false;
  enableCovidVaccinationSaveButton: boolean = false;
  testsPrescribed: any;
  disableSubmitButton: boolean = false;
  showProgressBar: Boolean = false;
  enableLungAssessment: boolean = false;
  enableProvisionalDiag: boolean = false;
  
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private masterdataService: MasterdataService,
    private nurseService: NurseService,
    private confirmationService: ConfirmationService,
    private doctorService: DoctorService,
    private route: ActivatedRoute,
    public httpServiceService: HttpServiceService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private mdDialog: MdDialog,
    private snackBar: MatSnackBar,
    private idrsScoreService: IdrsscoreService,
    private registrarService: RegistrarService
  ) {}
  isSpecialist: Boolean = false;
  doctorSaveAndTCSave: any;
  doctorUpdateAndTCSubmit: any;
  isDoctorUpdate: Boolean = false;
  isDoctorSave: Boolean = false;
  serviceType: any;
  ngOnInit() {
    this.enableUpdateButtonInVitals = false;
    this.enableCovidVaccinationSaveButton = false;
    this.ncdTemperature = false;
    this.enableProvisionalDiag = false;
    this.enableLungAssessment = false;
    this.nurseService.clearNCDTemp();
    this.nurseService.clearEnableLAssessment();
    this.nurseService.clearNCDScreeningProvision();
    this.ncdTemperatureSubscription = this.nurseService.ncdTemp$.subscribe(response => (response == undefined ? this.ncdTemperature = false : this.ncdTemperature = response)
  );
  this.nurseService.enableLAssessment$.subscribe(
    (response) => {
      if(response == true) {
        this.enableLungAssessment = true;
      } else {
        this.enableLungAssessment = false;
      }
    }
  );
  this.nurseService.enableProvisionalDiag$.subscribe(
    (response) => {
      if(response == true) {
        this.enableProvisionalDiag = true;
      } else {
        this.enableProvisionalDiag = false;
      }
    }
  );
    this.attendant = this.route.snapshot.params["attendant"];
    this.designation = localStorage.getItem("designation");
    this.visitCategory = localStorage.getItem("visitCategory");
    this.serviceType = localStorage.getItem("serviceName");

    this.schedulerFormData = null;
    this.tm = true;
    let disableFlag = this.visitCategory ? true : false;
    this.beneficiaryRegID = localStorage.getItem("beneficiaryRegID");
    this.visitID = localStorage.getItem("visitID");
    this.nurseFlag = localStorage.getItem("nurseFlag");
    this.doctorFlag = localStorage.getItem("doctorFlag");
    this.specialistFlag = localStorage.getItem("specialist_flag");
    this.rbsPresentSubscription =
      this.idrsScoreService.rBSPresentFlag$.subscribe(
        (response) => (this.rbsPresent = response)
      );
    this.visualAcuitySubscription =
      this.idrsScoreService.visualAcuityPresentFlag$.subscribe(
        (response) => (this.visualAcuityPresent = response)
      );
    this.hemoglobinSubscription =
      this.idrsScoreService.heamoglobinPresentFlag$.subscribe(
        (response) => (this.heamoglobinPresent = response)
      );
    this.diabetesSubscription =
      this.idrsScoreService.diabetesSelectedFlag$.subscribe(
        (response) => (this.diabetesSelected = response)
      ); // to check is pateint diabetics
    // this.idrsScoreService.diabetesSelectedFlag$.subscribe(response => {

    //   if (response > 0) {
    //     // this.getMMUInvestigationDetails();
    //   } else this.diabetesSelected = response;
    // });
    this.visualAcuityMandatorySubscription =
      this.idrsScoreService.VisualAcuityTestMandatoryFlag$.subscribe(
        (response) => (this.visualAcuityMandatory = response)
      ); // if rbs test value > 200
    this.assignSelectedLanguage();
    this.patientMedicalForm = this.fb.group({
      patientVisitForm: new VisitDetailUtils(this.fb).createPatientVisitForm(
        disableFlag
      ),
    });
    this.setVitalsUpdateButtonValue();
    this.getBeneficiaryDetails();
    this.getVisitReasonAndCategory();
    this.getVisitType();
    this.getPregnancyStatus();
    // this.setCovidVaccinationSaveButton();
  }
  setVitalsUpdateButtonValue() {
    this.enableVitalsButtonSubscription =
      this.doctorService.enableVitalsUpdateButton$.subscribe((response) =>
        response == undefined
          ? (this.enableUpdateButtonInVitals = false)
          : (this.enableUpdateButtonInVitals = response)
      );
  }

  // setCovidVaccinationSaveButton() {
  //   this.enableCovidVaccinationSaveButtonSubscription= this.doctorService.enableCovidVaccinationSaveUpdateButton$.subscribe(response => (response == undefined ? this.enableCovidVaccinationSaveButton = false : this.enableCovidVaccinationSaveButton = response));
  // }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    if (
      this.current_language_set !== undefined &&
      this.current_language_set !== null
    ) {
      // &&
      // this.schedulerButton !== "View " + this.serviceType + " Schedule")
      this.setValues();
    }
  }

  setValues() {
    if (this.schedulerButton !== "View " + this.serviceType + " Schedule") {
      this.schedulerButton =
        this.current_language_set.common.scheduleforTM + " " + this.serviceType;
    }
    if (this.attendant == "tcspecialist") {
      this.isSpecialist = true;
      if (this.doctorFlag == 1) {
        if (this.specialistFlag == 1) {
          this.doctorSaveAndTCSave = this.current_language_set.common.submit;
          this.isDoctorSave = true;
          console.log(
            "here for submit" + this.current_language_set.common.submit
          );
        } else if (this.specialistFlag == 3) {
          this.doctorUpdateAndTCSubmit =
            this.current_language_set.common.update;
          this.isDoctorUpdate = true;
          console.log(
            "here for update" + this.current_language_set.common.update
          );
        }
      } else {
        this.isDoctorUpdate = true;
        if (this.specialistFlag == 1) {
          this.doctorUpdateAndTCSubmit =
            this.current_language_set.common.submit;
        } else {
          this.doctorUpdateAndTCSubmit =
            this.current_language_set.common.update;
          console.log(
            "here for update" + this.current_language_set.common.update
          );
        }
      }
    } else {
      this.isSpecialist = false;
      if (this.doctorFlag == 1) {
        this.isDoctorSave = true;
        this.doctorSaveAndTCSave = this.current_language_set.common.submit;
      } else {
        this.doctorUpdateAndTCSubmit = this.current_language_set.common.update;
        console.log(
          "here for update" + this.current_language_set.common.update
        );
        this.isDoctorUpdate = true;
      }
    }
    // this.updatePending(event);
  }

  checkMandatory() {
    if (this.visitCategory == null || this.visitCategory == undefined) {
      this.confirmationService.alert(
        this.current_language_set.alerts.info.proceedFurther
      );
    }
    if (
      this.nurseService.fileData != undefined &&
      this.nurseService.fileData.length > 0
    ) {
      this.confirmationService.alert(
        this.current_language_set.common.Kindlyuploadthefiles
      );
      this.nurseService.fileData = null;
    }
  }

  // setCancerDefaultforMCSU(){
  //   if(localStorage.getItem('vanType') && localStorage.getItem('vanType') == 'MMU'){
  //     let f: FormGroup = (<FormGroup>this.patientMedicalForm.controls['patientVisitForm']);
  //     (<FormGroup>f.controls['patientVisitDetailsForm']).patchValue({
  //       visitReason : 'Screening',
  //       visitCategory :'Cancer Screening'
  //     })
  //            this.visitCategory = 'Cancer Screening';
  //            this.getNurseMasterData('Cancer Screening');
  //            this.handleVisitType('Cancer Screening');
  //   }
  // }

  getVisitType() {
    if (this.visitCategory) {
      this.handleVisitType(this.visitCategory, "view");
      this.newLookupMode = false;
    } else {
      this.newLookupMode = true;
      let fG: FormGroup = <FormGroup>(
        this.patientMedicalForm.controls["patientVisitForm"]
      );
      (<FormGroup>fG.controls["patientVisitDetailsForm"]).controls[
        "visitCategory"
      ].valueChanges.subscribe((categoryValue) => {
        if (categoryValue) {
          console.log(categoryValue, "categoryValue");
          this.schedulerData = null;
          this.schedulerFormData = null;

          this.schedulerButton =
            this.current_language_set.common.scheduleforTM +
            " " +
            this.serviceType;
          this.masterdataService.reset();
          this.visitCategory = categoryValue;
          this.getNurseMasterData(categoryValue);
          this.handleVisitType(categoryValue);
        }
      });
    }
  }

  handleVisitType(categoryValue, mode?: string) {
    if (categoryValue) {
      this.hideAll();

      if (categoryValue == "General OPD (QC)") {
        if (mode) {
          this.patientMedicalForm.addControl(
            "patientQuickConsultForm",
            new QuickConsultUtils(this.fb).createQuickConsultForm()
          );
          this.visitMode = new String(mode);
          this.showQuickConsult = true;
          this.quickConsultMode = new String(mode);
        } else {
          this.patientMedicalForm.addControl(
            "patientVitalsForm",
            new GeneralUtils(this.fb).createGeneralVitalDetailsForm()
          );
          this.showVitals = true;
        }
      } else if (categoryValue == "Cancer Screening") {
        this.patientMedicalForm.addControl(
          "patientHistoryForm",
          new CancerUtils(this.fb).createNurseCancerHistoryForm()
        );
        this.patientMedicalForm.addControl(
          "patientVitalsForm",
          new CancerUtils(this.fb).createNurseCancerPatientVitalsForm()
        );
        this.patientMedicalForm.addControl(
          "patientExaminationForm",
          new CancerUtils(this.fb).createCancerExaminationForm()
        );

        this.getCurrentVitals();

        this.showHistory = true;
        this.showVitals = true;
        this.showExamination = true;

        if (mode) {
          this.patientMedicalForm.addControl(
            "patientCaseRecordForm",
            new CancerUtils(this.fb).createCancerDiagnosisForm()
          );
          this.patientMedicalForm.addControl(
            "patientReferForm",
            new CancerUtils(this.fb).createCancerReferForm()
          );

          this.patchCancerFindings();

          this.visitMode = new String(mode);
          this.vitalsMode = new String(mode);
          this.historyMode = new String(mode);
          this.examinationMode = new String(mode);

          this.showCaseRecord = true;
          this.showRefer = true;
        }

        if (mode) {
          this.referMode = new String(mode);
          this.caseRecordMode = new String(mode);
        }
      } else if (categoryValue == "General OPD") {
        this.patientMedicalForm.addControl(
          "patientHistoryForm",
          new GeneralUtils(this.fb).createGeneralHistoryForm(false)
        );
        this.patientMedicalForm.addControl(
          "patientVitalsForm",
          new GeneralUtils(this.fb).createGeneralVitalDetailsForm()
        );
        this.patientMedicalForm.addControl(
          "patientExaminationForm",
          new GeneralUtils(this.fb).createPatientExaminationForm()
        );

        this.getCurrentVitals();

        this.showHistory = true;
        this.showVitals = true;
        this.showExamination = true;

        if (mode) {
          this.patientMedicalForm.addControl(
            "patientCaseRecordForm",
            new GeneralUtils(this.fb).createGeneralCaseRecord()
          );
          this.patientMedicalForm.addControl(
            "patientReferForm",
            new CancerUtils(this.fb).createCancerReferForm()
          );

          this.patchGeneralFinding();

          this.visitMode = new String(mode);
          this.vitalsMode = new String(mode);
          this.historyMode = new String(mode);
          this.examinationMode = new String(mode);

          this.showCaseRecord = true;
          this.showRefer = true;
        }

        if (mode) {
          this.referMode = new String(mode);
          this.caseRecordMode = new String(mode);
        }
      } else if (categoryValue == "NCD screening") {
        //wdf requirement
        // this.patientMedicalForm.addControl(
        //   "NCDScreeningForm",
        //   new NCDScreeningUtils(this.fb).createNCDScreeningForm()
        // );
        this.patientMedicalForm.addControl(
          "patientVitalsForm",
          new GeneralUtils(this.fb).createGeneralVitalDetailsForm()
        );
        this.patientMedicalForm.addControl(
          "patientHistoryForm",
          new GeneralUtils(this.fb).createNCDScreeningHistoryForm()
        );

        this.getCurrentVitals();
        this.showNCDScreening = true;
        this.showHistory = true;
        this.showVitals = true;

        this.patientMedicalForm.addControl(
          "idrsScreeningForm",
          new NCDScreeningUtils(this.fb).createIDRSForm()
        );
        if (mode) {
          this.patientMedicalForm.addControl(
            "patientCaseRecordForm",
            new GeneralUtils(this.fb).createNCDScreeningCaseRecord()
          );
          this.patchGeneralFinding();
          this.showCaseRecord = true;
          this.visitMode = new String(mode);
          this.vitalsMode = new String(mode);
          this.historyMode = new String(mode);
          this.caseRecordMode = new String(mode);
          // this.ncdScreeningMode = new String(mode);
          this.ncdScreeningMode = new String(mode);
          this.patientMedicalForm.addControl(
            "patientReferForm",
            new CancerUtils(this.fb).createCancerReferForm()
          );
          this.showCaseRecord = true;
          this.showRefer = true;

          if (mode) {
            this.referMode = new String(mode);
            this.caseRecordMode = new String(mode);
          }
        }
      } else if (categoryValue == "PNC") {
        this.patientMedicalForm.addControl(
          "patientPNCForm",
          new GeneralUtils(this.fb).createPatientPNCForm()
        );
        this.patientMedicalForm.addControl(
          "patientHistoryForm",
          new GeneralUtils(this.fb).createGeneralHistoryForm()
        );
        this.patientMedicalForm.addControl(
          "patientVitalsForm",
          new GeneralUtils(this.fb).createGeneralVitalDetailsForm()
        );
        this.patientMedicalForm.addControl(
          "patientExaminationForm",
          new GeneralUtils(this.fb).createPatientExaminationForm()
        );

        this.getCurrentVitals();

        this.showPNC = true;
        this.showHistory = true;
        this.showVitals = true;
        this.showExamination = true;

        if (mode) {
          this.patientMedicalForm.addControl(
            "patientCaseRecordForm",
            new GeneralUtils(this.fb).createPNCCaseRecord()
          );
          this.patientMedicalForm.addControl(
            "patientReferForm",
            new CancerUtils(this.fb).createCancerReferForm()
          );

          this.patchGeneralFinding();

          this.visitMode = new String(mode);
          this.pncMode = new String(mode);
          this.vitalsMode = new String(mode);
          this.historyMode = new String(mode);
          this.examinationMode = new String(mode);

          this.showCaseRecord = true;
          this.showRefer = true;
        }

        if (mode) {
          this.referMode = new String(mode);
          this.caseRecordMode = new String(mode);
        }
      } else if (categoryValue == "ANC") {
        this.patientMedicalForm.addControl(
          "patientANCForm",
          new GeneralUtils(this.fb).createPatientANCForm()
        );
        this.patientMedicalForm.addControl(
          "patientHistoryForm",
          new GeneralUtils(this.fb).createGeneralHistoryForm()
        );
        this.patientMedicalForm.addControl(
          "patientVitalsForm",
          new GeneralUtils(this.fb).createGeneralVitalDetailsForm()
        );
        this.patientMedicalForm.addControl(
          "patientExaminationForm",
          new GeneralUtils(this.fb).createPatientExaminationForm()
        );

        this.getCurrentVitals();
        this.patchLMPDate();
        this.getPrimeGravidaStatus();
        this.patchGravidaValue();

        this.showAnc = true;
        this.showHistory = true;
        this.showVitals = true;
        this.showExamination = true;
        if (mode) {
          this.patientMedicalForm.addControl(
            "patientCaseRecordForm",
            new GeneralUtils(this.fb).createANCCaseRecord()
          );
          this.patientMedicalForm.addControl(
            "patientReferForm",
            new CancerUtils(this.fb).createCancerReferForm()
          );

          this.patchGeneralFinding();
          this.getANCDiagnosis();

          this.visitMode = new String(mode);
          this.ancMode = new String(mode);
          this.vitalsMode = new String(mode);
          this.historyMode = new String(mode);
          this.examinationMode = new String(mode);

          this.showCaseRecord = true;
          this.showRefer = true;
        }

        if (mode) {
          this.referMode = new String(mode);
          this.caseRecordMode = new String(mode);
        }
      } else if (categoryValue == "COVID-19 Screening") {
        this.patientMedicalForm.addControl(
          "patientHistoryForm",
          new GeneralUtils(this.fb).createGeneralHistoryForm(false)
        );
        this.patientMedicalForm.addControl(
          "patientVitalsForm",
          new GeneralUtils(this.fb).createGeneralVitalDetailsForm()
        );

        this.getCurrentVitals();

        this.showHistory = true;
        this.showVitals = true;

        if (mode) {
          this.patientMedicalForm.addControl(
            "patientCaseRecordForm",
            new GeneralUtils(this.fb).createCovidCaseRecord()
          );
          this.patientMedicalForm.addControl(
            "patientReferForm",
            new CancerUtils(this.fb).createCancerReferForm()
          );

          this.patchGeneralFinding();

          this.visitMode = new String(mode);
          this.vitalsMode = new String(mode);
          this.historyMode = new String(mode);

          this.showCaseRecord = true;
          this.showRefer = true;
        }

        if (mode) {
          this.referMode = new String(mode);
          this.caseRecordMode = new String(mode);
        }
      } else if (categoryValue == "NCD care") {
        this.patientMedicalForm.addControl(
          "patientHistoryForm",
          new GeneralUtils(this.fb).createGeneralHistoryForm(false)
        );
        this.patientMedicalForm.addControl(
          "patientVitalsForm",
          new GeneralUtils(this.fb).createGeneralVitalDetailsForm()
        );

        this.getCurrentVitals();

        this.showHistory = true;
        this.showVitals = true;

        if (mode) {
          this.patientMedicalForm.addControl(
            "patientCaseRecordForm",
            new GeneralUtils(this.fb).createNCDCareCaseRecord()
          );
          this.patientMedicalForm.addControl(
            "patientReferForm",
            new CancerUtils(this.fb).createCancerReferForm()
          );

          this.patchGeneralFinding();

          this.visitMode = new String(mode);
          this.vitalsMode = new String(mode);
          this.historyMode = new String(mode);

          this.showCaseRecord = true;
          this.showRefer = true;
        }

        if (mode) {
          this.referMode = new String(mode);
          this.caseRecordMode = new String(mode);
        }
      }
    }
  }
  // createNCDScreeningCaseRecord() {
  //   return this.fb.group({
  //     generalFindingsForm: this.createGeneralFindingsForm(),
  //     generalDiagnosisForm: this.createNCDScreeningDiagnosisForm(),
  //     generalDoctorInvestigationForm: this.createGeneraldoctorinvestigationForm(),
  //     drugPrescriptionForm: this.createDrugPrescriptionForm()
  //   })
  // }
  hideAll() {
    this.patientMedicalForm.removeControl("patientHistoryForm");
    this.patientMedicalForm.removeControl("patientVitalsForm");
    this.patientMedicalForm.removeControl("patientExaminationForm");
    this.patientMedicalForm.removeControl("patientANCForm");
    this.patientMedicalForm.removeControl("patientCaseRecordForm");
    this.patientMedicalForm.removeControl("patientReferForm");
    this.patientMedicalForm.removeControl("NCDScreeningForm");
    this.patientMedicalForm.removeControl("idrsScreeningForm");

    this.showQuickConsult = false;
    this.showNCDScreening = false;
    this.showAnc = false;
    this.showHistory = false;
    this.showVitals = false;
    this.showExamination = false;
    this.showPNC = false;
    this.showCaseRecord = false;
    this.showRefer = false;

    this.changeDetectorRef.detectChanges();
  }

  submitPatientMedicalDetailsForm(medicalForm) {
    this.disableSubmitButton = true;
    this.showProgressBar = true;
    if (this.visitCategory == "Cancer Screening")
      this.submitNurseCancerVisitDetails(medicalForm);

    if (this.visitCategory == "NCD screening")
      this.submitNurseNCDScreeningVisitDetails(medicalForm);

    if (this.visitCategory == "General OPD (QC)")
      this.submitNurseQuickConsultVisitDetails(medicalForm);

    if (this.visitCategory == "ANC")
      this.submitNurseANCVisitDetails(medicalForm);

    if (this.visitCategory == "PNC")
      this.submitPatientMedicalDetailsPNC(medicalForm);

    if (this.visitCategory == "General OPD")
      this.submitNurseGeneralOPDVisitDetails(medicalForm);

    if (this.visitCategory == "NCD care")
      this.submitNurseNCDcareVisitDetails(medicalForm);

    if (this.visitCategory == "COVID-19 Screening")
      this.submitNurseCovidVisitDetails(medicalForm);
  }

  removeBeneficiaryDataForNurseVisit() {
    localStorage.removeItem("beneficiaryGender");
    localStorage.removeItem("beneficiaryRegID");
    localStorage.removeItem("beneficiaryID");
    localStorage.removeItem("benFlowID");
  }
  navigateToNurseWorklist() {
    this.patientMedicalForm.reset();
    this.removeBeneficiaryDataForNurseVisit();
    this.router.navigate(["/common/nurse-worklist"]);
  }

  checkForPrescribedTests(temp) {
    let investigationForm = (<FormGroup>(
      this.patientMedicalForm.controls["patientCaseRecordForm"]
    )).controls["generalDoctorInvestigationForm"];
    this.testsPrescribed =
      this.doctorService.postGeneralCaseRecordInvestigation(
        investigationForm,
        temp
      );
    console.log("testsPrescribed", this.testsPrescribed);
  }
  submitDoctorDiagnosisForm() {
    this.disableSubmitButton = true;
    this.showProgressBar = true;
    if (this.visitCategory == "Cancer Screening")
      this.submitCancerDiagnosisForm();

    if (this.visitCategory == "General OPD (QC)")
      this.submitQuickConsultDiagnosisForm();

    if (this.visitCategory == "ANC") this.submitANCDiagnosisForm();

    if (this.visitCategory == "PNC") this.submitPNCDiagnosisForm();

    if (this.visitCategory == "General OPD")
      this.submitGeneralOPDDiagnosisForm();

    if (this.visitCategory == "NCD care") this.submitNCDCareDiagnosisForm();
    if (this.visitCategory == "COVID-19 Screening")
      this.submitCovidDiagnosisForm();
    if (this.visitCategory == "NCD screening")
      this.submitNCDScreeningDiagnosisForm();
  }
  submitNCDScreeningDiagnosisForm() {
    console.log("patientMedicalForm", this.patientMedicalForm);
    if (this.checkNCDScreeningRequiredData(this.patientMedicalForm)) {
      let temp = {
        beneficiaryRegID: this.beneficiaryRegID,
        benVisitID: this.visitID,
        visitCode: localStorage.getItem("visitCode"),
        providerServiceMapID: localStorage.getItem("providerServiceID"),
        createdBy: localStorage.getItem("userName"),
      };

      this.checkForPrescribedTests(temp);
      this.doctorService
        .postDoctorNCDScreeningDetails(
          this.patientMedicalForm,
          temp,
          this.schedulerData,
          this.isSpecialist
        )
        .subscribe(
          (res: any) => {
            if (res.statusCode == 200 && res.data != null) {
              const idrsFormDetails = <FormGroup>(
                this.patientMedicalForm.controls["idrsScreeningForm"]
              );
              this.doctorService
                .updateIDRSDetails(idrsFormDetails, this.visitCategory)
                .subscribe(
                  (res) => {
                    console.log("updated Idrs value in diagnosis", res);
                  },
                  (err) => {
                    console.log(err, "error");
                  }
                );
              console.log(
                "IDRS",
                <FormGroup>(
                  this.patientMedicalForm.controls["idrsScreeningForm"].value
                )
              );
              this.patientMedicalForm.reset();
             // this.removeBeneficiaryDataForDoctorVisit();
              sessionStorage.removeItem("instFlag");
              sessionStorage.removeItem("suspectFlag");
              if (this.isSpecialist) {
                this.linkCareContextBasedOnSpecialistScheduled();
              } else {
                this.linkCareContextBasedOnTestsPrescribed();
              }
            } else {
              this.resetSpinnerandEnableTheSubmitButton();
              this.confirmationService.alert(res.errorMessage, "error");
            }
          },
          (err) => {
            this.resetSpinnerandEnableTheSubmitButton();
            this.confirmationService.alert(err, "error");
          }
        );
    }
  }
  removeBeneficiaryDataForDoctorVisit() {
    localStorage.removeItem("visitCode");
    localStorage.removeItem("beneficiaryGender");
    localStorage.removeItem("benFlowID");
    localStorage.removeItem("visitCategory");
    localStorage.removeItem("beneficiaryRegID");
    localStorage.removeItem("visitID");
    localStorage.removeItem("beneficiaryID");
    localStorage.removeItem("doctorFlag");
    localStorage.removeItem("nurseFlag");
    localStorage.removeItem("pharmacist_flag");
  }

  updateDoctorDiagnosisForm() {
    this.disableSubmitButton = true;
    this.showProgressBar = true;
    let visitCategory = localStorage.getItem("visitCategory");
    let vanID = JSON.parse(localStorage.getItem("serviceLineDetails")).vanID;
    let parkingPlaceID = JSON.parse(
      localStorage.getItem("serviceLineDetails")
    ).parkingPlaceID;
    let otherDetails = {
      beneficiaryRegID: this.beneficiaryRegID,
      benVisitID: this.visitID,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
      sessionID: localStorage.getItem("sessionID"),
      beneficiaryID: localStorage.getItem("beneficiaryID"),
      parkingPlaceID: parkingPlaceID,
      vanID: vanID,
      visitCode: localStorage.getItem("visitCode"),
      serviceID: localStorage.getItem("serviceID"),
      benFlowID: localStorage.getItem("benFlowID"),
      isSpecialist: this.isSpecialist,
    };

    if (visitCategory == "Cancer Screening") {
      if (this.checkCancerRequiredData(this.patientMedicalForm)) {
        this.doctorService
          .saveSpecialistCancerObservation(
            this.patientMedicalForm,
            otherDetails
          )
          .subscribe(
            (res) => {
              if (res.statusCode == 200 && res.data != null) {
                this.patientMedicalForm.reset();
                if (this.isSpecialist) {
                  this.getHealthIDDetails(res.data.response);
                } 
              } else {
                this.resetSpinnerandEnableTheSubmitButton();
                this.confirmationService.alert(res.errorMessage, "error");
              }
            },
            (err) => {
              this.resetSpinnerandEnableTheSubmitButton();
              this.confirmationService.alert(err, "error");
            }
          );
      }
    } else if (visitCategory == "NCD screening") {
      if (this.checkNCDScreeningRequiredData(this.patientMedicalForm)) {
        this.checkForPrescribedTests(otherDetails);
        this.doctorService
          .updateDoctorDiagnosisDetails(
            this.patientMedicalForm,
            visitCategory,
            otherDetails,
            this.schedulerData
          )
          .subscribe(
            (res: any) => {
              if (res.statusCode == 200 && res.data != null) {
                const idrsFormDetails = <FormGroup>(
                  this.patientMedicalForm.controls["idrsScreeningForm"]
                );
                this.doctorService
                  .updateIDRSDetails(idrsFormDetails, this.visitCategory)
                  .subscribe(
                    (res) => {
                      console.log("updated Idrs value in diagnosis", res);
                    },
                    (err) => {
                      console.log(err, "error");
                    }
                  );
                this.patientMedicalForm.reset();
                sessionStorage.removeItem("instFlag");
                sessionStorage.removeItem("suspectFlag");
                // this.confirmationService.alert(res.data.response, "success");
                if (this.isSpecialist) {
                  if (
                    this.testsPrescribed !== undefined &&
                    this.testsPrescribed !== null &&
                    this.testsPrescribed.laboratoryList.length > 0
                  ) {
                    this.confirmationService.alert(
                      res.data.response,
                      "success"
                    );
                    this.navigateToSpecialistWorklist();
                  } else {
                    this.getHealthIDDetails(res.data.response);
                  }
                } else {
                  if ((
                    this.testsPrescribed !== undefined &&
                    this.testsPrescribed !== null &&
                    this.testsPrescribed.laboratoryList.length > 0
                  ) || (this.schedulerData !== undefined &&
                    this.schedulerData !== null)) {
                    this.confirmationService.alert(
                      res.data.response,
                      "success"
                    );
                    this.navigateToDoctorWorklist();
                  } else {
                    this.getHealthIDDetails(res.data.response);
                  }
                }
              } else {
                this.resetSpinnerandEnableTheSubmitButton();
                this.confirmationService.alert(res.errorMessage, "error");
              }
            },
            (err) => {
              this.resetSpinnerandEnableTheSubmitButton();
              this.confirmationService.alert(err, "error");
            }
          );
      }
    } else {
      if (this.checkNurseRequirements(this.patientMedicalForm)) {
        this.checkForPrescribedTests(otherDetails);
        this.doctorService
          .updateDoctorDiagnosisDetails(
            this.patientMedicalForm,
            visitCategory,
            otherDetails,
            this.schedulerData
          )
          .subscribe(
            (res: any) => {
              if (res.statusCode == 200 && res.data != null) {
                if (this.isSpecialist) {
                  if (
                    this.testsPrescribed !== undefined &&
                    this.testsPrescribed !== null &&
                    this.testsPrescribed.laboratoryList.length > 0
                  ) {
                    this.confirmationService.alert(
                      res.data.response,
                      "success"
                    );
                    this.navigateToSpecialistWorklist();
                  } else {
                    this.getHealthIDDetails(res.data.response);
                  }
                } else {
                  if ((
                    this.testsPrescribed !== undefined &&
                    this.testsPrescribed !== null &&
                    this.testsPrescribed.laboratoryList.length > 0
                  ) || (this.schedulerData !== undefined &&
                    this.schedulerData !== null)) {
                    this.confirmationService.alert(
                      res.data.response,
                      "success"
                    );
                    this.navigateToDoctorWorklist();
                  } else {
                    this.getHealthIDDetails(res.data.response);
                  }
                }
              } else {
                this.resetSpinnerandEnableTheSubmitButton();
                this.confirmationService.alert(res.errorMessage, "error");
              }
            },
            (err) => {
              this.resetSpinnerandEnableTheSubmitButton();
              this.confirmationService.alert(err, "error");
            }
          );
      }
    }
  }

  /**
   * Submit Nurse Cancer Details
   */
  submitNurseCancerVisitDetails(medicalForm) {
    if (this.checkCancerRequiredData(medicalForm)) {
      // check if the form is valid
      let imageCoordiantes = this.getImageCoordinates(medicalForm);

      this.confirmationService
        .confirm(
          `info`,
          this.current_language_set.alerts.info.doctorVisit,
          "Yes",
          "No"
        )
        .subscribe((result) => {
          if (result != undefined && result != null)
            this.nurseService
              .postNurseCancerVisitForm(
                medicalForm,
                imageCoordiantes,
                result,
                this.schedulerData
              )
              .subscribe(
                (res: any) => {
                  if (res.statusCode == 200 && res.data != null) {
                    this.confirmationService.alert(res.data.response, 'success');
                    // this.confirmationService.alert(
                    //   this.current_language_set.alerts.info
                    //     .datafillSuccessfully,
                    //   "success"
                    // );
                    this.navigateToNurseWorklist();
                  } else if (res.statusCode == 9999) {
                    this.navigateToNurseWorklist();
                    this.confirmationService.alert(res.errorMessage, "info");
                  } else {
                    this.resetSpinnerandEnableTheSubmitButton();
                    this.confirmationService.alert(res.errorMessage, "error");
                  }
                },
                (err) => {
this.resetSpinnerandEnableTheSubmitButton();
                  this.confirmationService.alert(err, "error");
                }
              );
        });
    }
  }
  resetSpinnerandEnableTheSubmitButton() {
    this.disableSubmitButton = false;
    this.showProgressBar = false;
  }
  getImageCoordinates(patientMedicalForm) {
    let imageCords = [];
    let image1 = (<FormGroup>(
      (<FormGroup>patientMedicalForm.controls.patientExaminationForm).controls
        .oralExaminationForm
    )).controls["image"].value;
    if (image1)
      imageCords.push(
        Object.assign(image1, {
          vanID: JSON.parse(localStorage.getItem("serviceLineDetails")).vanID,
          parkingPlaceID: JSON.parse(localStorage.getItem("serviceLineDetails"))
            .parkingPlaceID,
        })
      );
    let image2 = (<FormGroup>(
      (<FormGroup>patientMedicalForm.controls.patientExaminationForm).controls
        .abdominalExaminationForm
    )).controls["image"].value;
    if (image2)
      imageCords.push(
        Object.assign(image2, {
          vanID: JSON.parse(localStorage.getItem("serviceLineDetails")).vanID,
          parkingPlaceID: JSON.parse(localStorage.getItem("serviceLineDetails"))
            .parkingPlaceID,
        })
      );
    let image3 = (<FormGroup>(
      (<FormGroup>patientMedicalForm.controls.patientExaminationForm).controls
        .gynecologicalExaminationForm
    )).controls["image"].value;
    if (image3)
      imageCords.push(
        Object.assign(image3, {
          vanID: JSON.parse(localStorage.getItem("serviceLineDetails")).vanID,
          parkingPlaceID: JSON.parse(localStorage.getItem("serviceLineDetails"))
            .parkingPlaceID,
        })
      );
    let image4 = (<FormGroup>(
      (<FormGroup>patientMedicalForm.controls.patientExaminationForm).controls
        .breastExaminationForm
    )).controls["image"].value;
    if (image4)
      imageCords.push(
        Object.assign(image4, {
          vanID: JSON.parse(localStorage.getItem("serviceLineDetails")).vanID,
          parkingPlaceID: JSON.parse(localStorage.getItem("serviceLineDetails"))
            .parkingPlaceID,
        })
      );

    return imageCords;
  }

  /**
   * Submit Doctor Cancer Details
   */
  submitCancerDiagnosisForm() {
    if (this.checkCancerRequiredData(this.patientMedicalForm)) {
      // check if the form is valid
      this.doctorService
        .postDoctorCancerVisitDetails(
          this.patientMedicalForm,
          this.schedulerData,
          this.isSpecialist
        )
        .subscribe(
          (res: any) => {
            if (res.statusCode == 200 && res.data != null) {
              if (this.isSpecialist) {
                this.getHealthIDDetails(
                  this.current_language_set.alerts.info.datafillSuccessfully
                );
              } else {
                if (this.schedulerData !== undefined && this.schedulerData !== null) {
                  this.confirmationService.alert(
                    this.current_language_set.alerts.info.datafillSuccessfully,
                    "success"
                  );
                  this.navigateToDoctorWorklist();
                } else {
                  this.getHealthIDDetails(
                    this.current_language_set.alerts.info.datafillSuccessfully
                  );
                }
              }
            } else {
              this.resetSpinnerandEnableTheSubmitButton();
              this.confirmationService.alert(res.errorMessage, "error");
            }
          },
          (err) => {
            this.resetSpinnerandEnableTheSubmitButton();
            this.confirmationService.alert(err, "error");
          }
        );
    }
  }
  /* If RBS score more than 200, then Visual Acuity test is mandatory */
  visualAcuityTestValidation(caseRecordForm, required) {
    if (
      this.visualAcuityPresent > 0 &&
      this.idrsScoreService.visualAcuityTestInMMU != 0 &&
      this.visualAcuityMandatory > 0
    ) {
      let investigationVisualCount = 0;
      let labTestArray =
        caseRecordForm.controls["generalDoctorInvestigationForm"].value.labTest;
      if (labTestArray !== undefined && labTestArray !== null && labTestArray.length > 0) {
        labTestArray.forEach((element) => {
          if (
            element.procedureName != null &&
            element.procedureName.toLowerCase() ==
              environment.visualAcuityTest.toLowerCase()
          ) {
            investigationVisualCount++;
          }
        });
      }

      if (investigationVisualCount == 0) {
        required.push(
          this.current_language_set.pleaseSelectVisualAcuityTestInInvestigation
        );
      }
    }
  }
  checkNurseRequirements(medicalForm) {
    const vitalsForm = <FormGroup>medicalForm.controls["patientVitalsForm"];
    const covidForm = <FormGroup>medicalForm.controls["patientVisitForm"];
    const referForm = <FormGroup>medicalForm.controls["patientReferForm"];
    const covidForm2 = <FormGroup>covidForm.controls["patientCovidForm"];
    const historyForm = <FormGroup>medicalForm.controls["patientHistoryForm"];
    const caseRecordForm = <FormGroup>(
      medicalForm.controls["patientCaseRecordForm"]
    );

    console.log("medicalForm", medicalForm);

    const examinationForm = <FormGroup>(
      this.patientMedicalForm.controls["patientExaminationForm"]
    );
    const pncForm = <FormGroup>(
      this.patientMedicalForm.controls["patientPNCForm"]
    );
    const ancForm = <FormGroup>(
      this.patientMedicalForm.controls["patientANCForm"]
    );
    const required = [];
    if(environment.isTMOffline) {
    if(this.enableLungAssessment === true && this.beneficiaryAge >= 18 && this.nurseService.isAssessmentDone === false) {
      required.push("Please perform Lung Assessment");
    }
  }

    console.log("pncForm", pncForm);
    if (this.visitCategory == "PNC") {
      if (pncForm.controls["deliveryPlace"].errors) {
        required.push(this.current_language_set.pncData.placeofDelivery);
      }
      if (pncForm.controls["deliveryType"].errors) {
        required.push(this.current_language_set.pncData.typeofDelivery);
      }
    }
    if (this.visitCategory == "General OPD" && this.attendant == "doctor") {
      const diagForm = <FormGroup>(
        this.patientMedicalForm.controls["patientCaseRecordForm"]
      );
      const diagForm1 = <FormGroup>diagForm.controls["generalDiagnosisForm"];
      const diagForm2 = <FormArray>(
        diagForm1.controls["provisionalDiagnosisList"]
      );
      // const historyForm4=<FormGroup>historyForm3.controls[0].["FormGroup"];
      const diagForm3 = <FormGroup>diagForm2.controls[0];
      if (diagForm3.controls["viewProvisionalDiagnosisProvided"].errors) {
        required.push(
          this.current_language_set.DiagnosisDetails.provisionaldiagnosis
        );
      }

      if (!diagForm3.controls["viewProvisionalDiagnosisProvided"].errors) {
        diagForm2.value.filter((item) => {
          if (
            item.viewProvisionalDiagnosisProvided &&
            (item.conceptID === null ||
              item.conceptID === undefined ||
              item.conceptID === "")
          )
            required.push(
              this.current_language_set
                .pleaseSelectprovisionalDiagnosisWithSnomedCode
            );
        });
      }
    }

    if (
      this.visitCategory != "General OPD (QC)" &&
      this.visitCategory != "NCD screening"
    ) {
      const pregForm = <FormGroup>medicalForm.controls["patientHistoryForm"];
      const pregForm1 = <FormGroup>pregForm.controls["pastObstericHistory"];
      const pregForm2 = <FormGroup>(
        pregForm1.controls["pastObstericHistoryList"]
      );
      if (this.attendant == "nurse") {
        if (pregForm2.controls) {
          var score1: number = Number(pregForm2.controls.length);
          for (let i = 0; i < score1; i++) {
            const pregForm3 = <FormGroup>pregForm2.controls[i];
            if (
              pregForm3.controls["pregOutcome"].value &&
              pregForm3.controls["pregOutcome"].value.pregOutcome == "Abortion"
            ) {
              if (
                pregForm3.controls["abortionType"].value &&
                pregForm3.controls["abortionType"].value.complicationValue ==
                  "Induced" &&
                pregForm3.controls["typeofFacility"].errors
              ) {
                required.push(
                  this.current_language_set.historyData.opd_NCD_PNCHistory
                    .obstetric.typeofFacility +
                    "-" +
                    this.current_language_set.historyData.opd_NCD_PNCHistory
                      .obstetric.orderofPregnancy +
                    " " +
                    pregForm3.value.pregOrder
                );
              }
              if (pregForm3.controls["postAbortionComplication"].errors) {
                required.push(
                  this.current_language_set.historyData.opd_NCD_PNCHistory
                    .obstetric.complicationPostAbortion +
                    "-" +
                    this.current_language_set.historyData.opd_NCD_PNCHistory
                      .obstetric.orderofPregnancy +
                    " " +
                    pregForm3.value.pregOrder
                );
              }
              if (pregForm3.controls["abortionType"].errors) {
                required.push(
                  this.current_language_set.historyData.opd_NCD_PNCHistory
                    .obstetric.typeOfAbortion +
                    "-" +
                    this.current_language_set.historyData.opd_NCD_PNCHistory
                      .obstetric.orderofPregnancy +
                    " " +
                    pregForm3.value.pregOrder
                );
              }
              if (pregForm3.controls["pregDuration"].errors) {
                required.push(
                  this.current_language_set.historyData.opd_NCD_PNCHistory
                    .obstetric.noOfcompletedWeeks +
                    "-" +
                    this.current_language_set.historyData.opd_NCD_PNCHistory
                      .obstetric.orderofPregnancy +
                    " " +
                    pregForm3.value.pregOrder
                );
              }
            }
          }
        }
      }
    }

    if (
      this.visitCategory == "General OPD" &&
      this.designation == "TC Specialist"
    ) {
      const diagForm = <FormGroup>(
        this.patientMedicalForm.controls["patientCaseRecordForm"]
      );
      const diagForm1 = <FormGroup>diagForm.controls["generalDiagnosisForm"];
      const diagForm2 = <FormArray>(
        diagForm1.controls["provisionalDiagnosisList"]
      );
      const diagForm3 = <FormGroup>diagForm2.controls[0];

      if (diagForm3.controls["viewProvisionalDiagnosisProvided"].errors) {
        required.push(
          this.current_language_set.DiagnosisDetails.provisionaldiagnosis
        );
      }
      // if (diagForm1.controls["instruction"].errors) {
      //   required.push("Specialist Advice");
      // }

      if (!diagForm3.controls["viewProvisionalDiagnosisProvided"].errors) {
        diagForm2.value.filter((item) => {
          if (
            item.viewProvisionalDiagnosisProvided &&
            (item.conceptID === null ||
              item.conceptID === undefined ||
              item.conceptID === "")
          )
            required.push(
              this.current_language_set
                .pleaseSelectprovisionalDiagnosisWithSnomedCode
            );
        });
      }
    }
    if (this.visitCategory == "PNC" && this.attendant == "doctor") {
      const diagForm = <FormGroup>(
        this.patientMedicalForm.controls["patientCaseRecordForm"]
      );
      const diagForm1 = <FormGroup>diagForm.controls["generalDiagnosisForm"];
      const diagForm2 = <FormArray>(
        diagForm1.controls["provisionalDiagnosisList"]
      );
      // const historyForm4=<FormGroup>historyForm3.controls[0].["FormGroup"];
      const diagForm3 = <FormGroup>diagForm2.controls[0];
      // if (diagForm3.controls["viewProvisionalDiagnosisProvided"].errors) {
      //   required.push(
      //     this.current_language_set.DiagnosisDetails.provisionaldiagnosis
      //   );
      // }

      if (!diagForm3.controls["viewProvisionalDiagnosisProvided"].errors) {
        diagForm2.value.filter((item) => {
          if (
            item.viewProvisionalDiagnosisProvided &&
            (item.conceptID === null ||
              item.conceptID === undefined ||
              item.conceptID === "")
          )
            required.push(
              this.current_language_set
                .pleaseSelectprovisionalDiagnosisWithSnomedCode
            );
        });
      }

      const confirmatorydiagForm = <FormArray>(
        diagForm1.controls["confirmatoryDiagnosisList"]
      );

      confirmatorydiagForm.value.filter((item) => {
        if (
          item.viewConfirmatoryDiagnosisProvided &&
          (item.conceptID === null ||
            item.conceptID === undefined ||
            item.conceptID === "")
        )
          required.push(
            this.current_language_set.confirmatoryDiagnosisIsNotValid
          );
      });
    }
    if (this.visitCategory == "PNC" && this.designation == "TC Specialist") {
      const diagForm = <FormGroup>(
        this.patientMedicalForm.controls["patientCaseRecordForm"]
      );
      const diagForm1 = <FormGroup>diagForm.controls["generalDiagnosisForm"];
      const diagForm2 = <FormArray>(
        diagForm1.controls["provisionalDiagnosisList"]
      );
      const diagForm3 = <FormGroup>diagForm2.controls[0];
      if (diagForm3.controls["viewProvisionalDiagnosisProvided"].errors) {
        required.push(
          this.current_language_set.DiagnosisDetails.provisionaldiagnosis
        );
      }
      // if (diagForm1.controls["specialistDiagnosis"].errors) {
      //   required.push("Specialist Diagnosis");
      // }

      if (!diagForm3.controls["viewProvisionalDiagnosisProvided"].errors) {
        diagForm2.value.filter((item) => {
          if (
            item.viewProvisionalDiagnosisProvided &&
            (item.conceptID === null ||
              item.conceptID === undefined ||
              item.conceptID === "")
          )
            required.push(
              this.current_language_set
                .pleaseSelectprovisionalDiagnosisWithSnomedCode
            );
        });
      }

      const confirmatorydiagForm = <FormArray>(
        diagForm1.controls["confirmatoryDiagnosisList"]
      );

      confirmatorydiagForm.value.filter((item) => {
        if (
          item.viewConfirmatoryDiagnosisProvided &&
          (item.conceptID === null ||
            item.conceptID === undefined ||
            item.conceptID === "")
        )
          required.push(
            this.current_language_set.confirmatoryDiagnosisIsNotValid
          );
      });
    }
    if (
      this.visitCategory == "Cancer Screening" &&
      this.attendant == "doctor"
    ) {
      const diagForm = <FormGroup>(
        this.patientMedicalForm.controls["patientCaseRecordForm"]
      );
      const diagForm1 = <FormGroup>diagForm.controls["diagnosisForm"];
      //  const diagForm2=<FormArray>diagForm1.controls["provisionalDiagnosisList"];
      // // const historyForm4=<FormGroup>historyForm3.controls[0].["FormGroup"];
      // const diagForm3=<FormGroup>diagForm2.controls[0];
      if (diagForm1.controls["provisionalDiagnosisPrimaryDoctor"].errors) {
        required.push(
          this.current_language_set.DiagnosisDetails.provisionaldiagnosis
        );
      }
    }
    if (
      this.visitCategory == "Cancer Screening" &&
      this.designation == "TC Specialist"
    ) {
      const diagForm = <FormGroup>(
        this.patientMedicalForm.controls["patientCaseRecordForm"]
      );
      const diagForm1 = <FormGroup>diagForm.controls["diagnosisForm"];
      if (diagForm1.controls["provisionalDiagnosisPrimaryDoctor"].errors) {
        required.push(
          this.current_language_set.DiagnosisDetails.provisionaldiagnosis
        );
      }
    }
    console.log("attendant", this.attendant);
    // if (this.visitCategory == "ANC" && this.designation == "TC Specialist") {
    //   const diagForm = <FormGroup>this.patientMedicalForm.controls["patientCaseRecordForm"];
    //    const diagForm1=<FormGroup>diagForm.controls["generalDiagnosisForm"];
    //    console.log("diagForm",diagForm)
    //   if (diagForm1.controls["specialistDiagnosis"].errors) {
    //     required.push("Specialist Diagnosis");
    //   }
    //    }

    if (
      this.visitCategory == "COVID-19 Screening" &&
      this.attendant == "doctor"
    ) {
      const diagForm = <FormGroup>(
        this.patientMedicalForm.controls["patientCaseRecordForm"]
      );
      const diagForm1 = <FormGroup>diagForm.controls["generalDiagnosisForm"];
      console.log("diag", diagForm1);
      if (diagForm1.controls["doctorDiagnosis"].errors) {
        required.push(this.current_language_set.doctorDiagnosis);
      }
    }
    // if (this.visitCategory == "COVID-19 Screening" && this.designation == "TC Specialist") {

    //   const diagForm = <FormGroup>this.patientMedicalForm.controls["patientCaseRecordForm"];
    //    const diagForm1=<FormGroup>diagForm.controls["generalDiagnosisForm"];

    //   if (diagForm1.controls["specialistDiagnosis"].errors) {
    //     required.push("Specialist Diagnosis");
    //   }

    // }
    // if (this.visitCategory == "General OPD (QC)" && this.attendant=="doctor") {
    //   const diagForm = <FormGroup>this.patientMedicalForm.controls["patientQuickConsultForm"];
    //   // const diagForm1=<FormGroup>diagForm.controls["generalDiagnosisForm"];
    //  const diagForm2=<FormArray>diagForm.controls["provisionalDiagnosisList"];
    //  console.log("diagForm2",diagForm2)
    // // const historyForm4=<FormGroup>historyForm3.controls[0].["FormGroup"];
    // const diagForm3=<FormGroup>diagForm2.controls[0];
    //  if (diagForm3.controls["viewProvisionalDiagnosisProvided"].errors) {
    //    required.push("Provisional Diagnosis");
    //   }

    // }
    // if (this.visitCategory == "General OPD (QC)" && this.attendant == "tcspecialist") {

    //   const diagForm = <FormGroup>this.patientMedicalForm.controls["patientQuickConsultForm"];
    //   //  const diagForm1=<FormGroup>diagForm.controls["generalDiagnosisForm"];

    //   if (diagForm.controls["instruction"].errors) {
    //     required.push("Specialist Advice");
    //   }

    // }
    // if (this.visitCategory == "NCD care" && this.designation == "TC Specialist") {

    //   const diagForm = <FormGroup>this.patientMedicalForm.controls["patientCaseRecordForm"];
    //    const diagForm1=<FormGroup>diagForm.controls["generalDiagnosisForm"];

    //   if (diagForm1.controls["specialistDiagnosis"].errors) {
    //     required.push("Specialist Diagnosis");
    //   }

    // }

    if (this.visitCategory == "COVID-19 Screening") {
      const historyForm = <FormGroup>(
        this.patientMedicalForm.controls["patientHistoryForm"]
      );
      console.log("HistoryForm", historyForm);
      const historyForm2 = <FormGroup>(
        historyForm.controls["comorbidityHistory"]
      );
      const historyForm3 = <FormArray>(
        historyForm2.controls["comorbidityConcurrentConditionsList"]
      );
      // const historyForm4=<FormGroup>historyForm3.controls[0].["FormGroup"];
      const historyForm4 = <FormGroup>historyForm3.controls[0];
      if (covidForm2.controls["contactStatus"].errors) {
        required.push(this.current_language_set.contactHistory);
      }

      if (covidForm2.controls["travelStatus"].errors) {
        required.push(this.current_language_set.covid.travelHistory);
      }
      if (covidForm2.controls["symptom"].errors) {
        required.push(
          this.current_language_set.ExaminationData.cancerScreeningExamination
            .symptoms.symptoms
        );
      }
      /*  if(historyForm.controls[0].errors){
          required.push("Comorbid");
         }*/
      if (historyForm4.controls["comorbidConditions"].errors) {
        required.push(
          this.current_language_set.historyData.ancHistory
            .combordityANC_OPD_NCD_PNC.comorbidConditions
        );
      }
      /* if(historyForm5.controls["comorbidConditions"].errors){
        required.push("Comorbid conditions");
       }*/
      /* if(historyForm2.controls["timePeriodAgo"].errors){
        required.push("Comorbid conditions Duration");
       }
       if(historyForm2.controls["timePeriodUnit"].errors){
        required.push("Comorbid conditions Duration Unit");
       }*/
    }
    if (this.visitCategory == "ANC") {
      const ancdetailsForm = <FormGroup>(
        ancForm.controls["patientANCDetailsForm"]
      );
      if (ancdetailsForm.controls["primiGravida"].errors) {
        required.push(
          this.current_language_set.ancData.ancDataDetails.primiGravida
        );
      }
      if (ancdetailsForm.controls["lmpDate"].errors) {
        required.push(this.current_language_set.ancData.ancDataDetails.lastMenstrualPeriod);
      }
      if (this.attendant == "doctor" || this.designation == "TC Specialist") {
        let ANCCaseRecordForm = <FormGroup>(
          medicalForm.controls["patientCaseRecordForm"]
        );
        let ANCVitalsForm = <FormGroup>(
          medicalForm.controls["patientVitalsForm"]
        );
        console.log("ANCCaseRecordForm", ANCVitalsForm);
        if (this.rbsPresent > 0) {
          let investigationCount = 0;
          let labTestArray =
            ANCCaseRecordForm.controls["generalDoctorInvestigationForm"].value
              .labTest;
          if (labTestArray !== undefined && labTestArray !== null && labTestArray.length > 0) {
            labTestArray.forEach((element) => {
              if (
                element.procedureName != null &&
                element.procedureName.toLowerCase() ==
                  environment.RBSTest.toLowerCase()
              ) {
                investigationCount++;
              }
            });
          }

          if (
            investigationCount == 0 &&
            ANCVitalsForm.controls["rbsTestResult"].value === null
          ) {
            required.push(
              this.current_language_set.pleaseSelectRBSTestInInvestigation
            );
          }

          // if(investigationCount == 0 && this.diabetesSelected === 1 ) {
          //   required.push("Please select RBS Test");
          // }
        }
        if (this.heamoglobinPresent > 0) {
          let investigationCount = 0;
          let labTestArray =
            ANCCaseRecordForm.controls["generalDoctorInvestigationForm"].value
              .labTest;
          if (labTestArray !== undefined && labTestArray !== null && labTestArray.length > 0) {
            labTestArray.forEach((element) => {
              if (
                element.procedureName != null &&
                element.procedureName.toLowerCase() ==
                  environment.haemoglobinTest.toLowerCase()
              ) {
                investigationCount++;
              }
            });
          }

          if (investigationCount == 0) {
            required.push(
              this.current_language_set
                .pleaseSelectHeamoglobinTestInInvestigation
            );
          }
        }
      }
    }
    if (
      this.visitCategory != "General OPD (QC)" &&
      this.visitCategory != "NCD screening"
    ) {
      let personalHistory = historyForm.controls["personalHistory"];
      let allergyList = personalHistory.value.allergicList;

      let snomedTermNotMapped = false;

      if (allergyList.length > 0) {
        for (let i = 0; i < allergyList.length; i++) {
          if (allergyList[i].allergyType != null) {
            if (
              allergyList[i].snomedCode == null &&
              allergyList[i].snomedTerm != null
            ) {
              snomedTermNotMapped = true;
            } else if (
              allergyList[i].snomedCode != null &&
              allergyList[i].snomedTerm == null
            ) {
              snomedTermNotMapped = true;
            }
          }
        }
      }

      if (snomedTermNotMapped) {
        required.push(this.current_language_set.allergyNameIsNotValid);
      }
    }

    if (vitalsForm !== undefined && vitalsForm !== null) {
      if (vitalsForm.controls["systolicBP_1stReading"].errors) {
        required.push(this.current_language_set.vitalsDetails.vitalsDataANC_OPD_NCD_PNC
          .systolicBP);
      }
      if (vitalsForm.controls["diastolicBP_1stReading"].errors) {
        required.push(this.current_language_set.vitalsDetails.vitalsDataANC_OPD_NCD_PNC
          .diastolicBP);
      }
      if (vitalsForm.controls["height_cm"].errors) {
        required.push(
          this.current_language_set.vitalsDetails
            .AnthropometryDataANC_OPD_NCD_PNC.height
        );
      }
      if (vitalsForm.controls["weight_Kg"].errors) {
        required.push(this.current_language_set.common.weight);
      }
      if (vitalsForm.controls["temperature"].errors) {
        required.push(
          this.current_language_set.vitalsDetails.vitalsDataANC_OPD_NCD_PNC
            .temperature
        );
      }
      if (vitalsForm.controls["pulseRate"].errors) {
        required.push(
          this.current_language_set.vitalsDetails.vitalsDataANC_OPD_NCD_PNC
            .pulseRate
        );
      }
    }

    console.log("referForm", referForm);
    if (this.attendant == "doctor" || this.designation == "TC Specialist") {
      if (referForm.controls["refrredToAdditionalServiceList"].value != null) {
        if (
          referForm.controls["refrredToAdditionalServiceList"].value.length > 0
        ) {
          if (referForm.controls["referralReason"].errors) {
            required.push(
              this.current_language_set.Referdetails.referralReason
            );
          }
        } else if (
          referForm.controls["referredToInstituteName"].value != null
        ) {
          if (referForm.controls["referralReason"].errors) {
            required.push(
              this.current_language_set.Referdetails.referralReason
            );
          }
        }
      } else if (referForm.controls["referredToInstituteName"].value != null) {
        if (referForm.controls["referralReason"].errors) {
          required.push(this.current_language_set.Referdetails.referralReason);
        }
      }
    }

    console.log(examinationForm, "examinationForm");
    if (examinationForm !== undefined && examinationForm !== null) {
      const generalExaminationForm = <FormGroup>(
        examinationForm.controls["generalExaminationForm"]
      );
      if (generalExaminationForm.controls["typeOfDangerSigns"].errors) {
        required.push(
          this.current_language_set.ExaminationData.ANC_OPD_PNCExamination
            .genExamination.dangersigns
        );
      }
      if (generalExaminationForm.controls["lymphnodesInvolved"].errors) {
        required.push(
          this.current_language_set.ExaminationData.ANC_OPD_PNCExamination
            .genExamination.lymph
        );
      }
      if (generalExaminationForm.controls["typeOfLymphadenopathy"].errors) {
        required.push(
          this.current_language_set.ExaminationData.ANC_OPD_PNCExamination
            .genExamination.typeofLymphadenopathy
        );
      }
      if (generalExaminationForm.controls["extentOfEdema"].errors) {
        required.push(
          this.current_language_set.ExaminationData.ANC_OPD_PNCExamination
            .genExamination.extentofEdema
        );
      }
      if (generalExaminationForm.controls["edemaType"].errors) {
        required.push(
          this.current_language_set.ExaminationData.ANC_OPD_PNCExamination
            .genExamination.typeofEdema
        );
      }
    }
    // if(this.visitCategory == "NCD screening"){

    // }
    this.mmuReferredSubscription = this.nurseService.ismmutc$.subscribe(
      (response) => (this.ismmutc = response)
    );

    if (
      this.attendant == "nurse" &&
      this.ismmutc == "yes" &&
      !this.schedulerData
    )
      required.push(this.current_language_set.nurseData.scheduleTM);
    if (this.visitCategory == "NCD care" && this.attendant == "doctor") {
      const diagnosisForm = <FormGroup>(
        this.patientMedicalForm.controls["patientCaseRecordForm"]
      );
      if (diagnosisForm != undefined) {
        const diagnosisForm1 = <FormGroup>(
          diagnosisForm.controls["generalDiagnosisForm"]
        );
        if (diagnosisForm1 != undefined) {
          const temp =
            diagnosisForm1.controls["ncdScreeningConditionArray"].value;
          if (diagnosisForm1.controls["ncdScreeningConditionArray"].errors) {
            required.push(
              this.current_language_set.casesheet.ncdCondition
            );
          }
          let flag = false;

          if (temp != undefined && temp != null && temp.length > 0) {
            temp.forEach((element) => {
              if (element == "Other") flag = true;
            });
          }
          if (
            flag &&
            diagnosisForm1.controls["ncdScreeningConditionOther"].value === null
          )
            required.push(this.current_language_set.nCDConditionOther);
        }
      }
    }
    if (required.length) {
      this.confirmationService.notify(
        this.current_language_set.alerts.info.belowFields,
        required
      );
      this.resetSpinnerandEnableTheSubmitButton();
      return 0;
    } else {
      return 1;
    }
  }

  checkCancerRequiredData(medicalForm) {
    const vitalsForm = <FormGroup>medicalForm.controls["patientVitalsForm"];
    const referForm = <FormGroup>medicalForm.controls["patientReferForm"];
    const required = [];

    console.log("medicalCancer", medicalForm);

    if (vitalsForm !== undefined && vitalsForm !== null) {
      if (vitalsForm.controls["systolicBP_1stReading"].errors) {
        required.push(this.current_language_set.vitalsDetails.vitalsDataANC_OPD_NCD_PNC
          .systolicBP);
      }
      if (vitalsForm.controls["diastolicBP_1stReading"].errors) {
        required.push(this.current_language_set.vitalsDetails.vitalsDataANC_OPD_NCD_PNC
          .diastolicBP);
      }
      if (vitalsForm.controls["height_cm"].errors) {
        required.push(
          this.current_language_set.vitalsDetails
            .AnthropometryDataANC_OPD_NCD_PNC.height
        );
      }
      if (vitalsForm.controls["weight_Kg"].errors) {
        required.push(
          this.current_language_set.vitalsDetails
            .AnthropometryDataANC_OPD_NCD_PNC.weight
        );
      }
    }

    if (
      this.visitCategory == "Cancer Screening" &&
      this.attendant == "doctor"
    ) {
      const diagForm = <FormGroup>(
        this.patientMedicalForm.controls["patientCaseRecordForm"]
      );
      // const diagForm1=<FormGroup>diagForm.controls["diagnosisForm"];
      //  const diagForm2=<FormArray>diagForm1.controls["provisionalDiagnosisList"];
      // // const historyForm4=<FormGroup>historyForm3.controls[0].["FormGroup"];
      // const diagForm3=<FormGroup>diagForm2.controls[0];
      if (diagForm.controls["provisionalDiagnosisPrimaryDoctor"].errors) {
        required.push(
          this.current_language_set.DiagnosisDetails.provisionaldiagnosis
        );
      }
    }

    if (
      this.visitCategory == "Cancer Screening" &&
      this.designation == "TC Specialist"
    ) {
      const diagForm = <FormGroup>(
        this.patientMedicalForm.controls["patientCaseRecordForm"]
      );

      if (diagForm.controls["provisionalDiagnosisPrimaryDoctor"].errors) {
        required.push(
          this.current_language_set.DiagnosisDetails.provisionaldiagnosis
        );
      }
    }

    if (this.attendant == "doctor" || this.designation == "TC Specialist") {
      if (referForm.controls["refrredToAdditionalServiceList"].value != null) {
        if (
          referForm.controls["refrredToAdditionalServiceList"].value.length > 0
        ) {
          if (referForm.controls["referralReason"].errors) {
            required.push(
              this.current_language_set.Referdetails.referralReason
            );
          }
        } else if (referForm.controls["referredToInstituteID"].value != null) {
          if (referForm.controls["referralReason"].errors) {
            required.push(
              this.current_language_set.Referdetails.referralReason
            );
          }
        }
      } else if (referForm.controls["referredToInstituteID"].value != null) {
        if (referForm.controls["referralReason"].errors) {
          required.push(this.current_language_set.Referdetails.referralReason);
        }
      }
    }
    this.mmuReferredSubscription = this.nurseService.ismmutc$.subscribe(
      (response) => (this.ismmutc = response)
    );

    if (
      this.attendant == "nurse" &&
      this.ismmutc == "yes" &&
      !this.schedulerData
    )
      required.push(this.current_language_set.nurseData.scheduleTM);

    if (required.length) {
      this.confirmationService.notify(
        this.current_language_set.alerts.info.belowFields,
        required
      );
      this.resetSpinnerandEnableTheSubmitButton();
      return false;
    } else {
      return true;
    }
  }

  checkNCDScreeningRequiredData(medicalForm) {
    //WDF requirement
    // let NCDScreeningForm = <FormGroup>medicalForm.controls['NCDScreeningForm'];
    let NCDScreeningForm = <FormGroup>medicalForm.controls["patientVitalsForm"];
    let ncdIDRSScreeningForm = <FormGroup>(
      medicalForm.controls["idrsScreeningForm"]
    );
    const required = [];
    let count = 0;
    let physicalActivityMandatory = <FormGroup>(
      medicalForm.controls["patientHistoryForm"].controls[
        "physicalActivityHistory"
      ]
    );
    if(environment.isTMOffline) {
    if(this.enableLungAssessment === true && this.beneficiaryAge >= 18 && this.nurseService.isAssessmentDone === false) {
      required.push("Please perform Lung Assessment");
    }
  }
    /* If diabetes suspected then rbs test has to perform under vitals */
    if (
      this.attendant == "nurse" &&
      this.diabetesSelected === 1 &&
      NCDScreeningForm.controls["rbsCheckBox"].value === true &&
      NCDScreeningForm.controls["rbsTestResult"].value === null
    ) {
      required.push("Please perform RBS Test under Vitals");
    }
    if (this.beneficiary.ageVal >= 30) {
      let familyDiseaseList =
        medicalForm.controls.patientHistoryForm.controls.familyHistory.controls
          .familyDiseaseList.value;
      familyDiseaseList.forEach((element) => {
        if (
          element.diseaseType != null &&
          element.deleted === false &&
          element.diseaseType.diseaseType === "Diabetes Mellitus"
        ) {
          count++;
        }
      });
      if (count == 0) {
        required.push(
          this.current_language_set.pleaseSelectDiabetesMellitusInFamilyHistory
        );
      }
      if (physicalActivityMandatory.controls["activityType"].errors) {
        required.push(this.current_language_set.physicalActivity);
      }
    }
    let familyMember = 0;
    let familyDiseasesList =
      medicalForm.controls.patientHistoryForm.controls.familyHistory.controls
        .familyDiseaseList.value;
    let familyDiseasesLength = familyDiseasesList.length;
    for (let element = 0; element < familyDiseasesList.length; element++) {
      //familyMember = 0;
      if (
        familyDiseasesList[element].diseaseType != null &&
        familyDiseasesList[element].deleted === false
      ) {
        if (
          familyDiseasesList[element].familyMembers != null &&
          familyDiseasesList[element].familyMembers.length > 0
        ) {
          familyMember++;
        }
      } else {
        familyDiseasesLength--;
      }
    }
    if (familyMember != familyDiseasesLength) {
      required.push(this.current_language_set.familyMemberInFamilyHistory);
    }
    console.log(
      "required",
      <FormGroup>medicalForm.controls["idrsScreeningForm"]
    );
    // console.log("required", ncdIDRSScreeningForm.controls['requiredList'].value);
    if (ncdIDRSScreeningForm.controls["requiredList"].value != null) {
      let ar = ncdIDRSScreeningForm.controls["requiredList"].value;
      for (var i = 0; i < ar.length; i++) {
        if (ar[i] != "Hypertension") {
          required.push(ar[i]);
        }
      }
    }

    //WDF requirement -> to check whether RBS test is prescribed or not
    if (this.attendant == "doctor" || this.designation == "TC Specialist") {
      let NCDScreeningCaseRecordForm = <FormGroup>(
        medicalForm.controls["patientCaseRecordForm"]
      );
      if (
        this.rbsPresent > 0 &&
        this.idrsScoreService.diabetesNotPresentInMMU != 0
      ) {
        let investigationCount = 0;
        let labTestArray =
          NCDScreeningCaseRecordForm.controls["generalDoctorInvestigationForm"]
            .value.labTest;
        if (labTestArray != undefined && labTestArray.length > 0) {
          labTestArray.forEach((element) => {
            if (
              element.procedureName != null &&
              element.procedureName.toLowerCase() ==
                environment.RBSTest.toLowerCase()
            ) {
              investigationCount++;
            }
          });
        }

        // if ( && this.diabetesSelected != 1) {
        //   required.push(this.current_language_set.pleaseSelectRBSTestInInvestigation);
        // }

        if (
          investigationCount == 0 &&
          this.diabetesSelected === 1 &&
          NCDScreeningForm.controls["rbsCheckBox"].value === true &&
          NCDScreeningForm.controls["rbsTestResult"].value === null
        ) {
          required.push("Please select RBS Test under Vitals or Investigation");
        }

        if (
          investigationCount == 0 &&
          this.diabetesSelected === 1 &&
          NCDScreeningForm.controls["rbsCheckBox"].value === false &&
          NCDScreeningForm.controls["rbsTestResult"].value === null
        ) {
          required.push("Please select RBS Test under Investigation");
        }
      }
      if (this.designation === "TC Specialist") {
        let finalDiagnosis = <FormGroup>(
          medicalForm.controls["patientCaseRecordForm"].controls[
            "generalDiagnosisForm"
          ]
        );
        const diabetesConfirm =
          finalDiagnosis.controls["diabetesConfirmed"].value;
        const hyperTensionConfirm =
          finalDiagnosis.controls["hypertensionConfirmed"].value;
        if (diabetesConfirm === null || hyperTensionConfirm === null) {
          required.push(this.current_language_set.pleaseSelectFinalDiagnosis);
        }
      }

      this.visualAcuityTestValidation(NCDScreeningCaseRecordForm, required);
    }
    //WDF requirement
    if (NCDScreeningForm.controls["height_cm"].errors) {
      required.push(
        this.current_language_set.vitalsDetails.AnthropometryDataANC_OPD_NCD_PNC
          .height
      );
    }
    if (NCDScreeningForm.controls["weight_Kg"].errors) {
      required.push(
        this.current_language_set.vitalsDetails.AnthropometryDataANC_OPD_NCD_PNC
          .weight
      );
    }
    if (NCDScreeningForm.controls["waistCircumference_cm"].errors) {
      required.push(
        this.current_language_set.vitalsDetails.vitalsCancerscreening_QC
          .waistCircumference
      );
    }
    if (
      NCDScreeningForm.controls["temperature"].errors &&
      this.ncdTemperature === true
    ) {
      required.push(
        this.current_language_set.vitalsDetails.vitalsDataANC_OPD_NCD_PNC
          .temperature
      );
    }
    if (NCDScreeningForm.controls["pulseRate"].errors) {
      required.push(
        this.current_language_set.vitalsDetails.vitalsDataANC_OPD_NCD_PNC
          .pulseRate
      );
    }
    if (NCDScreeningForm.controls["systolicBP_1stReading"].errors) {
      required.push(this.current_language_set.vitalsDetails.vitalsDataANC_OPD_NCD_PNC
        .systolicBP);
    }
    if (NCDScreeningForm.controls["diastolicBP_1stReading"].errors) {
      required.push(this.current_language_set.vitalsDetails.vitalsDataANC_OPD_NCD_PNC
        .diastolicBP);
    }

    if (this.attendant == "doctor" || this.attendant === "TC Specialist") {
      const diagForm = <FormGroup>(
        this.patientMedicalForm.controls["patientCaseRecordForm"]
      );
      const diagForm1 = <FormGroup>diagForm.controls["generalDiagnosisForm"];
      const diagForm2 = <FormArray>(
        diagForm1.controls["provisionalDiagnosisList"]
      );
      // const historyForm4=<FormGroup>historyForm3.controls[0].["FormGroup"];
      const diagForm3 = <FormGroup>diagForm2.controls[0];
      if (diagForm3.controls["viewProvisionalDiagnosisProvided"].errors && this.enableProvisionalDiag === true) {
        required.push(
          this.current_language_set.DiagnosisDetails.provisionaldiagnosis
        );
      }

      if (!diagForm3.controls["viewProvisionalDiagnosisProvided"].errors) {
        diagForm2.value.filter((item) => {
          if (
            item.viewProvisionalDiagnosisProvided &&
            (item.conceptID === null ||
              item.conceptID === undefined ||
              item.conceptID === "")
          )
            required.push(
              this.current_language_set
                .pleaseSelectprovisionalDiagnosisWithSnomedCode
            );
        });
      }
      const referForm = <FormGroup>medicalForm.controls["patientReferForm"];
      if (
        referForm.controls["referredToInstituteName"].value == null &&
        sessionStorage.getItem("instFlag") == "true" &&
        sessionStorage.getItem("suspectFlag") == "true"
      ) {
        required.push(
          this.current_language_set.Referdetails.higherhealthcarecenter
        );
      }
      if (referForm.controls["refrredToAdditionalServiceList"].value != null) {
        if (
          referForm.controls["refrredToAdditionalServiceList"].value.length > 0
        ) {
          if (referForm.controls["referralReason"].errors) {
            required.push(
              this.current_language_set.Referdetails.referralReason
            );
          }
        } else if (
          referForm.controls["referredToInstituteName"].value != null
        ) {
          if (referForm.controls["referralReason"].errors) {
            required.push(
              this.current_language_set.Referdetails.referralReason
            );
          }
        }
      } else if (referForm.controls["referredToInstituteName"].value != null) {
        if (referForm.controls["referralReason"].errors) {
          required.push(this.current_language_set.Referdetails.referralReason);
        }
      }
    }
    this.mmuReferredSubscription = this.nurseService.ismmutc$.subscribe(
      (response) => (this.ismmutc = response)
    );
    if (
      this.attendant == "nurse" &&
      this.ismmutc == "yes" &&
      !this.schedulerData
    )
      required.push(this.current_language_set.nurseData.scheduleTM);

    if (required.length) {
      this.confirmationService.notify(
        this.current_language_set.alerts.info.belowFields,
        required
      );
      this.resetSpinnerandEnableTheSubmitButton();
      return false;
    } else {
      return true;
    }
  }

  /**
   * Submit NURSE GENERAL QUICK CONSULT
   */
  submitNurseQuickConsultVisitDetails(medicalForm) {
    if (this.checkNurseRequirements(medicalForm)) {
      this.nurseService
        .postNurseGeneralQCVisitForm(medicalForm, this.schedulerData)
        .subscribe(
          (res) => {
            if (res.statusCode == 200 && res.data != null) {
              this.confirmationService.alert(res.data.response, 'success');
              // this.confirmationService.alert(
              //   this.current_language_set.alerts.info.datafillSuccessfully,
              //   "success"
              // );
              this.navigateToNurseWorklist();
            } else {
              this.resetSpinnerandEnableTheSubmitButton();
              this.confirmationService.alert(res.errorMessage, "error");
            }
          },
          (err) => {
            this.resetSpinnerandEnableTheSubmitButton();
            this.confirmationService.alert(err, "error");
          }
        );
    }
  }

  checkQuickConsultDoctorData(patientMedicalForm) {
    const form = <FormGroup>(
      this.patientMedicalForm.controls["patientQuickConsultForm"]
    );
    const caseRecordForm = <FormGroup>(
      patientMedicalForm.controls["patientCaseRecordForm"]
    );
    const required = [];

    if (form.controls["chiefComplaintList"].errors) {
      required.push(
        this.current_language_set.nurseData.chiefComplaintsDetails
          .chiefComplaints
      );
    }
    if (form.controls["clinicalObservation"].errors) {
      required.push(this.current_language_set.casesheet.clinicalObs);
    }
    if (
      this.visitCategory == "General OPD (QC)" &&
      this.attendant == "doctor"
    ) {
      const diagForm = <FormGroup>(
        this.patientMedicalForm.controls["patientQuickConsultForm"]
      );
      // const diagForm1=<FormGroup>diagForm.controls["generalDiagnosisForm"];
      const diagForm2 = <FormArray>(
        diagForm.controls["provisionalDiagnosisList"]
      );
      console.log("diagForm2", diagForm2);
      // const historyForm4=<FormGroup>historyForm3.controls[0].["FormGroup"];

      const diagForm3 = <FormGroup>diagForm2.controls[0];
      if (diagForm3.controls["viewProvisionalDiagnosisProvided"].errors) {
        required.push(
          this.current_language_set.DiagnosisDetails.provisionaldiagnosis
        );
      }

      if (!diagForm3.controls["viewProvisionalDiagnosisProvided"].errors) {
        diagForm2.value.filter((item) => {
          if (
            item.viewProvisionalDiagnosisProvided &&
            (item.conceptID === null ||
              item.conceptID === undefined ||
              item.conceptID === "")
          )
            required.push(
              this.current_language_set
                .pleaseSelectprovisionalDiagnosisWithSnomedCode
            );
        });
      }
    }
    if (
      this.visitCategory == "General OPD (QC)" &&
      this.designation == "TC Specialist"
    ) {
      const diagForm = <FormGroup>(
        this.patientMedicalForm.controls["patientQuickConsultForm"]
      );
      //  const diagForm1=<FormGroup>diagForm.controls["generalDiagnosisForm"];
      const diagForm2 = <FormArray>(
        diagForm.controls["provisionalDiagnosisList"]
      );
      const diagForm3 = <FormGroup>diagForm2.controls[0];
      if (diagForm3.controls["viewProvisionalDiagnosisProvided"].errors) {
        required.push(
          this.current_language_set.DiagnosisDetails.provisionaldiagnosis
        );
      }

      if (!diagForm3.controls["viewProvisionalDiagnosisProvided"].errors) {
        diagForm2.value.filter((item) => {
          if (
            item.viewProvisionalDiagnosisProvided &&
            (item.conceptID === null ||
              item.conceptID === undefined ||
              item.conceptID === "")
          )
            required.push(
              this.current_language_set
                .pleaseSelectprovisionalDiagnosisWithSnomedCode
            );
        });
      }
      if (diagForm.controls["instruction"].errors) {
        required.push(this.current_language_set.casesheet.sprcAdvice);
      }
    }

    if (form.controls["provisionalDiagnosisList"].errors) {
      required.push(
        this.current_language_set.DiagnosisDetails.provisionaldiagnosis
      );
    }

    if (required.length) {
      this.confirmationService.notify(
        this.current_language_set.alerts.info.belowFields,
        required
      );
      this.resetSpinnerandEnableTheSubmitButton();
      return 0;
    } else {
      return 1;
    }
  }

  /**
   * Submit DOCTOR GENERAL QUICK CONSULT
   */
  submitQuickConsultDiagnosisForm() {
    const valid = this.checkQuickConsultDoctorData(this.patientMedicalForm);
    if (valid) {
      let patientQuickConsultForm = <FormGroup>(
        this.patientMedicalForm.controls["patientQuickConsultForm"]
      );
      let patientQuickConsultFormValue = JSON.parse(
        JSON.stringify(patientQuickConsultForm.value)
      );
      console.log(patientQuickConsultFormValue, "formValue");
      let chiefComplaintList = patientQuickConsultFormValue.chiefComplaintList;
      chiefComplaintList.forEach((element) => {
        if (element.chiefComplaint) {
          element.chiefComplaintID = element.chiefComplaint.chiefComplaintID;
          element.chiefComplaint = element.chiefComplaint.chiefComplaint;
        }
      });

      let prescribedDrugs =
        patientQuickConsultFormValue.prescription.prescribedDrugs;
      prescribedDrugs = prescribedDrugs.filter((item) => !!item.createdBy);
      patientQuickConsultFormValue.prescription = prescribedDrugs;

      let labTestOrders = [];
      if (
        patientQuickConsultFormValue.test != null &&
        patientQuickConsultFormValue.radiology != null
      ) {
        labTestOrders = patientQuickConsultFormValue.test.concat(
          patientQuickConsultFormValue.radiology
        );
      } else if (patientQuickConsultFormValue.test != null) {
        labTestOrders = Object.assign([], patientQuickConsultFormValue.test);
      } else {
        labTestOrders = Object.assign(
          [],
          patientQuickConsultFormValue.radiology
        );
      }
      patientQuickConsultFormValue.labTestOrders = labTestOrders;
      patientQuickConsultFormValue.test = undefined;
      patientQuickConsultFormValue.radiology = undefined;
      patientQuickConsultFormValue = Object.assign(
        {},
        patientQuickConsultFormValue,
        this.patientMedicalForm.controls["patientFileUploadDetailsForm"]
      );

      this.doctorService
        .postQuickConsultDetails(
          { quickConsultation: patientQuickConsultFormValue },
          this.schedulerData,
          this.isSpecialist
        )
        .subscribe(
          (res) => {
            if (res.statusCode == 200 && res.data != null) {
              this.patientMedicalForm.reset();
              // this.removeBeneficiaryDataForDoctorVisit();
              if (this.isSpecialist) {
                if (
                  labTestOrders !== undefined &&
                  labTestOrders !== null &&
                  labTestOrders.length > 0
                ) {
                  this.confirmationService.alert(
                    this.current_language_set.alerts.info.datafillSuccessfully,
                    "success"
                  );
                  this.navigateToSpecialistWorklist();
                } else {
                  this.getHealthIDDetails(
                    this.current_language_set.alerts.info.datafillSuccessfully
                  );
                }
              } else {
                if (
                  (labTestOrders !== undefined &&
                    labTestOrders !== null &&
                    labTestOrders.length > 0) ||
                  (this.schedulerData !== undefined &&
                    this.schedulerData !== null)
                ) {
                  this.confirmationService.alert(
                    this.current_language_set.alerts.info.datafillSuccessfully,
                    "success"
                  );
                  this.navigateToDoctorWorklist();
                } else {
                  this.getHealthIDDetails(
                    this.current_language_set.alerts.info.datafillSuccessfully
                  );
                }
              }
            } else {
              this.resetSpinnerandEnableTheSubmitButton();
              this.confirmationService.alert(res.errorMessage, "error");
            }
          },
          (err) => {
            this.resetSpinnerandEnableTheSubmitButton();
            this.confirmationService.alert(err, "error");
          }
        );
    }
  }

  updateQuickConsultDiagnosisForm() {
    let patientQuickConsultDetails = this.mapDoctorQuickConsultDetails();
    if (this.checkQuickConsultDoctorData(this.patientMedicalForm)) {
      this.doctorService
        .updateQuickConsultDetails(
          { quickConsultation: patientQuickConsultDetails },
          this.schedulerData,
          this.isSpecialist
        )
        .subscribe(
          (res) => {
            if (res.statusCode == 200 && res.data != null) {
              // this.patientMedicalForm.reset();
              // this.confirmationService.alert(res.data.response, "success");
              if (this.isSpecialist) {
                if (patientQuickConsultDetails && (
                  patientQuickConsultDetails.labTestOrders !== undefined &&
                  patientQuickConsultDetails.labTestOrders !== null &&
                  patientQuickConsultDetails.labTestOrders.length > 0)
                ) {
                  this.confirmationService.alert(
                    res.data.response,
                    "success"
                  );
                  this.navigateToSpecialistWorklist();
                } else {
                  this.getHealthIDDetails(res.data.response);
                }
              } else {
                if ((
                  this.testsPrescribed !== undefined &&
                  this.testsPrescribed !== null &&
                  this.testsPrescribed.laboratoryList.length > 0
                ) || (this.schedulerData !== undefined &&
                  this.schedulerData !== null)) {
                  this.confirmationService.alert(
                    res.data.response,
                    "success"
                  );
                  this.navigateToDoctorWorklist();
                } else {
                  this.getHealthIDDetails(res.data.response);
                }
              }
            } else {
              this.resetSpinnerandEnableTheSubmitButton();
              this.confirmationService.alert(res.errorMessage, "error");
            }
          },
          (err) => {
            this.resetSpinnerandEnableTheSubmitButton();
            this.confirmationService.alert(err, "error");
          }
        );
    }
  }

  mapDoctorQuickConsultDetails() {
    let patientQuickConsultForm = <FormGroup>(
      this.patientMedicalForm.controls["patientQuickConsultForm"]
    );
    let patientQuickConsultDetails = JSON.parse(
      JSON.stringify(patientQuickConsultForm.value)
    );

    // let prescribedDrugs = patientQuickConsultDetails.prescribedDrugs;
    // if (prescribedDrugs) {
    //   prescribedDrugs = prescribedDrugs.filter((value, i) => {
    //     if (value.drug == null && value.specialInstruction == null && value.dose == null && value.frequency == null &&
    //       value.drugForm == null && value.drugDuration == null) {
    //       return false;
    //     }
    //     return true;
    //   })
    // }
    let prescribedDrugs =
      patientQuickConsultDetails.prescription.prescribedDrugs;
    prescribedDrugs = prescribedDrugs.filter((item) => !!item.createdBy);
    patientQuickConsultDetails.prescription = prescribedDrugs;

    const chiefComplaintList = patientQuickConsultDetails.chiefComplaintList;
    chiefComplaintList.forEach((element) => {
      if (element.chiefComplaint) {
        element.chiefComplaintID = element.chiefComplaint.chiefComplaintID;
        element.chiefComplaint = element.chiefComplaint.chiefComplaint;
      }
    });
    let labTestOrders = [];
    if (
      patientQuickConsultDetails.test != null &&
      patientQuickConsultDetails.radiology != null
    ) {
      labTestOrders = patientQuickConsultDetails.test.concat(
        patientQuickConsultDetails.radiology
      );
    } else if (patientQuickConsultDetails.test != null) {
      labTestOrders = Object.assign([], patientQuickConsultDetails.test);
    } else {
      labTestOrders = Object.assign([], patientQuickConsultDetails.radiology);
    }
    labTestOrders = labTestOrders.filter((test) => !test.disabled);

    patientQuickConsultDetails.labTestOrders = labTestOrders;
    patientQuickConsultDetails.chiefComplaintList = chiefComplaintList;
    patientQuickConsultDetails.prescribedDrugs = prescribedDrugs;
    patientQuickConsultDetails.test = undefined;
    patientQuickConsultDetails.radiology = undefined;

    return patientQuickConsultDetails;
  }
  /**
   * Submit NURSE ANC Details
   */
  submitNurseANCVisitDetails(medicalForm) {
    if (this.checkNurseRequirements(medicalForm)) {
      this.nurseService
        .postNurseANCVisitForm(
          medicalForm,
          null,
          this.visitCategory,
          this.beneficiary.ageVal,
          this.schedulerData
        )
        .subscribe(
          (res: any) => {
            if (res.statusCode == 200 && res.data != null) {
              this.confirmationService.alert(res.data.response, 'success');
              // this.confirmationService.alert(
              //   this.current_language_set.alerts.info.datafillSuccessfully,
              //   "success"
              // );
              this.navigateToNurseWorklist();
            } else {
              this.resetSpinnerandEnableTheSubmitButton();
              this.confirmationService.alert(res.errorMessage, "error");
            }
          },
          (err) => {
            this.resetSpinnerandEnableTheSubmitButton();
            this.confirmationService.alert(err, "error");
          }
        );
    }
  }

  /**
   * Submit DOCTOR ANC Details
   */
  submitANCDiagnosisForm() {
    if (this.checkNurseRequirements(this.patientMedicalForm)) {
      let temp = {
        beneficiaryRegID: this.beneficiaryRegID,
        benVisitID: this.visitID,
        visitCode: localStorage.getItem("visitCode"),
        providerServiceMapID: localStorage.getItem("providerServiceID"),
        createdBy: localStorage.getItem("userName"),
        isSpecialist: this.isSpecialist,
      };
      this.checkForPrescribedTests(temp);
      this.doctorService
        .postDoctorANCDetails(
          this.patientMedicalForm,
          temp,
          this.schedulerData,
          this.isSpecialist
        )
        .subscribe(
          (res: any) => {
            if (res.statusCode == 200 && res.data != null) {
              if (this.isSpecialist) {
                this.linkCareContextBasedOnSpecialistScheduled();
              } else {
                this.linkCareContextBasedOnTestsPrescribed();
              }
            } else {
              this.resetSpinnerandEnableTheSubmitButton();
              this.confirmationService.alert(res.errorMessage, "error");
            }
          },
          (err) => {
            this.resetSpinnerandEnableTheSubmitButton();
            this.confirmationService.alert(err, "error");
          }
        );
    }
  }

  /**
   * Submit Function for NCD Care
   */
  submitNurseNCDcareVisitDetails(medicalForm) {
    if (this.checkNurseRequirements(medicalForm)) {
      this.nurseService
        .postNurseNCDCareVisitForm(
          medicalForm,
          this.visitCategory,
          this.beneficiary,
          this.schedulerData
        )
        .subscribe(
          (res: any) => {
            if (res.statusCode == 200 && res.data != null) {
              this.confirmationService.alert(res.data.response, 'success');
              // this.confirmationService.alert(
              //   this.current_language_set.alerts.info.datafillSuccessfully,
              //   "success"
              // );
              this.navigateToNurseWorklist();
            } else {
              this.resetSpinnerandEnableTheSubmitButton();
              this.confirmationService.alert(res.errorMessage, "error");
            }
          },
          (err) => {
            this.resetSpinnerandEnableTheSubmitButton();
            this.confirmationService.alert(err, "error");
          }
        );
    }
  }

  /**
   * Submit Function for Covid-19
   */
  submitNurseCovidVisitDetails(medicalForm) {
    if (this.checkNurseRequirements(medicalForm)) {
      this.nurseService
        .postNurseCovidVisitForm(
          medicalForm,
          this.visitCategory,
          this.beneficiary,
          this.schedulerData
        )
        .subscribe(
          (res: any) => {
            if (res.statusCode == 200 && res.data != null) {
              this.confirmationService.alert(res.data.response, 'success');
              // this.confirmationService.alert(
              //   this.current_language_set.alerts.info.datafillSuccessfully,
              //   "success"
              // );
              this.navigateToNurseWorklist();
            } else {
              this.resetSpinnerandEnableTheSubmitButton();
              this.confirmationService.alert(res.errorMessage, "error");
            }
          },
          (err) => {
            this.resetSpinnerandEnableTheSubmitButton();
            this.confirmationService.alert(err, "error");
          }
        );
    }
  }

  /**
   * Submit Nurse NCD Screening
   */
  submitNurseNCDScreeningVisitDetails(medicalForm) {
    if (this.checkNCDScreeningRequiredData(medicalForm)) {
      this.nurseService
        .postNCDScreeningForm(
          medicalForm,
          this.visitCategory,
          this.beneficiary,
          this.schedulerData
        )
        .subscribe(
          (res) => {
            if (res.statusCode == 200 && res.data != null) {
              this.confirmationService.alert(res.data.response, 'success');
              // this.confirmationService.alert(
              //   this.current_language_set.alerts.info.datafillSuccessfully,
              //   "success"
              // );
              this.navigateToNurseWorklist();
            } else {
              this.resetSpinnerandEnableTheSubmitButton();
              this.confirmationService.alert(res.errorMessage, "error");
            }
          },
          (err) => {
            this.resetSpinnerandEnableTheSubmitButton();
            this.confirmationService.alert(err, "error");
          }
        );
    }
  }

  submitCovidDiagnosisForm() {
    if (this.checkNurseRequirements(this.patientMedicalForm)) {
      let temp = {
        beneficiaryRegID: this.beneficiaryRegID,
        benVisitID: this.visitID,
        visitCode: localStorage.getItem("visitCode"),
        providerServiceMapID: localStorage.getItem("providerServiceID"),
        createdBy: localStorage.getItem("userName"),
        isSpecialist: this.isSpecialist,
      };
      let investigationForm = (<FormGroup>(
        this.patientMedicalForm.controls["patientCaseRecordForm"]
      )).controls["generalDoctorInvestigationForm"];
      let testsPrescribed =
        this.doctorService.postGeneralCaseRecordInvestigation(
          investigationForm,
          temp
        );
      console.log("testsPrescribed", testsPrescribed, this.testsPrescribed);
      this.doctorService
        .postDoctorCovidDetails(
          this.patientMedicalForm,
          temp,
          this.schedulerData,
          this.isSpecialist
        )
        .subscribe(
          (res: any) => {
            if (res.statusCode == 200 && res.data != null) {
              if (this.isSpecialist) {
                if (this.isSpecialist) {
                  this.linkCareContextBasedOnSpecialistScheduled();
                } else {
                  this.linkCareContextBasedOnTestsPrescribed();
                }
              } else {
                if (
                  (testsPrescribed !== undefined &&
                  testsPrescribed !== null &&
                  testsPrescribed.laboratoryList.length > 0) ||
                  (this.schedulerData !== undefined &&
                  this.schedulerData !== null)
                ) {
                  this.confirmationService.alert(
                    this.current_language_set.alerts.info.datafillSuccessfully,
                    "success"
                  );
                  this.navigateToDoctorWorklist();
                } else {
                  this.getHealthIDDetails(
                    this.current_language_set.alerts.info.datafillSuccessfully
                  );
                }
              }
            } else {
              this.resetSpinnerandEnableTheSubmitButton();
              this.confirmationService.alert(res.errorMessage, "error");
            }
          },
          (err) => {
            this.resetSpinnerandEnableTheSubmitButton();
            this.confirmationService.alert(err, "error");
          }
        );
    }
  }

  submitNCDCareDiagnosisForm() {
    if (this.checkNurseRequirements(this.patientMedicalForm)) {
      let temp = {
        beneficiaryRegID: this.beneficiaryRegID,
        benVisitID: this.visitID,
        visitCode: localStorage.getItem("visitCode"),
        providerServiceMapID: localStorage.getItem("providerServiceID"),
        createdBy: localStorage.getItem("userName"),
        isSpecialist: this.isSpecialist,
      };
      this.checkForPrescribedTests(temp);
      this.doctorService
        .postDoctorNCDCareDetails(
          this.patientMedicalForm,
          temp,
          this.schedulerData,
          this.isSpecialist
        )
        .subscribe(
          (res: any) => {
            if (res.statusCode == 200 && res.data != null) {
              if (this.isSpecialist) {
                this.linkCareContextBasedOnSpecialistScheduled();
              } else {
                this.linkCareContextBasedOnTestsPrescribed();
              }
            } else {
              this.resetSpinnerandEnableTheSubmitButton();
              this.confirmationService.alert(res.errorMessage, "error");
            }
          },
          (err) => {
            this.resetSpinnerandEnableTheSubmitButton();
            this.confirmationService.alert(err, "error");
          }
        );
    }
  }

  /**
   * Submit Function for PNC
   *
   */
  submitPatientMedicalDetailsPNC(medicalForm) {
    if (this.checkNurseRequirements(medicalForm)) {
      this.nurseService
        .postNursePNCVisitForm(
          medicalForm,
          this.visitCategory,
          this.beneficiary,
          this.schedulerData
        )
        .subscribe(
          (res: any) => {
            if (res.statusCode == 200 && res.data != null) {
              this.confirmationService.alert(
                this.current_language_set.alerts.info.datafillSuccessfully,
                "success"
              );
              this.navigateToNurseWorklist();
            } else {
              this.resetSpinnerandEnableTheSubmitButton();
              this.confirmationService.alert(res.errorMessage, "error");
            }
          },
          (err) => {
            this.resetSpinnerandEnableTheSubmitButton();
            this.confirmationService.alert(err, "error");
          }
        );
    }
  }

  /**
   * Submit Function for General OPD
   *
   */
  submitNurseGeneralOPDVisitDetails(medicalForm) {
    if (this.checkNurseRequirements(medicalForm)) {
      this.nurseService
        .postNurseGeneralOPDVisitForm(
          medicalForm,
          this.visitCategory,
          this.beneficiary,
          this.schedulerData
        )
        .subscribe(
          (res: any) => {
            if (res.statusCode == 200 && res.data != null) {
              // this.confirmationService.alert(
              //   this.current_language_set.alerts.info.datafillSuccessfully,
               
              //   "success"
              // );
              this.confirmationService.alert(res.data.response, 'success');
              this.navigateToNurseWorklist();
            } else {
              this.resetSpinnerandEnableTheSubmitButton();
              this.confirmationService.alert(res.errorMessage, "error");
            }
          },
          (err) => {
            this.resetSpinnerandEnableTheSubmitButton();
            this.confirmationService.alert(err, "error");
          }
        );
    }
  }
  navigateToDoctorWorklist() {
    this.patientMedicalForm.reset();
    this.testsPrescribed = null;
    this.removeBeneficiaryDataForDoctorVisit();
    this.router.navigate(["/common/doctor-worklist"]);
  }
  navigateToSpecialistWorklist() {
    this.patientMedicalForm.reset();
    this.testsPrescribed = null;
    this.removeBeneficiaryDataForDoctorVisit();
    this.router.navigate(["/common/tcspecialist-worklist"]);
  }
  basedOnRoleNavigateToWorklist() {
    if (this.isSpecialist) {
      this.navigateToSpecialistWorklist();
    } else {
      this.navigateToDoctorWorklist();
    }
  }
  /* JA354063 - Link care context if tests are not prescribed by the specialist*/
  linkCareContextBasedOnSpecialistScheduled() {
    if (
      this.testsPrescribed !== undefined &&
      this.testsPrescribed !== null &&
      this.testsPrescribed.laboratoryList.length > 0
    ) {
      this.confirmationService.alert(
        this.current_language_set.alerts.info.datafillSuccessfully,
        "success"
      );
      this.navigateToSpecialistWorklist();
    } else {
      this.getHealthIDDetails(
        this.current_language_set.alerts.info.datafillSuccessfully
      );
    }
  }
  /* JA354063 - Link care context if tests are not prescribed by the doctor or if the tm is not scheduled from doctor*/
  linkCareContextBasedOnTestsPrescribed() {
    console.log(
      "tests prescribed",
      this.testsPrescribed.laboratoryList.length,
      this.schedulerData
    );
    if (
      (this.testsPrescribed !== undefined &&
        this.testsPrescribed !== null &&
        this.testsPrescribed.laboratoryList.length > 0) ||
      (this.schedulerData !== undefined && this.schedulerData !== null)
    ) {
      this.confirmationService.alert(
        this.current_language_set.alerts.info.datafillSuccessfully,
        "success"
      );
      this.navigateToDoctorWorklist();
    } else {
      this.getHealthIDDetails(
        this.current_language_set.alerts.info.datafillSuccessfully
      );
    }
  }
  /* Fetch health ID detaiuls to link the visit */
  getHealthIDDetails(successResponseFromAPI) {
    this.confirmationService
      .confirm(
        "info",
        successResponseFromAPI +
          ". " +
          this.current_language_set.common.doYouWantToLinkCareContext
      )
      .subscribe((res) => {
        if (res) {
          this.fetchHealthIDDetailsOnConfirmation();
        } else if (!res) {
          this.basedOnRoleNavigateToWorklist();
          console.log();
        }
      });
  }
  fetchHealthIDDetailsOnConfirmation() {
    let data = {
      beneficiaryID: this.beneficiary.beneficiaryID,
      beneficiaryRegID: this.beneficiaryRegID,
    };
    this.registrarService.getHealthIdDetails(data).subscribe(
      (healthIDDetails) => {
        if (healthIDDetails.statusCode == 200) {
          let dialog = this.mdDialog.open(HealthIdDisplayModalComponent, {
            data: {
              dataList: healthIDDetails,
              healthIDMapping: true,
              visitCode: localStorage.getItem("visitCode"),
            },
          });
          dialog.afterClosed().subscribe((result) => {
            console.log(result);
            this.basedOnRoleNavigateToWorklist();
          });
        } else {
          this.confirmationService.alert(this.current_language_set.issueInGettingBeneficiaryABHADetails, 'error');
          this.patientMedicalForm.reset();
          this.removeBeneficiaryDataForNurseVisit();
          this.router.navigate(["/common/nurse-worklist"]);
        }
      }, (err) => {
        this.confirmationService.alert(this.current_language_set.issueInGettingBeneficiaryABHADetails, 'error');
        this.patientMedicalForm.reset();
        this.removeBeneficiaryDataForNurseVisit();
        this.router.navigate(["/common/nurse-worklist"]);
      }
    );
  }

  submitGeneralOPDDiagnosisForm() {
    if (this.checkNurseRequirements(this.patientMedicalForm)) {
      let temp = {
        beneficiaryRegID: this.beneficiaryRegID,
        benVisitID: this.visitID,
        visitCode: localStorage.getItem("visitCode"),
        providerServiceMapID: localStorage.getItem("providerServiceID"),
        createdBy: localStorage.getItem("userName"),
        isSpecialist: this.isSpecialist,
      };
      /* Method to check whether tests has been prescribed, if not link the care context*/
      this.checkForPrescribedTests(temp);
      this.doctorService
        .postDoctorGeneralOPDDetails(
          this.patientMedicalForm,
          temp,
          this.schedulerData,
          this.isSpecialist
        )
        .subscribe(
          (res: any) => {
            if (res.statusCode == 200 && res.data != null) {
              if (this.isSpecialist) {
                this.linkCareContextBasedOnSpecialistScheduled();
              } else {
                this.linkCareContextBasedOnTestsPrescribed();
              }
            } else {
              this.resetSpinnerandEnableTheSubmitButton();
              this.confirmationService.alert(res.errorMessage, "error");
            }
          },
          (err) => {
            this.resetSpinnerandEnableTheSubmitButton();
            this.confirmationService.alert(err, "error");
          }
        );
    }
  }

  idrsChange(value) {
    this.enableIDRSUpdate = value;
  }
  submitPNCDiagnosisForm() {
    if (this.checkNurseRequirements(this.patientMedicalForm)) {
      let temp = {
        beneficiaryRegID: this.beneficiaryRegID,
        benVisitID: this.visitID,
        visitCode: localStorage.getItem("visitCode"),
        providerServiceMapID: localStorage.getItem("providerServiceID"),
        createdBy: localStorage.getItem("userName"),
        isSpecialist: this.isSpecialist,
      };
      this.checkForPrescribedTests(temp);
      this.doctorService
        .postDoctorPNCDetails(
          this.patientMedicalForm,
          temp,
          this.schedulerData,
          this.isSpecialist
        )
        .subscribe(
          (res: any) => {
            if (res.statusCode == 200 && res.data != null) {
              if (this.isSpecialist) {
                this.linkCareContextBasedOnSpecialistScheduled();
              } else {
                this.linkCareContextBasedOnTestsPrescribed();
              }
            } else {
              this.resetSpinnerandEnableTheSubmitButton();
              this.confirmationService.alert(res.errorMessage, "error");
            }
          },
          (err) => {
            this.resetSpinnerandEnableTheSubmitButton();
            this.confirmationService.alert(err, "error");
          }
        );
    }
  }

  /**
   * update patient data
   */
  updatePatientVitals() {
    this.vitalsMode = new String("update");
  }

  updatePatientHistory() {
    if (this.visitCategory != "Cancer Screening") {
      if (this.visitCategory == "NCD screening") {
        if (this.checkNCDScreeningHistory(this.patientMedicalForm))
          this.historyMode = new String("update");
      } else {
        if (this.checkPastObstericHistory(this.patientMedicalForm))
          this.historyMode = new String("update");
      }
    } else {
      this.historyMode = new String("update");
    }
  }

  updatePatientExamination() {
    this.examinationMode = new String("update");
  }

  updatePatientANC() {
    this.ancMode = new String("update");
  }

  updatePatientPNC() {
    this.pncMode = new String("update");
  }

  updatePatientNcdScreening() {
    const required = [];
    let ncdIDRSScreeningForm = <FormGroup>(
      this.patientMedicalForm.controls["idrsScreeningForm"]
    );
    if (ncdIDRSScreeningForm.controls["requiredList"].value != null) {
      let ar = ncdIDRSScreeningForm.controls["requiredList"].value;
      for (var i = 0; i < ar.length; i++) {
        if (ar[i] != "Hypertension") {
          required.push(ar[i]);
        }
      }
    }
    console.log("req", required);
    if (required.length) {
      this.confirmationService.notify(
        this.current_language_set.alerts.info.mandatoryFields,
        required
      );      
    } else this.ncdScreeningMode = new String("update");
  }

  ngAfterViewInit() {
    //setTimeout(() => { this.sidenav.toggle(); }, 600);
  }

  ngOnDestroy() {
    if (this.visitDetailMasterDataSubscription)
      this.visitDetailMasterDataSubscription.unsubscribe();
    if (this.beneficiaryDetailsSubscription)
      this.beneficiaryDetailsSubscription.unsubscribe();
    if (this.rbsPresentSubscription) this.rbsPresentSubscription.unsubscribe();
    if (this.visualAcuitySubscription)
      this.visualAcuitySubscription.unsubscribe();
    if (this.hemoglobinSubscription) this.hemoglobinSubscription.unsubscribe();
    if (this.diabetesSubscription) this.diabetesSubscription.unsubscribe();
    if (this.visualAcuityMandatorySubscription)
      this.visualAcuityMandatorySubscription.unsubscribe();
    if (this.ncdTemperatureSubscription)
      this.ncdTemperatureSubscription.unsubscribe();
    if (this.mmuReferredSubscription)
      this.mmuReferredSubscription.unsubscribe();
    if (this.enableVitalsButtonSubscription)
      this.enableVitalsButtonSubscription.unsubscribe();
    // if (this.enableCovidVaccinationSaveButtonSubscription)
    // this.enableCovidVaccinationSaveButtonSubscription.unsubscribe();

    this.doctorService.clearCache();
    this.masterdataService.reset();
  }

  beneficiaryDetailsSubscription: any;
  getBeneficiaryDetails() {
    this.beneficiaryDetailsSubscription =
      this.beneficiaryDetailsService.beneficiaryDetails$.subscribe(
        (beneficiary) => {
          if (beneficiary) {
            this.beneficiary = beneficiary;
            this.beneficiaryAge = beneficiary.ageVal;
            console.log("beneficiary", beneficiary);
          }
        }
      );
  }

  visitDetailMasterDataSubscription: any;
  getVisitReasonAndCategory() {
    this.masterdataService.getVisitDetailMasterData();
    this.visitDetailMasterDataSubscription =
      this.masterdataService.visitDetailMasterData$.subscribe(
        (visitDetails) => {
          if (visitDetails) {
            this.visitCategoryList = visitDetails.visitCategories;
            console.log("Visit Details Master Data", visitDetails);

            if (this.visitCategory) {
              this.getNurseMasterData(this.visitCategory);
              this.getDoctorMasterData(this.visitCategory);
            }
          }
        }
      );
  }

  getNurseMasterData(visitCategory: string) {
    let visitID = this.getVisitCategoryID(visitCategory);
    let serviceProviderID = localStorage.getItem("providerServiceID");

    if (visitID)
      this.masterdataService.getNurseMasterData(visitID, serviceProviderID);
  }

  getDoctorMasterData(visitCategory: string) {
    let visitID = this.getVisitCategoryID(visitCategory);
    let serviceProviderID = localStorage.getItem("providerServiceID");

    if (visitID)
      this.masterdataService.getDoctorMasterData(visitID, serviceProviderID);
  }

  getVisitCategoryID(visitCategory: string) {
    if (visitCategory && this.visitCategoryList) {
      let temp = this.visitCategoryList.filter((category) => {
        return category.visitCategory == visitCategory;
      });
      if (temp.length > 0) return temp[0].visitCategoryID;
    }
    return null;
  }

  getPregnancyStatus() {
    let pg = <FormGroup>this.patientMedicalForm.controls["patientVisitForm"];
    pg.controls["patientVisitDetailsForm"].valueChanges.subscribe((value) => {
      if (value.pregnancyStatus) {
        this.pregnancyStatus = value.pregnancyStatus;
      } else {
        this.pregnancyStatus = null;
      }
    });
  }

  patchGravidaValue() {
    let af = this.patientMedicalForm.controls["patientANCForm"] as FormGroup;
    let pof = (<FormGroup>(
      this.patientMedicalForm.controls["patientHistoryForm"]
    )).controls["pastObstericHistory"] as FormGroup;

    (<FormGroup>af.controls["obstetricFormulaForm"]).controls[
      "gravida_G"
    ].valueChanges.subscribe((value) => {
      if (pof && value && value > 1)
        pof.controls["totalNoOfPreg"].setValue(value);
    });
  }

  getCurrentVitals() {
    this.patientMedicalForm.controls[
      "patientVitalsForm"
    ].valueChanges.subscribe((value) => {
      if (value) {
        this.currentVitals = value;
      }
    });
  }

  patchCancerFindings() {
    this.patientMedicalForm.valueChanges.subscribe(
      (patientMedicalForm: any) => {
        this.findings = {
          briefHistory:
            patientMedicalForm.patientExaminationForm.signsForm.observation,
          oralExamination:
            patientMedicalForm.patientExaminationForm.oralExaminationForm
              .observation,
          abdominalExamination:
            patientMedicalForm.patientExaminationForm.abdominalExaminationForm
              .observation,
          gynecologicalExamination:
            patientMedicalForm.patientExaminationForm
              .gynecologicalExaminationForm.observation,
        };
      }
    );
  }

  getANCDiagnosis() {
    let ANCForm = <FormGroup>this.patientMedicalForm.controls["patientANCForm"];
    let CaseRecordForm = <FormGroup>(
      this.patientMedicalForm.controls["patientCaseRecordForm"]
    );

    ANCForm.controls["obstetricFormulaForm"].valueChanges.subscribe((value) => {
      CaseRecordForm.controls["generalDiagnosisForm"].patchValue(value);
    });
    ANCForm.controls["patientANCDetailsForm"].valueChanges.subscribe(
      (value) => {
        CaseRecordForm.controls["generalDiagnosisForm"].patchValue(value);
      }
    );
  }

  getPrimeGravidaStatus() {
    let ANCForm = <FormGroup>this.patientMedicalForm.controls["patientANCForm"];
    (<FormGroup>ANCForm.controls["patientANCDetailsForm"]).controls[
      "primiGravida"
    ].valueChanges.subscribe((value) => {
      this.primeGravidaStatus = value;
    });
  }

  patchLMPDate() {
    let patientANCDetailsForm = (<FormGroup>(
      this.patientMedicalForm.controls["patientANCForm"]
    )).controls["patientANCDetailsForm"];
    let menstrualHistoryForm = (<FormGroup>(
      this.patientMedicalForm.controls["patientHistoryForm"]
    )).controls["menstrualHistory"];

    patientANCDetailsForm.valueChanges.subscribe((value) => {
      if (value.lmpDate) {
        let temp = new Date(value.lmpDate);
        menstrualHistoryForm.patchValue({ lMPDate: temp });
        this.nurseService.setLMPForFetosenseTest(temp);
      }
    });
  }

  patchGeneralFinding() {
    let patientChiefComplaintsForm = (<FormGroup>(
      this.patientMedicalForm.controls["patientVisitForm"]
    )).controls["patientChiefComplaintsForm"];

    patientChiefComplaintsForm.valueChanges.subscribe((value) => {
      this.findings = value;
    });
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }
  lableName: any;
  updatePending(event: any) {
    let dirty = false;

    let changedForm: any;

    if (!this.newLookupMode) {
      switch (event.previouslySelectedStep.label) {
        case "ANC":
          let ancForm = <FormGroup>(
            this.patientMedicalForm.controls["patientANCForm"]
          );
          if (ancForm.dirty) {
            this.lableName = this.current_language_set.ancData.anc;
            dirty = true;
            changedForm = ancForm;
          }
          break;

        case "History":
          let historyForm = <FormGroup>(
            this.patientMedicalForm.controls["patientHistoryForm"]
          );
          if (historyForm.dirty) {
            this.lableName = this.current_language_set.common.history;

            dirty = true;
            changedForm = historyForm;
          }
          break;

        case "Vitals":
          let vitalsForm = <FormGroup>(
            this.patientMedicalForm.controls["patientVitalsForm"]
          );
          if (vitalsForm.dirty || this.enableUpdateButtonInVitals) {
            this.lableName =
              this.current_language_set.vitalsDetails.vitalsDataANC_OPD_NCD_PNC.vitals;
            dirty = true;
            changedForm = vitalsForm;
          }
          break;

        case "Examination":
          let examinationForm = <FormGroup>(
            this.patientMedicalForm.controls["patientExaminationForm"]
          );
          if (examinationForm.dirty) {
            this.lableName =
              this.current_language_set.ExaminationData.examination;
            dirty = true;
            changedForm = examinationForm;
          }
          break;
        case "IDRS":
          let IDRSForm = <FormGroup>(
            this.patientMedicalForm.controls["idrsScreeningForm"]
          );
          this.lableName = "Screening";
          if (this.enableIDRSUpdate == false) {
            dirty = true;
            changedForm = IDRSForm;
          }
          break;

        case "Visit Details":
          let patientVisitFormDet = <FormGroup>(
            this.patientMedicalForm.controls["patientVisitForm"]
          );
          let covidVaccinationForm =
            patientVisitFormDet.controls["covidVaccineStatusForm"];
          this.lableName = this.current_language_set.covidVaccinationStatus;
          if (
            this.doctorService.covidVaccineAgeGroup === ">=12 years" &&
            (covidVaccinationForm.dirty === true ||
              this.doctorService.enableCovidVaccinationButton == true)
          ) {
            dirty = true;
            changedForm = covidVaccinationForm;
          }
          break;

        default:
          dirty = false;
          break;
      }
    } else {
      switch (event.previouslySelectedStep.label) {
        case "Visit Details":
          let patientVisitFormDet = <FormGroup>(
            this.patientMedicalForm.controls["patientVisitForm"]
          );
          let covidVaccinationForm =
            patientVisitFormDet.controls["covidVaccineStatusForm"];
          this.lableName = this.current_language_set.covidVaccinationStatus;
          if (
            this.doctorService.covidVaccineAgeGroup === ">=12 years" &&
            (covidVaccinationForm.dirty === true ||
              this.doctorService.enableCovidVaccinationButton == true)
          ) {
            dirty = true;
            changedForm = covidVaccinationForm;
          }
          break;

        default:
          dirty = false;
          break;
      }
    }

    if (dirty)
      this.confirmationService.alert(
        this.current_language_set.alerts.info.dontForget +
          " " +
          this.lableName +
          " " +
          this.current_language_set.alerts.info.changes
      );

    // if (changedForm) {
    //   changedForm.markAsPristine();
    // }
  }

  sideNavModeChange(sidenav) {
    let deviceHeight = window.screen.height;
    let deviceWidth = window.screen.width;
    if (deviceWidth < 700) sidenav.mode = "over";
    else sidenav.mode = "side";
    sidenav.toggle();
  }

  canDeactivate(): Observable<boolean> {
    console.log("deactivate called");
    if (
      (sessionStorage.length > 0 && this.patientMedicalForm.dirty) ||
      this.enableUpdateButtonInVitals
    )
      return this.confirmationService.confirm(
        `info`,
        this.current_language_set.alerts.info.navigateFurtherAlert,
        "Yes",
        "No"
      );
    else return Observable.of(true);
  }

  preventSubmitOnEnter(event: Event) {
    event.preventDefault();
  }

  schedulerData: any;
  schedulerFormData: any;
  schedulerButton: any;
  openScheduler() {
    let mdDialogRef: MdDialogRef<SchedulerComponent> = this.mdDialog.open(
      SchedulerComponent,
      {
        data: this.schedulerFormData,
      }
    );
    mdDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("result", result);

        if (result.clear) {
          this.schedulerFormData = null;
          this.schedulerData = null;
          this.schedulerButton =
            this.current_language_set.common.scheduleforTM +
            " " +
            this.serviceType;
        } else if (
          result.tmSlot &&
          result.tmSlot != null &&
          result.tmSlot != undefined
        ) {
          this.schedulerFormData = result;
          this.schedulerData = this.schedulerFormData.tmSlot;
          this.schedulerButton = "View " + this.serviceType + " Schedule";
        }
      } else {
        console.log("result", result);
      }
      // if (result) {
      //   this.schedulerFormData = result
      //   this.schedulerData = this.schedulerFormData.tmSlot;
      //   this.schedulerButton = 'View TM Schedule'
      // } else {
      //   if (this.schedulerFormData && this.schedulerData) {
      //     this.schedulerButton = 'View TM Schedule'
      //   } else {

      //   }
      // }
    });
  }

  startTC() {
    console.log("startTC");
    this.doctorService.invokeSwymedCallSpecialist().subscribe(
      (res) => {
        if (res.statusCode == 200 && res.data) {
          window.location.href = res.data.response;
          this.updateTCStartTime();
        } else {
          this.confirmationService.alert(res.errorMessage, "error");
        }
      },
      (error) => {
        this.confirmationService.alert(error, "error");
      }
    );
  }
  updateTCStartTime() {
    let tCStartTimeObj = {
      benRegID: localStorage.getItem("beneficiaryRegID"),
      visitCode: localStorage.getItem("visitCode"),
    };
    this.doctorService.updateTCStartTime(tCStartTimeObj).subscribe((res) => {
      console.log(res);
    });
  }
  provideLogin() {
    this.confirmationService
      .confirm(
        "info",
        this.current_language_set.provideSwyMedLoginDetailsToStartTC,
        "Yes",
        "No"
      )
      .subscribe((res) => {
        if (res) {
          this.openSnackBar();
        } else {
          this.confirmationService.alert(
            this.current_language_set.loginManuallyThroughSwyMed
          );
        }
      });
  }

  openSnackBar() {
    let snackBarRef: MatSnackBarRef<SpecialistLoginComponent> =
      this.snackBar.openFromComponent(SpecialistLoginComponent, {
        horizontalPosition: "right",
        data: {
          message: "string",
          action: "Save",
        },
      });
    snackBarRef.afterDismissed().subscribe(() => {
      console.log("locsl", JSON.parse(localStorage.getItem("swymedLogin")));
      this.startTC();
    });
  }
  checkPastObstericHistory(generalOPDHistory) {
    const vitalsForm = <FormGroup>(
      generalOPDHistory.controls["patientHistoryForm"]
    );
    const pregForm1 = <FormGroup>vitalsForm.controls["pastObstericHistory"];
    const pregForm2 = <FormGroup>pregForm1.controls["pastObstericHistoryList"];
    const historyForm = <FormGroup>(
      generalOPDHistory.controls["patientHistoryForm"]
    );

    const required = [];
    if (pregForm2.controls) {
      var score1: number = Number(pregForm2.controls.length);
      for (let i = 0; i < score1; i++) {
        const pregForm3 = <FormGroup>pregForm2.controls[i];
        if (
          pregForm3.controls["pregOutcome"].value &&
          pregForm3.controls["pregOutcome"].value.pregOutcome == "Abortion"
        ) {
          if (
            pregForm3.controls["abortionType"].value &&
            pregForm3.controls["abortionType"].value.complicationValue ==
              "Induced" &&
            pregForm3.controls["typeofFacility"].errors
          ) {
            required.push(
              this.current_language_set.historyData.opd_NCD_PNCHistory.obstetric
                .typeofFacility +
                "-" +
                this.current_language_set.historyData.opd_NCD_PNCHistory
                  .obstetric.orderofPregnancy +
                " " +
                pregForm3.value.pregOrder
            );
          }
          if (pregForm3.controls["postAbortionComplication"].errors) {
            required.push(
              this.current_language_set.historyData.opd_NCD_PNCHistory.obstetric
                .complicationPostAbortion +
                "-" +
                this.current_language_set.historyData.opd_NCD_PNCHistory
                  .obstetric.orderofPregnancy +
                " " +
                pregForm3.value.pregOrder
            );
          }
          if (pregForm3.controls["abortionType"].errors) {
            required.push(
              this.current_language_set.historyData.opd_NCD_PNCHistory.obstetric
                .typeOfAbortion +
                "-" +
                this.current_language_set.historyData.opd_NCD_PNCHistory
                  .obstetric.orderofPregnancy +
                " " +
                pregForm3.value.pregOrder
            );
          }
          if (pregForm3.controls["pregDuration"].errors) {
            required.push(
              this.current_language_set.historyData.opd_NCD_PNCHistory.obstetric
                .noOfcompletedWeeks +
                "-" +
                this.current_language_set.historyData.opd_NCD_PNCHistory
                  .obstetric.orderofPregnancy +
                " " +
                pregForm3.value.pregOrder
            );
          }
        }
      }
    }
    let personalHistory = historyForm.controls["personalHistory"];
    let allergyList = personalHistory.value.allergicList;

    let snomedTermNotMapped = false;

    if (allergyList.length > 0) {
      for (let i = 0; i < allergyList.length; i++) {
        if (allergyList[i].allergyType != null) {
          if (
            allergyList[i].snomedCode == null &&
            allergyList[i].snomedTerm != null
          ) {
            snomedTermNotMapped = true;
          } else if (
            allergyList[i].snomedCode != null &&
            allergyList[i].snomedTerm == null
          ) {
            snomedTermNotMapped = true;
          }
        }
      }
    }

    if (snomedTermNotMapped) {
      required.push(this.current_language_set.allergyNameIsNotValid);
    }
    if (required.length) {
      this.confirmationService.notify(
        this.current_language_set.alerts.info.belowFields,
        required
      );
      return 0;
    } else {
      return 1;
    }
  }
  checkNCDScreeningHistory(historyForm) {
    const required = [];

    let count = 0;
    let familyDiseaseList =
      historyForm.controls.patientHistoryForm.controls.familyHistory.controls
        .familyDiseaseList.value;
    familyDiseaseList.forEach((element) => {
      if (
        element.diseaseType != null &&
        element.deleted === false &&
        element.diseaseType.diseaseType === "Diabetes Mellitus"
      ) {
        count++;
      }
    });
    // console.log("array",arrayt);
    if (this.beneficiaryAge < 30) {
      count++;
    }

    if (count == 0) {
      required.push(
        this.current_language_set.pleaseSelectDiabetesMellitusInFamilyHistory
      );
    }
    // let isDiabetesMellitusSelected =  localStorage.getItem("diabetesMellitusSelected");
    // console.log("local",isDiabetesMellitusSelected);

    // if(isDiabetesMellitusSelected == null || isDiabetesMellitusSelected != "Diabetes Mellitus" ){
    //   required.push("Please select Diabetes Mellitus in family history");
    // }
    // const referForm = <FormGroup>historyForm.controls["patientReferForm"];
    // if (this.attendant == "doctor") {
    //   if (referForm.controls["refrredToAdditionalServiceList"].value != null) {
    //     if (referForm.controls["refrredToAdditionalServiceList"].value.length > 0) {
    //       if (referForm.controls["referralReason"].errors) {
    //         required.push("Referral reason");
    //       }
    //     } else if (referForm.controls["referredToInstituteName"].value != null) {
    //       if (referForm.controls["referralReason"].errors) {
    //         required.push("Referral reason");
    //       }
    //     }
    //   } else if (referForm.controls["referredToInstituteName"].value != null) {

    //     if (referForm.controls["referralReason"].errors) {
    //       required.push("Referral reason");
    //     }

    //   }
    // }
    let familyMember = 0;
    let familyDiseasesList =
      historyForm.controls.patientHistoryForm.controls.familyHistory.controls
        .familyDiseaseList.value;
    let familyDiseasesLength = familyDiseasesList.length;
    for (let element = 0; element < familyDiseasesList.length; element++) {
      //familyMember = 0;
      if (
        familyDiseasesList[element].diseaseType != null &&
        familyDiseasesList[element].deleted === false
      ) {
        if (
          familyDiseasesList[element].familyMembers != null &&
          familyDiseasesList[element].familyMembers.length > 0
        ) {
          familyMember++;
        }
      } else {
        familyDiseasesLength--;
      }
    }
    if (familyMember != familyDiseasesLength) {
      required.push(this.current_language_set.familyMemberInFamilyHistory);
    }
    if (required.length) {
      this.confirmationService.notify(
        this.current_language_set.alerts.info.mandatoryFields,
        required
      );
      return 0;
    } else {
      return 1;
    }
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
              labList.forEach((element) => {
                if (element.procedureName.toLowerCase() == "RBS Test") {
                  this.diabetesSelected = 0;
                  rbsPresentInList = true;
                }
              });
              // if (!rbsPresentInList)
              this.diabetesSelected = 1;
              // } else {
              //   this.diabetesSelected = 1;
              //   console.log("No data avaiable from MMU investigations");
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

  openBenPreviousisitDetails(){
    this.mdDialog.open(OpenPreviousVisitDetailsComponent, {
      disableClose: true,
      width: '95%',
      panelClass: 'preview-casesheet',
      data: {
        previous: true,
      }
    });
  }
}
