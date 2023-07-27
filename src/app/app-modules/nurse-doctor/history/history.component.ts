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


import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DoctorService } from '../shared/services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'nurse-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  @Input('patientHistoryForm')
  patientHistoryForm: FormGroup

  @Input('visitCategory')
  visitCategory : string;

  @Input('historyMode')
  mode: String;

  @Input('pregnancyStatus')
  pregnancyStatus: string;

  @Input('primeGravidaStatus')
  primeGravidaStatus: any;

  showGeneralOPD = false;
  showCancer = false;
  attendant: any;
  
  constructor(
    private doctorService: DoctorService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    this.attendant = this.route.snapshot.params["attendant"];
    this.doctorService.setCapturedHistoryByNurse(null);
    if (this.attendant != "nurse") this.generalHistory();

  }

  ngOnChanges() {

    if (this.visitCategory) {
      this.showGeneralOPD =
        this.visitCategory == "General OPD" ||
        this.visitCategory == "ANC" ||
        this.visitCategory == "NCD care" ||
        this.visitCategory == "PNC" ||
        this.visitCategory == "COVID-19 Screening" ||
        this.visitCategory == "NCD screening"
          ? true
          : false;
    }

  }

  generalHistory() {
    let visitID = localStorage.getItem("visitID");
    let benRegID = localStorage.getItem("beneficiaryRegID");
    this.doctorService
      .getGeneralHistoryDetails(benRegID, visitID)
      .subscribe((historyresponse) => {
        if (historyresponse.statusCode == 200 && historyresponse !== undefined) {
          this.doctorService.setCapturedHistoryByNurse(historyresponse);
        }

      });

  }

}
