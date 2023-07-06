import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MasterdataService, NurseService, DoctorService } from '../../../shared/services';
import { GeneralOpdDiagnosisComponent } from './general-opd-diagnosis/general-opd-diagnosis.component';
import { AncDiagnosisComponent } from './anc-diagnosis/anc-diagnosis.component';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
@Component({
  selector: 'app-diagnosis',
  templateUrl: './diagnosis.component.html',
  styleUrls: ['./diagnosis.component.css']
})
export class DiagnosisComponent implements OnInit {

  @Input('generalDiagnosisForm')
  generalDiagnosisForm: FormGroup;

  @Input('visitCategory')
  visitCategory: string;

  @Input('caseRecordMode')
  caseRecordMode: string;
  current_language_set: any;

  constructor(
    private fb: FormBuilder,
    public httpServiceService: HttpServiceService,
    private nurseService: NurseService,
    private doctorService: DoctorService,
    private masterdataService: MasterdataService) { }

  ngOnInit() {
    
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
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
  }

}

