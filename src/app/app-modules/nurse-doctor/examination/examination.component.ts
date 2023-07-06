import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'nurse-examination',
  templateUrl: './examination.component.html',
  styleUrls: ['./examination.component.css']
})
export class ExaminationComponent implements OnInit {

  @Input('visitCategory')
  visitCategory: string;

  @Input('patientExaminationForm')
  patientExaminationForm: FormGroup;

  @Input('examinationMode')
  examinationMode: String;

  showGeneralOPD = false;
  showCancer = false;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.visitCategory) {
      this.showGeneralOPD = this.visitCategory == 'General OPD' || this.visitCategory == 'ANC' || this.visitCategory == 'PNC' ? true : false;
      this.showCancer = this.visitCategory == 'Cancer Screening' ? true : false;
    }
  }

}

