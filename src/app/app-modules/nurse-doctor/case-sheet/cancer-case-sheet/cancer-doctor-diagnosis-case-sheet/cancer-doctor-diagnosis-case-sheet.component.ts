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
import { DoctorService } from '../../../shared/services/doctor.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { RegistrarService } from 'app/app-modules/registrar/shared/services/registrar.service';
import { ConfirmationService } from 'app/app-modules/core/services';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { MasterdataService } from 'app/app-modules/nurse-doctor/shared/services/masterdata.service';

@Component({
  selector: 'cancer-doctor-diagnosis-case-sheet',
  templateUrl: './cancer-doctor-diagnosis-case-sheet.component.html',
  styleUrls: ['./cancer-doctor-diagnosis-case-sheet.component.css']
})
export class CancerDoctorDiagnosisCaseSheetComponent implements OnInit {

  @Input('data')
  casesheetData: any;
  @Input('previous')
  previous: any;
  @Input('printPagePreviewSelect')
  printPagePreviewSelect: any;

  healthIDValue: string='';
  beneficiaryDetails: any;
  currentVitals: any;
  caseSheetDiagnosisData: any;
  date: any;
  imgUrl: any;
  currentLanguageSet: any;
  benDetails: any;
  covidVaccineDetails: any;
  ageValidationForVaccination="< 12 years";

  constructor(private doctorService: DoctorService,
    public httpServiceService: HttpServiceService,
    private registrarService: RegistrarService,
    private confirmationService: ConfirmationService,
    private masterdataService: MasterdataService
    ) { }

  ngOnInit() {
    let t = new Date();
    this.date = t.getDate() + "/" + (t.getMonth() + 1) + "/" + t.getFullYear();
    this.getHealthIDDetails();
    // this.changeLanguage();
    this.assignSelectedLanguage();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }

  ngOnChanges() {
    console.log(this.casesheetData);

    if (this.casesheetData) {
      if (this.casesheetData.BeneficiaryData)
        this.beneficiaryDetails = this.casesheetData.BeneficiaryData;

      if (this.beneficiaryDetails.serviceDate) {
        let sDate = new Date(this.beneficiaryDetails.serviceDate);
        this.beneficiaryDetails.serviceDate = [
          this.padLeft.apply(sDate.getDate()),
          this.padLeft.apply((sDate.getMonth() + 1)),
          this.padLeft.apply(sDate.getFullYear())].join('/') +
          ' ' +
          [this.padLeft.apply(sDate.getHours()),
          this.padLeft.apply(sDate.getMinutes()),
          this.padLeft.apply(sDate.getSeconds())].join(':');
      }

      if (this.beneficiaryDetails.consultationDate) {
        let cDate = new Date(this.beneficiaryDetails.consultationDate);
        this.beneficiaryDetails.consultationDate = [
          this.padLeft.apply(cDate.getDate()),
          this.padLeft.apply((cDate.getMonth() + 1)),
          this.padLeft.apply(cDate.getFullYear())].join('/') +
          ' ' +
          [this.padLeft.apply(cDate.getHours()),
          this.padLeft.apply(cDate.getMinutes()),
          this.padLeft.apply(cDate.getSeconds())].join(':');
      }

      if (this.casesheetData.nurseData && this.casesheetData.nurseData.currentVitals)
        this.currentVitals = this.casesheetData.nurseData.currentVitals;

      if (this.casesheetData.doctorData && this.casesheetData.doctorData.diagnosis)
        this.caseSheetDiagnosisData = this.casesheetData.doctorData.diagnosis;

        this.getVaccinationTypeAndDoseMaster();
    }
    this.downloadSign();
 
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
              this.currentLanguageSet = response[this.language];             
              
            } else {
              console.log(
                this.currentLanguageSet.alerts.info.comingUpWithThisLang +
                  " " +
                  this.language
              );
            }
          },
          error => {
            console.log(
              this.currentLanguageSet.alerts.info.comingUpWithThisLang +
                " " +
                this.language
            );
          }
        );
    }else{
      this.httpServiceService.currentLangugae$.subscribe(
        response => (this.currentLanguageSet = response)
      );
    }

  }
  
  padLeft() {
    let len = (String(10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join('0') + this : this;
  }
  downloadSign() {
    if (this.beneficiaryDetails && this.beneficiaryDetails.tCSpecialistUserID) {
      let tCSpecialistUserID = this.beneficiaryDetails.tCSpecialistUserID;
      this.doctorService.downloadSign(tCSpecialistUserID).subscribe((response) => {
        const blob = new Blob([response], { type: response.type });
        this.showSign(blob);
      }, (err) => {
        console.log('error');
      })
    } else {
      console.log("No tCSpecialistUserID found");
    }
  }
  showSign(blob) {
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = (_event) => {
      this.imgUrl = reader.result;
    }
  }
  getHealthIDDetails()
  {
    let data = {
      "beneficiaryRegID": localStorage.getItem('caseSheetBeneficiaryRegID'),
      "beneficiaryID": null
    }
    this.registrarService.getHealthIdDetails(data)
      .subscribe((healthIDDetails) => {
        if (healthIDDetails.statusCode == 200) {
          console.log("healthID",healthIDDetails);
          if(healthIDDetails.data !=undefined && healthIDDetails.data.BenHealthDetails !=undefined && healthIDDetails.data.BenHealthDetails !=null)
          {
          this.benDetails=healthIDDetails.data.BenHealthDetails;
          if(this.benDetails.length >0)
          {
          this.benDetails.forEach((healthID) => {
            if(healthID.healthId !=undefined && healthID.healthId !=null)
            this.healthIDValue=this.healthIDValue+healthID.healthId+',';
          })
        }
          if(this.healthIDValue !=undefined && this.healthIDValue !=null && this.healthIDValue.length >1)
          this.healthIDValue=this.healthIDValue.substring(0,this.healthIDValue.length-1);
        }
        } else {
          this.confirmationService.alert(this.currentLanguageSet.issueInGettingBeneficiaryABHADetails, 'error');
        }
      }, (err) => {
        this.confirmationService.alert(this.currentLanguageSet.issueInGettingBeneficiaryABHADetails, 'error');

      });
  }

  getVaccinationTypeAndDoseMaster(){
    if(this.beneficiaryDetails.ageVal >= 12) {
    this.masterdataService.getVaccinationTypeAndDoseMaster().subscribe((res) => {
      if (res.statusCode == 200) {
        if (res.data) {
          let doseTypeList = res.data.doseType;
          let vaccineTypeList = res.data.vaccineType;
              this.getPreviousCovidVaccinationDetails(doseTypeList,vaccineTypeList);
         
        }
       
      }
      
    }, err => {
      console.log("error",err.errorMessage);
    });

  }

  }

  getPreviousCovidVaccinationDetails(doseTypeList,vaccineTypeList)
  {
    let beneficiaryRegID = localStorage.getItem('caseSheetBeneficiaryRegID');
    this.masterdataService.getPreviousCovidVaccinationDetails(beneficiaryRegID).subscribe((res) => {
      if (res.statusCode == 200) {
        if (res.data.covidVSID) {
          this.covidVaccineDetails=res.data;

          if(res.data.doseTypeID !== undefined && res.data.doseTypeID !== null && res.data.covidVaccineTypeID !== undefined && res.data.covidVaccineTypeID !== null) 
          {
          this.covidVaccineDetails.doseTypeID = doseTypeList.filter(item => {
            return item.covidDoseTypeID === res.data.doseTypeID;
          });
          this.covidVaccineDetails.covidVaccineTypeID = vaccineTypeList.filter(item => {
            return item.covidVaccineTypeID === res.data.covidVaccineTypeID;
          });
        }

        }
       
      }
      
    }, err => {
     console.log("error",err.errorMessage);
    });
   
  }
}
