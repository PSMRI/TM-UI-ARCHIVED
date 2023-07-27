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


import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BeneficiaryDetailsService } from '../../../core/services/beneficiary-details.service'
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { DoctorService } from '../../shared/services';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'nurse-general-opd-history',
  templateUrl: './general-opd-history.component.html',
  styleUrls: ['./general-opd-history.component.css']
})
export class GeneralOpdHistoryComponent implements OnInit, DoCheck {

  @Input('patientHistoryForm')
  patientHistoryForm: FormGroup;

  @Input('mode')
  mode: any;

  @Input('visitCategory')
  visitCategory: any;

  @Input('primeGravidaStatus')
  primiGravida: any;

  @Input('pregnancyStatus')
  pregnancyStatus: any;

  beneficiary: any;
  showObstetricHistory = false;
  currentLanguageSet: any;

  constructor(
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private doctorService: DoctorService,
    public httpServiceService: HttpServiceService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.getBeneficiaryDetails();
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.currentLanguageSet = response);
    console.log("visit",this.visitCategory);
    
  }

  

  ngOnChanges(changes) {
    if (changes.mode && this.mode == 'update') {
      let visitCategory = localStorage.getItem('visitCategory');
      if(visitCategory == "NCD screening"){
        this.updatePatientNCDScreeningHistory(this.patientHistoryForm);
      }else{
        this.updatePatientGeneralHistory(this.patientHistoryForm);
      }
    }

    if (changes.pregnancyStatus) {
      this.canShowObstetricHistory();
    }

    if (changes.primiGravida) {
      this.canShowObstetricHistory();
    }
  }

  ngOnDestroy() {
    if (this.beneficiaryDetailsSubscription)
      this.beneficiaryDetailsSubscription.unsubscribe();
  }

  updatePatientGeneralHistory(generalOPDHistory) {
    let vanID = JSON.parse(localStorage.getItem('serviceLineDetails')).vanID;
    let parkingPlaceID = JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID
    let temp = {
      beneficiaryRegID: localStorage.getItem('beneficiaryRegID'),
      benVisitID: localStorage.getItem('visitID'),
      providerServiceMapID: localStorage.getItem('providerServiceID'),
      createdBy: localStorage.getItem('userName'),
      modifiedBy: localStorage.getItem('userName'),
      beneficiaryID: localStorage.getItem('beneficiaryID'), sessionID: localStorage.getItem('sessionID'),
      parkingPlaceID: parkingPlaceID, vanID: vanID,
      benFlowID: localStorage.getItem('benFlowID'),
      visitCode: localStorage.getItem('visitCode')
    }

    this.doctorService.updateGeneralHistory(generalOPDHistory, temp, this.beneficiary.ageVal)
      .subscribe((res: any) => {
        if (res.statusCode == 200 && res.data != null) {
          if(localStorage.getItem('visitCategory') == 'ANC')
          {
            this.getHRPDetails();
          }
          this.confirmationService.alert(res.data.response, 'success');
          this.patientHistoryForm.markAsPristine();
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

  beneficiaryDetailsSubscription: any;
  getBeneficiaryDetails() {
    this.beneficiaryDetailsSubscription = this.beneficiaryDetailsService.beneficiaryDetails$.subscribe(beneficiary => {
      if (beneficiary) {
        this.beneficiary = beneficiary;
        this.canShowObstetricHistory();
      }
    })
  }

  canShowObstetricHistory() {
    if (this.primiGravida)
      this.showObstetricHistory = false;
    else if (this.beneficiary && this.beneficiary.genderName == "Male")
      this.showObstetricHistory = false;
    else if (this.beneficiary && this.beneficiary.genderName != "Male" && this.beneficiary.ageVal < 12)
      this.showObstetricHistory = false;
    else if (this.beneficiary && this.beneficiary.genderName != "Male" && this.beneficiary.ageVal >= 12)
      this.showObstetricHistory = true;
    else if (this.visitCategory == 'PNC')
      this.showObstetricHistory = true;
    else if (!this.primiGravida)
      this.showObstetricHistory = true;
  }
  updatePatientNCDScreeningHistory(NCDScreeningHistory) {
    let vanID = JSON.parse(localStorage.getItem('serviceLineDetails')).vanID;
    let parkingPlaceID = JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID
    let temp = {
      beneficiaryRegID: localStorage.getItem('beneficiaryRegID'),
      benVisitID: localStorage.getItem('visitID'),
      providerServiceMapID: localStorage.getItem('providerServiceID'),
      createdBy: localStorage.getItem('userName'),
      modifiedBy: localStorage.getItem('userName'),
      beneficiaryID: localStorage.getItem('beneficiaryID'), sessionID: localStorage.getItem('sessionID'),
      parkingPlaceID: parkingPlaceID, vanID: vanID,
      benFlowID: localStorage.getItem('benFlowID'),
      visitCode: localStorage.getItem('visitCode')
    }

    this.doctorService.updateNCDScreeningHistory(NCDScreeningHistory, temp, this.beneficiary.ageVal)
      .subscribe((res: any) => {
        if (res.statusCode == 200 && res.data != null) {
          this.confirmationService.alert(res.data.response, 'success');
          this.patientHistoryForm.markAsPristine();
        } else {
          this.confirmationService.alert(res.errorMessage, 'error');
        }
      }, err => {
        this.confirmationService.alert(err, 'error');
      })
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
