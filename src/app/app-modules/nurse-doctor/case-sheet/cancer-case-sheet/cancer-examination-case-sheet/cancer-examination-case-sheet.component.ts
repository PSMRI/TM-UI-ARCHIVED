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


import { Component, OnInit, Input } from '@angular/core';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { DoctorService } from "app/app-modules/nurse-doctor/shared/services";
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import * as moment from 'moment';

@Component({
  selector: 'cancer-examination-case-sheet',
  templateUrl: './cancer-examination-case-sheet.component.html',
  styleUrls: ['./cancer-examination-case-sheet.component.css']
})
export class CancerExaminationCaseSheetComponent implements OnInit {

  @Input('data')
  casesheetData: any;
  @Input('previous')
  previous:any;
  gynecologicalImageUrl = 'assets/images/gynecologicalExamination.png';
  breastImageUrl = 'assets/images/breastExamination.png';
  abdominalImageUrl = 'assets/images/abdominalExamination.png';
  oralImageUrl = 'assets/images/oralExamination.png';
  date: any;
  signsAndSymptoms: any;
  BenCancerLymphNodeDetails: any;
  oralExamination: any;
  breastExamination: any;
  abdominalExamination: any;
  gynecologicalExamination: any;
  imageAnnotatedData: any;
  beneficiaryDetails: any;
  diagnosisdetails: any;

  blankRows = [1, 2, 3, 4]
  current_language_set: any;
  serviceList: string = "";

  constructor(public httpServiceService: HttpServiceService, private doctorService: DoctorService
    ) { }

  ngOnInit() {
  //  this.changeLanguage();
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

  ngOnChanges() {
    if (this.casesheetData) {
      if (this.casesheetData.BeneficiaryData)
        this.beneficiaryDetails = this.casesheetData.BeneficiaryData;

      this.signsAndSymptoms = this.casesheetData.nurseData.signsAndSymptoms;
      this.BenCancerLymphNodeDetails = this.casesheetData.nurseData.BenCancerLymphNodeDetails;
      this.oralExamination = this.casesheetData.nurseData.oralExamination;
      this.breastExamination = this.casesheetData.nurseData.breastExamination;
      this.abdominalExamination = this.casesheetData.nurseData.abdominalExamination;
      this.gynecologicalExamination = this.casesheetData.nurseData.gynecologicalExamination;
      this.imageAnnotatedData = this.casesheetData.ImageAnnotatedData;
    }
    let t = new Date();
    this.date = t.getDate() + "/" + (t.getMonth() + 1) + "/" + t.getFullYear();
    if(this.casesheetData !=undefined && this.casesheetData.doctorData !=undefined && this.casesheetData.doctorData.diagnosis !=undefined)
    this.diagnosisdetails = this.casesheetData.doctorData.diagnosis;
  // if(this.diagnosisdetails.refrredToAdditionalServiceList){
  //   console.log("institute",this.diagnosisdetails.refrredToAdditionalServiceList);
  //   for(let i  = 0; i <  this.diagnosisdetails.refrredToAdditionalServiceList.length;i++){
  //     this.serviceList += this.diagnosisdetails.refrredToAdditionalServiceList[i].serviceName;
  //     if(i>=0 && i < this.diagnosisdetails.refrredToAdditionalServiceList.length-1)
  //       this.serviceList += ",";
      
  //   }
  // }

  console.log(
    "referDetailsForRefercancer",
    JSON.stringify(this.diagnosisdetails, null, 4)
  );
  if(this.casesheetData !=undefined && this.casesheetData.doctorData !=undefined && this.casesheetData.doctorData.diagnosis !=undefined && !(moment(this.casesheetData.doctorData.diagnosis.revisitDate, 'DD/MM/YYYY',true).isValid()))
  {
    if(this.diagnosisdetails.revisitDate !=undefined)
    {
      let sDate = new Date(this.diagnosisdetails.revisitDate);
      this.diagnosisdetails.revisitDate = [
        this.padLeft.apply(sDate.getDate()),
        this.padLeft.apply((sDate.getMonth() + 1)),
        this.padLeft.apply(sDate.getFullYear())].join('/')
    }
   
  }
  }
  padLeft() {
    let len = (String(10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join('0') + this : this;
  }
  language_file_path: any = "./assets/";
  language : any;

  changeLanguage(){
    this.language = sessionStorage.getItem('setLanguage');
    
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
    }else{
      this.httpServiceService.currentLangugae$.subscribe(
        response => (this.current_language_set = response)
      );
    }

  }
  

  getImageAnnotation(imageID) {
    let arr = this.imageAnnotatedData.filter(item => item.imageID == imageID);
    return arr.length > 0 ? arr[0] : null;
  }

}
