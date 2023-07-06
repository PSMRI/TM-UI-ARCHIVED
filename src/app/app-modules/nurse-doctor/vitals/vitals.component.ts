import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'nurse-vitals',
  templateUrl: './vitals.component.html',
  styleUrls: ['./vitals.component.css']
})
export class VitalsComponent implements OnInit {
  @Input('patientVitalsForm')
  patientVitalsForm: FormGroup;

  @Input('visitCategory')
  visitCategory: string;

  @Input('vitalsMode')
  mode: String;

  @Input('pregnancyStatus')
  pregnancyStatus: string;

  showGeneralOPD = false;
  showCancer = false;

  constructor(
    private fb: FormBuilder ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.visitCategory) {
      this.showCancer = this.visitCategory == 'Cancer Screening' ? true : false;
      this.showGeneralOPD = this.visitCategory != 'Cancer Screening' ? true : false;    
    }
  }
}
