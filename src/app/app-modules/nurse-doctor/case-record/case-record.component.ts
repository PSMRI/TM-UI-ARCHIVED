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

import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-case-record',
  templateUrl: './case-record.component.html',
  styleUrls: ['./case-record.component.css']
})
export class CaseRecordComponent implements OnInit {

  @Input('patientCaseRecordForm')
  patientCaseRecordForm: FormGroup

  @Input('visitCategory')
  visitCategory : string;

  @Input('caseRecordMode')
  caseRecordMode: String;

  @Input('findings')
  findings: any;

  @Input('currentVitals')
  currentVitals: any;
  
  @Input('pregnancyStatus')
  pregnancyStatus: any;
  
  showGeneralOPD: boolean = false;
  showCancer: boolean = false;
  
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
      if (this.visitCategory) {
        this.showGeneralOPD = this.visitCategory == 'General OPD' || this.visitCategory == 'ANC' || this.visitCategory == 'NCD care' || this.visitCategory == 'PNC' || this.visitCategory == 'COVID-19 Screening' || this.visitCategory == 'NCD screening' ? true : false;
        this.showCancer = this.visitCategory == 'Cancer Screening' ? true : false;
      }
  }

  ngOnChanges() {
  }

}
