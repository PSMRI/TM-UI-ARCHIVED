import { Component, OnInit, Input, OnChanges, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ConfirmationService } from '../../../../core/services/confirmation.service';
import { MasterdataService, DoctorService, NurseService } from '../../../shared/services';
import { BeneficiaryDetailsService } from '../../../../core/services/beneficiary-details.service';

import { PreviousDetailsComponent } from '../../../../core/components/previous-details/previous-details.component';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'nurse-cancer-obstetric-history',
  templateUrl: './obstetric-history.component.html',
  styleUrls: ['./obstetric-history.component.css']
})
export class ObstetricHistoryComponent implements OnInit, DoCheck {
  @Input('cancerPatientObstetricHistoryForm')
  cancerPatientObstetricHistoryForm: FormGroup;

  @Input('pregnancyStatus')
  ispregnant: string;

  templateNurseMasterData: any;
  templateBeneficiaryDetails: any;
  currentLanguageSet: any;

  constructor(private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private dialog: MdDialog,
    private nurseService: NurseService,
    private masterdataService: MasterdataService,
    private doctorService: DoctorService,
    public httpServiceService: HttpServiceService,
    private beneficiaryDetailsService: BeneficiaryDetailsService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.getNurseMasterData();
  }

  ngOnChanges() {
    if (this.ispregnant) {
      this.cancerPatientObstetricHistoryForm.controls['pregnancyStatus'].setValue(this.ispregnant);
    }
  }

  ngOnDestroy() {
    if (this.nurseMasterDataSubscription)
      this.nurseMasterDataSubscription.unsubscribe();
  }

  nurseMasterDataSubscription: any;
  getNurseMasterData() {
    this.getBenificiaryDetails();
    this.nurseMasterDataSubscription = this.masterdataService.nurseMasterData$.subscribe((nurseMasterData) => {
      this.templateNurseMasterData = nurseMasterData;
    });
  }

  patientAge: any;
  spaceIndex: any;
  getBenificiaryDetails() {
    this.beneficiaryDetailsService.beneficiaryDetails$
      .subscribe(beneficiaryDetails => {
        if (beneficiaryDetails) {
          this.templateBeneficiaryDetails = beneficiaryDetails;
          this.patientAge = this.templateBeneficiaryDetails.ageVal;
        }
      })
  }

  templatePregnancyStatus = ["Yes", "No", "Don't Know"];
  templateTimesPregnant = ["0", "1", "2", "3", ">3"];
  templateTypeOfFlow = ["Little", "Moderate", "Heavy"];

  checkWithPregnancy() {
    this.cancerPatientObstetricHistoryForm.patchValue({ isUrinePregTest: null });
  }

  checkWithPregnantTimes() {
    this.cancerPatientObstetricHistoryForm.patchValue({ noOfLivingChild: null });
    this.cancerPatientObstetricHistoryForm.patchValue({ isAbortion: null });
  }

  checkNoOfChildren(noOfLivingChild) {
    if (this.noOfLivingChild > 0) {
      if (this.noOfLivingChild > 15) {
        this.cancerPatientObstetricHistoryForm.patchValue({ noOfLivingChild: null });
        this.confirmationService.alert(this.currentLanguageSet.alerts.info.childObstericHistory);
      }
    } else {
      this.cancerPatientObstetricHistoryForm.patchValue({ noOfLivingChild: null });
    }

  }

  get noOfLivingChild() {
    return this.cancerPatientObstetricHistoryForm.controls['noOfLivingChild'].value;
  }

  checkLengthMenstrualCycle(lengthMenstrualCycle: any) {
    if (lengthMenstrualCycle > 0) {
      if (lengthMenstrualCycle < 25 || lengthMenstrualCycle > 40) {
        this.confirmationService.alert(this.currentLanguageSet.alerts.info.recheckValue);
      }
    } else {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.invalidLength);
      this.cancerPatientObstetricHistoryForm.patchValue({ menstrualCycleLength: null });
    }
  }

  checkMenstrualFlowDuration(menstrualFlowDuration: any) {
    if (menstrualFlowDuration > 0) {
      if (menstrualFlowDuration > 12) {
        this.confirmationService.alert(this.currentLanguageSet.alerts.info.recheckValue);
      }
    } else {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.invalidValueless);
      this.cancerPatientObstetricHistoryForm.patchValue({ menstrualFlowDuration: null });
    }
  }

  checkMenarcheAge(event) {
    let menarcheAge = event.target.value;
    if (menarcheAge > 0) {
      if (menarcheAge <= this.patientAge) {
        if (menarcheAge < 8 || menarcheAge > 20) {
          this.confirmationService.alert(this.currentLanguageSet.alerts.info.recheckValue);
        }
      } else {
        this.cancerPatientObstetricHistoryForm.patchValue({ menarche_Age: null });
        this.confirmationService.alert(this.currentLanguageSet.alerts.info.menarchAge);
      }
    } else {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.invalidAge);
      this.cancerPatientObstetricHistoryForm.patchValue({ menarche_Age: null });
    }
  }

  checkMenopauseAge(event) {
    let menopauseAge = event.target.value;
    if (menopauseAge > 0) {
      if (menopauseAge <= this.patientAge) {
        if (menopauseAge < 50 || menopauseAge > 60) {
          this.cancerPatientObstetricHistoryForm.patchValue({ isPostMenopauseBleeding: null });
          this.confirmationService.alert(this.currentLanguageSet.alerts.info.recheckValue);
        }
      } else {
        this.cancerPatientObstetricHistoryForm.patchValue({ menopauseAge: null });
        this.cancerPatientObstetricHistoryForm.patchValue({ isPostMenopauseBleeding: null });
        this.confirmationService.alert(this.currentLanguageSet.alerts.info.menopauseAge);
      }
    } else {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.invalidAge);
      this.cancerPatientObstetricHistoryForm.patchValue({ menopauseAge: null });
      this.cancerPatientObstetricHistoryForm.patchValue({ isPostMenopauseBleeding: null });
    }
  }

  getPreviousCancerPastObstetricHistory() {
    let benRegID = localStorage.getItem('beneficiaryRegID');
    this.nurseService.getPreviousCancerPastObstetricHistory(benRegID)
      .subscribe(data => {
        if (data != null && data.data != null) {
          if (data.data.data.length > 0) {
            this.viewPreviousData(data.data);
          } else {
            this.confirmationService.alert(this.currentLanguageSet.alerts.previousHistoryDetailsAlert.prevHabitDiet);
          }
        } else {
          this.confirmationService.alert(data.errorMessage, 'error');
        }
      }, err => {
        this.confirmationService.alert(err, 'error');
      })
  }

  viewPreviousData(data) {
    this.dialog.open(PreviousDetailsComponent, {
      data: { 'dataList': data, title: this.currentLanguageSet.historyData.familyhistory.previousfamilyhistory }
    });
  }

  get pregnant_No() {
    return this.cancerPatientObstetricHistoryForm.controls['pregnant_No'].value;
  }

  get pregnancyStatus() {
    return this.cancerPatientObstetricHistoryForm.controls['pregnancyStatus'].value;
  }

  get menopauseAge() {
    return this.cancerPatientObstetricHistoryForm.controls['menopauseAge'].value;
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
