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


import { Component, DoCheck, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialogRef, MdDialog, MdDialogConfig } from "@angular/material";
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { NurseService, DoctorService } from '../../shared/services';
import { CameraService } from '../../../core/services/camera.service';
import { BeneficiaryDetailsService } from '../../../core/services/beneficiary-details.service';
import { SchedulerComponent } from './../../scheduler/scheduler.component';

import * as moment from "moment";
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
@Component({
  selector: 'app-nurse-tm-worklist',
  templateUrl: './nurse-tm-worklist.component.html',
  styleUrls: ['./nurse-tm-worklist.component.css']
})
export class NurseTmWorklistComponent implements OnInit, DoCheck {

  rowsPerPage = 5;
  activePage = 1;
  pagedList = [];
  rotate = true;


  blankTable = [1, 2, 3, 4, 5];
  beneficiaryList: any;
  filteredBeneficiaryList = [];
  filterTerm;
  currentLanguageSet: any;
  currentPage: number;
  constructor(
    private nurseService: NurseService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private cameraService: CameraService,
    private dialog: MdDialog,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    public httpServiceService: HttpServiceService,
    private doctorService: DoctorService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    localStorage.setItem('currentRole', 'Nurse');
    this.removeBeneficiaryDataForNurseVisit();
    this.getNurseTMWorklist();
    this.beneficiaryDetailsService.reset();

  }

  ngOnDestroy() {
    localStorage.removeItem('currentRole');
  }

  removeBeneficiaryDataForNurseVisit() {
    localStorage.removeItem('visitCode');
    localStorage.removeItem('beneficiaryGender');
    localStorage.removeItem('benFlowID');
    localStorage.removeItem('visitCategory');
    localStorage.removeItem('beneficiaryRegID');
    localStorage.removeItem('visitID');
    localStorage.removeItem('beneficiaryID');
    localStorage.removeItem('doctorFlag');
    localStorage.removeItem('nurseFlag');
    localStorage.removeItem('pharmacist_flag');
  }

  getNurseTMWorklist() {
    this.nurseService.getNurseTMWorklist()
      .subscribe((res) => {

        console.log('resof tmnurse', JSON.stringify(res, null, 4));

        if (res.statusCode == 200 && res.data != null) {
          res.data.map(item => {
            let temp = this.getVisitStatus(item);
            item.statusMessage = temp.statusMessage;
            item.statusCode = temp.statusCode;
          });
          const benlist = this.loadDataToBenList(res.data);
          this.beneficiaryList = benlist;
          this.filteredBeneficiaryList = benlist;
          this.pageChanged({
            page: this.activePage,
            itemsPerPage: this.rowsPerPage
          });
          this.filterTerm = null;
          this.currentPage=1;
        } else
          this.confirmationService.alert(res.errorMessage, 'error');
      }, err => {
        this.confirmationService.alert(err, 'error');
      });
  }
  getVisitStatus(beneficiaryVisitDetials) {
    const status = {
      statusCode: 0,
      statusMessage: ""
    };

    if (beneficiaryVisitDetials.specialist_flag == 1 || beneficiaryVisitDetials.specialist_flag == 2 || beneficiaryVisitDetials.specialist_flag == 3) {
      status.statusCode = 5;
      status.statusMessage = "Pending For Tele-Consultation";
    } else if (beneficiaryVisitDetials.specialist_flag == 4) {
      status.statusCode = 4;
      status.statusMessage = "Tele-Consultation Cancelled";
    }
    //  else if (beneficiaryVisitDetials.doctorFlag == 3) {
    //   status.statusCode = 3;
    //   status.statusMessage = "Labtest Done";
    // } 
    // else if (beneficiaryVisitDetials.doctorFlag == 1) {
    //   status.statusCode = 1;
    //   status.statusMessage = "Pending For consultation";
    // } 
    else if (beneficiaryVisitDetials.specialist_flag == 9) {
      status.statusCode = 9;
      status.statusMessage = "Tele-Consultation Done";
    }

    return status;
  }
  loadDataToBenList(data) {
    data.forEach(element => {
      element.genderName = element.genderName || "Not Available";
      element.age = element.age || "Not Available";
      element.statusMessage = element.statusMessage || "Not Available";
      element.VisitCategory = element.VisitCategory || "Not Available";
      element.benVisitNo = element.benVisitNo || "Not Available";
      element.arrival = false;
      element.preferredPhoneNum = element.preferredPhoneNum || "Not Available";
      element.visitDate = moment(element.visitDate).format("DD-MM-YYYY HH:mm A") || "Not Available";
      element.benVisitDate = moment(element.benVisitDate).format('DD-MM-YYYY HH:mm A ') || 'Not Available';
      element.tCRequestDate = moment(element.tCRequestDate).format('DD-MM-YYYY HH:mm A ') || 'Not Available';
      element.districtName = element.districtName || 'Not Available'
      element.villageName = element.villageName || 'Not Available'
      element.fatherName = element.fatherName || 'Not Available'
      element.preferredPhoneNum = element.preferredPhoneNum || 'Not Available'
    })
    return data;
  }

  pageChanged(event): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedList = this.filteredBeneficiaryList.slice(startItem, endItem);
  }

  patientImageView(benregID: any) {
    this.beneficiaryDetailsService.getBeneficiaryImage(benregID)
      .subscribe(data => {
        if (data && data.benImage)
          this.cameraService.viewImage(data.benImage);
        else
          this.confirmationService.alert(this.currentLanguageSet.alerts.info.imageNotFound);
      });
  }

  loadNursePatientDetails(beneficiary) {
    console.log('Beneficiary', beneficiary);
    localStorage.setItem("visitCode", beneficiary.visitCode);
    if (beneficiary.statusCode == 5) {
      this.confirmationService.alert(beneficiary.statusMessage)
    } else if (beneficiary.statusCode == 4) {
      this.confirmationService.alert(beneficiary.statusMessage)
    } else if (beneficiary.statusCode == 9) {
      this.viewAndPrintCaseSheet(beneficiary)
    }
  }
  viewAndPrintCaseSheet(beneficiary) {
    this.confirmationService.confirm("info", this.currentLanguageSet.alerts.info.consulation).subscribe(res => {
      if (res) {
        this.routeToCaseSheet(beneficiary)
      }
    });
  }

  routeToCaseSheet(beneficiary) {
    localStorage.setItem("caseSheetBenFlowID", beneficiary.benFlowID);
    localStorage.setItem("caseSheetVisitCategory", beneficiary.VisitCategory);
    localStorage.setItem("caseSheetBeneficiaryRegID", beneficiary.beneficiaryRegID);
    localStorage.setItem("caseSheetVisitID", beneficiary.benVisitID);
    this.router.navigate(["/common/print/" + 'TM' + '/' + 'current']);
  }

  filterBeneficiaryList(searchTerm: string) {
    if (!searchTerm)
      this.filteredBeneficiaryList = this.beneficiaryList;
    else {
      this.filteredBeneficiaryList = [];
      this.beneficiaryList.forEach((item) => {
        console.log('item', JSON.stringify(item, null, 4))
        for (let key in item) {
          if (key == 'beneficiaryID' || key == 'benName' || key == 'genderName' || key == 'fatherName' || key == 'districtName' || key == 'preferredPhoneNum' || key == 'villageName') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredBeneficiaryList.push(item); break;
            }
          } else {
            if (key == 'benVisitNo') {
              let value: string = '' + item[key];
              if (value == '1') {
                let val = 'First visit'
                if (val.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
                  this.filteredBeneficiaryList.push(item); break;
                }
              } else {
                let val = 'Revist'
                if (val.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
                  this.filteredBeneficiaryList.push(item); break;
                }
              }
            }
          }
        }
      });
    }
    this.activePage = 1;
    this.pageChanged({
      page: 1,
      itemsPerPage: this.rowsPerPage
    });
    this.currentPage=1;
  }


  toggleArrivalStatus(evt, benFlowID, index) {
    let message: string;
    if (evt.checked) {
      message = this.currentLanguageSet.alerts.info.beneficiaryArrive;
    } else {
      message = this.currentLanguageSet.alerts.info.cancelStatus;
    }

    console.log(benFlowID, "", evt, "", this.beneficiaryList);

    let filteredBenIndex = -1;
    this.confirmationService.confirm("info", message, "YES", "NO")
      .subscribe(res => {
        if (res) {
          this.beneficiaryList.forEach((benef, i) => {
            if (benef.benFlowID == benFlowID) {
              filteredBenIndex = i;
            }
          });
          if (filteredBenIndex >= 0) {
            this.beneficiaryList[filteredBenIndex].benArrivedFlag = evt.checked;
            this.filteredBeneficiaryList = this.beneficiaryList;

            let arrivedBeneficiary = this.beneficiaryList[filteredBenIndex];
            this.doctorService.updateBeneficiaryArrivalStatus({
              benflowID: arrivedBeneficiary.benFlowID,
              benRegID: arrivedBeneficiary.beneficiaryRegID,
              visitCode: arrivedBeneficiary.visitCode,
              status: evt.checked,
              userID: arrivedBeneficiary.tCSpecialistUserID,
              modifiedBy: localStorage.getItem('userName'),
            }).subscribe(res => {
              if (res && res.statusCode && res.data) {
                this.confirmationService.alert(res.data.response, "success");
              } else {
                this.beneficiaryList[filteredBenIndex].benArrivedFlag = !evt.checked;
                this.confirmationService.alert(res.errorMessage, "error")
              }
            }, error => {
              this.beneficiaryList[filteredBenIndex].benArrivedFlag = !evt.checked;
              this.confirmationService.alert(error, "error");
            });
          }
        } else {
          this.pagedList[index].benArrivedFlag = !evt.checked;
        }
      });

    console.log(benFlowID, "", evt, "", this.beneficiaryList);
  }
  cancelTCRequest(beneficiary) {
    console.log(beneficiary.benFlowID, beneficiary.beneficiaryRegID, beneficiary.visitCode, beneficiary.tCSpecialistUserID);

    this.confirmationService.confirm("info", this.currentLanguageSet.alerts.info.cancelReq, "Yes", "No")
      .subscribe(res => {
        if (res) {
          this.doctorService.cancelBeneficiaryTCRequest({
            benflowID: beneficiary.benFlowID,
            benRegID: beneficiary.beneficiaryRegID,
            visitCode: beneficiary.visitCode,
            userID: beneficiary.tCSpecialistUserID,
            modifiedBy: localStorage.getItem('userName'),
          }).subscribe(res => {
            if (res && res.statusCode && res.data) {
              this.confirmationService.alert(res.data.response, "success");
              this.getNurseTMWorklist();
            } else {
              this.confirmationService.alert(res.errorMessage, "error")
            }
          }, error => {
            this.confirmationService.alert(error, "error");
          });
        }
      });
  }

  openScheduler(beneficiary) {
    let mdDialogRef: MdDialogRef<SchedulerComponent> = this.dialog.open(SchedulerComponent, {
    })
    mdDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.scheduleTC(beneficiary, result.tmSlot);
      }
      console.log(JSON.stringify(result, null, 4));
    })
  }
  scheduleTC(beneficiary, tcRequest) {
    const scedulerRequest = {
      benFlowID: beneficiary.benFlowID,
      beneficiaryRegID: beneficiary.beneficiaryRegID,
      benVisitID: beneficiary.benVisitID,
      visitCode: beneficiary.visitCode,
      vanID: beneficiary.vanID,
      providerServiceMapID: localStorage.getItem('providerServiceID'),
      createdBy: localStorage.getItem('userName'),
      tcRequest: tcRequest
    }
    this.doctorService.scheduleTC(scedulerRequest).subscribe((res) => {
      console.log('res', res);

      if (res.statusCode == 200) {
        this.confirmationService.alert(this.currentLanguageSet.alerts.info.beneficiaryDetails, 'success');
        this.getNurseTMWorklist();
      } else {
        this.confirmationService.alert(res.errorMessage, "error")
      }
    }, error => {
      this.confirmationService.alert(error, "error");
    })
  }

  initiateTC(beneficiary) {
    console.log('ben',beneficiary);
    if (beneficiary.benArrivedFlag) {
      this.doctorService.invokeSwymedCall(beneficiary.tCSpecialistUserID).subscribe((res) => {
        if (res.statusCode == 200 && res.data) {
          window.location.href = res.data.response;
          this.updateTCStartTime(beneficiary);
        } else {
          this.confirmationService.alert(res.errorMessage, "error")
        }
      }, error => {
        this.confirmationService.alert(error, "error");
      })
    } else {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.benificiary);
    }
  }
  updateTCStartTime(beneficiary) {
   let tCStartTimeObj = {
      benRegID: beneficiary.beneficiaryRegID,
      visitCode: beneficiary.visitCode
    }
    this.doctorService.updateTCStartTime(tCStartTimeObj).subscribe((res) => {
      console.log(res);
    })
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
