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


import { Component, OnInit, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { DoctorService } from '../../shared/services';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'patient-adherence',
  templateUrl: './adherence.component.html',
  styleUrls: ['./adherence.component.css']
})
export class AdherenceComponent implements OnInit {
  @Input('patientAdherenceForm')
  patientAdherenceForm: FormGroup;

  @Input('mode')
  mode: string;

  adherenceProgressData = ["Improved", "Unchanged", "Worsened"];
  currentLanguageSet: any;

  constructor(
    private fb: FormBuilder,
    public httpServiceService: HttpServiceService,
    private doctorService: DoctorService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  ngOnChanges() {
    if (this.mode == 'view') {
      let visitID = localStorage.getItem('visitID');
      let benRegID = localStorage.getItem('beneficiaryRegID')
      this.getAdherenceDetails(benRegID, visitID);
    }
    if(parseInt(localStorage.getItem("specialistFlag")) == 100)
    {
       let visitID = localStorage.getItem('visitID');
      let benRegID = localStorage.getItem('beneficiaryRegID')
      this.getAdherenceDetails(benRegID, visitID);
    }
  }

  getAdherenceDetails(beneficiaryRegID, visitID) {
    this.doctorService.getVisitComplaintDetails(beneficiaryRegID, visitID)
      .subscribe(value => {
        if (value != null && value.statusCode == 200 && value.data != null && value.data.BenAdherence != null)
          this.patientAdherenceForm.patchValue(value.data.BenAdherence);
      });
  }
 

  checkReferralDescription(toReferral) {
    if (toReferral) {
      this.patientAdherenceForm.patchValue({ 'referralReason': null });
    }
  }

  checkDrugsDescription(toDrugs) {
    if (toDrugs) {
      this.patientAdherenceForm.patchValue({ 'drugReason': null });
    }
  }

  get drugReason() {
    return this.patientAdherenceForm.controls['drugReason'].value;
  }

  get referralReason() {
    return this.patientAdherenceForm.controls['referralReason'].value;
  }

  get toDrugs() {
    return this.patientAdherenceForm.controls['toDrugs'].value;
  }

  get toReferral() {
    return this.patientAdherenceForm.controls['toReferral'].value;
  }

}
