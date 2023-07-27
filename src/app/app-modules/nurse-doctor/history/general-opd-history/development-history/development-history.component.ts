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


import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { MasterdataService, NurseService, DoctorService } from '../../../shared/services';
import { PreviousDetailsComponent } from '../../../../core/components/previous-details/previous-details.component';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ConfirmationService } from '../../../../core/services/confirmation.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'general-development-history',
  templateUrl: './development-history.component.html',
  styleUrls: ['./development-history.component.css']
})
export class DevelopmentHistoryComponent implements OnInit, DoCheck {

  @Input('developmentHistory')
  developmentHistoryForm: FormGroup;

  @Input('visitCategory')
  visitType: any;

  @Input('mode')
  mode: string;

  masterData: any;
  currentLanguageSet: any;

  constructor(
    private fb: FormBuilder,
    private masterdataService: MasterdataService,
    private nurseService: NurseService,
    private doctorService: DoctorService,
    public httpServiceService: HttpServiceService,
    private dialog: MdDialog,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.getMasterData();
    this.httpServiceService.currentLangugae$.subscribe(response =>this.currentLanguageSet = response);
  }
ngOnChanges()
{
}
  ngOnDestroy() {
    if (this.nurseMasterDataSubscription)
      this.nurseMasterDataSubscription.unsubscribe();

    if (this.generalHistorySubscription)
      this.generalHistorySubscription.unsubscribe();
  }

  nurseMasterDataSubscription: any;
  getMasterData() {
    this.nurseMasterDataSubscription = this.masterdataService.nurseMasterData$.subscribe(masterData => {
      if (masterData) {
        this.nurseMasterDataSubscription.unsubscribe();
        this.masterData = masterData;
        console.log('this.masterData ', this.masterData);
        if (this.mode == 'view') {
          let visitID = localStorage.getItem('visitID');
          let benRegID = localStorage.getItem('beneficiaryRegID')
          this.getGeneralHistory(benRegID, visitID);
        }

        if(parseInt(localStorage.getItem("specialistFlag")) == 100)
        {
           let visitID = localStorage.getItem('visitID');
          let benRegID = localStorage.getItem('beneficiaryRegID')
          this.getGeneralHistory(benRegID, visitID);
        }
      
      }
    })
  }

  developmentHistoryData: any;
  generalHistorySubscription: any;
  getGeneralHistory(benRegID, visitID) {
    this.generalHistorySubscription = this.doctorService.getGeneralHistoryDetails(benRegID, visitID).subscribe(history => {
      if (history != null && history.statusCode == 200 && history.data != null && history.data.DevelopmentHistory) {
        this.developmentHistoryData = history.data.DevelopmentHistory;
        console.log('history.data DEVELOPMWENTAL', this.developmentHistoryData);
        this.developmentHistoryForm.patchValue(this.developmentHistoryData);
      }
    })
  }

  getPreviousDevelopmentalHistory() {
    let benRegID = localStorage.getItem('beneficiaryRegID');
    console.log('here checkig', this.visitType);

    this.nurseService.getPreviousDevelopmentalHistory(benRegID, this.visitType)
      .subscribe(data => {
        if (data != null && data.data != null) {
          if (data.data.data.length > 0) {
            this.viewPreviousData(data.data);
          } else {
            this.confirmationService.alert(this.currentLanguageSet.historyData.ancHistory.previousHistoryDetails.pastHistoryalert);
          }
        } else {
          this.confirmationService.alert(this.currentLanguageSet.alerts.info.errorFetchingHistory, 'error');
        }
      }, err => {
        this.confirmationService.alert(this.currentLanguageSet.alerts.info.errorFetchingHistory, 'error');
      })
  }

  viewPreviousData(data) {
    this.dialog.open(PreviousDetailsComponent, {
      data: { 'dataList': data, title: this.currentLanguageSet.historyData.Perinatalhistorydetails.developmentalhistorydetails }
    });
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
