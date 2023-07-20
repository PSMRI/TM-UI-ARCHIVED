import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { ConfirmationService } from "../../../core/services/confirmation.service";
import { BeneficiaryDetailsService } from "../../../core/services/beneficiary-details.service";
import { NurseService, DoctorService } from "../../shared/services";
import { MdDialog } from "@angular/material";
import { IotcomponentComponent } from "app/app-modules/core/components/iotcomponent/iotcomponent.component";
import { environment } from "environments/environment";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { IdrsscoreService } from "../../shared/services/idrsscore.service";
import { TestInVitalsService } from "../../shared/services/test-in-vitals.service";
import { MmuRbsDetailsComponent } from "app/app-modules/core/components/mmu-rbs-details/mmu-rbs-details.component";
import { ActivatedRoute } from "@angular/router";
import { AudioRecordingService } from "../../shared/services/audio-recording.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "nurse-general-patient-vitals",
  templateUrl: "./general-patient-vitals.component.html",
  styleUrls: ["./general-patient-vitals.component.css"],
})
export class GeneralPatientVitalsComponent implements OnInit {
  @Input("patientVitalsForm")
  patientVitalsForm: FormGroup;

  @Input("mode")
  mode: String;

  @Input("visitCategory")
  visitCategory: String;

  female = false;
  BMI = null;
  hideForANCAndQC: Boolean = true;
  showGlucoseQC: Boolean = false;

  startWeightTest = environment.startWeighturl;
  startTempTest = environment.startTempurl;
  startPulseTest = environment.startPulseurl;
  startRBSTest= environment.startRBSurl;
  startBPTest = environment.startBPurl;
  startBloodGlucose = environment.startBloodGlucoseurl;
  currentLanguageSet: any;
  doctorScreen: boolean = false;
  IDRSWaistScore: any;
  male: boolean = false;
  ncdTemperature: boolean;
  bmiStatusMinor: any;
  totalMonths: number;
  benAge: any;
  rbsSelectedInInvestigation: boolean=false;
  rbsSelectedInInvestigationSubscription: any;
  referredVisitcode: string;
  attendant: any;
  rbsResult: any;
  rbsRemarks: any;
  diabetesSelected: number=0;
  rbsPopup: boolean=false;
  rbsCheckBox: boolean = true;

  // Audio - SWAASA
  isRecording:boolean = false;
  recordedTime;
  blobUrl;
  teste;
  enableResult:boolean =false;
  enableSymptoms: boolean = false;
  frequentCough: boolean = false;
  sputum: boolean = false;
  coughAtNight: boolean = false;
  wheezing: boolean = false;
  painInChest: boolean = false;
  shortnessOfBreath: boolean = false;
  benGenderType: any;
  age: any;
  coughBlobFile: Blob;
  severityValue: any;
  cough_pattern_Value: any;
  assessmentDetail: any;
  disabledLungAssesment: boolean = false;
  severity: any;
  cough_pattern: any;
  cough_severity_score: any;
  record_duration: any;
  frequentCoughChecked: any;
  sputumChecked: any;
  coughAtNightChecked: any;
  wheezingChecked: any;
  painInChestChecked: any;
  shortnessOfBreathChecked: any;
  enableLungAssessment: boolean = false;
  hideLungAssessment: boolean = false;

  constructor(
    private dialog: MdDialog,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private doctorService: DoctorService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    public httpServiceService: HttpServiceService,
    private idrsscore: IdrsscoreService,
    private nurseService: NurseService,
    private testInVitalsService: TestInVitalsService,
    private route: ActivatedRoute,
    private audioRecordingService: AudioRecordingService,
    private sanitizer: DomSanitizer
  ) {

    this.audioRecordingService
      .recordingFailed()
      .subscribe(() => (this.isRecording = false));
    this.audioRecordingService
      .getRecordedTime()
      .subscribe(time => {this.recordedTime = time;
        if(this.recordedTime=="00:16"){
          this.stopRecording();
        }});
    this.audioRecordingService.getRecordedBlob().subscribe(data => {
      this.teste = data;
      this.coughBlobFile = data.blob;
      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(data.blob)
      );
    });
  }

  ngOnInit() {
    this.rbsPopup=false;
    this.rbsCheckBox= true;
    this.ncdTemperature = false;
    this.nurseService.clearNCDTemp();
    this.nurseService.clearRbsSelectedInInvestigation();
    this.nurseService.clearEnableLAssessment();
    this.idrsscore.clearDiabetesSelected();
    this.doctorService.setValueToEnableVitalsUpdateButton(false);
    this.nurseService.ncdTemp$.subscribe((response) =>
      response == undefined
        ? (this.ncdTemperature = false)
        : (this.ncdTemperature = response)
    );
    this.httpServiceService.currentLangugae$.subscribe(
      (response) => (this.currentLanguageSet = response)
    );
    this.attendant = this.route.snapshot.params["attendant"];
    this.getBeneficiaryDetails();
    // if(this.benAge < 18){
    //   this.disabledLungAssesment = true;
    // } else {
    //   this.disabledLungAssesment = false;
    // }
    this.rbsSelectedInInvestigationSubscription= this.nurseService.rbsSelectedInInvestigation$.subscribe(response => 
      (response == undefined ? this.rbsSelectedInInvestigation = false : this.rbsSelectedInInvestigation = response));
    if (localStorage.getItem("mmuReferredVisitCode")) {
      this.referredVisitcode = localStorage.getItem("mmuReferredVisitCode");
    }
    else if(localStorage.getItem("referredVisitCode"))
    {
      this.referredVisitcode = localStorage.getItem("referredVisitCode");
    }
    else {
      this.referredVisitcode = "undefined";
    }
    
    this.idrsscore.diabetesSelectedFlag$.subscribe(response => this.diabetesSelected = response);
    this.getGender();
    if(environment.isMMUOffline) {
      this.hideLungAssessment = true;
    } else {
      this.hideLungAssessment = false;
    }
    this.nurseService.enableLAssessment$.subscribe(
      (response) => {
        if(response == true) {
          this.enableLungAssessment = true;
        } else {
          this.enableLungAssessment = false;
        }
      }
    );
  }

  ngOnChanges() {
    let visitCategory1 = localStorage.getItem("visitCategory");
    console.log("page54" + visitCategory1);
    if (
      this.visitCategory == "ANC" ||
      this.visitCategory == "General OPD (QC)"
    ) {
      this.hideForANCAndQC = false;
    } else {
      this.hideForANCAndQC = true;
    }
    if (this.visitCategory == "General OPD (QC)") {
      this.showGlucoseQC = true;
    } else {
      this.showGlucoseQC = false;
    }

    if (this.mode == "view") {
      let visitID = localStorage.getItem("visitID");
      let benRegID = localStorage.getItem("beneficiaryRegID");
      this.getGeneralVitalsData();
      this.getAssessmentID();
      this.doctorScreen = true;
    }
    if (parseInt(localStorage.getItem("specialistFlag")) == 100) {
      let visitID = localStorage.getItem("visitID");
      let benRegID = localStorage.getItem("beneficiaryRegID");
      this.getGeneralVitalsData();
    }

    if (this.mode == "update") {
      this.doctorScreen = true;
      this.updateGeneralVitals(this.patientVitalsForm);
    }
  }

  checkNurseRequirements(medicalForm) {
    const vitalsForm = this.patientVitalsForm;
    const required = [];
    if(this.enableLungAssessment === true && this.benAge >=18 && this.nurseService.isAssessmentDone === false) {
      required.push("Please perform Lung Assessment");
    }

    if (this.visitCategory == "NCD screening") {
      if (vitalsForm.controls["height_cm"].errors) {
        required.push(this.currentLanguageSet.vitalsDetails.height);
      }
      if (vitalsForm.controls["weight_Kg"].errors) {
        required.push(this.currentLanguageSet.vitalsDetails.weight);
      }
      if (vitalsForm.controls["waistCircumference_cm"].errors) {
        required.push(
          this.currentLanguageSet.vitalsDetails.vitalsCancerscreening_QC
            .waistCircumference
        );
      }
      if (vitalsForm.controls["temperature"].errors) {
        required.push(
          this.currentLanguageSet.vitalsDetails.vitalsDataANC_OPD_NCD_PNC
            .temperature
        );
      }
      if (vitalsForm.controls["pulseRate"].errors) {
        required.push(
          this.currentLanguageSet.vitalsDetails.vitalsDataANC_OPD_NCD_PNC
            .pulseRate
        );
      }
      if (vitalsForm.controls["systolicBP_1stReading"].errors) {
        required.push(this.currentLanguageSet.systolicBPReading);
      }
      if (vitalsForm.controls["diastolicBP_1stReading"].errors) {
        required.push(this.currentLanguageSet.diastolicBPReading);
      }
      if (vitalsForm.controls["rbsTestResult"].errors) {
        required.push(this.currentLanguageSet.rbsTestResult);
      }
    } else {
      if (this.visitCategory == "ANC") {
        if (vitalsForm.controls["systolicBP_1stReading"].errors) {
          required.push(this.currentLanguageSet.systolicBPReading);
        }
        if (vitalsForm.controls["diastolicBP_1stReading"].errors) {
          required.push(this.currentLanguageSet.diastolicBPReading);
        }
      }
      if (vitalsForm.controls["height_cm"].errors) {
        required.push(this.currentLanguageSet.vitalsDetails.height);
      }
      if (vitalsForm.controls["weight_Kg"].errors) {
        required.push(this.currentLanguageSet.vitalsDetails.weight);
      }
      if (vitalsForm.controls["temperature"].errors) {
        required.push(
          this.currentLanguageSet.vitalsDetails.vitalsDataANC_OPD_NCD_PNC
            .temperature
        );
      }
      if (vitalsForm.controls["pulseRate"].errors) {
        required.push(
          this.currentLanguageSet.vitalsDetails.vitalsDataANC_OPD_NCD_PNC
            .pulseRate
        );
      }
    }
    if (required.length) {
      this.confirmationService.notify(
        this.currentLanguageSet.alerts.info.belowFields,
        required
      );
      return 0;
    } else {
      return 1;
    }
  }

  updateGeneralVitals(patientVitalsForm) {
    if (this.checkNurseRequirements(this.patientVitalsForm)) {
      this.doctorService
        .updateGeneralVitals(patientVitalsForm, this.visitCategory)
        .subscribe(
          (res: any) => {
            if (res.statusCode == 200 && res.data != null) {
              this.idrsscore.rbsTestResultsInVitals(this.patientVitalsForm.controls['rbsTestResult'].value);
              if (this.visitCategory == "ANC") {
                this.getHRPDetails();
              }
              this.confirmationService.alert(res.data.response, "success");
              this.doctorService.setValueToEnableVitalsUpdateButton(false);
              this.setRBSResultInReport(this.patientVitalsForm);
              this.patientVitalsForm.markAsPristine();
            } else {
              this.confirmationService.alert(res.errorMessage, "error");
            }
          },
          (err) => {
            this.confirmationService.alert(err, "error");
          }
        );
    }
  }

  setRBSResultInReport(patientVitalsForm) {

    if(patientVitalsForm.value)
    {
      let todayDate = new Date();
      if(!patientVitalsForm.controls['rbsTestResult'].disabled && (patientVitalsForm.controls['rbsTestResult'].dirty || patientVitalsForm.controls['rbsTestRemarks'].dirty)) {

      let patientVitalsDataForReport = Object.assign({}, patientVitalsForm.getRawValue(), {
        createdDate: todayDate
      });

      this.testInVitalsService.setVitalsRBSValueInReportsInUpdate(patientVitalsDataForReport);
    }
    }
  }
  loadMMURBS()
  {
    // if(this.attendant != "nurse")
    // {
      this.doctorService
      .getRBSPreviousVitals({
        benRegID: localStorage.getItem("beneficiaryRegID"),
        benVisitID: localStorage.getItem("referredVisitID"),
        visitCode: this.attendant !== 'nurse' ? localStorage.getItem("referredVisitCode") : localStorage.getItem("mmuReferredVisitCode")
      })
      .subscribe((data) => {
        if (data) {
          let temp = Object.assign(
            {},
            data.benAnthropometryDetail,
            data.benPhysicalVitalDetail
          );
          if ((this.patientVitalsForm.controls['rbsTestResult'] === null || this.patientVitalsForm.controls['rbsTestResult'] === undefined )) {
            this.patientVitalsForm.patchValue({
              rbsTestResult: temp.rbsTestResult
            });
          }
          if ((this.patientVitalsForm.controls['rbsTestRemarks'] === null || this.patientVitalsForm.controls['rbsTestRemarks'] === undefined )) {
            this.patientVitalsForm.patchValue({
              rbsTestRemarks: temp.rbsTestRemarks
            });
          }
          
          this.rbsResult=temp.rbsTestResult;
          this.rbsRemarks=temp.rbsTestRemarks;
          this.dialog.open(MmuRbsDetailsComponent, {
            data: {
              rbsResult: this.rbsResult,
              rbsRemarks:this.rbsRemarks
            },
          });
        }
      });
    // }
    // else{
    //   this.dialog.open(MmuRbsDetailsComponent, {
    //     data: {
    //       rbsResult: this.rbsResult,
    //       rbsRemarks:this.rbsRemarks
    //     },
    //   });
    // }
     
  }
  generalVitalsDataSubscription: any;
  getGeneralVitalsData() {
    this.generalVitalsDataSubscription = this.doctorService
      .getGenericVitals({
        benRegID: localStorage.getItem("beneficiaryRegID"),
        benVisitID: localStorage.getItem("visitID"),
      })
      .subscribe((vitalsData) => {
        if (vitalsData) {
          let temp = Object.assign(
            {},
            vitalsData.benAnthropometryDetail,
            vitalsData.benPhysicalVitalDetail
          );
          this.patientVitalsForm.patchValue(temp);
          // if(this.attendant =="nurse")
          // this.patientVitalsForm.patchValue({
          //   rbsTestResult: null,
          //   rbsTestRemarks: null
          // });
          this.rbsResult=temp.rbsTestResult;
          this.rbsRemarks=temp.rbsTestRemarks;
          if (temp.systolicBP_1stReading != null) {
            this.idrsscore.setSystolicBp(temp.systolicBP_1stReading);
          }
          if (temp.diastolicBP_1stReading != null) {
            this.idrsscore.setDiastolicBp(temp.diastolicBP_1stReading);
          }
          if (temp.waistCircumference_cm != null) {
            this.patchIDRSForWaist(temp.waistCircumference_cm);
          }
          this.nurseService.rbsTestResultFromDoctorFetch=null;
          if(temp.rbsTestResult !=undefined && temp.rbsTestResult !=null && this.attendant != "nurse")
          {
            this.nurseService.rbsTestResultFromDoctorFetch=temp.rbsTestResult;
            this.rbsResultChange();
          }
          if (
            this.patientVitalsForm.controls["hipCircumference_cm"].value &&
            this.patientVitalsForm.controls["hipCircumference_cm"].value !=
              null &&
            this.visitCategory == "General OPD"
          ) {
            this.checkHip(
              this.patientVitalsForm.controls["hipCircumference_cm"].value
            );
          }
          if (
            this.patientVitalsForm.controls["waistHipRatio"].value &&
            this.patientVitalsForm.controls["waistHipRatio"].value != null &&
            this.visitCategory == "General OPD"
          ) {
            this.hipWaistRatio();
          }
          this.calculateBMI();

          //Sending RBS Test Result to patch in Lab Reports

          if( vitalsData.benPhysicalVitalDetail)
          {
           this.testInVitalsService.setVitalsRBSValueInReports(vitalsData.benPhysicalVitalDetail)
          }

        } else {
          this.loadMMURBS();
        }
      });
  }

  ngOnDestroy() {
    if (this.beneficiaryDetailSubscription)
      this.beneficiaryDetailSubscription.unsubscribe();
    if (this.generalVitalsDataSubscription)
      this.generalVitalsDataSubscription.unsubscribe();
    if(this.rbsSelectedInInvestigationSubscription)
      this.rbsSelectedInInvestigationSubscription.unsubscribe();
      this.nurseService.rbsTestResultFromDoctorFetch=null;
      this.nurseService.isAssessmentDone = false;
  }

  checkDiasableRBS()
  {
    if(this.rbsSelectedInInvestigation === true || (this.nurseService.rbsTestResultFromDoctorFetch !=undefined && this.nurseService.rbsTestResultFromDoctorFetch !=null))
    return true;

    return false;
  }

  benGenderAndAge: any;
  beneficiaryDetailSubscription: any;
  getBeneficiaryDetails() {
    this.beneficiaryDetailSubscription =
      this.beneficiaryDetailsService.beneficiaryDetails$.subscribe(
        (beneficiary) => {
          if (beneficiary) {
            if (beneficiary && beneficiary.ageVal != null && beneficiary.ageVal != undefined)
      {
        this.benGenderAndAge = beneficiary;
        this.benAge = beneficiary.ageVal;
        if(this.benAge >= 18){
          this.disabledLungAssesment = false;
        } else {
          this.disabledLungAssesment = true;
        } 
            this.benGenderAndAge = beneficiary;
            let ageMonth = this.benGenderAndAge.age;
        let ar = ageMonth.split(" ");
        this.totalMonths = Number(ar[0] * 12) + Number(ar[3]);
      }
            if (beneficiary !=undefined && 
              beneficiary.genderName != undefined &&
              beneficiary.genderName != null &&
              beneficiary.genderName &&
              beneficiary.genderName.toLowerCase() == "female"
            ) {
              this.female = true;
            }
            if (beneficiary !=undefined && 
              beneficiary.genderName != undefined &&
              beneficiary.genderName != null &&
              beneficiary.genderName &&
              beneficiary.genderName.toLowerCase() == "male"
            ) {
              this.male = true;
            }
          }
        }
      );
  }

  normalBMI = true;
  calculateBMI() {
    if (
      this.height_cm &&
      this.height_cm != null &&
      this.weight_Kg &&
      this.weight_Kg != null
    ) {
      this.BMI = (this.weight_Kg / (this.height_cm * this.height_cm)) * 10000;
      this.BMI = +this.BMI.toFixed(1);
      if( this.BMI !== null && this.BMI !== undefined){
      this.calculateBMIStatusBasedOnAge();
      }
      this.patientVitalsForm.patchValue({ bMI: this.BMI });
    } else {
      this.patientVitalsForm.patchValue({ bMI: null });
    }
    
  }
  calculateBMIStatusBasedOnAge() {
    if(this.benGenderAndAge !=undefined && this.benGenderAndAge.age !=undefined)
    {
      let ageMonth = this.benGenderAndAge.age;
      let ar = ageMonth.split(" ");
      this.totalMonths = Number(ar[0] * 12) + Number(ar[3]);
    }
    if (this.totalMonths > 60 && this.totalMonths <= 228 && ((this.benGenderAndAge.genderName).toLowerCase() =="male" || 
    (this.benGenderAndAge.genderName).toLowerCase() =="female")) {
      this.nurseService
        .calculateBmiStatus({
          yearMonth: this.benGenderAndAge.age,
          gender: this.benGenderAndAge.genderName,
          bmi: this.BMI,
        })
        .subscribe(
          (res) => {
            if (res.statusCode == 200 && res.data != null) {
              let bmiData = res.data;
              if (bmiData.bmiStatus != undefined && bmiData.bmiStatus != null) {
                this.bmiStatusMinor = bmiData.bmiStatus.toLowerCase();
                if (this.bmiStatusMinor === "normal") this.normalBMI = true;
                else this.normalBMI = false;
              }
            } else {
              this.confirmationService.alert(res.errorMessage, "error");
            }
          },

          (err) => {
            this.confirmationService.alert(err, "error");
          }
        );
    } else {
      if (this.BMI >= 18.5 && this.BMI <= 24.9) this.normalBMI = true;
      else this.normalBMI = false;
    }
  }
  checkHeight(height_cm) {
    if (height_cm < 10 || height_cm > 200) {
      this.confirmationService.alert(
        this.currentLanguageSet.alerts.info.recheckValue
      );
    }
  }

  checkWeight(weight_Kg) {
    if (weight_Kg < 25 || weight_Kg > 150) {
      this.confirmationService.alert(
        this.currentLanguageSet.alerts.info.recheckValue
      );
    }
  }

  normalWaistHipRatio = true;
  hipWaistRatio() {
    let waistHipRatio;
    if (
      this.hipCircumference_cm &&
      this.waistCircumference_cm &&
      this.hipCircumference_cm != null &&
      this.waistCircumference_cm != null
    ) {
      waistHipRatio = (
        this.waistCircumference_cm / this.hipCircumference_cm
      ).toFixed(2);
      this.patientVitalsForm.patchValue({ waistHipRatio: waistHipRatio });
      if (this.female) {
        this.normalWaistHipRatio = waistHipRatio < 0.81 ? true : false;
      } else this.normalWaistHipRatio = waistHipRatio < 0.91 ? true : false;
    } else {
      this.patientVitalsForm.patchValue({ waistHipRatio: null });
    }
  }

  get waistHipRatio() {
    return this.patientVitalsForm.controls["waistHipRatio"].value;
  }

  normalHip = true;
  checkHip(hipCircumference_cm) {
    if (this.female)
      this.normalHip =
        this.hipCircumference_cm >= 97 && this.hipCircumference_cm <= 108
          ? true
          : false;
    else
      this.normalHip =
        this.hipCircumference_cm >= 94 && this.hipCircumference_cm <= 105
          ? true
          : false;
  }

  checkHeadCircumference(headCircumference_cm) {
    if (this.headCircumference_cm <= 25 || this.headCircumference_cm >= 75) {
      this.confirmationService.alert(
        this.currentLanguageSet.alerts.info.recheckValue
      );
    }
  }

  checkMidUpperArmCircumference(midUpperArmCircumference_MUAC_cm) {
    if (
      this.midUpperArmCircumference_MUAC_cm <= 6 ||
      this.midUpperArmCircumference_MUAC_cm >= 30
    ) {
      this.confirmationService.alert(
        this.currentLanguageSet.alerts.info.recheckValue
      );
    }
  }

  checkTemperature(temperature) {
    if (this.temperature <= 90 || this.temperature >= 110) {
      this.confirmationService.alert(
        this.currentLanguageSet.alerts.info.recheckValue
      );
    }
  }

  checkPulseRate(pulseRate) {
    if (this.pulseRate <= 50 || this.pulseRate >= 200) {
      this.confirmationService.alert(
        this.currentLanguageSet.alerts.info.recheckValue
      );
    }
  }
  checkSpo2() {
    if (this.sPO2 < 1 || this.sPO2 > 100) {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.recheckValue);
    }
  }

  checkRespiratoryRate(respiratoryRate) {
    if (this.respiratoryRate <= 10 || this.respiratoryRate >= 100) {
      this.confirmationService.alert(
        this.currentLanguageSet.alerts.info.recheckValue
      );
    }
  }

  checkSystolic(systolicBP) {
    if (systolicBP <= 40 || systolicBP >= 320) {
      this.confirmationService.alert(
        this.currentLanguageSet.alerts.info.recheckValue
      );
    }
    // if(systolicBP != null){
    //   localStorage.setItem("systolicBP",systolicBP)
    // }
    if (systolicBP != null) this.idrsscore.setSystolicBp(systolicBP);
    else this.idrsscore.setSystolicBp(0);
  }

  checkSystolicGreater(systolic, diastolic) {
    if (systolic && diastolic && parseInt(systolic) <= parseInt(diastolic)) {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.sysBp);
      this.patientVitalsForm.patchValue({
        systolicBP_1stReading: null,
      });
    }
  }

  checkDiastolicLower(systolic, diastolic) {
    if (systolic && diastolic && parseInt(diastolic) >= parseInt(systolic)) {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.sysBp);
      this.patientVitalsForm.patchValue({
        diastolicBP_1stReading: null,
      });
    }
  }

  checkDiastolic(diastolicBP) {
    if (diastolicBP <= 10 || diastolicBP >= 180) {
      this.confirmationService.alert(
        this.currentLanguageSet.alerts.info.recheckValue
      );
    }
    if (diastolicBP != null) this.idrsscore.setDiastolicBp(diastolicBP);
    else this.idrsscore.setDiastolicBp(0);
  }

  checkBloodSugarFasting(bloodSugarFasting: any) {
    if (bloodSugarFasting < 50 || bloodSugarFasting > 700) {
      this.confirmationService.alert(
        this.currentLanguageSet.alerts.info.recheckValue
      );
    }
  }

  checkBloodSugarRandom(bloodSugarRandom: any) {
    if (bloodSugarRandom < 50 || bloodSugarRandom > 700) {
      this.confirmationService.alert(
        this.currentLanguageSet.alerts.info.recheckValue
      );
    }
  }

  checkBloodSugar2HrPostPrandial(bloodSugar2HrPostPrandial: any) {
    if (bloodSugar2HrPostPrandial < 50 || bloodSugar2HrPostPrandial > 700) {
      this.confirmationService.alert(
        this.currentLanguageSet.alerts.info.recheckValue
      );
    }
  }

  get height_cm() {
    return this.patientVitalsForm.controls["height_cm"].value;
  }

  get weight_Kg() {
    return this.patientVitalsForm.controls["weight_Kg"].value;
  }

  get waistCircumference_cm() {
    return this.patientVitalsForm.controls["waistCircumference_cm"].value;
  }

  get hipCircumference_cm() {
    return this.patientVitalsForm.controls["hipCircumference_cm"].value;
  }

  get midUpperArmCircumference_MUAC_cm() {
    return this.patientVitalsForm.controls["midUpperArmCircumference_MUAC_cm"]
      .value;
  }

  get headCircumference_cm() {
    return this.patientVitalsForm.controls["headCircumference_cm"].value;
  }

  get temperature() {
    return this.patientVitalsForm.controls["temperature"].value;
  }

  get pulseRate() {
    return this.patientVitalsForm.controls["pulseRate"].value;
  }

  get systolicBP_1stReading() {
    return this.patientVitalsForm.controls["systolicBP_1stReading"].value;
  }

  get diastolicBP_1stReading() {
    return this.patientVitalsForm.controls["diastolicBP_1stReading"].value;
  }

  get respiratoryRate() {
    return this.patientVitalsForm.controls["respiratoryRate"].value;
  }

  get bMI() {
    return this.patientVitalsForm.controls["bMI"].value;
  }

  get bloodGlucose_Fasting() {
    return this.patientVitalsForm.controls["bloodGlucose_Fasting"].value;
  }

  get bloodGlucose_Random() {
    return this.patientVitalsForm.controls["bloodGlucose_Random"].value;
  }

  get bloodGlucose_2hr_PP() {
    return this.patientVitalsForm.controls["bloodGlucose_2hr_PP"].value;
  }
  get sPO2()
 {
  return this.patientVitalsForm.controls['sPO2'].value;
 }
 
 get rbsTestResult()
 {
  return this.patientVitalsForm.controls['rbsTestResult'].value;
 }

  openIOTWeightModel() {
    let dialogRef = this.dialog.open(IotcomponentComponent, {
      width: "600px",
      height: "180px",
      disableClose: true,
      data: { startAPI: this.startWeightTest },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("he;;p", result, result["result"]);
      if (result != null) {
        //result['result']
        this.patientVitalsForm.patchValue({
          weight_Kg: result["result"],
        });
        this.doctorService.setValueToEnableVitalsUpdateButton(true);
        this.calculateBMI();
      }
    });
  }

  openIOTRBSModel() {
    this.rbsPopup=true;
    let dialogRef = this.dialog.open(IotcomponentComponent, {
      "width": "600px",
      "height": "180px",
      "disableClose": true,
      data: { "startAPI": this.startRBSTest }

    });
    dialogRef.afterClosed().subscribe(result => {
      this.rbsPopup=false;
      if (result != null) {
        this.patientVitalsForm.patchValue({
          'rbsTestResult': result['result']
        })
        this.patientVitalsForm.controls["rbsTestResult"].markAsDirty();
        this.doctorService.setValueToEnableVitalsUpdateButton(true);
        if (this.patientVitalsForm.controls['rbsTestResult'].value && 
        this.patientVitalsForm.controls['rbsTestResult'].value != null ) {
        this.nurseService.setRbsInCurrentVitals(this.patientVitalsForm.controls['rbsTestResult'].value);
      }
    }
    });
  }
  checkForRange() {
    if (this.rbsTestResult < 0 || this.rbsTestResult > 1000 && !this.rbsPopup) {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.recheckValue);
    }
  }
  rbsResultChange()
  {
    if (this.patientVitalsForm.controls['rbsTestResult'].value && 
    this.patientVitalsForm.controls['rbsTestResult'].value != null ) {
    this.nurseService.setRbsInCurrentVitals(this.patientVitalsForm.controls['rbsTestResult'].value);
    //this.patientVitalsForm.controls['rbsTestResult'].disable();
  }
  else
  {
    this.nurseService.setRbsInCurrentVitals(null);
  }
  if(this.rbsSelectedInInvestigation === true || (this.nurseService.rbsTestResultFromDoctorFetch !=undefined && this.nurseService.rbsTestResultFromDoctorFetch !=null))
  {
    this.patientVitalsForm.controls['rbsTestResult'].disable();
    this.patientVitalsForm.controls['rbsTestRemarks'].disable();
    this.patientVitalsForm.controls['rbsCheckBox'].disable();
  }
  else
  {
    this.patientVitalsForm.controls['rbsTestResult'].enable();
    this.patientVitalsForm.controls['rbsTestRemarks'].enable();
    this.patientVitalsForm.controls['rbsCheckBox'].enable();
  }
}

  openIOTTempModel() {
    let dialogRef = this.dialog.open(IotcomponentComponent, {
      width: "600px",
      height: "180px",
      disableClose: true,
      data: { startAPI: this.startTempTest },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("temperature", result, result["temperature"]);
      if (result != null) {
        this.patientVitalsForm.patchValue({
          temperature: result["temperature"],
        });
        this.doctorService.setValueToEnableVitalsUpdateButton(true);
      }
    });
  }

  openIOTPulseRateModel() {
    let dialogRef = this.dialog.open(IotcomponentComponent, {
      width: "600px",
      height: "180px",
      disableClose: true,
      data: { startAPI: this.startPulseTest },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("pulse_oxymetery", result, result["pulseRate"]);
      if (result != null) {
        this.patientVitalsForm.patchValue({
          pulseRate: result["pulseRate"],
        });
        this.doctorService.setValueToEnableVitalsUpdateButton(true);
      }
    });
  }
  openIOTSPO2Model() {
    let dialogRef = this.dialog.open(IotcomponentComponent, {
      "width": "600px",
      "height": "180px",
      "disableClose": true,
      data: { "startAPI": this.startPulseTest }

    });
    dialogRef.afterClosed().subscribe(result => {
     // console.log("sPO2", result, result['sPO2']);
      if (result != null) {
        this.patientVitalsForm.patchValue({
          'sPO2': result['spo2']
        })
        this.doctorService.setValueToEnableVitalsUpdateButton(true);
      }
    });
  }

  openIOTBPModel() {
    let dialogRef = this.dialog.open(IotcomponentComponent, {
      width: "600px",
      height: "180px",
      disableClose: true,
      data: { startAPI: this.startBPTest },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("blood_pressure", result["sys"], result["dia"]);
      if (result != null) {
        this.patientVitalsForm.patchValue({
          systolicBP_1stReading: result["sys"],
          diastolicBP_1stReading: result["dia"],
        });
        this.doctorService.setValueToEnableVitalsUpdateButton(true);
      }
    });
  }
  openIOTBGFastingModel() {
    let dialogRef = this.dialog.open(IotcomponentComponent, {
      width: "600px",
      height: "180px",
      disableClose: true,
      data: { startAPI: this.startBloodGlucose },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("blood_pressure", result["sys"], result["dia"]);
      if (result != null) {
        this.patientVitalsForm.patchValue({
          bloodGlucose_Fasting: result["result"],
        });
        this.doctorService.setValueToEnableVitalsUpdateButton(true);
      }
    });
  }
  openIOTBGRandomModel() {
    let dialogRef = this.dialog.open(IotcomponentComponent, {
      width: "600px",
      height: "180px",
      disableClose: true,
      data: { startAPI: this.startBloodGlucose },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("blood_pressure", result["sys"], result["dia"]);
      if (result != null) {
        this.patientVitalsForm.patchValue({
          bloodGlucose_Random: result["result"],
        });
        this.doctorService.setValueToEnableVitalsUpdateButton(true);
      }
    });
  }
  openIOTBGPostPrandialModel() {
    let dialogRef = this.dialog.open(IotcomponentComponent, {
      width: "600px",
      height: "180px",
      disableClose: true,
      data: { startAPI: this.startBloodGlucose },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("blood_pressure", result["sys"], result["dia"]);
      if (result != null) {
        this.patientVitalsForm.patchValue({
          bloodGlucose_2hr_PP: result["result"],
        });
        this.doctorService.setValueToEnableVitalsUpdateButton(true);
      }
    });
  }
  checkIDRSForWaist(waistValue) {
    if (this.male) {
      if (waistValue < 90) {
        this.IDRSWaistScore = 0;
      }
      if (waistValue >= 90 && waistValue <= 99) {
        this.IDRSWaistScore = 10;
      }
      if (waistValue >= 100) {
        this.IDRSWaistScore = 20;
      }
    } else if (this.female) {
      if (waistValue < 80) {
        this.IDRSWaistScore = 0;
      }
      if (waistValue >= 80 && waistValue <= 89) {
        this.IDRSWaistScore = 10;
      }
      if (waistValue >= 90) {
        this.IDRSWaistScore = 20;
      }
    }
    // localStorage.setItem("waistIDRSScore", this.IDRSWaistScore.toStr);
    this.idrsscore.setIDRSScoreWaist(this.IDRSWaistScore);
    this.idrsscore.setIDRSScoreFlag();
  }
  patchIDRSForWaist(waistValue) {
    if (this.male) {
      if (waistValue < 90) {
        this.IDRSWaistScore = 0;
      }
      if (waistValue >= 90 && waistValue <= 99) {
        this.IDRSWaistScore = 10;
      }
      if (waistValue >= 100) {
        this.IDRSWaistScore = 20;
      }
    } else if (this.female) {
      if (waistValue < 80) {
        this.IDRSWaistScore = 0;
      }
      if (waistValue >= 80 && waistValue <= 89) {
        this.IDRSWaistScore = 10;
      }
      if (waistValue >= 90) {
        this.IDRSWaistScore = 20;
      }
    }
    // localStorage.setItem("waistIDRSScore", this.IDRSWaistScore.toStr);
    this.idrsscore.setIDRSScoreWaist(this.IDRSWaistScore);
  }

  getHRPDetails() {
    let beneficiaryRegID = localStorage.getItem("beneficiaryRegID");
    let visitCode = localStorage.getItem("visitCode");
    this.doctorService
      .getHRPDetails(beneficiaryRegID, visitCode)
      .subscribe((res) => {
        if (res && res.statusCode == 200 && res.data) {
          if (res.data.isHRP == true) {
            this.beneficiaryDetailsService.setHRPPositive();
          } else {
            this.beneficiaryDetailsService.resetHRPPositive();
          }
        }
      });
  }

  onRbsCheckBox(event){
    if (event.checked){
      this.rbsCheckBox = true;
    }
    else {
      this.rbsCheckBox = false;
    }
  }

  startRecording() {
    if (!this.isRecording) {
      this.isRecording = true;
      this.audioRecordingService.startRecording();
    }
  }

  abortRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

  stopRecording() {
    if (this.isRecording) {
      this.audioRecordingService.stopRecording();
      this.isRecording = false;
    }
  }

  clearRecordedData() {
    this.confirmationService.confirm(
      `info`,
      "Do you really want to clear the recording?"
      
    ).subscribe((res)=>{
      if(res){
        this.blobUrl = null;
       this.coughBlobFile = null;
       this.frequentCough = false;
       this.sputum = false;
       this.coughAtNight = false;
       this.wheezing = false;
       this.painInChest = false;
       this.shortnessOfBreath = false;
       this.enableResult = false;
       this.nurseService.isAssessmentDone = false;
      }
    });
    
  }

  getGender() {
  let gender = localStorage.getItem("beneficiaryGender");
    if(gender === "Female")
    this.benGenderType = 1;
    else if(gender === "Male")
    this.benGenderType = 0;
    else if(gender === "Transgender")
    this.benGenderType = 2;
  }

  onCheckboxChange(symptomName: string, event: any) {
    this[symptomName] = event.checked ? 1 : 0;
  }
  
  startAssessment() {
    let todayDate = new Date();
    // formData.append('File', file, file.name); // file.name was mandatory for us (otherwise again an error occured)
    // this.enableResult = true;
    const symptoms = {
      frequent_cough: this.frequentCough ? 1 : 0,
      sputum: this.sputum ? 1 : 0,
      cough_at_night: this.coughAtNight ? 1 : 0,
      wheezing: this.wheezing ? 1 : 0,
      pain_in_chest: this.painInChest ? 1 : 0,
      shortness_of_breath: this.shortnessOfBreath ? 1 : 0
    };
    let reqObj = {
      coughsoundfile: null,
      gender: this.benGenderType,
      age: this.benAge,
      patientId: localStorage.getItem('beneficiaryRegID'),
      // timestamp: moment(todayDate).format('YYYY-MM-DD HH:mm:ss'),
      assessmentId: null,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
      symptoms: symptoms,
    }
    const file = new File([this.coughBlobFile], 'coughSound.wav');
    const formData = new FormData();
    formData.append("file", file);
    formData.append("request", JSON.stringify(reqObj));
    console.log("reqObjFile", formData.get('file'));
    this.audioRecordingService.getResultStatus(formData)
    .subscribe(res => {
      if (res.statusCode == 200 && res.data !== null) {
        this.severity = res.data.severity;
        this.cough_pattern = res.data.cough_pattern;
        this.cough_severity_score = res.data.cough_severity_score;
        this.record_duration = res.data.record_duration;
        this.nurseService.setEnableLAssessment(false);
        this.enableResult = true;
        this.nurseService.isAssessmentDone = true;
        console.log("Cough Result Data", res.data)
        }
        else
        {
          this.confirmationService.alert(res.errorMessage, 'error')
        }
      },
      err => {
        this.confirmationService.alert(
          err,
          'error'
        );
      });
    console.log("reqObj",reqObj);
  }

  getAssessmentID() {
    let benRegID = localStorage.getItem("beneficiaryRegID");
    this.doctorService.getAssessment(benRegID).subscribe(res => {
      if (res.statusCode == 200 && res.data !== null && res.data.length > 0) {
        const lastElementIndex = res.data.length - 1;
        const lastElementData = res.data[lastElementIndex];
        let assessmentId = lastElementData.assessmentId;
        if(assessmentId !== null && assessmentId !== undefined) {
          this.getAssessmentDetails(assessmentId);
        }
      }
    })
  }

  getAssessmentDetails(assessmentId) {
    this.doctorService.getAssessmentDet(assessmentId).subscribe(res => {
      if (res.statusCode === 200 && res.data !== null) {
        this.severity = res.data.severity;
        this.cough_pattern = res.data.cough_pattern;
        this.cough_severity_score = res.data.cough_severity_score;
        this.record_duration = res.data.record_duration;
        this.nurseService.setEnableLAssessment(false);
        this.enableResult = true;
        this.nurseService.isAssessmentDone = true;
      }
    })
  }

}
