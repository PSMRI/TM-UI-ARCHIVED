import { Component, OnInit, Input } from '@angular/core';

import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-refer',
  templateUrl: './refer.component.html',
  styleUrls: ['./refer.component.css']
})
export class ReferComponent implements OnInit {

  @Input('patientReferForm')
  patientReferForm: FormGroup

  @Input('referMode')
  referMode: String;

  @Input('visitCategory')
  visitCategory : string;

  showGeneralOPD: boolean = false;
  showCancer: boolean = false;
  
  constructor() { }

  ngOnInit() {
    if (this.visitCategory) {
      this.showGeneralOPD = this.visitCategory == 'General OPD' || this.visitCategory == 'ANC' || this.visitCategory == 'NCD care'  || this.visitCategory == 'PNC' || this.visitCategory == 'COVID-19 Screening' || this.visitCategory == 'NCD screening' ? true : false;
      this.showCancer = this.visitCategory == 'Cancer Screening' ? true : false;
    }
  }

}
