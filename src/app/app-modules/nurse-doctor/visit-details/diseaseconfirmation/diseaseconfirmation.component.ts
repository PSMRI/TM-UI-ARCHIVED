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


import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DoctorService, MasterdataService, NurseService } from '../../shared/services';
import { IdrsscoreService } from '../../shared/services/idrsscore.service';
import { VisitDetailUtils } from '../../shared/utility/visit-detail-utility';

@Component({
  selector: 'diseaseconfirmation',
  templateUrl: './diseaseconfirmation.component.html',
  styleUrls: ['./diseaseconfirmation.component.css']
})
export class DiseaseconfirmationComponent implements OnInit {

  @Input('mode')
  mode: String;

  @Input('diseaseFormsGroup')
  diseaseFormsGroup: FormGroup;

  diseaseFormsArray: FormArray;
  questions: any = [];
  diseasearray: any = [];
  diseases: any = [];
  suspect: any = [];  // this suspect variable is used to store confirm Disease
  revisit: any;
  diseaseArray = [];
  attendantType: any;
  isDoctor: any;
  constructor(private fb: FormBuilder, private masterdataService: MasterdataService, private idrsScoreService: IdrsscoreService, private doctorService: DoctorService,
    private nurseService: NurseService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    // let benVisitNo = localStorage.getItem('benVisitNo');
    // if (benVisitNo == null)
    //   this.revisit = false;
    // else if (benVisitNo == "1")
    //   this.revisit = false;
    // else
    //   this.revisit = true;

    this.diseaseFormsArray = this.getData();

    while (this.getData().length) {
      this.diseaseFormsArray.removeAt(0)
    }
   // if (this.revisit) {
      
    //}
    //else {
      if (this.mode == 'view') {
        let visitID = localStorage.getItem('visitID');
        let benRegID = localStorage.getItem('beneficiaryRegID');
        if (visitID != null && benRegID != null) {
          this.getIDRSDetailsFrmNurse(visitID, benRegID);
        }
      }
      else
      this.getPatientRevisitSuspectedDieseaData();
      // else {
      //   this.getDiseasesMasterData();
      // }
    //}
    this.attendantType = this.route.snapshot.params['attendant'];
    if(this.attendantType == "doctor" || this.attendantType == "tcspecialist"){
      this.isDoctor= true;
    }
  }
  ngOnDestroy() {
   // localStorage.removeItem('benVisitNo');
  }
  getData() {
    return this.diseaseFormsGroup.get('diseaseFormsArray') as FormArray;
  }

  addMoreDiseases(data) {
    this.getData().push(new VisitDetailUtils(this.fb).createPatientDiseaseArrayForm(data));
  }

  checked(event, item) {
    console.log(event.checked);
    console.log(this.diseaseFormsGroup.value);
    if (this.diseaseFormsGroup.value) {
      this.diseasearray = this.diseaseFormsGroup.get('diseaseFormsArray').value;
      let ar = [];
      this.diseasearray.forEach(value => {
        if (value.selected !=false)
          ar.push(value.diseaseName);
      });
      console.log("diseasearray", ar);
      if (!event.checked){
      if(item.value.diseaseName === "Hypertension")
      {
        this.idrsScoreService.clearHypertensionSelected();
      }
      if(item.value.diseaseName === "Diabetes")
      {
        // this.idrsScoreService.clearConfirmedDiabeticSelected();
      }
        this.idrsScoreService.setUnchecked(item.value.diseaseName);
    }
      else {
        if(item.value.diseaseName === "Hypertension")
        {
          this.idrsScoreService.setHypertensionSelected();
        }
        if(item.value.diseaseName === "Diabetes")
        {
          // this.idrsScoreService.setConfirmedDiabeticSelected();
        }

        this.idrsScoreService.setDiseasesSelected(ar);
      }
    }
  }
  nurseMasterDataSubscription: any;
  IDRSDetailsSubscription: any;
  questionArray = [];
  getIDRSDetailsFrmNurse(visitID, benRegID) {
    this.nurseMasterDataSubscription = this.masterdataService.nurseMasterData$
      .subscribe(data => {
        if (data) {
          if (this.nurseMasterDataSubscription)
            this.nurseMasterDataSubscription.unsubscribe();
          this.questions = data.IDRSQuestions;
          this.diseases = [];
          this.diseaseArray = [];
          if (this.questions && this.questions.length > 0) {
            for (var i = 0; i < this.questions.length; i++) {
              if (i != 0) {
                console.log(this.questions.DiseaseQuestionType !== this.questions[i - 1].DiseaseQuestionType);
                if (this.questions[i].DiseaseQuestionType !== this.questions[i - 1].DiseaseQuestionType)
                  this.diseases.push({ "disease": this.questions[i].DiseaseQuestionType, "flag": null, "selected": false ,"current":false });
              }
              else
                this.diseases.push({ "disease": this.questions[i].DiseaseQuestionType, "flag": null, "selected": false ,"current":false});
            }
            
          this.diseaseArray = this.diseases;
          }
            let obj = {
              "benRegID": localStorage.getItem('beneficiaryRegID')
            }
            this.nurseService.getPreviousVisitData(obj)
              .subscribe((res: any) => {
                if (res.statusCode == 200 && res.data != null) {
                  //console.log("visit", res);
                  //if (res.data.suspectedDisease != null) {
                    this.suspect = [];
                    if (res.data.confirmedDisease != undefined && res.data.confirmedDisease != null) 
                    this.suspect = res.data.confirmedDisease.split(',');
                    if(res.data.isDiabetic)
                    this.addToSuspected("Diabetes");
                    if(res.data.isDefectiveVision)
                    this.addToSuspected("Vision Screening");
                    if(res.data.isEpilepsy)
                    this.addToSuspected("Epilepsy");
                    if(res.data.isHypertension)
                    this.addToSuspected("Hypertension");

                    this.suspect.forEach(element => {
                      this.diseaseArray.forEach(value=>{
                        if(value.disease===element)
                        value.selected=true;
                        if(element === "Hypertension")
                        {
                          this.idrsScoreService.setHypertensionSelected();
                        }
                        if(element === "Diabetes")
                        {
                          // this.idrsScoreService.setConfirmedDiabeticSelected();
                        }
                      });
                    });
                    this.IDRSDetailsSubscription = this.doctorService.getIDRSDetails(benRegID, visitID)
                    .subscribe(value => {
                      if (value != null && value.statusCode == 200 && value.data != null) {
                        if (this.IDRSDetailsSubscription)
                          this.IDRSDetailsSubscription.unsubscribe();
                        
                          this.questionArray = [];let suspect1 =[];
                         // this.suspect = [];
                         if (value.data.IDRSDetail.confirmedDisease != null) 
                          suspect1 = value.data.IDRSDetail.confirmedDisease.split(',');
                          if(suspect1 !=undefined && suspect1 !=null && suspect1.length>0)
                          {
                            if(this.suspect!=null && this.suspect.length==0)
                            {
                              this.suspect=suspect1;
                              this.suspect.forEach(value=>{
                                  this.diseaseArray.forEach(val=>{
                                    if(val.disease===value)
                                    val.current=true;
                                  });
                                });
                              // });
                            }
                            
                            else{
                              let check=false;
                              suspect1.forEach(element => {check=false;
                                this.suspect.forEach(value=>{
                                  if(value==element)
                                  {
                                    check=true;
                                  }
                                });
                                if(!check)
                                {
                                  this.addToSuspected(element);
                                  this.diseaseArray.forEach(val=>{
                                    if(val.disease===element)
                                    val.current=true;
                                  });
                                }

                              });
                            }
                         
                        }
                         
                          this.suspect.forEach(element => {
                            this.diseaseArray.forEach(value=>{
                              if(value.disease===element)
                              value.selected=true;
                              if(element === "Hypertension")
                              {
                                this.idrsScoreService.setHypertensionSelected();
                              }
                              if(element === "Diabetes")
                              {
                                // this.idrsScoreService.setConfirmedDiabeticSelected();
                              }
                            });
                          });
                          // this.questionArray.forEach(res => {
                          //   let temp2 = this.diseaseArray.filter(item => item.disease == res.disease);
                          //   let diseaseindex = this.diseaseArray.indexOf(temp2[0]);
                          //   this.diseaseArray.splice(diseaseindex, 1);
                          // });
                          // this.questionArray = this.questionArray.concat(this.diseaseArray);
                          //this.questionArray.push(this.diseases);
                          for (let d of this.diseaseArray) {
                            this.addMoreDiseases(d);
                          }
                          // this.questionArray.forEach((res, index) => {
                          //   if (res.selected == true) {
                          //     let diseaseformArraygroup = (<FormGroup>this.diseaseFormsGroup.controls["diseaseFormsArray"]).controls[index];
                          //     (<FormGroup>diseaseformArraygroup).controls["selected"].disable();
                          //   }
                          // });
                        //}
                        // else {
                        //   for (let d of this.diseaseArray) {
                        //     this.addMoreDiseases(d);
                        //   }
                        // }
                      }
                      this.diseaseArray.forEach((res, index) => {
                        if (res.selected == true && res.current==false) {
                          let diseaseformArraygroup = (<FormGroup>this.diseaseFormsGroup.controls["diseaseFormsArray"]).controls[index];
                          (<FormGroup>diseaseformArraygroup).controls["selected"].disable();
                        }
                      });
                      let ar = [];
                      this.diseaseArray.forEach(value => {
                        if (value.selected)
                          ar.push(value.disease);
                      });
                      console.log("diseasearray", ar);
                      this.idrsScoreService.setDiseasesSelected(ar);
                    });
               
                    // this.questionArray.forEach(res => {
                    //   let temp2 = this.diseaseArray.filter(item => item.disease == res.disease);
                    //   let diseaseindex = this.diseaseArray.indexOf(temp2[0]);
                    //   this.diseaseArray.splice(diseaseindex, 1);
                    // });
                    // this.questionArray = (this.questionArray.concat(this.diseaseArray));
                    
                    
                  //}
                  // else {
                  //   this.diseaseArray.forEach((form, index) => {
                  //     this.addMoreDiseases(form);
                  //   });
                  // }
                  //this.addToChronicDiseases(res);
                }
        //         let ar = [];
        // this.diseaseArray.forEach(value => {
        //   if (value.selected)
        //     ar.push(value.disease);
        // });
        // console.log("diseasearray", ar);
        // this.idrsScoreService.setDiseasesSelected(ar);
              });
          
        }
      })
  }
  diseasesMasterData: any;
  getDiseasesMasterData() {
    this.diseasesMasterData = this.masterdataService.nurseMasterData$
      .subscribe(data => {
        if (data) {
          if (this.diseasesMasterData)
            this.diseasesMasterData.unsubscribe();
          this.questions = data.IDRSQuestions;
          this.diseases = [];
          this.diseaseArray = [];
          if (this.questions && this.questions.length > 0) {
            for (var i = 0; i < this.questions.length; i++) {
              if (i != 0) {
                console.log(this.questions.DiseaseQuestionType !== this.questions[i - 1].DiseaseQuestionType);
                if (this.questions[i].DiseaseQuestionType !== this.questions[i - 1].DiseaseQuestionType)
                  this.diseases.push({ "disease": this.questions[i].DiseaseQuestionType, "flag": null, "selected": false ,"current":false});
              }
              else
                this.diseases.push({ "disease": this.questions[i].DiseaseQuestionType, "flag": null, "selected": false ,"current":false});
            }
            this.diseaseArray = this.diseases;
            for (let d of this.diseaseArray) {
              this.addMoreDiseases(d);
            }
            this.diseaseArray.forEach((res, index) => {
              if (res.selected == true) {
                let diseaseformArraygroup = (<FormGroup>this.diseaseFormsGroup.controls["diseaseFormsArray"]).controls[index];
                (<FormGroup>diseaseformArraygroup).controls["selected"].disable();
              }
            });
          }
        }
      })
  }
  addToSuspected(val) {
    let flag = false;
    for (var i = 0; i < this.suspect.length; i++) {
      if (this.suspect[i] === val)
        flag = true;
    }
    if (!flag) {
      this.suspect.push(val);
    }

  }
  patientRevisitSuspectedDieseaData: any;
  getPatientRevisitSuspectedDieseaData() {
    this.patientRevisitSuspectedDieseaData = this.masterdataService.nurseMasterData$
      .subscribe(data => {
        if (data) {
          if (this.patientRevisitSuspectedDieseaData)
            this.patientRevisitSuspectedDieseaData.unsubscribe();
          this.questions = data.IDRSQuestions;
          this.diseases = [];
          this.diseaseArray = [];
          if (this.questions && this.questions.length > 0) {
            for (var i = 0; i < this.questions.length; i++) {
              if (i != 0) {
               // console.log(this.questions.DiseaseQuestionType !== this.questions[i - 1].DiseaseQuestionType);
                if (this.questions[i].DiseaseQuestionType !== this.questions[i - 1].DiseaseQuestionType)
                  this.diseases.push({ "disease": this.questions[i].DiseaseQuestionType, "flag": null, "selected": false });
              }
              else
                this.diseases.push({ "disease": this.questions[i].DiseaseQuestionType, "flag": null, "selected": false });
            }
            this.diseaseArray = this.diseases;
            let obj = {
              "benRegID": localStorage.getItem('beneficiaryRegID')
            }
            this.nurseService.getPreviousVisitData(obj)
              .subscribe((res: any) => {
                if (res.statusCode == 200 && res.data != null) {
                  //console.log("visit", res);
                  //if (res.data.suspectedDisease != null) {
                    this.suspect = [];
                    if (res.data.confirmedDisease != undefined && res.data.confirmedDisease != null) 
                    this.suspect = res.data.confirmedDisease.split(',');
                    if(res.data.isDiabetic)
                    this.addToSuspected("Diabetes");
                    if(res.data.isDefectiveVision)
                    this.addToSuspected("Vision Screening");
                    if(res.data.isEpilepsy)
                    this.addToSuspected("Epilepsy");
                    if(res.data.isHypertension)
                    this.addToSuspected("Hypertension");

                    this.suspect.forEach(element => {
                      this.diseaseArray.forEach(value=>{
                        if(value.disease===element)
                        value.selected=true;
                        if(element === "Hypertension")
                        {
                          this.idrsScoreService.setHypertensionSelected();
                        }
                        // if(element === "Diabetes")
                        // {
                        //   this.idrsScoreService.setConfirmedDiabeticSelected();
                        // }
                      });
                    });
                  
                    // this.questionArray.forEach(res => {
                    //   let temp2 = this.diseaseArray.filter(item => item.disease == res.disease);
                    //   let diseaseindex = this.diseaseArray.indexOf(temp2[0]);
                    //   this.diseaseArray.splice(diseaseindex, 1);
                    // });
                    // this.questionArray = (this.questionArray.concat(this.diseaseArray));
                    this.diseaseArray.forEach((form, index) => {
                      this.addMoreDiseases(form);
                    });
                    this.diseaseArray.forEach((res, index) => {
                      if (res.selected == true) {
                        let diseaseformArraygroup = (<FormGroup>this.diseaseFormsGroup.controls["diseaseFormsArray"]).controls[index];
                        (<FormGroup>diseaseformArraygroup).controls["selected"].disable();
                      }
                    });
                  //}
                  // else {
                  //   this.diseaseArray.forEach((form, index) => {
                  //     this.addMoreDiseases(form);
                  //   });
                  // }
                //  this.addToChronicDiseases(res);
                }
                let ar = [];
        this.diseaseArray.forEach(value => {
          if (value.selected)
            ar.push(value.disease);
        });
        console.log("diseasearray", ar);
        this.idrsScoreService.setDiseasesSelected(ar);
              });
          }
        }
        
      });
  }
  addToChronicDiseases(res) {
    let tempdiseaseformArray = (<FormGroup>this.diseaseFormsGroup.controls["diseaseFormsArray"]).value;
    tempdiseaseformArray.forEach((element, i) => {
      if (res.data.isDefectiveVision == true && element.diseaseName == "Vision Screening") {
        let diseaseformArraygroup = (<FormGroup>this.diseaseFormsGroup.controls["diseaseFormsArray"]).controls[i];
        diseaseformArraygroup.patchValue({ "disease": element.diseaseName, "flag": null, "selected": true });
        (<FormGroup>diseaseformArraygroup).controls["selected"].disable();
      }
      else if (res.data.isDiabetic == true && element.diseaseName == "Diabetes") {
        let diseaseformArraygroup = (<FormGroup>this.diseaseFormsGroup.controls["diseaseFormsArray"]).controls[i];
        diseaseformArraygroup.patchValue({ "disease": element.diseaseName, "flag": null, "selected": true });
        (<FormGroup>diseaseformArraygroup).controls["selected"].disable();
      }
      else if (res.data.isEpilepsy == true && element.diseaseName == "Epilepsy") {
        let diseaseformArraygroup = (<FormGroup>this.diseaseFormsGroup.controls["diseaseFormsArray"]).controls[i];
        diseaseformArraygroup.patchValue({ "disease": element.diseaseName, "flag": null, "selected": true });
        (<FormGroup>diseaseformArraygroup).controls["selected"].disable();
      }

      else if (res.data.isHypertension == true && element.diseaseName == "Hypertension") {
        let diseaseformArraygroup = (<FormGroup>this.diseaseFormsGroup.controls["diseaseFormsArray"]).controls[i];
        diseaseformArraygroup.patchValue({ "disease": element.diseaseName, "flag": null, "selected": true });
        (<FormGroup>diseaseformArraygroup).controls["selected"].disable();
      }

    });
  }

}
