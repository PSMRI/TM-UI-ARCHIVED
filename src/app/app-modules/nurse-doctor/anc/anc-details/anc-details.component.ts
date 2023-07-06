import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BeneficiaryDetailsService } from '../../../core/services/beneficiary-details.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { NurseService } from '../../shared/services';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'nurse-anc-details',
  templateUrl: './anc-details.component.html',
  styleUrls: ['./anc-details.component.css']
})
export class AncDetailsComponent implements OnInit {

  @Input('patientANCDetailsForm')
  patientANCDetailsForm: FormGroup;

  today: Date;
  dob: Date;
  beneficiaryAge;
  current_language_set: any;
  constructor(
    private fb: FormBuilder,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private confirmationService: ConfirmationService,
    public httpServiceService: HttpServiceService,
    private nurseService: NurseService,) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    //this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
    this.getBenificiaryDetails();
    this.today = new Date();
    this.dob = new Date();
    this.dob.setMonth(this.today.getMonth() - 10);
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }

  ngOnDestroy() {
    if (this.beneficiaryDetailsSubscription)
      this.beneficiaryDetailsSubscription.unsubscribe();
  }

  ngOnChanges() {
  }

  beneficiaryDetailsSubscription: any;
  getBenificiaryDetails() {
    this.beneficiaryDetailsSubscription = this.beneficiaryDetailsService.beneficiaryDetails$
      .subscribe(beneficiaryDetails => {
        if (beneficiaryDetails) {
          this.beneficiaryAge = beneficiaryDetails.ageVal;
        }
      })
  }

  checkGravidaStatus(primiGravida) {
    // this.patientANCDetailsForm.get('primiGravida');
  }

  checkupLMP(lmpDate) {
    let today = new Date();
    let checkdate = new Date();

    checkdate.setMonth(today.getMonth() - 10)

    if (lmpDate > checkdate && lmpDate < today) {
      this.patientANCDetailsForm.patchValue({ duration: null });
      this.calculateEDD(lmpDate);
      this.calculateGestationalAge(lmpDate);
      this.calculatePeriodOfPregnancy(lmpDate);
      this.nurseService.setLMPForFetosenseTest(lmpDate);
    }
    else {
      lmpDate = null;
      this.patientANCDetailsForm.patchValue({ lmpDate: lmpDate });
      this.confirmationService.alert(this.current_language_set.alerts.info.invalidVal);
      this.calculateEDD(lmpDate);
      this.calculateGestationalAge(lmpDate);
      this.calculatePeriodOfPregnancy(lmpDate);
      this.nurseService.clearLMPForFetosenseTest();
   
    }
    
    
  }

  calculatePeriodOfPregnancy(lmpDate) {
    this.patientANCDetailsForm.patchValue({ duration: null });
  }

  calculateGestationalAge(lastMP) {
    if (lastMP != null) {
      var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      var gestationalAge = Math.round(Math.abs(Math.round(Math.abs((this.today.getTime() - lastMP.getTime()) / (oneDay)))) / 7);
      this.patientANCDetailsForm.patchValue({ gestationalAgeOrPeriodofAmenorrhea_POA: gestationalAge });
      this.calculateTrimester(gestationalAge);
    }
    else {
      gestationalAge = null;
      this.patientANCDetailsForm.patchValue({ gestationalAgeOrPeriodofAmenorrhea_POA: gestationalAge });
      this.calculateTrimester(gestationalAge);
    }
  }

  calculateEDD(lastMP) {
    if (lastMP != null) {
      let edd = new Date(lastMP);
      edd.setDate(lastMP.getDate() + 280)
      this.patientANCDetailsForm.patchValue({ expDelDt: edd })
    } else {
      this.patientANCDetailsForm.patchValue({ expDelDt: null })
    }

  }

  calculateTrimester(trimesterWeeks) {
    if (trimesterWeeks != null) {
      if (trimesterWeeks >= 0 && trimesterWeeks <= 12) {
        this.patientANCDetailsForm.patchValue({ trimesterNumber: 1 });
      }
      if (trimesterWeeks >= 12 && trimesterWeeks <= 27) {
        this.patientANCDetailsForm.patchValue({ trimesterNumber: 2 });
      }
      if (trimesterWeeks >= 27) {
        this.patientANCDetailsForm.patchValue({ trimesterNumber: 3 });
      }
    } else {
      this.patientANCDetailsForm.patchValue({ trimesterNumber: null });
    }
  }

  checkPeriodOfPregnancy(periodOfPregnancy) {
    if (periodOfPregnancy > 9) {
      this.patientANCDetailsForm.patchValue({ duration: null });
      this.confirmationService.alert(this.current_language_set.alerts.info.invalidValue);
    } else if (periodOfPregnancy < 1) {
      this.patientANCDetailsForm.patchValue({ duration: null });
      this.confirmationService.alert(this.current_language_set.common.invalidValueMorethan);
    }
  }

  get primiGravida() {
    return this.patientANCDetailsForm.controls['primiGravida'].value;
  }

  get lmpDate() {
    return this.patientANCDetailsForm.controls['lmpDate'].value;
  }

  get gestationalAgeOrPeriodofAmenorrhea_POA() {
    return this.patientANCDetailsForm.controls['gestationalAgeOrPeriodofAmenorrhea_POA'].value;
  }

  get duration() {
    return this.patientANCDetailsForm.controls['duration'].value;
  }

}
