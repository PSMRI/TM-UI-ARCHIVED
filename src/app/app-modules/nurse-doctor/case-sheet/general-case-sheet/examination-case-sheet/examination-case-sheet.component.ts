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


import { Component, OnInit, Input } from "@angular/core";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { DoctorService } from "app/app-modules/nurse-doctor/shared/services";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";

@Component({
  selector: "app-examination-case-sheet",
  templateUrl: "./examination-case-sheet.component.html",
  styleUrls: ["./examination-case-sheet.component.css"]
})
export class ExaminationCaseSheetComponent implements OnInit {
  @Input("previous")
  previous: any;

  @Input("data")
  casesheetData: any;

  visitCategory: any;

  generalExamination: any;
  headToToeExamination: any;
  gastroIntestinalExamination: any;
  cardioVascularExamination: any;
  respiratorySystemExamination: any;
  centralNervousSystemExamination: any;
  musculoskeletalSystemExamination: any;
  genitoUrinarySystemExamination: any;
  obstetricExamination: any;
  current_language_set: any;
  refer: any;
  referDetails: any;
  beneficiaryRegID: any;
  visitID: any;
  revisitDate: any;
  date: string;
  serviceList: String = "";

  constructor(
    public httpServiceService: HttpServiceService,
    private doctorService: DoctorService
  ) {}

  ngOnInit() {
    this.visitCategory = localStorage.getItem("caseSheetVisitCategory");
    this.beneficiaryRegID = localStorage.getItem("beneficiaryRegID");
    this.visitID = localStorage.getItem("visitID");
    this.assignSelectedLanguage();
    // this.visitCategory = localStorage.getItem('visitCategory');
    // this.getReferDetails(this.beneficiaryRegID, this.visitID, this.visitCategory);
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
    // this.changeLanguage();
  }
  // referSubscription: any;
  // getReferDetails(beneficiaryRegID, visitID, visitCategory) {
  //   this.referSubscription = this.doctorService.getCaseRecordAndReferDetails(beneficiaryRegID, visitID, visitCategory)
  //     .subscribe(res => {
  //       if (res && res.statusCode == 200 && res.data && res.data.Refer) {
  //         this.patchReferDetails(res.data.Refer);
  //       }
  //     })
  // }

  // patchReferDetails(referDetails) {
  //   console.log("revisitDate:" + this.revisitDate);
  //   this.revisitDate=referDetails.revisitDate;
  // }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }

  ngOnChanges() {
    if (
      this.casesheetData &&
      this.casesheetData.nurseData &&
      this.casesheetData.nurseData.examination
    ) {
      let examination = this.casesheetData.nurseData.examination;

      if (examination.generalExamination)
        this.generalExamination = examination.generalExamination;

      if (examination.headToToeExamination)
        this.headToToeExamination = examination.headToToeExamination;

      if (examination.cardiovascularExamination)
        this.cardioVascularExamination = examination.cardiovascularExamination;

      if (examination.respiratoryExamination)
        this.respiratorySystemExamination = examination.respiratoryExamination;

      if (examination.centralNervousExamination)
        this.centralNervousSystemExamination =
          examination.centralNervousExamination;

      if (examination.musculoskeletalExamination)
        this.musculoskeletalSystemExamination =
          examination.musculoskeletalExamination;

      if (examination.genitourinaryExamination)
        this.genitoUrinarySystemExamination =
          examination.genitourinaryExamination;

      if (examination.obstetricExamination)
        this.obstetricExamination = examination.obstetricExamination;

      if (examination.gastrointestinalExamination)
        this.gastroIntestinalExamination =
          examination.gastrointestinalExamination;
    }
    // let t = new Date();
    //   this.date = t.getDate() + "/" + (t.getMonth() + 1) + "/" + t.getFullYear();
    if (this.casesheetData && this.casesheetData.doctorData) {
      this.referDetails = this.casesheetData.doctorData.Refer;
      console.log("refer", this.referDetails);

      if (this.referDetails && this.referDetails.refrredToAdditionalServiceList) {
        console.log(
          "institute",
          this.referDetails.refrredToAdditionalServiceList
        );
        for (
          let i = 0;
          i < this.referDetails.refrredToAdditionalServiceList.length;
          i++
        ) {
          if (this.referDetails.refrredToAdditionalServiceList[i].serviceName) {
            this.serviceList += this.referDetails.refrredToAdditionalServiceList[
              i
            ].serviceName;
            if (
              i >= 0 &&
              i < this.referDetails.refrredToAdditionalServiceList.length - 1
            )
              this.serviceList += ",";
          }
        }
      }
      console.log(
        "referDetailsForReferexamination",
        JSON.stringify(this.casesheetData, null, 4)
      );
    }
    // if(this.casesheetData.doctorData.Refer)
    // {
    //   let sDate = new Date(this.referDetails.revisitDate);
    //   this.referDetails.revisitDate = [
    //     this.padLeft.apply(sDate.getDate()),
    //     this.padLeft.apply((sDate.getMonth() + 1)),
    //     this.padLeft.apply(sDate.getFullYear())].join('/')
    // }
  }
  padLeft() {
    let len = String(10).length - String(this).length + 1;
    return len > 0 ? new Array(len).join("0") + this : this;
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
}
