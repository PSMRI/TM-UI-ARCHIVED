import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'app-doctor-tm-worklist-wrapper',
  templateUrl: './doctor-tm-worklist-wrapper.component.html',
  styleUrls: ['./doctor-tm-worklist-wrapper.component.css']
})
export class DoctorTmWorklistWrapperComponent implements OnInit {

  app: any;
  current_language_set: any;

  constructor(public httpServiceService: HttpServiceService) { }

  ngOnInit() {
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
    this.assignSelectedLanguage();
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
