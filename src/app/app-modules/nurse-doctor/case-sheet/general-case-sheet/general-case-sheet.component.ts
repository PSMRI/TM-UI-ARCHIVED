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


import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { DoctorService } from '../../shared/services/doctor.service';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Location } from '@angular/common';
import { PrintPageSelectComponent } from '../../print-page-select/print-page-select.component';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'app-general-case-sheet',
  templateUrl: './general-case-sheet.component.html',
  styleUrls: ['./general-case-sheet.component.css']
})
export class GeneralCaseSheetComponent implements OnInit {
  @Input('previous')
  previous: any;

  @Input('serviceType')
  serviceType: any;

  caseSheetData: any;
  visitCategory: any;
  hideBack: Boolean = false;
  language_file_path: any = "./assets/";
  language : any;

  printPagePreviewSelect = {
    caseSheetANC: true,
    caseSheetPNC: true,
    caseSheetHistory: true,
    caseSheetExamination: true,
    caseSheetPrescription: true,
    caseSheetDiagnosis: true,
    caseSheetInvestigations: true,
    caseSheetExtInvestigation: true,
    caseSheetCurrentVitals: true,
    caseSheetChiefComplaints: true,
    caseSheetClinicalObservations: true,
    caseSheetFindings: true,
    caseSheetCovidVaccinationDetails: true
  }
  current_language_set: any;

  constructor(
    private location: Location,
    private dialog: MdDialog,
    private doctorService: DoctorService,
    private route: ActivatedRoute,
    public httpServiceService: HttpServiceService) { }

  ngOnInit() {
    this.dataStore = this.route.snapshot.params['printablePage'] || 'previous';

    let caseSheetRequest;
    if (this.dataStore == 'current') {
      this.visitCategory = localStorage.getItem('caseSheetVisitCategory');
      caseSheetRequest = {
        "VisitCategory": localStorage.getItem('caseSheetVisitCategory'),
        "benFlowID": localStorage.getItem('caseSheetBenFlowID'),
        "benVisitID": localStorage.getItem('caseSheetVisitID'),
        "beneficiaryRegID": localStorage.getItem('caseSheetBeneficiaryRegID'),
        "visitCode": localStorage.getItem('visitCode')
      }
      this.getCasesheetData(caseSheetRequest);
    }
    if (this.dataStore == 'previous') {
      this.hideBack = true;

      this.visitCategory = localStorage.getItem('previousCaseSheetVisitCategory');
      caseSheetRequest = {
        "VisitCategory": localStorage.getItem('previousCaseSheetVisitCategory'),
        "benFlowID": localStorage.getItem('previousCaseSheetBenFlowID'),
        "beneficiaryRegID": localStorage.getItem('previousCaseSheetBeneficiaryRegID'),
        "visitCode": localStorage.getItem('previousCaseSheetVisitCode')
      }
      this.getCasesheetData(caseSheetRequest);
    }

    this.assignSelectedLanguage();
    // this.language = sessionStorage.getItem('setLanguage');
    
    // if (this.language != undefined) {
    //   this.httpServiceService
    //     .getLanguage(this.language_file_path + this.language + ".json")
    //     .subscribe(
    //       response => {
    //         if (response) {
    //           this.current_language_set = response[this.language];             
              
    //         } else {
    //           console.log(
    //             this.current_language_set.alerts.info.comingUpWithThisLang +
    //               " " +
    //               this.language
    //           );
    //         }
    //       },
    //       error => {
    //         console.log(
    //           this.current_language_set.alerts.info.comingUpWithThisLang +
    //             " " +
    //             this.language
    //         );
    //       }
    //     );
    // }else{
    //   this.httpServiceService.currentLangugae$.subscribe(
    //     response => (this.current_language_set = response)
    //   );
    // }

  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }

  dataStore: any;
  ngOnDestroy() {
    if (this.casesheetSubs)
      this.casesheetSubs.unsubscribe();
  }

  casesheetSubs: any;
  hideSelectQC: Boolean = false;

  getCasesheetData(caseSheetRequest) {
    // if (this.visitCategory == 'General OPD (QC)' || this.previous == true) {
    //   this.hideSelectQC = true;
    // }
    if (this.serviceType == 'TM') {
      this.getTMCasesheetData(caseSheetRequest)
    }
    if (this.serviceType == 'MMU') {
      this.getMMUCasesheetData(caseSheetRequest);
    }

  }
  getMMUCasesheetData(caseSheetRequest) {
    this.casesheetSubs = this.doctorService.getMMUCasesheetData(caseSheetRequest)
      .subscribe(res => {
        if (res && res.statusCode == 200 && res.data) {
          this.caseSheetData = res.data;
          console.log('caseSheetData', JSON.stringify(this.caseSheetData, null, 4));
        }
      });
  }
  getTMCasesheetData(caseSheetRequest) {
    this.casesheetSubs = this.doctorService.getTMCasesheetData(caseSheetRequest)
      .subscribe(res => {
        if (res && res.statusCode == 200 && res.data) {
          this.caseSheetData = res.data;
          console.log('caseSheetData', JSON.stringify(this.caseSheetData, null, 4));
        }
      });
  }

  selectPrintPage() {
    let mdDialogRef: MdDialogRef<PrintPageSelectComponent> = this.dialog.open(PrintPageSelectComponent, {
      width: '520px',
      disableClose: false,
      data: { printPagePreviewSelect: this.printPagePreviewSelect, visitCategory: this.visitCategory,
      }
    });

    mdDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.printPagePreviewSelect.caseSheetANC = result.caseSheetANC;
        this.printPagePreviewSelect.caseSheetPNC = result.caseSheetPNC;
        this.printPagePreviewSelect.caseSheetExamination = result.caseSheetExamination;
        this.printPagePreviewSelect.caseSheetHistory = result.caseSheetHistory;
        this.printPagePreviewSelect.caseSheetPrescription = result.caseSheetPrescription;
        this.printPagePreviewSelect.caseSheetDiagnosis = result.caseSheetDiagnosis;
        this.printPagePreviewSelect.caseSheetInvestigations = result.caseSheetInvestigations;
        this.printPagePreviewSelect.caseSheetExtInvestigation = result.caseSheetExtInvestigation;
        this.printPagePreviewSelect.caseSheetCurrentVitals = result.caseSheetCurrentVitals;
        this.printPagePreviewSelect.caseSheetChiefComplaints = result.caseSheetChiefComplaints;
        this.printPagePreviewSelect.caseSheetClinicalObservations = result.caseSheetClinicalObservations;
        this.printPagePreviewSelect.caseSheetFindings = result.caseSheetFindings;
        this.printPagePreviewSelect.caseSheetCovidVaccinationDetails = result.caseSheetCovidVaccinationDetails;
      }
    });
  }

  downloadCasesheet() {
    window.print();
  }

  goBack() {
    this.location.back();
  }

  goToTop() {
    window.scrollTo(0, 0);
  }

}
