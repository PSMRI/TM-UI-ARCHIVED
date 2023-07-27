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


import { Component, OnInit, Input, EventEmitter, Output, DoCheck } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";
import {
  MasterdataService,
  NurseService,
  DoctorService
} from "../../shared/services";
// import { NurseService, DoctorService } from '../shared/services';

@Component({
  selector: "symptoms",
  templateUrl: "./symptoms.component.html",
  styleUrls: ["./symptoms.component.css"]
})
export class SymptomsComponent implements OnInit, DoCheck {
  @Input("patientCovidForm")
  patientCovidForm: FormGroup;
  symptomsList: string[] = [];

  @Input("mode")
  mode: string;

  @Output() onFilter: EventEmitter<any> = new EventEmitter<any>();
  symptomsArray: string[];
  symptoms: any;
  answer1: string;
  symptomsarray: string[];
  currentLanguageSet: any;

  constructor(
    private fb: FormBuilder,
    private nurseService: NurseService,
    private doctorService: DoctorService,
    private masterdataService: MasterdataService,
    private httpServiceService: HttpServiceService
  ) {}

  disable: any = ["false", "false", "false", "false"];
  checked: boolean[] = [false, false, false, false];

  ngOnInit() {
    this.assignSelectedLanguage();
    localStorage.setItem("symptom", "null");

    this.disable = ["false", "false", "false", "false"];
    this.checked = [false, false, false, false];
    //this.symptomsArray=["Fever","Cough","Breathing difficulties","No symptoms"];
    // this.symptomsList=["Fever","Cough","Breathing difficulties","No symptoms"];
    this.getMasterData();
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
    if (this.mode == 'view') {
      let visitID = localStorage.getItem('visitID');
      let benRegID = localStorage.getItem('beneficiaryRegID')
      this.getHistoryDetails(benRegID, visitID);
    }
 
  }
  ngOnDestroy(){
    if (this.nurseMasterDataSubscription)
      this.nurseMasterDataSubscription.unsubscribe();

    if (this.coividSymptomsHistory)
      this.coividSymptomsHistory.unsubscribe();
  }

  covidSymptoms : any;
  coividSymptomsHistory : any;
  getHistoryDetails(beneficiaryRegID, visitID){
    this.coividSymptomsHistory = this.doctorService.getVisitComplaintDetails(beneficiaryRegID, visitID)
      .subscribe(value => {
        if (value != null && value.statusCode == 200 && value.data != null && value.data.covidDetails != null)
        {
          console.log("coviddata" ,value.data.covidDetails.symptom); 
          this.covidSymptoms = value.data.covidDetails.symptom;
            this.patientCovidForm.patchValue({'symptom' : this.covidSymptoms});
            
        }
      });
  }

 
  getMMUHistoryDetails(beneficiaryRegID, visitID){
    this.coividSymptomsHistory = this.doctorService.getVisitComplaintDetails(beneficiaryRegID, visitID)
      .subscribe(value => {
        if (value != null && value.statusCode == 200 && value.data != null && value.data.covidDetails != null)
        {
          console.log("coviddata" ,value.data.covidDetails.symptom); 
          this.covidSymptoms = value.data.covidDetails.symptom;
            this.patientCovidForm.patchValue({'symptom' : this.covidSymptoms});
            this.symptomSelected();
         
        }
      });
  }

  symptomSelected() {
    console.log("SymptomLength" + this.symptom.length);
    if (this.symptom.length != 0) {
      if (this.symptom.indexOf("No Symptoms") > -1) {
        localStorage.setItem("symptom", "false");

        this.symptomsList = this.symptomsList.filter(item => {
          return item == "No Symptoms";
        });
        //this.answer1=true;
      } else {
        localStorage.setItem("symptom", "true"); //change

        this.symptomsList = this.symptomsList.filter(item => {
          return item != "No Symptoms";
        });
        if(this.symptom.length == 3)
        {
         localStorage.setItem('allSymptom',"true");
        }
        else{
         localStorage.setItem('allSymptom',"false");

        }
      }
      this.answer1 = localStorage.getItem("symptom");
      //this.outputToParent.emit( this.answer1);
      this.masterdataService.filter(this.answer1);
    } else 
    {this.symptomsList = this.symptomsArray;
      localStorage.setItem('symptom',"null");
      localStorage.setItem('allSymptom',"null");
      this.answer1=localStorage.getItem("symptom");
      //this.outputToParent.emit( this.answer1);
      this.masterdataService.filter( this.answer1);
    }
  }

  /* onCheckboxChagen(event, value,i,symptoms) {
          this.patientCovidForm.patchValue({ symptoms : symptoms});
           if(event.checked)
           {
             this.checked[i]=true;
             if(value=="No symptoms")
             {
               this.disable[1]=true;
               this.disable[0]=true;
               this.disable[2]=true;
             
             }
             else
             {
               this.disable[3]=true;
             }
           }
           if(!event.checked)
           {
             this.checked[i]=false;
            
            if(value=="No symptoms")
            {
              this.disable[1]=false;
              this.disable[0]=false;
              this.disable[2]=false;
              this.disable[3]=false;
            }
            if(this.disable[1]==="false" && this.checked[1]===false && this.disable[0]==="false" && this.checked[0]===false && this.disable[2]==="false" && this.checked[2]===false )
            this.disable[3]=false; 
              }
      
      
         }*/

  //  patchDataToFields(benRegID, visitID) {
  //   this.doctorService.getCovidDetails(benRegID, visitID).subscribe((pNCdata) => {
  //     let tempPNCData = Object.assign({}, pNCdata.data.PNCCareDetail);

  //     if (this.masterData.symptoms) {
  //       tempPNCData.symptoms = this.masterData.symptoms.filter((data) => {
  //         return data.symptoms == tempPNCData.symptoms;
  //       })[0];
  //     }
  //     let patchPNCdata = Object.assign({}, tempPNCData);
  //     this.patientCovidForm.patchValue(tempPNCData);
  //   })
  // }

  // patchDataToFields(benRegID, visitID) {
  //   this.doctorService.getPNCDetails(benRegID, visitID).subscribe(pNCdata => {
  //     let tempPNCData = Object.assign({}, pNCdata.data.PNCCareDetail);

  //     if (this.masterData.deliveryTypes) {
  //       tempPNCData.covidSymptomsMaster = this.masterData.covidSymptomsMaster.filter(
  //         data => {
  //           return data.covidSymptomsMaster == tempPNCData.covidSymptomsMaster;
  //         }
  //       )[0];
  //     }

  //     let patchPNCdata = Object.assign({}, tempPNCData);
  //     this.patientCovidForm.patchValue(tempPNCData);
  //   });
  // }

  masterData: any;
  nurseMasterDataSubscription: any;
  getMasterData() {
    this.nurseMasterDataSubscription = this.masterdataService.nurseMasterData$.subscribe(
      masterData => {
        if (masterData && masterData.covidSymptomsMaster) {
          this.nurseMasterDataSubscription.unsubscribe();
          console.log("covidSymptomsMaster =" + masterData.covidSymptomsMaster);

          this.masterData = masterData;
          this.symptomsarray = this.masterData.covidSymptomsMaster;
          for (var i = 0; i < this.symptomsarray.length; i++) {
            console.log(this.symptomsarray[i]["symptoms"]);
            this.symptomsList.push(this.symptomsarray[i]["symptoms"]);
          }
          this.symptomsArray = this.symptomsList;
          console.log("symptomsArray");
          console.log(this.symptomsArray);
          console.log("symptomsarray");
          console.log(this.symptomsList);
          console.log(masterData.covidSymptomsMaster);
          console.log(this.symptomsList[0]);
          console.log(this.symptomsList[0]["symptoms"]);
          // if (this.mode) {
          //   let visitID = localStorage.getItem("visitID");
          //   let benRegID = localStorage.getItem("beneficiaryRegID");
          //   this.patchDataToFields(benRegID, visitID);
          // }


          if(parseInt(localStorage.getItem("specialistFlag")) == 100)
          {
             let visitID = localStorage.getItem('visitID');
            let benRegID = localStorage.getItem('beneficiaryRegID')
            this.getMMUHistoryDetails(benRegID, visitID);
          }
        }
      }
    );
  }

  get symptom() {
    return this.patientCovidForm.controls["symptom"].value;
  }
}
