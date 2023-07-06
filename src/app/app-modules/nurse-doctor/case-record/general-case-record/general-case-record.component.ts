import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { MasterdataService } from '../../shared/services';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'app-general-case-record',
  templateUrl: './general-case-record.component.html',
  styleUrls: ['./general-case-record.component.css']
})
export class GeneralCaseRecordComponent implements OnInit {

  @Input('generalCaseRecordForm')
  generalCaseRecordForm: FormGroup

  @Input('currentVitals')
  currentVitals: any;

  @Input('caseRecordMode')
  caseRecordMode: string;

  @Input('visitCategory')
  visitCategory: string;

  @Input('findings')
  findings: any;
  current_language_set: any;

  constructor(
    private masterdataService: MasterdataService,
    public httpServiceService: HttpServiceService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(response => this.current_language_set = response);
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }
}
