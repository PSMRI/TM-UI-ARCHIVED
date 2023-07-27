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


import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
@Component({
  selector: 'app-beneficiary-mcts-call-history',
  templateUrl: './beneficiary-mcts-call-history.component.html',
  styleUrls: ['./beneficiary-mcts-call-history.component.css']
})
export class BeneficiaryMctsCallHistoryComponent implements OnInit {
  current_language_set: any;

  constructor(@Inject(MD_DIALOG_DATA) public data: any, public httpServiceService: HttpServiceService,
  public dialogRef: MdDialogRef<BeneficiaryMctsCallHistoryComponent>) { }

  callDetails = []
  filteredCallDetails = [];
  callDetailsRowsPerPage = 5;
  callDetailsActivePage = 1;
  ngOnInit() {
    this.callDetails = this.data;
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
    this.filteredCallDetails = this.data;
    this.callDetailsPageChanged({
      page: this.callDetailsActivePage,
      itemsPerPage: this.callDetailsRowsPerPage
    });

  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }

  filterCallHistory(searchTerm?: String) {
    if (!searchTerm) {
      this.filteredCallDetails = this.callDetails;
    }
    else {
      this.filteredCallDetails = [];
      this.callDetails.forEach((item) => {
        const value: string = '' + item.questionnaireDetail.question;
        if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
          this.filteredCallDetails.push(item);
        }
      });
    }

    this.callDetailsActivePage = 1;
    this.callDetailsPageChanged({
      page: 1,
      itemsPerPage: this.callDetailsRowsPerPage
    })
  }

  callDetailsPagedList = [];
  callDetailsPageChanged(event): void {
    console.log('called', event)
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.callDetailsPagedList = this.filteredCallDetails.slice(startItem, endItem);
    console.log('list', this.callDetailsPagedList)
  }

}
