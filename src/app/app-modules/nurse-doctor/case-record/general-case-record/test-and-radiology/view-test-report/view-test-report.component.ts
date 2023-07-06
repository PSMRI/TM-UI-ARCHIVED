import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'app-view-test-report',
  templateUrl: './view-test-report.component.html',
  styleUrls: ['./view-test-report.component.css']
})
export class ViewTestReportComponent implements OnInit {
  currentLanguageSet: any;

  constructor( @Inject(MD_DIALOG_DATA) public data: any,
  public httpServiceService: HttpServiceService,
  public mdDialogRef: MdDialogRef<ViewTestReportComponent>, ) { }

  testReport=[];
  ngOnInit() {
    console.log('data', this.data)
  this.testReport = this.data;
  this.assignSelectedLanguage();
  // this.httpServiceService.currentLangugae$.subscribe(response =>this.currentLanguageSet = response);
  console.log('this.testReport ',this.testReport );
  
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }

}
