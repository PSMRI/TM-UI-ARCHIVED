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
