/* 
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/


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
