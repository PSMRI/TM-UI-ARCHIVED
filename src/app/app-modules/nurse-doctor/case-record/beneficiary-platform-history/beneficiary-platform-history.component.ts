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


import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../shared/services';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { BeneficiaryMctsCallHistoryComponent } from '../beneficiary-mcts-call-history/beneficiary-mcts-call-history.component';
import { environment } from 'environments/environment';

import { CaseSheetComponent } from '../../case-sheet/case-sheet.component';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'app-beneficiary-platform-history',
  templateUrl: './beneficiary-platform-history.component.html',
  styleUrls: ['./beneficiary-platform-history.component.css']
})
export class BeneficiaryPlatformHistoryComponent implements OnInit {
  current_language_set: any;
  higherHealthFacility='Higher Health Facility';
  constructor(private doctorService: DoctorService,
    public httpServiceService: HttpServiceService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private dialog: MdDialog, ) { }

  ngOnInit() {
    this.getServiceOnState();
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }
    
  serviceOnState = [];
  getServiceOnState() {
    this.doctorService.getServiceOnState().subscribe((res) => {
      console.log('resinstate', res);
      if (res.statusCode == 200) {
        this.serviceOnState = this.getStateServiceActivity(res.data)
      }
    })
  }
  getStateServiceActivity(serviceOnState) {
    let services = [];
    serviceOnState.forEach((service) => {
      if (service.serviceID != 1 && service.serviceID != 5) {
        service = Object.assign({
          serviceID: service.serviceID,
          serviceName: service.serviceName,
          serviceLoaded: false,
        })
        services.push(service);
      }
    });
    //console.log(services, "services");
    // services.push(
    //   Object.assign({
    //     serviceName: this.higherHealthFacility,
    //     serviceLoaded: false,
    //   })
    // );
    //uncomment to see bahmni clinical records
    return services;
  }

  getServiceHistory(service) {
    if (service == 2) {
      this.getMMUHistory();
    }
    if (service == 3) {
      this.get104History();
    }
    if (service == 4) {
      this.getTMHistory()
    }
    if (service == 6) {
      this.getMCTSHistory();
    }
  }

  previousMMUHistoryRowsPerPage = 5;
  previousMMUHistoryActivePage = 1;
  rotate = true;
  historyOfMMU = [];
  filteredMMUHistory = [];
  hideMMUFetch: Boolean = false

  getMMUHistory() {
    this.doctorService.getMMUHistory().subscribe((data) => {
      console.log('data', data);
      if (data.statusCode == 200) {
        this.hideMMUFetch = true;
        let services = this.serviceOnState
        this.serviceOnState = [];
        this.serviceOnState = this.checkServiceLoader(services, 2);
        console.log('dataget', JSON.stringify(data, null, 4));
        this.historyOfMMU = data.data;
        this.filteredMMUHistory = data.data;
        this.previousMMUHistoryPageChanged({
          page: this.previousMMUHistoryActivePage,
          itemsPerPage: this.previousMMUHistoryRowsPerPage
        });
      }
    })
  }
  checkServiceLoader(services, serviceID) {
    services.forEach((service) => {
      service.serviceName = service.serviceName
      service.serviceID = service.serviceID
      if (serviceID == service.serviceID) {
        service.serviceLoaded = true;
      } else {
        service.serviceLoaded = service.serviceLoaded
      }
    })
    console.log(services, 'servicechane');

    return services;
  }
  filterMMUHistory(searchTerm?: String) {
    if (!searchTerm) {
      this.filteredMMUHistory = this.historyOfMMU;
    }
    else {
      this.filteredMMUHistory = [];
      this.historyOfMMU.forEach((item) => {
        const value: string = '' + item.VisitCategory;
        if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
          this.filteredMMUHistory.push(item);
        }
      });
    }

    this.previousMMUHistoryActivePage = 1;
    this.previousMMUHistoryPageChanged({
      page: 1,
      itemsPerPage: this.previousMMUHistoryRowsPerPage
    })
  }

  previousMMUHistoryPagedList = [];
  previousMMUHistoryPageChanged(event): void {
    console.log('called', event)
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.previousMMUHistoryPagedList = this.filteredMMUHistory.slice(startItem, endItem);
    console.log('list', this.previousMMUHistoryPagedList)
  }

  getVisitDetails(serviceType, visit, print) {
   // if (visit.VisitCategory != 'NCD screening') {
      this.confirmationService.confirm("info", this.current_language_set.alerts.info.viewCasesheet)
        .subscribe((res) => {
          console.log('print', print);
          if (res) {
            localStorage.setItem('previousCaseSheetVisitCode', visit.visitCode);
            localStorage.setItem('previousCaseSheetBenFlowID', visit.benFlowID);
            localStorage.setItem('previousCaseSheetVisitCategory', visit.VisitCategory);
            localStorage.setItem('previousCaseSheetBeneficiaryRegID', visit.beneficiaryRegID);
            localStorage.setItem('previousCaseSheetVisitID', visit.benVisitID);
            if (print) {
              let url = environment.newTaburl;
              window.open(url + '#/common/print/' + serviceType + '/' + 'previous');
            }
            else {
              this.dialog.open(CaseSheetComponent, {
                disableClose: true,
                width: '95%',
                panelClass: 'preview-casesheet',
                data: {
                  previous: true,
                  serviceType: serviceType
                }
              });
            }
          }
        });
    // } else {
    //   this.confirmationService.alert(this.current_language_set.alerts.info.noCasesheet)
    // }
  }

  hideMCTSFetch: Boolean = false
  previousMCTSHistoryRowsPerPage = 5;
  previousMCTSHistoryActivePage = 1;
  historyOfMCTS = [];
  filteredMCTSHistory = [];
  getMCTSHistory() {
    this.doctorService.getMCTSHistory().subscribe((data) => {
      console.log('data', data);

      if (data.statusCode == 200) {
        this.hideMCTSFetch = true;
        console.log('dataget', data);
         let services = this.serviceOnState
        this.serviceOnState = [];
        this.serviceOnState = this.checkServiceLoader(services, 6);
        this.historyOfMCTS = data.data;
        this.filteredMCTSHistory = data.data;
        this.previousMCTSHistoryPageChanged({
          page: this.previousMCTSHistoryActivePage,
          itemsPerPage: this.previousMCTSHistoryRowsPerPage
        });
      }
    })
  }

  filterMCTSHistory(searchTerm?: String) {
    if (!searchTerm) {
      this.filteredMCTSHistory = this.historyOfMCTS;
    }
    else {
      this.filteredMCTSHistory = [];
      this.historyOfMCTS.forEach((item) => {
        const value: string = '' + item.mctsOutboundCall.displayOBCallType;
        if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
          this.filteredMCTSHistory.push(item);
        }
      });
    }

    this.previousMCTSHistoryActivePage = 1;
    this.previousMCTSHistoryPageChanged({
      page: 1,
      itemsPerPage: this.previousMCTSHistoryRowsPerPage
    })
  }

  previousMCTSHistoryPagedList = [];
  previousMCTSHistoryPageChanged(event): void {
    console.log('called', event)
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.previousMCTSHistoryPagedList = this.filteredMCTSHistory.slice(startItem, endItem);
    console.log('list', this.previousMCTSHistoryPagedList)
  }



  hide104Fetch: Boolean = false
  previous104HistoryRowsPerPage = 5;
  previous104HistoryActivePage = 1;
  historyOf104 = [];
  filtered104History = [];
  get104History() {
    this.doctorService.get104History().subscribe((data) => {
      console.log('data', data);

      if (data.statusCode == 200) {
        this.hide104Fetch = true;
         let services = this.serviceOnState
        this.serviceOnState = [];
        this.serviceOnState = this.checkServiceLoader(services, 3);
        console.log('dataget', data);
        this.historyOf104 = data.data;
        this.filtered104History = data.data;
        this.previous104HistoryPageChanged({
          page: this.previous104HistoryActivePage,
          itemsPerPage: this.previous104HistoryRowsPerPage
        });
      }
    })
  }

  filter104History(searchTerm?: String) {
    if (!searchTerm) {
      this.filtered104History = this.historyOf104;
    }
    else {
      this.filtered104History = [];
      this.historyOf104.forEach((item) => {
        const value: string = '' + item.diseaseSummary;
        if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
          this.filtered104History.push(item);
        }
      });
    }

    this.previous104HistoryActivePage = 1;
    this.previous104HistoryPageChanged({
      page: 1,
      itemsPerPage: this.previous104HistoryRowsPerPage
    })
  }

  previous104HistoryPagedList = [];
  previous104HistoryPageChanged(event): void {
    console.log('called', event)
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.previous104HistoryPagedList = this.filtered104History.slice(startItem, endItem);
    console.log('list', this.previous104HistoryPagedList)
  }

  callData: any;
  getPatientMCTSCallHistory(call) {
    let callDetailID = { "callDetailID": call.callDetailID }
    // let callDetailID={ "callDetailID": "19099" }
    this.doctorService.getPatientMCTSCallHistory(callDetailID).subscribe((data) => {
      console.log('data', data);
      if (data.statusCode == 200) {
        this.showCallDetails(data.data);
      }
    });
  }

  showCallDetails(CallDetails) {
    let mdDialogRef: MdDialogRef<BeneficiaryMctsCallHistoryComponent> = this.dialog.open(BeneficiaryMctsCallHistoryComponent, {
      width: '70%',
      panelClass: 'preview-casesheet',
      data: CallDetails
    })

    mdDialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    })
  }
  previousTMHistoryRowsPerPage = 5;
  previousTMHistoryActivePage = 1;
  historyOfTM = [];
  filteredTMHistory = [];
  hideTMFetch: Boolean = false

  getTMHistory() {
    this.doctorService.getTMHistory().subscribe((data) => {
      console.log('data', data);

      if (data.statusCode == 200) {
        this.hideTMFetch = true;
         let services = this.serviceOnState
        this.serviceOnState = [];
        this.serviceOnState = this.checkServiceLoader(services, 4);
        console.log('dataget', JSON.stringify(data, null, 4));
        this.historyOfTM = data.data;
        this.filteredTMHistory = data.data;
        this.getEachVisitData();
        // this.previousTMHistoryPageChanged({
        //   page: this.previousTMHistoryActivePage,
        //   itemsPerPage: this.previousTMHistoryRowsPerPage
        // });
      }
    })
  }

  getEachVisitData(){
    this.historyOfTM.forEach((item, i) => {
      if(item.visitCode){
        let reqObj = {
          'VisitCategory': item.VisitCategory,
          'benFlowID': item.benFlowID,
          'beneficiaryRegID': item.beneficiaryRegID,
          'visitCode': item.visitCode
        }
        this.doctorService.getTMCasesheetData(reqObj).subscribe(res => {
          if(res.statusCode == 200 && res.data !== null){
            this.historyOfTM[i]['benPreviousData'] = res.data;
            //this.previousVisitData.push({ 'benPreviousData': res.data});
            this.filteredTMHistory = res.data;
            this.previousTMHistoryPageChanged({
            page: this.previousTMHistoryActivePage,
            itemsPerPage: this.previousTMHistoryRowsPerPage
        });
            
            // this.previousMMUHistoryPageChanged({
            //   page: this.previousMMUHistoryActivePage,
            //   itemsPerPage: this.previousMMUHistoryRowsPerPage
            // });
          }
        });
      }
    });
    console.log("previous data", this.historyOfTM);
  }

  filterTMHistory(searchTerm?: String) {
    if (!searchTerm) {
      this.filteredTMHistory = this.historyOfTM;
    }
    else {
      this.filteredTMHistory = [];
      this.historyOfTM.forEach((item) => {
        const value: string = '' + item.VisitCategory;
        if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
          this.filteredTMHistory.push(item);
        }
      });
    }

    this.previousTMHistoryActivePage = 1;
    this.previousTMHistoryPageChanged({
      page: 1,
      itemsPerPage: this.previousTMHistoryRowsPerPage
    })
  }

  previousTMHistoryPagedList = [];
  previousTMHistoryPageChanged(event): void {
    console.log('called', event)
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    // this.previousTMHistoryPagedList = this.filteredTMHistory.slice(startItem, endItem);
     this.previousTMHistoryPagedList = this.historyOfTM.slice(startItem, endItem);
    console.log('list', this.previousTMHistoryPagedList)
  }


}
