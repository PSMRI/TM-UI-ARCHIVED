import { Component, OnInit, Input } from '@angular/core';
import { GeneralUtils } from '../../../shared/utility/general-utility';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'nurse-systemic-examination',
  templateUrl: './systemic-examination.component.html',
  styleUrls: ['./systemic-examination.component.css']
})
export class SystemicExaminationComponent implements OnInit {

  generalUtils = new GeneralUtils(this.fb);

  @Input('systemicExaminationForm')
  systemicExaminationForm: FormGroup;

  @Input('visitCategory')
  visitCategory: string;

  displayANC: Boolean;
  displayGeneral: Boolean;
  current_language_set: any;
  constructor(private fb: FormBuilder,public httpServiceService: HttpServiceService ) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
    this.displayANC = false;
    this.displayGeneral = false;

    if (this.visitCategory == 'ANC') {
      this.systemicExaminationForm.addControl('obstetricExaminationForANCForm', this.generalUtils.createObstetricExaminationForANCForm());
      this.displayANC = true;
    } else if (this.visitCategory == 'General OPD' || this.visitCategory == 'PNC') {
      this.displayGeneral = true;
    }
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }

  ngOnChanges() {
    this.displayANC = this.visitCategory == 'ANC' ? true : false;
    if (this.displayANC) {
      this.systemicExaminationForm.addControl('obstetricExaminationForANCForm', this.generalUtils.createObstetricExaminationForANCForm());
    } else if (!this.displayANC) {
      this.systemicExaminationForm.removeControl('obstetricExaminationForANCForm');
      if (this.visitCategory == 'General OPD' || this.visitCategory == 'PNC') {
        this.displayGeneral = true;
      }
    }
  }

}
