import { Component, DoCheck, OnInit } from '@angular/core';
import { MdTabChangeEvent } from '@angular/material';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { NurseService } from '../shared/services';

@Component({
  selector: 'app-nurse-worklist-wrapper',
  templateUrl: './nurse-worklist-wrapper.component.html',
  styleUrls: ['./nurse-worklist-wrapper.component.css']
})
export class NurseWorklistWrapperComponent implements OnInit, DoCheck {
  currentLanguageSet: any;

  constructor(
    public httpServiceService: HttpServiceService,
    private nurseService: NurseService,

  ) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.nurseService.setIsMMUTC("no");
  }

  public tabChanged(tabChangeEvent: MdTabChangeEvent): void {
    console.log('changedtab', tabChangeEvent.index);
    if (tabChangeEvent.index == 3)
      this.nurseService.setIsMMUTC("yes");
    else
      this.nurseService.setIsMMUTC("no");
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
