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


import { Component, DoCheck, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";
import { ConfirmationService } from "app/app-modules/core/services";
import { BeneficiaryDetailsService } from "app/app-modules/core/services/beneficiary-details.service";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { DoctorService, MasterdataService, NurseService } from "../../shared/services";

@Component({
  selector: "app-covid-vaccination-status",
  templateUrl: "./covid-vaccination-status.component.html",
  styleUrls: ["./covid-vaccination-status.component.css"],
})
export class CovidVaccinationStatusComponent implements OnInit, DoCheck {
  currentLanguageSet: any;
  beneficiaryAge: any;
  enableVaccinationStatusFields: boolean=false;
  enableVaccineTypeAndDoseTakenFlag: boolean=false;
  doseTypeList: any=[];
  vaccineTypeList: any=[];
  // enableDoseOne: boolean=false;
  // enableBoosterDose: boolean=false;
  // enableDoseTwo: boolean=false;
  today: Date;
  enableSaveButton: boolean=true;
  // enableSaveButtonForDoseTaken: boolean=true;

  constructor(private httpService: HttpServiceService,private beneficiaryDetailsService: BeneficiaryDetailsService,
    private nurseService: NurseService,  private confirmationService: ConfirmationService,
    private masterdataService: MasterdataService,private doctorService: DoctorService,) {}
  @Input("covidVaccineStatusForm")
  covidVaccineStatusForm: FormGroup;
  ageGroupsList : any=["<12 years", ">=12 years"];
  applicableForVaccineStatusList : any =["Not Applicable for Vaccination", "Applicable for Vaccination"];

  ngOnInit() {
    this.doctorService.enableCovidVaccinationButton = false;
    this.doctorService.covidVaccineAgeGroup = null;
    this.assignSelectedLanguage();
    this.getBenificiaryDetails();
    this.getVaccinationTypeAndDoseMaster();
    this.today = new Date();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  beneficiaryDetailsSubscription: any;
  getBenificiaryDetails() {
    this.beneficiaryDetailsSubscription = this.beneficiaryDetailsService.beneficiaryDetails$
      .subscribe(beneficiaryDetails => {
        if (beneficiaryDetails) {
          this.beneficiaryAge = beneficiaryDetails.ageVal;
          if(this.beneficiaryAge < 12) {
            this.covidVaccineStatusForm.controls["ageGroup"].setValue("<12 years");
            this.doctorService.covidVaccineAgeGroup = "<12 years";
            this.covidVaccineStatusForm.controls["isApplicableForVaccine"].setValue("Not Applicable for Vaccination");
            this.enableVaccinationStatusFields=false;
          }
          else
          {
            this.covidVaccineStatusForm.controls["ageGroup"].setValue(">=12 years");
            this.doctorService.covidVaccineAgeGroup = ">=12 years";
            this.covidVaccineStatusForm.controls["isApplicableForVaccine"].setValue("Applicable for Vaccination");
            this.enableVaccinationStatusFields=true;
          }
           this.covidVaccineStatusForm.controls["ageGroup"].disable();
          this.covidVaccineStatusForm.controls["isApplicableForVaccine"].disable();
        }
      })
  }

  setIsApplicable()
  {
    this.covidVaccineStatusForm.controls["isApplicableForVaccine"].setValue(null);
    this.covidVaccineStatusForm.controls["vaccineStatus"].setValue(null);
    this.covidVaccineStatusForm.controls["vaccineTypes"].setValue(null);
    this.covidVaccineStatusForm.controls["doseTaken"].setValue(null);
    this.enableVaccineTypeAndDoseTakenFlag=false;
    this.enableSaveButton=true;
    this.doctorService.enableCovidVaccinationButton = false;
    this.doctorService.covidVaccineAgeGroup = this.covidVaccineStatusForm.controls["ageGroup"].value;

    if(this.covidVaccineStatusForm.controls["ageGroup"].value === "<12 years") {
      this.covidVaccineStatusForm.controls["isApplicableForVaccine"].setValue("Not Applicable for Vaccination");
      this.enableVaccinationStatusFields=false;
      this.enableSaveButton=false;
      this.doctorService.enableCovidVaccinationButton = true;
    }
    else
    {
      this.covidVaccineStatusForm.controls["isApplicableForVaccine"].setValue("Applicable for Vaccination");
      this.enableVaccinationStatusFields=true;
    }
  }

  enableVaccineTypeAndDoseTaken()
  {
    this.covidVaccineStatusForm.controls["vaccineTypes"].setValue(null);
    this.covidVaccineStatusForm.controls["doseTaken"].setValue(null);
    // this.resetFlags();
    if(this.covidVaccineStatusForm.controls["vaccineStatus"].value === "YES")
    {
      this.enableVaccineTypeAndDoseTakenFlag=true;
      this.enableSaveButton=true;
      this.doctorService.enableCovidVaccinationButton = false;
  
    }
    else{
      this.enableVaccineTypeAndDoseTakenFlag=false;
      this.enableSaveButton=false;
      this.doctorService.enableCovidVaccinationButton = true;

    }
  }



  getVaccinationTypeAndDoseMaster(){
    this.masterdataService.getVaccinationTypeAndDoseMaster().subscribe((res) => {
      if (res.statusCode == 200) {
        if (res.data) {
          this.doseTypeList = res.data.doseType;
          this.vaccineTypeList = res.data.vaccineType;
          if(this.beneficiaryAge >= 12) 
              this.getPreviousCovidVaccinationDetails();
         
        }
       
      }
      
    }, err => {
      console.log("error",err.errorMessage);
    });

  
   

   

  }

  getPreviousCovidVaccinationDetails()
  {
    let beneficiaryRegID = localStorage.getItem('beneficiaryRegID');
    this.masterdataService.getPreviousCovidVaccinationDetails(beneficiaryRegID).subscribe((res) => {
      if (res.statusCode == 200) {
        if (res.data.covidVSID) {
          this.covidVaccineStatusForm.controls["covidVSID"].setValue(res.data.covidVSID);
          this.covidVaccineStatusForm.controls["vaccineStatus"].setValue(res.data.vaccineStatus);
          this.enableVaccineTypeAndDoseTaken();
       if(res.data.vaccineStatus === "YES") {
          this.covidVaccineStatusForm.controls["vaccineTypes"].setValue(res.data.covidVaccineTypeID);
          this.covidVaccineStatusForm.controls["doseTaken"].setValue(res.data.doseTypeID);

        }
        this.enableSaveButton=true;
        this.doctorService.enableCovidVaccinationButton = false;
        }
       
      }
      
    }, err => {
     console.log("error",err.errorMessage);
    });

}

  

 
    


  saveBenCovidVaccinationDetails()
{
  this.nurseService
  .saveBenCovidVaccinationDetails(
    this.covidVaccineStatusForm
  )
  .subscribe(
    (res: any) => {
      if (res.statusCode == 200 && res.data != null) {

        this.doctorService.enableCovidVaccinationButton = false;
        this.confirmationService.alert(this.currentLanguageSet.covidVaccinationDetailsSaved, 'success');
        this.covidVaccineStatusForm.controls["covidVSID"].setValue(res.data.covidVSID);
        this.enableSaveButton=true;
        this.covidVaccineStatusForm.markAsPristine();
   
      
      } else {
        this.confirmationService.alert(res.errorMessage, "error");
      }
    },
    err => {
      this.confirmationService.alert(err, "error");
    }
  );
}

enableSaveButtonInForm()
{
  if(this.covidVaccineStatusForm.controls["vaccineTypes"].value !== undefined && this.covidVaccineStatusForm.controls["vaccineTypes"].value !== null 
   && this.covidVaccineStatusForm.controls["doseTaken"].value !== undefined && this.covidVaccineStatusForm.controls["doseTaken"].value !== null )
  {
    this.enableSaveButton=false;
    this.doctorService.enableCovidVaccinationButton = true;
  }
  else
  {
    this.enableSaveButton=true;
    this.doctorService.enableCovidVaccinationButton = false;
  }
    
}

}
