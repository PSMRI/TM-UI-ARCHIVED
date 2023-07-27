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


import { Component, OnInit, Inject, Injector } from '@angular/core';
import { DataSyncService } from '../shared/service/data-sync.service';
import { ConfirmationService } from 'app/app-modules/core/services';

import { Router } from '@angular/router';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { HttpServiceService } from '../../core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'app-data-sync-login',
  templateUrl: './data-sync-login.component.html',
  styleUrls: ['./data-sync-login.component.css'],
  providers: [DataSyncService]
})
export class DataSyncLoginComponent implements OnInit {

  userName: string;
  password: string;

  dynamictype = "password";
  dialogRef: any;
  data: any;
  current_language_set: any;
  constructor(
    private router: Router,
    public httpServiceService: HttpServiceService,
    private dataSyncService: DataSyncService,
    private injector: Injector,
    private confirmationService: ConfirmationService,
    private http_service: HttpServiceService
  ) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    //this.http_service.currentLangugae$.subscribe(response =>this.current_language_set = response);
    this.dialogRef = this.injector.get(MdDialogRef, null)
    this.data = this.injector.get(MD_DIALOG_DATA, null);
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }

  showPWD() {
    this.dynamictype = "text";
  }

  hidePWD() {
    this.dynamictype = "password";
  }

  // checkCurrentUser(){
  //   if(this.userName != localStorage.getItem('username')){
  //     this.confirmationService.alert('Username you entered not matched the current user')
  //     this.userName = null;
  //   }
  // }

  dataSyncLogin() {
    if (this.userName && this.password) {
      this.dataSyncService.dataSyncLogin(this.userName, this.password)
        .subscribe(res => {
          if (res.statusCode = "200" && res.data) {
            localStorage.setItem("serverKey", res.data.key);
            if (this.data && this.data.masterDowloadFirstTime) {
              let mmuService = res.data.previlegeObj.filter(item => {
                return item.serviceName == "MMU"
              });
              sessionStorage.setItem("key", res.data.key);
              localStorage.setItem("providerServiceID",'2049')
              // localStorage.setItem("providerServiceID", mmuService[0].providerServiceMapID);
              this.dialogRef.close(true);
            } else {
              this.router.navigate(["/datasync/workarea"]);
            }
          } else {
            this.confirmationService.alert(res.errorMessage, "error");
          }
        })
    } else {
      this.confirmationService.alert(this.current_language_set.alerts.info.usernamenPass);
    }
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

}
