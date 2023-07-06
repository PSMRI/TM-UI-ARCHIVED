import { Component, OnInit, Input } from '@angular/core';
import { BeneficiaryDetailsService } from '../../../../../core/services/beneficiary-details.service';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { DoctorService } from '../../../../shared/services';
import { GeneralUtils } from '../../../../shared/utility';
import { ConfirmationService } from './../../../../../core/services/confirmation.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'app-pnc-diagnosis',
  templateUrl: './pnc-diagnosis.component.html',
  styleUrls: ['./pnc-diagnosis.component.css']
})
export class PncDiagnosisComponent implements OnInit {
  utils = new GeneralUtils(this.fb);
  @Input('generalDiagnosisForm')
  generalDiagnosisForm: FormGroup;

  @Input('caseRecordMode')
  caseRecordMode: string;
  current_language_set: any;
  designation : any;
  specialist : boolean;

  constructor(
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private doctorService: DoctorService,
    public httpServiceService: HttpServiceService
) { }

  beneficiaryAge: any;
  dob: Date;
  today: Date;
  minimumDeathDate: Date;

  ngOnInit() {
    this.getBenificiaryDetails();
    this.today = new Date();
    this.dob = new Date();
    this.minimumDeathDate = new Date(this.today.getTime() - (365 * 24 * 60 * 60 * 1000));
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
    this.designation = localStorage.getItem("designation");
    if (this.designation == "TC Specialist") {
      this.generalDiagnosisForm.controls['specialistDiagnosis'].enable();
      this.specialist = true;
    } else {
      this.generalDiagnosisForm.controls['specialistDiagnosis'].disable();
      this.specialist = false;
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

  ngOnDestroy() {
    if (this.beneficiaryDetailsSubscription)
      this.beneficiaryDetailsSubscription.unsubscribe();
  }

  ngOnChanges() {
    if (this.caseRecordMode == 'view') {
      let beneficiaryRegID = localStorage.getItem('beneficiaryRegID');
      let visitID = localStorage.getItem('visitID');
      let visitCategory = localStorage.getItem('visitCategory');
      if(localStorage.getItem("referredVisitCode") == "undefined" || localStorage.getItem("referredVisitCode") == null)
      {
      this.getDiagnosisDetails(beneficiaryRegID, visitID, visitCategory);
      }
      else
      if(parseInt(localStorage.getItem("specialist_flag")) == 3){
      this.getMMUDiagnosisDetails(beneficiaryRegID, visitID, visitCategory,localStorage.getItem("visitCode"));
      }
    else
    {
      this.getMMUDiagnosisDetails(beneficiaryRegID, localStorage.getItem("referredVisitID"), visitCategory,localStorage.getItem("referredVisitCode"));
    }
    }
  }

  beneficiaryDetailsSubscription: any;
  getBenificiaryDetails() {
    this.beneficiaryDetailsSubscription = this.beneficiaryDetailsService.beneficiaryDetails$
      .subscribe(beneficiaryDetails => {
        if (beneficiaryDetails) {
          this.beneficiaryAge = beneficiaryDetails.ageVal;
          this.dob.setFullYear(this.today.getFullYear() - this.beneficiaryAge);
        }
      })
  }

  addProvisionalDiagnosis() {
    let provisionalDiagnosisArrayList = this.generalDiagnosisForm.controls['provisionalDiagnosisList'] as FormArray;
    if (provisionalDiagnosisArrayList.length < 30) {
      provisionalDiagnosisArrayList.push(this.utils.initProvisionalDiagnosisList());
    } else {
      this.confirmationService.alert(this.current_language_set.alerts.info.maxDiagnosis);
    }
  }

  removeProvisionalDiagnosis(index, provisionalDiagnosisForm) {
    let provisionalDiagnosisArrayList = this.generalDiagnosisForm.controls['provisionalDiagnosisList'] as FormArray;
    if (provisionalDiagnosisArrayList.at(index).valid) {
      this.confirmationService.confirm(`warn`, this.current_language_set.alerts.info.warn).subscribe(result => {
        if (result) {
          if (provisionalDiagnosisArrayList.length > 1) {
            provisionalDiagnosisArrayList.removeAt(index);
          }
          else {
            provisionalDiagnosisForm.reset();
            provisionalDiagnosisForm.controls['viewProvisionalDiagnosisProvided'].enable();
          }
          this.generalDiagnosisForm.markAsDirty();
        }
      });
    } else {
      if (provisionalDiagnosisArrayList.length > 1) {
        provisionalDiagnosisArrayList.removeAt(index);
      }
      else {
        provisionalDiagnosisForm.reset();
        provisionalDiagnosisForm.controls['viewProvisionalDiagnosisProvided'].enable();
      }
    }
  }

  diagnosisSubscription: any;
  getDiagnosisDetails(beneficiaryRegID, visitID, visitCategory) {
    this.diagnosisSubscription = this.doctorService.getCaseRecordAndReferDetails(beneficiaryRegID, visitID, visitCategory)
      .subscribe(res => {
        if (res && res.statusCode == 200 && res.data && res.data.diagnosis) {
          this.patchDiagnosisDetails(res.data.diagnosis);
        }
      })
  }

  MMUdiagnosisSubscription:any;
  getMMUDiagnosisDetails(beneficiaryRegID, visitID, visitCategory,visitCode) {
    this.MMUdiagnosisSubscription = this.doctorService.getMMUCaseRecordAndReferDetails(beneficiaryRegID, visitID, visitCategory,visitCode)
    .subscribe(res => {
      if (res && res.statusCode == 200 && res.data && res.data.diagnosis) {
        this.generalDiagnosisForm.patchValue(res.data.diagnosis)
        if (res.data.diagnosis.provisionalDiagnosisList) {
          this.patchDiagnosisDetails(res.data.diagnosis.provisionalDiagnosisList);
        }
      }
    })

         
   
  }

  // MMUdiagnosisSubscription:any;
  // getMMUDiagnosisDetails(beneficiaryRegID, visitID, visitCategory) {
  //   this.diagnosisSubscription = this.doctorService.getMMUCaseRecordAndReferDetails(beneficiaryRegID, visitID, visitCategory,localStorage.getItem("visitCode"))
  //     .subscribe(res => {
  //       if (res && res.statusCode == 200 && res.data && res.data.diagnosis) {
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
  //     })
  // }

  patchDiagnosisDetails(diagnosis) {
    if (diagnosis.dateOfDeath)
      diagnosis.dateOfDeath = new Date(diagnosis.dateOfDeath);
    this.generalDiagnosisForm.patchValue(diagnosis);
    this.handleDiagnosisData(diagnosis);
  }
  handleDiagnosisData(diagnosis) {
    if (diagnosis.provisionalDiagnosisList && diagnosis.provisionalDiagnosisList.length > 0) {
      this.handleProvisionalDiagnosisData(diagnosis.provisionalDiagnosisList)
    }

    if (diagnosis.confirmatoryDiagnosisList && diagnosis.confirmatoryDiagnosisList.length > 0) {
      this.handleConfirmatoryDiagnosisData(diagnosis.confirmatoryDiagnosisList)
    }
  }
  handleProvisionalDiagnosisData(provisionalDiagnosisDataList) {
    let provisionalDiagnosisList = this.generalDiagnosisForm.controls['provisionalDiagnosisList'] as FormArray;
    for (let i = 0; i < provisionalDiagnosisDataList.length; i++) {
      provisionalDiagnosisList.at(i).patchValue({
        "viewProvisionalDiagnosisProvided": provisionalDiagnosisDataList[i].term,
        "term": provisionalDiagnosisDataList[i].term,
        "conceptID": provisionalDiagnosisDataList[i].conceptID
      });
      (<FormGroup>provisionalDiagnosisList.at(i)).controls['viewProvisionalDiagnosisProvided'].disable();
      if (provisionalDiagnosisList.length < provisionalDiagnosisDataList.length)
        this.addProvisionalDiagnosis();
    }
  }

  handleConfirmatoryDiagnosisData(confirmatoryDiagnosisDataList) {
    let confirmatoryDiagnosisList = this.generalDiagnosisForm.controls['confirmatoryDiagnosisList'] as FormArray;
    for (let i = 0; i < confirmatoryDiagnosisDataList.length; i++) {
      confirmatoryDiagnosisList.at(i).patchValue({
        "viewConfirmatoryDiagnosisProvided": confirmatoryDiagnosisDataList[i].term,
        "term": confirmatoryDiagnosisDataList[i].term,
        "conceptID": confirmatoryDiagnosisDataList[i].conceptID
      });
      (<FormGroup>confirmatoryDiagnosisList.at(i)).controls['viewConfirmatoryDiagnosisProvided'].disable();
      if (confirmatoryDiagnosisList.length < confirmatoryDiagnosisDataList.length)
        this.addConfirmatoryDiagnosis();
    }
  }

  checkWithDeathDetails() {
    this.generalDiagnosisForm.patchValue({
      placeOfDeath: null,
      dateOfDeath: null,
      causeOfDeath: null
    })
  }

  get isMaternalDeath() {
    return this.generalDiagnosisForm.controls['isMaternalDeath'].value;
  }
  addConfirmatoryDiagnosis() {
    let confirmatoryDiagnosisArrayList = this.generalDiagnosisForm.controls['confirmatoryDiagnosisList'] as FormArray;
    if (confirmatoryDiagnosisArrayList.length < 30) {
      confirmatoryDiagnosisArrayList.push(this.utils.initConfirmatoryDiagnosisList());
    } else {
      this.confirmationService.alert(this.current_language_set.alerts.info.maxDiagnosis);
    }
  }
  removeConfirmatoryDiagnosis(index, confirmatoryDiagnosisForm) {
    let confirmatoryDiagnosisFormArrayList = this.generalDiagnosisForm.controls['confirmatoryDiagnosisList'] as FormArray;
    if (confirmatoryDiagnosisFormArrayList.at(index).valid) {
      this.confirmationService.confirm(`warn`, this.current_language_set.alerts.info.warn).subscribe(result => {
        if (result) {
          if (confirmatoryDiagnosisFormArrayList.length > 1) {
            confirmatoryDiagnosisFormArrayList.removeAt(index);
          }
          else {
            confirmatoryDiagnosisForm.reset();
            confirmatoryDiagnosisForm.controls['viewConfirmatoryDiagnosisProvided'].enable();
          }
          this.generalDiagnosisForm.markAsDirty();
        }
      });
    } else {
      if (confirmatoryDiagnosisFormArrayList.length > 1) {
        confirmatoryDiagnosisFormArrayList.removeAt(index);
      }
      else {
        confirmatoryDiagnosisForm.reset();
        confirmatoryDiagnosisForm.controls['viewConfirmatoryDiagnosisProvided'].enable();
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

  checkConfirmatoryDiagnosisValidity(confirmatoryDiagnosis) {
    let temp = confirmatoryDiagnosis.value;
    if (temp.term && temp.conceptID) {
      return false;
    } else {
      return true;
    }
  }
}
