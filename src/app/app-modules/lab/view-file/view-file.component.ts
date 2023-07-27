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
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { ConfirmationService } from '../../core/services/confirmation.service';

@Component({
  selector: 'app-view-file',
  templateUrl: './view-file.component.html',
  styleUrls: ['./view-file.component.css']
})
export class ViewFileComponent implements OnInit {

  fileObj: any;
  currentLanguageSet: any;
  constructor(
    @Inject(MD_DIALOG_DATA) public input: any,
    private dialogRef: MdDialogRef<ViewFileComponent>,
    private confirmationService: ConfirmationService,
    private httpServiceService : HttpServiceService) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.assignSelectedLanguage();
    console.log("this.input", this.input.viewFileObj);
    let inputFileObj = this.input.viewFileObj;
    let procedureID = this.input.procedureID;
    this.assignObject(inputFileObj, procedureID);
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }

  assignObject(inputFileObj, procedureID) {
    this.fileObj = inputFileObj[procedureID];
  }
  remove(file) {
    this.confirmationService.confirm('info', this.currentLanguageSet.alerts.info.wantToRemoveFile).subscribe((res) => {
      if (res) {
        const index = this.input.viewFileObj[this.input.procedureID].indexOf(file);
        if (index >= 0) {
          this.input.viewFileObj[this.input.procedureID].splice(index, 1);
        }
        if (this.input.viewFileObj[this.input.procedureID].length == 0) {
          this.closeDialog();
        }

      }
    })
  }
  closeDialog() {
    let returnObj = this.input.viewFileObj;
    this.dialogRef.close(returnObj);
  }

}
