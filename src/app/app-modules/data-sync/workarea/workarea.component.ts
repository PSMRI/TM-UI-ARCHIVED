import { Component, OnInit, ViewChild, AfterViewChecked, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { DataSyncService } from './../shared/service/data-sync.service'
import { Observable } from 'rxjs/Rx';
import { CanComponentDeactivate } from '../../core/services/can-deactivate-guard.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';

@Component({
  selector: 'app-workarea',
  templateUrl: './workarea.component.html',
  styleUrls: ['./workarea.component.css']
})
export class WorkareaComponent implements OnInit, CanComponentDeactivate {
  current_language_set: any;

  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    public httpServiceService: HttpServiceService,
    private dataSyncService: DataSyncService
  ) { }

  syncTableGroupList = [];
  ngOnInit() {
    this.assignSelectedLanguage();
    if (localStorage.getItem('serverKey') != null || localStorage.getItem('serverKey') != undefined) {
      this.getDataSYNCGroup();
    } else {
      this.router.navigate(['datasync/sync-login'])
    }
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }

  ngOnDestroy() {
    localStorage.removeItem('serverKey')
  }

  getDataSYNCGroup() {
    this.dataSyncService.getDataSYNCGroup().subscribe((res) => {
      if (res.statusCode == 200) {
        this.syncTableGroupList = this.createSyncActivity(res.data);
        console.log('syncTableGroupList', this.syncTableGroupList);
      }
    })
  }

  createSyncActivity(data) {
    data.forEach(element => {
      element.syncTableGroupName = element.syncTableGroupName
      element.syncTableGroupID = element.syncTableGroupID
      element.processed = element.processed
      element.benDetailSynced = false
      element.visitSynced = false
    });
    return data;
  }

  checkSelectedGroup(syncTableGroup) {
    console.log(syncTableGroup, 'syncTableGroup');

    if (syncTableGroup.processed == 'N') {
      if (syncTableGroup.syncTableGroupID == 1) {
        this.syncUploadData(syncTableGroup);
      } else if (syncTableGroup.syncTableGroupID == 2) {
        if (syncTableGroup.benDetailSynced == false && syncTableGroup.visitSynced == false) {
          this.confirmationService.alert(this.current_language_set.alerts.info.syncBeneficiary)
        } else {
          this.syncUploadData(syncTableGroup);
        }
      } else {
        if (syncTableGroup.benDetailSynced == false && syncTableGroup.visitSynced == false) {
          this.confirmationService.alert(this.current_language_set.alerts.info.syncBeneficiaryDetails)
        } else if (syncTableGroup.benDetailSynced == true && syncTableGroup.visitSynced == false) {
          this.confirmationService.alert(this.current_language_set.alerts.info.syncVisitFirst)
        } else {
          this.syncUploadData(syncTableGroup);
        }
      }
    } else {
      this.confirmationService.alert(this.current_language_set.alerts.info.dataSynced)
    }

  }

  syncUploadData(syncTableGroup) {
    this.confirmationService.confirm('info', this.current_language_set.alerts.info.confirmUpload).subscribe((result) => {
      if (result) {
        this.dataSyncService.syncUploadData(syncTableGroup.syncTableGroupID).subscribe((res) => {
          console.log(res);
          if (res.statusCode == 200) {
            const syncTableGroups = this.syncTableGroupList;
            this.syncTableGroupList = [];
            this.syncTableGroupList = this.modifySYNCEDGroup(syncTableGroups, syncTableGroup);
            console.log(this.syncTableGroupList, 'this.syncTableGroupList');
            this.confirmationService.alert(res.data.response, 'success');
          } else {
            this.confirmationService.alert(res.errorMessage, "error")
          }
        }, err => {
          this.confirmationService.alert(err, 'error');
        });
      }
    })
  }

  modifySYNCEDGroup(syncTableGroups, syncTableGroup) {
    console.log('syncTableGroup', syncTableGroup);
    syncTableGroups.forEach(element => {
      element.syncTableGroupName = element.syncTableGroupName
      element.syncTableGroupID = element.syncTableGroupID
      if (element.syncTableGroupID == syncTableGroup.syncTableGroupID) {
        element.processed = 'D'
      }
      if (syncTableGroup.syncTableGroupID == 1) {
        element.benDetailSynced = true
        element.visitSynced = false
      }
      if (syncTableGroup.syncTableGroupID == 2) {
        element.benDetailSynced = true
        element.visitSynced = true
      }
    });
    return syncTableGroups;
  }


  showProgressBar = false;
  progressValue = 0;
  failedMasterList: any;
  intervalref: any;

  syncDownloadData() {
    this.failedMasterList = undefined;
    this.progressValue = 0;
    this.confirmationService.confirm('info', this.current_language_set.alerts.info.confirmDownload).subscribe((result) => {
      if (result) {
        let vanID = JSON.parse(localStorage.getItem('serviceLineDetails')).vanID;
        let reqObj = {
          "vanID": vanID,
          "providerServiceMapID": localStorage.getItem('providerServiceID')
        }
        this.dataSyncService.syncDownloadData(reqObj).subscribe((res) => {
          if (res.statusCode == 200) {
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
            this.confirmationService.alert(this.current_language_set.alerts.info.masterFinished);
          }
        }
      });
  }

  canDeactivate() {
    if (this.showProgressBar) {
      this.confirmationService.alert(this.current_language_set.alerts.info.downloadProgress);
      return false;
    } else {
      return true;
    }
  }

}

