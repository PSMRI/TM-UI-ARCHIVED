import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';

import { BeneficiaryDetailsService } from '../../core/services/beneficiary-details.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { DoctorService, MasterdataService } from '../shared/services';
import { CameraService } from '../../core/services/camera.service';

import { environment } from 'environments/environment';

import * as moment from 'moment';
import { SchedulerComponent } from './../scheduler/scheduler.component';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
@Component({
  selector: 'app-tm-future-worklist',
  templateUrl: './tm-future-worklist.component.html',
  styleUrls: ['./tm-future-worklist.component.css']
})


export class TmFutureWorklistComponent implements OnInit {

  rowsPerPage = 5;
  activePage = 1;
  pagedList = [];
  rotate = true;
  beneficiaryList: any;
  filteredBeneficiaryList = [];
  blankTable = [1, 2, 3, 4, 5];
  filterTerm;
  current_language_set: any;
  currentPage: number;
  constructor(
    private dialog: MdDialog,
    private cameraService: CameraService,
    private router: Router,
    private masterdataService: MasterdataService,
    private confirmationService: ConfirmationService,
    public httpServiceService: HttpServiceService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private doctorService: DoctorService) { }

  ngOnInit() {
    localStorage.setItem('currentRole', 'Doctor');
    this.loadWorklist();
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
    this.assignSelectedLanguage();
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
    localStorage.removeItem('currentRole');
  }

  pageChanged(event): void {
    console.log('called', event)
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedList = this.filteredBeneficiaryList.slice(startItem, endItem);
    console.log('list', this.pagedList)
  }
  loadWorklist() {
    this.filterTerm = null;
    this.doctorService.getDoctorFutureWorklist()
      .subscribe(data => {
        if (data && data.statusCode == 200 && data.data) {
          console.log("doctor future worklist", JSON.stringify(data.data, null, 4));
          data.data.map((item) => {
            let temp = this.getVisitStatus(item);
            item.statusMessage = temp.statusMessage;
            item.statusCode = temp.statusCode;
          })
          // this.beneficiaryList = data.data;
          // this.filteredBeneficiaryList = data.data;
          const benlist = this.loadDataToBenList(data.data);
          this.beneficiaryList = benlist;
          this.filteredBeneficiaryList = benlist;
          this.filterTerm = null;
          this.currentPage=1;
          this.pageChanged({
            page: this.activePage,
            itemsPerPage: this.rowsPerPage
          });
        } else
          this.confirmationService.alert(data.errorMessage, 'error');
      }, err => {
        this.confirmationService.alert(err, 'error');
      });
  }

  loadDataToBenList(data) {
    data.forEach(element => {
      element.genderName = element.genderName || 'Not Available'
      element.age = element.age || 'Not Available'
      element.statusMessage = element.statusMessage || 'Not Available'
      element.VisitCategory = element.VisitCategory || 'Not Available'
      element.benVisitNo = element.benVisitNo || 'Not Available'
      element.districtName = element.districtName || 'Not Available'
      element.villageName = element.villageName || 'Not Available'
      element.arrival = false
      element.preferredPhoneNum = element.preferredPhoneNum || 'Not Available'
      element.visitDate = moment(element.visitDate).format('DD-MM-YYYY HH:mm A') || 'Not Available',
        element.benVisitDate = moment(element.benVisitDate).format('DD-MM-YYYY HH:mm A ') || 'Not Available',
        element.tCRequestDate = moment(element.tCRequestDate).format('DD-MM-YYYY HH:mm A ') || 'Not Available'
    })
    return data;
  }

  filterBeneficiaryList(searchTerm: string) {
    if (!searchTerm)
      this.filteredBeneficiaryList = this.beneficiaryList;
    else {
      this.filteredBeneficiaryList = [];
      this.beneficiaryList.forEach((item) => {
        console.log('item', JSON.stringify(item, null, 4))
        for (let key in item) {
          if (key == 'beneficiaryID' || key == 'benName' || key == 'genderName' || key == 'age' || key == 'statusMessage' || key == 'VisitCategory' || key == 'benVisitNo' || key == 'districtName' || key == 'preferredPhoneNum' || key == 'villageName' || key == 'beneficiaryRegID' || key || 'visitDate') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredBeneficiaryList.push(item); break;
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

  patientImageView(benregID: any) {
    this.beneficiaryDetailsService.getBeneficiaryImage(benregID)
      .subscribe(data => {
        if (data && data.benImage)
          this.cameraService.viewImage(data.benImage);
        else
          this.confirmationService.alert(this.current_language_set.alerts.info.imageNotFound);
      });
  }

  getBeneficiryStatus(beneficiary: any) {
    this.confirmationService.alert(beneficiary.statusMessage);
  }

  getVisitStatus(beneficiaryVisitDetials) {
    let status = {
      statusCode: 0,
      statusMessage: ""
    }
    status.statusMessage = this.current_language_set.alerts.info.scheduledTC;
    status.statusCode = 1;
    return status;
  }
  cancelTCRequest(beneficiary) {
    this.confirmationService.confirm("info", this.current_language_set.alerts.info.cancelReq, "Yes", "No")
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
              this.loadWorklist();
            } else {
              this.confirmationService.alert(res.errorMessage, "error")
            }
          }, error => {
            this.confirmationService.alert(error, "error");
          });
        }
      });
  }
  reSchedule(beneficiary) {
    // this.confirmationService.alert(beneficiary.statusMessage);
    this.openScheduler(beneficiary);
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

      if (res.statusCode == 200) {
        this.confirmationService.alert(this.current_language_set.alerts.info.beneficiaryDetails, 'success');
        this.loadWorklist();
      } else {
        this.confirmationService.alert(res.errorMessage, "error")
      }
    }, error => {
      this.confirmationService.alert(error, "error");
    })
  }

}
