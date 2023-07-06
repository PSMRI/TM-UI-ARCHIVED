import { Component, DoCheck, OnInit } from '@angular/core';
import { MdTabChangeEvent } from '@angular/material';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'app-tc-specialist-worklist-wrapper',
  templateUrl: './tc-specialist-worklist-wrapper.component.html',
  styleUrls: ['./tc-specialist-worklist-wrapper.component.css']
})
export class TcSpecialistWorklistWrapperComponent implements OnInit, DoCheck {
  
  currentLanguageSet: any;
  constructor(public httpServiceService: HttpServiceService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
  }
  getChangedTab: any;
  public tabChanged(tabChangeEvent: MdTabChangeEvent): void {
    console.log('changedtab', tabChangeEvent.index);
    if (tabChangeEvent.index == 0)
      this.getChangedTab = 'current'
    else
      this.getChangedTab = 'future'
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
