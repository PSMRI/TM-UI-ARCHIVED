import { Component, OnInit, Input, OnChanges, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { BeneficiaryDetailsService } from '../../../core/services/beneficiary-details.service';

import { ConfirmationService } from '../../../core/services/confirmation.service';
import { DoctorService } from '../../shared/services/doctor.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'nurse-cancer-history',
  templateUrl: './cancer-history.component.html',
  styleUrls: ['./cancer-history.component.css']
})
export class CancerHistoryComponent implements OnInit, DoCheck {
  @Input('patientHistoryForm')
  nurseCancerHistoryForm: FormGroup;

  @Input('mode')
  mode: String;

  @Input('pregnancyStatus')
  pregnancyStatus: string;

  templateBeneficiaryDetails: any;
  familyHistoryData: any;
  currentLanguageSet: any;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private confirmationService: ConfirmationService,
    public httpServiceService: HttpServiceService,
    private beneficiaryDetailsService: BeneficiaryDetailsService) { }

  ngOnInit() {
    this.getBenificiaryDetails();
    this.assignSelectedLanguage();
  }

  ngOnChanges(changes) {
    if (this.mode == 'view') {
      let visitID = localStorage.getItem('visitID');
      let benRegID = localStorage.getItem('beneficiaryRegID')
      this.getCancerHistory(benRegID, visitID);
    }
    if(parseInt(localStorage.getItem("specialistFlag")) == 100)
    {
       let visitID = localStorage.getItem('visitID');
      let benRegID = localStorage.getItem('beneficiaryRegID')
      this.getCancerHistory(benRegID, visitID);
    }

    if (this.mode == 'update')
      this.updatePateintHistory(this.nurseCancerHistoryForm);
  }

  updatePateintHistory(cancerHistoryForm) {
    let vanID = JSON.parse(localStorage.getItem('serviceLineDetails')).vanID;
    let parkingPlaceID = JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID
    let updateDetails = {
      beneficiaryRegID: localStorage.getItem('beneficiaryRegID'),
      benVisitID: localStorage.getItem('visitID'),
      providerServiceMapID: localStorage.getItem('providerServiceID'),
      modifiedBy:localStorage.getItem('userName'),
      beneficiaryID: localStorage.getItem('beneficiaryID'), sessionID: localStorage.getItem('sessionID'),
      parkingPlaceID: parkingPlaceID, vanID: vanID,
      benFlowID: localStorage.getItem('benFlowID'),
      visitCode: localStorage.getItem('visitCode')
    }

    this.doctorService.updateCancerHistoryDetails(cancerHistoryForm, updateDetails)
      .subscribe((res: any) => {
        if (res.statusCode == 200 && res.data != null) {
          this.confirmationService.alert(res.data.response, 'success');
          this.nurseCancerHistoryForm.markAsPristine();
        } else {
          this.confirmationService.alert(res.errorMessage, 'error');
        }
      }, err => {
        this.confirmationService.alert(err, 'error');
      })
  }

  cancerHistorySubscription: any;
  getCancerHistory(benRegID, visitID) {
    this.cancerHistorySubscription = this.doctorService.getCancerHistoryDetails(benRegID, visitID).subscribe(history => {
      if (history != null && history.statusCode == 200 && history.data != null) {
        let cancerHistoryData = history.data;

        let cancerPatientPerosnalHistoryData = Object.assign({}, cancerHistoryData.benPersonalHistory, cancerHistoryData.benPersonalDietHistory);
        (<FormGroup>this.nurseCancerHistoryForm.controls['cancerPatientPerosnalHistoryForm']).patchValue(cancerPatientPerosnalHistoryData);

        this.familyHistoryData = cancerHistoryData.benFamilyHistory;

        let cancerPatientObstetricHistoryForm = Object.assign({}, cancerHistoryData.benObstetricHistory);
        (<FormGroup>this.nurseCancerHistoryForm.controls['cancerPatientObstetricHistoryForm']).patchValue(cancerPatientObstetricHistoryForm);
      }
    })
  }

  beneficiaryDetailsSubscription: any;
  getBenificiaryDetails() {
    this.beneficiaryDetailsSubscription = this.beneficiaryDetailsService.beneficiaryDetails$
      .subscribe(beneficiaryDetails => {
        if (beneficiaryDetails)
          this.templateBeneficiaryDetails = beneficiaryDetails;
      })
  }

  ngOnDestroy() {
    if (this.beneficiaryDetailsSubscription)
      this.beneficiaryDetailsSubscription.unsubscribe();

    if (this.cancerHistorySubscription)
      this.cancerHistorySubscription.unsubscribe();
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
