import { Component, OnInit, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DoctorService } from '../shared/services';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { BeneficiaryDetailsService } from 'app/app-modules/core/services';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'nurse-anc',
  templateUrl: './anc.component.html',
  styleUrls: ['./anc.component.css']
})
export class AncComponent implements OnInit {

  @Input('patientANCForm')
  patientANCForm: FormGroup;

  @Input('mode')
  mode: String;

  gravidaStatus: boolean;
  current_language_set: any;
  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private confirmationService: ConfirmationService,
    public httpServiceService: HttpServiceService,
    public beneficiaryDetailsService: BeneficiaryDetailsService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
    (<FormGroup>this.patientANCForm.controls['patientANCDetailsForm']).controls['primiGravida'].valueChanges
      .subscribe((gravidaData) => {
        this.gravidaStatus = gravidaData;
      });
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
    if (this.mode == 'view') {
      let visitID = localStorage.getItem('visitID');
      let benRegID = localStorage.getItem('beneficiaryRegID')
      this.patchDataToFields(benRegID, visitID);
    }
    if(parseInt(localStorage.getItem("specialistFlag")) == 100)
    {
       let visitID = localStorage.getItem('visitID');
      let benRegID = localStorage.getItem('beneficiaryRegID')
      this.patchDataToFields(benRegID, visitID);
    }
    if (this.mode == 'update') {
      this.updatePatientANC(this.patientANCForm);
    }
  }

  ngOnDestroy() {
    if (this.ancCareDetails)
      this.ancCareDetails.unsubscribe();
    if (this.updateANCDetailsSubs)
      this.updateANCDetailsSubs.unsubscribe();
  }

  updateANCDetailsSubs: any;
  updatePatientANC(patientANCForm) {
    let vanID = JSON.parse(localStorage.getItem('serviceLineDetails')).vanID;
    let parkingPlaceID = JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID

    let temp = {
      beneficiaryRegID: localStorage.getItem('beneficiaryRegID'),
      benVisitID: localStorage.getItem('visitID'),
      beneficiaryID: localStorage.getItem('beneficiaryID'),
      sessionID: localStorage.getItem('sessionID'),
      modifiedBy: localStorage.getItem('userName'),
      providerServiceMapID: localStorage.getItem('providerServiceID'),
      parkingPlaceID: parkingPlaceID,
      vanID: vanID,
      benFlowID: localStorage.getItem('benFlowID'),
      visitCode: localStorage.getItem('visitCode')
    }

    this.updateANCDetailsSubs = this.doctorService.updateANCDetails(patientANCForm, temp)
      .subscribe((res: any) => {
        if (res.statusCode == 200 && res.data != null) {
          this.getHRPDetails();
          this.confirmationService.alert(res.data.response, 'success');
          this.patientANCForm.markAsPristine();
        } else {
          this.confirmationService.alert(res.errorMessage, 'error');
        }
      }, err => {
        this.confirmationService.alert(err, 'error');
      })
  }

  getHRPDetails()
  {
    let beneficiaryRegID = localStorage.getItem("beneficiaryRegID");
    let visitCode = localStorage.getItem('visitCode');
  this.doctorService
    .getHRPDetails(beneficiaryRegID,visitCode)
    .subscribe(res => {
      if (res && res.statusCode == 200 && res.data) {
        if(res.data.isHRP == true)
        {
          this.beneficiaryDetailsService.setHRPPositive();
        }
        else
        {
          this.beneficiaryDetailsService.resetHRPPositive();
        }
      }
    });
  }

  ancCareDetails: any
  patchDataToFields(benRegID, visitID) {
    this.ancCareDetails = this.doctorService.getAncCareDetails(benRegID, visitID)
      .subscribe((ancCareData) => {
        if (ancCareData != null && ancCareData != undefined && ancCareData.statusCode == 200 && ancCareData.data != null) {
          let temp = ancCareData.data.ANCCareDetail;
          if (temp) {
            let ancDetails = Object.assign({}, temp, { expDelDt: new Date(temp.expDelDt), lmpDate: new Date(temp.lmpDate) });
            (<FormGroup>this.patientANCForm.controls['patientANCDetailsForm']).patchValue(ancDetails);
            this.gravidaStatus = ancDetails.primiGravida;
            (<FormGroup>this.patientANCForm.controls['obstetricFormulaForm']).patchValue(ancDetails);

            if (temp.bloodGroup && temp.bloodGroup != "Don't Know")
              (<FormGroup>this.patientANCForm.controls['obstetricFormulaForm']).controls['bloodGroup'].disable();
          }
          if(parseInt(localStorage.getItem("specialistFlag")) == 100)
          {
            (<FormGroup>this.patientANCForm.controls['obstetricFormulaForm']).controls['bloodGroup'].enable();
          }    

          let temp2 = ancCareData.data.ANCWomenVaccineDetails;
          if (temp2) {
            let ancImmunizationDetails = Object.assign({}, temp2, {
              dateReceivedForTT_1: new Date(temp2.dateReceivedForTT_1),
              dateReceivedForTT_2: new Date(temp2.dateReceivedForTT_2),
              dateReceivedForTT_3: new Date(temp2.dateReceivedForTT_3)
            });
            (<FormGroup>this.patientANCForm.controls['patientANCImmunizationForm']).patchValue(ancImmunizationDetails);
          }
        } else {
          this.confirmationService.alert(ancCareData.errorMessage, 'error');
        }
      }, err => {
        this.confirmationService.alert(err, 'error');
      })
  }

}
