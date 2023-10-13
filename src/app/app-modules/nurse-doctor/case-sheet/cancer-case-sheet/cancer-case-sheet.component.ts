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


import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Input
} from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { ConfirmationService } from "../../../core/services/confirmation.service";
import { MdDialogRef, MdDialog, MdDialogConfig } from "@angular/material";
import { DoctorService } from "../../shared/services/doctor.service";
import { PrintPageSelectComponent } from "../../print-page-select/print-page-select.component";
import { BeneficiaryDetailsService } from "../../../core/services/beneficiary-details.service";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";

@Component({
  selector: "app-cancer-case-sheet",
  templateUrl: "./cancer-case-sheet.component.html",
  styleUrls: ["./cancer-case-sheet.component.css"]
})
export class CancerCaseSheetComponent implements OnInit {
  @Input("previous")
  previous: any;

  @Input("serviceType")
  serviceType: any;

  printPagePreviewSelect = {
    caseSheetHistory: true,
    caseSheetExamination: true,
    caseSheetCurrentVitals: true,
    cancerCaseSheetObservations: true,
    caseSheetCovidVaccinationDetails: true
  };

  visitCategory: string;
  hideBack: Boolean = false;
  getCaseSheetDataVisit: any;
  current_language_set: any;

  constructor(
    private doctorService: DoctorService,
    private dialog: MdDialog,
    private location: Location,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    public httpServiceService: HttpServiceService
  ) {}

  ngOnInit() {
    let dataStore = this.route.snapshot.params["printablePage"] || "previous";
    let caseSheetRequest;
    if (dataStore == "current") {
      caseSheetRequest = {
        VisitCategory: localStorage.getItem("caseSheetVisitCategory"),
        benFlowID: localStorage.getItem("caseSheetBenFlowID"),
        benVisitID: localStorage.getItem("caseSheetVisitID"),
        beneficiaryRegID: localStorage.getItem("caseSheetBeneficiaryRegID"),
        visitCode: localStorage.getItem("visitCode")
      };
      this.getCaseSheetDataVisit = {
        benVisitID: localStorage.getItem("caseSheetVisitID"),
        benRegID: localStorage.getItem("caseSheetBeneficiaryRegID"),
        benFlowID: localStorage.getItem("caseSheetBenFlowID")
      };
      this.visitCategory = localStorage.getItem("caseSheetVisitCategory");
      this.getCurrentRole();
      this.getCasesheetData(caseSheetRequest);
    }
    if (dataStore == "previous") {
      this.hideBack = true;
      caseSheetRequest = {
        VisitCategory: localStorage.getItem("previousCaseSheetVisitCategory"),
        benFlowID: localStorage.getItem("previousCaseSheetBenFlowID"),
        beneficiaryRegID: localStorage.getItem(
          "previousCaseSheetBeneficiaryRegID"
        ),
        visitCode: localStorage.getItem("previousCaseSheetVisitCode")
      };
      this.getCaseSheetDataVisit = {
        benVisitID: localStorage.getItem("previousCaseSheetVisitID"),
        benRegID: localStorage.getItem("previousCaseSheetBeneficiaryRegID"),
        benFlowID: localStorage.getItem("previousCaseSheetBenFlowID")
      };
      this.visitCategory = localStorage.getItem(
        "previousCaseSheetVisitCategory"
      );
      this.getCurrentRole();
      this.getCasesheetData(caseSheetRequest);
    }
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
    // this.changeLanguage();
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
    if (this.casesheetSubs) this.casesheetSubs.unsubscribe();

    // localStorage.removeItem('currentRole');
  }

  language_file_path: any = "./assets/";
  language: any;

  changeLanguage() {
    this.language = sessionStorage.getItem("setLanguage");

    if (this.language != undefined) {
      this.httpServiceService
        .getLanguage(this.language_file_path + this.language + ".json")
        .subscribe(
          response => {
            if (response) {
              this.current_language_set = response[this.language];
            } else {
              console.log(
                this.current_language_set.alerts.info.comingUpWithThisLang +
                  " " +
                  this.language
              );
            }
          },
          error => {
            console.log(
              this.current_language_set.alerts.info.comingUpWithThisLang +
                " " +
                this.language
            );
          }
        );
    } else {
      this.httpServiceService.currentLangugae$.subscribe(
        response => (this.current_language_set = response)
      );
    }
  }

  oncologistRemarks: any;
  getCurrentRole() {
    let currentRole = localStorage.getItem("currentRole");
    if (currentRole && currentRole === "Oncologist") {
      this.oncologistRemarks = true;
    }
  }

  caseSheetData: any;
  caseSheetDiagnosisData: any;
  casesheetSubs: any;

  getCasesheetData(caseSheetRequest) {
    if (this.serviceType == "TM") {
      this.getTMCasesheetData(caseSheetRequest);
    }
    if (this.serviceType == "MMU") {
      this.getMMUCasesheetData(caseSheetRequest);
    }
  }
  getMMUCasesheetData(caseSheetRequest) {
    this.casesheetSubs = this.doctorService
      .getMMUCasesheetData(caseSheetRequest)
      .subscribe(res => {
        if (res && res.statusCode == 200 && res.data) {
          this.caseSheetData = res.data;
          console.log(
            "caseSheetData",
            JSON.stringify(this.caseSheetData, null, 4)
          );
        }
      });
  }
  getTMCasesheetData(caseSheetRequest) {
    this.casesheetSubs = this.doctorService
      .getTMCasesheetData(caseSheetRequest)
      .subscribe(res => {
        if (res && res.statusCode == 200 && res.data) {
          this.caseSheetData = res.data;
          console.log(
            "caseSheetData",
            JSON.stringify(this.caseSheetData, null, 4)
          );
        }
      });
  }

  getOncologistRemarks() {
    let value = undefined;
    if (
      this.caseSheetDiagnosisData &&
      this.caseSheetDiagnosisData.provisionalDiagnosisOncologist
    ) {
      value = this.caseSheetDiagnosisData.provisionalDiagnosisOncologist;
    }

    this.confirmationService
      .editRemarks(
        this.current_language_set.casesheet.oncologistObservation,
        value
      )
      .subscribe(result => {
        if (result) {
          if (!this.caseSheetDiagnosisData) {
            this.caseSheetDiagnosisData = {};
          }
          result = result.slice(0, result.lastIndexOf("."));
          this.caseSheetDiagnosisData.provisionalDiagnosisOncologist = result;
          this.saveOncologistRemarks(result);
        }
      });
  }

  saveOncologistRemarks(result) {
    this.doctorService
      .postOncologistRemarksforCancerCaseSheet(
        result,
        this.getCaseSheetDataVisit.benVisitID,
        this.getCaseSheetDataVisit.benRegID
      )
      .subscribe(res => {
        if (res.statusCode == 500 || res.statusCode == 5000) {
          this.confirmationService.alert(res.errorMessage, "error");
        } else if (res.statusCode == 200) {
          if (this.caseSheetData && this.caseSheetData.doctorData) {
            this.caseSheetData = {
              ...this.caseSheetData,
              doctorData: {
                ...this.caseSheetData.doctorData,
                diagnosis: {
                  ...this.caseSheetData.doctorData.diagnosis,
                  provisionalDiagnosisOncologist: result
                }
              }
            };
          }
          // this.confirmationService.alert(res.data.response, 'success');
          this.confirmationService.alert(
            this.current_language_set.common.Dataupdatedsuccessfully,
            "success"
          );
        }
      });
  }

  selectPrintPage() {
    let mdDialogRef: MdDialogRef<PrintPageSelectComponent> = this.dialog.open(
      PrintPageSelectComponent,
      {
        width: "520px",
        disableClose: false,
        data: {
          printPagePreviewSelect: this.printPagePreviewSelect,
          visitCategory: this.visitCategory
        }
      }
    );

    mdDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.printPagePreviewSelect.caseSheetExamination =
          result.caseSheetExamination;
        this.printPagePreviewSelect.caseSheetHistory = result.caseSheetHistory;
        this.printPagePreviewSelect.caseSheetCurrentVitals =
          result.caseSheetCurrentVitals;
        this.printPagePreviewSelect.cancerCaseSheetObservations =
          result.cancerCaseSheetObservations;
          this.printPagePreviewSelect.caseSheetCovidVaccinationDetails =
          result.caseSheetCovidVaccinationDetails;
          
      }
    });
  }

  printPage() {
    window.print();
  }

  goToTop() {
    window.scrollTo(0, 0);
  }

  goBack() {
    this.location.back();
  }
}
