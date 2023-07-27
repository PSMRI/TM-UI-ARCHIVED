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


import { Component, OnInit, ChangeDetectorRef, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { DataSyncService } from './../shared/service/data-sync.service'
import { Observable } from 'rxjs/Rx';

import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdDialogConfig } from '@angular/material';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';


@Component({
  selector: 'app-master-download',
  templateUrl: './master-download.component.html',
  styleUrls: ['./master-download.component.css']
})
export class MasterDownloadComponent implements OnInit {
  current_language_set: any;

  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    public dialogRef: MdDialogRef<MasterDownloadComponent>,
    private confirmationService: ConfirmationService,
    private dataSyncService: DataSyncService,
    public httpServiceService: HttpServiceService,
  ) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.getVanDetails();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
   
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }

  showProgressBar = false;
  progressValue = 0;
  failedMasterList: any;
  intervalref: any;
  vanID: any;
  vehicalNo: any;

  showVanDetails: boolean;

  getVanDetails() {
    this.dataSyncService.getVanDetailsForMasterDownload()
      .subscribe(res => {
        if (res && res.statusCode == 200 && res.data) {
          if (res.data.vanID && res.data.vehicalNo) {
            this.showVanDetails = true;
          } else {
            this.showVanDetails = false;
          }
          this.vanID = res.data.vanID;
          this.vehicalNo = res.data.vehicalNo;
        } else {
          this.showVanDetails = false;
        }
      }, error => {
        this.showVanDetails = false;
      });
  }

  syncDownloadData() {
    this.failedMasterList = undefined;
    this.progressValue = 0;
    this.confirmationService.confirm('info', this.current_language_set.alerts.info.confirmDownload).subscribe((result) => {
      if (result) {
        let reqObj = {
          "vanID": this.vanID,
          "providerServiceMapID": localStorage.getItem('providerServiceID')
        }
        this.dataSyncService.syncDownloadData(reqObj).subscribe((res) => {
          if (res && res.statusCode == 200) {
            this.showProgressBar = true;
            this.intervalref = setInterval(() => {
              this.syncDownloadProgressStatus();
            }, 2000);
          } else {
            this.confirmationService.alert(res.errorMessage, 'error')
          }
        });
      }
    });
  }

  syncDownloadProgressStatus() {
    this.dataSyncService.syncDownloadDataProgress()
      .subscribe(res => {
        if (res.statusCode == 200 && res.data) {
          this.progressValue = res.data.percentage;

          if (this.progressValue >= 100) {
            this.failedMasterList = res.data.failedMasters.split("|");
            if (this.failedMasterList !== undefined && this.failedMasterList !== null && this.failedMasterList[this.failedMasterList.length - 1].trim() == "")
              this.failedMasterList.pop();
            this.showProgressBar = false;
            clearInterval(this.intervalref);
            this.confirmationService.alert("Master download finished");
          }
        } else {
          this.showProgressBar = false;
          clearInterval(this.intervalref);
          this.confirmationService.alert(res.errorMessage, 'error');
        }
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
