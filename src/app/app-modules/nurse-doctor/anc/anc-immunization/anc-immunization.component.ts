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


import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BeneficiaryDetailsService } from '../../../core/services/beneficiary-details.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'nurse-anc-immunization',
  templateUrl: './anc-immunization.component.html',
  styleUrls: ['./anc-immunization.component.css']
})
export class AncImmunizationComponent implements OnInit {

  selectImmunizationStatus = ["NA", "Not Received", "Received"];

  @Input('patientANCImmunizationForm')
  patientANCImmunizationForm: FormGroup;

  @Input('gravidaStatus')
  gravidaStatus: any;

  @Input('mode')
  mode: String;

  enableTTStatus_1_2_b = false;
  enableTTStatus_1_2 = false;
  today: Date;
  dob: Date;
  beneficiaryAge;
  current_language_set: any;
  constructor(
    private fb: FormBuilder,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    public httpServiceService: HttpServiceService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
    this.getBenificiaryDetails();
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }


  ngOnChanges(changes) {

    this.checkStatus();

    if (this.mode != 'view' && this.mode != 'update' && parseInt(sessionStorage.getItem("specialistFlag")) != 100) {
      this.nullifyTTStatus()
    }
  }

  nullifyTTStatus() {
    this.patientANCImmunizationForm.reset({
      vanID:JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID :JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID
    });
  }

  checkStatus() {
    this.enableTTStatus_1_2_b = false;
    this.enableTTStatus_1_2 = false
    if (this.gravidaStatus != null && this.gravidaStatus != undefined) {
      if (!this.gravidaStatus) {
        this.enableTTStatus_1_2_b = true;
      }
      if (this.gravidaStatus) {
        this.enableTTStatus_1_2 = true;
      }
    }
  }

  ngOnDestroy() {
    if (this.beneficiaryDetailsSubscription)
      this.beneficiaryDetailsSubscription.unsubscribe();
  }

  beneficiaryDetailsSubscription: any;
  getBenificiaryDetails() {
    this.beneficiaryDetailsSubscription = this.beneficiaryDetailsService.beneficiaryDetails$
      .subscribe(beneficiaryDetails => {
        if (beneficiaryDetails) {
          this.beneficiaryAge = beneficiaryDetails.ageVal;
          this.checkDate();
        }
      })
  }

  checkDate() {
    this.today = new Date();
    this.dob = new Date();
    this.dob.setFullYear(this.today.getFullYear() - this.beneficiaryAge);
    console.log('this.dob', this.dob, 'this.today', this.today);
  }

  checkedTT_1Status = false;
  checkedTT_2Status = false;
  checkedTT_3Status = false;
  checkTT_1Status(tT_1Status) {
    this.checkedTT_1Status = false;
    this.patientANCImmunizationForm.patchValue({ dateReceivedForTT_1: null });
    this.patientANCImmunizationForm.patchValue({ facilityNameOfTT_1: null });
    this.patientANCImmunizationForm.patchValue({ tT_2Status: null });
    this.patientANCImmunizationForm.patchValue({ dateReceivedForTT_2: null });
    this.patientANCImmunizationForm.patchValue({ facilityNameOfTT_2: null });
    this.patientANCImmunizationForm.patchValue({ tT_3Status: null });
    this.patientANCImmunizationForm.patchValue({ dateReceivedForTT_3: null });
    this.patientANCImmunizationForm.patchValue({ facilityNameOfTT_3: null });
  }

  get tT_1Status() {
    return this.patientANCImmunizationForm.controls['tT_1Status'].value;
  }

  tT_1Date: any;
  checkTT_2Status(tT_2Status) {
    this.checkedTT_2Status = false;
    this.patientANCImmunizationForm.patchValue({ dateReceivedForTT_2: null });
    this.patientANCImmunizationForm.patchValue({ facilityNameOfTT_2: null });
    this.patientANCImmunizationForm.patchValue({ tT_3Status: null });
    this.patientANCImmunizationForm.patchValue({ dateReceivedForTT_3: null });
    this.patientANCImmunizationForm.patchValue({ facilityNameOfTT_3: null });
    if (tT_2Status == 'Received') {
      if (this.dateReceivedForTT_1 == null) {
        this.tT_1Date = this.dob;
      } else {
        this.tT_1Date = this.dateReceivedForTT_1;
      }
    }
  }

  get tT_2Status() {
    return this.patientANCImmunizationForm.controls['tT_2Status'].value;
  }

  checkTT_1Date(dateReceivedForTT_1) {
    this.patientANCImmunizationForm.patchValue({ facilityNameOfTT_1: null });
    this.patientANCImmunizationForm.patchValue({ tT_2Status: null });
    this.patientANCImmunizationForm.patchValue({ dateReceivedForTT_2: null });
    this.patientANCImmunizationForm.patchValue({ facilityNameOfTT_2: null });
    this.patientANCImmunizationForm.patchValue({ tT_3Status: null });
    this.patientANCImmunizationForm.patchValue({ dateReceivedForTT_3: null });
    this.patientANCImmunizationForm.patchValue({ facilityNameOfTT_3: null });
  }

  get dateReceivedForTT_1() {
    return this.patientANCImmunizationForm.controls['dateReceivedForTT_1'].value;
  }

  checkTT_2Date(dateReceivedForTT_2) {
    this.patientANCImmunizationForm.patchValue({ facilityNameOfTT_2: null });
    this.patientANCImmunizationForm.patchValue({ tT_3Status: null });
    this.patientANCImmunizationForm.patchValue({ dateReceivedForTT_3: null });
    this.patientANCImmunizationForm.patchValue({ facilityNameOfTT_3: null });
  }
  get dateReceivedForTT_2() {
    return this.patientANCImmunizationForm.controls['dateReceivedForTT_2'].value;
  }

  tT_3Date: any;
  checkTT_3Status(tT_3Status) {
    this.checkedTT_3Status = false;
    this.patientANCImmunizationForm.patchValue({ dateReceivedForTT_3: null });
    this.patientANCImmunizationForm.patchValue({ facilityNameOfTT_3: null });
    if (tT_3Status == 'Received') {
      if (this.tT_2Status == 'Received' && this.dateReceivedForTT_2 != null) {
        this.tT_3Date = this.dateReceivedForTT_2;
      } else {
        if (this.tT_1Status == 'Received' && this.dateReceivedForTT_1 != null) {
          this.tT_3Date = this.dateReceivedForTT_1;
        } else {
          this.tT_3Date = this.dob;
        }
      }
    }
  }

  get tT_3Status() {
    return this.patientANCImmunizationForm.controls['tT_3Status'].value;
  }
}
