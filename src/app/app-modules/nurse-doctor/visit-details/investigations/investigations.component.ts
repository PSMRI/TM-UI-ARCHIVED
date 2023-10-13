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


import { Component, OnInit, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { MasterdataService, DoctorService, NurseService } from '../../shared/services';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { Subscription } from 'rxjs';
import { environment } from 'environments/environment';

@Component({
  selector: 'patient-investigations',
  templateUrl: './investigations.component.html',
  styleUrls: ['./investigations.component.css']
})
export class InvestigationsComponent implements OnInit {
  @Input('patientInvestigationsForm')
  patientInvestigationsForm: FormGroup;

  @Input('mode')
  mode: string;

  patientInvestigationDetails: any;
  selectLabTest: any;
  currentLanguageSet: any;
  rbsTestResultSubscription: Subscription;
  RBSTestScore: number;
  RBStestDone: boolean=false;
  rbsTestResultCurrent: any;

  constructor(
    private fb: FormBuilder,
    private masterdataService: MasterdataService,
    public httpServiceService: HttpServiceService,
    private doctorService: DoctorService,
    private nurseService: NurseService) { }

  ngOnInit() {
    this.nurseService.clearRbsInVitals();
    this.assignSelectedLanguage();
    this.getNurseMasterData();
    this.rbsTestValidation();
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

  
  }


  nurseMasterDataSubscription: any;
  getNurseMasterData() {
    this.nurseMasterDataSubscription = this.masterdataService.nurseMasterData$
      .subscribe(masterData => {
        if (masterData && masterData.procedures) {
        
          // this.nurseMasterDataSubscription.unsubscribe();
          

          this.selectLabTest = masterData.procedures.filter(item => {
            return item.procedureType == 'Laboratory';
          })

          if (this.mode == 'view') {
            let visitID = localStorage.getItem('visitID');
            let benRegID = localStorage.getItem('beneficiaryRegID')
            this.getInvestigation(benRegID, visitID);
          }
          if(parseInt(localStorage.getItem("specialistFlag")) == 100)
          {
             let visitID = localStorage.getItem('visitID');
            let benRegID = localStorage.getItem('beneficiaryRegID')
            this.getInvestigation(benRegID, visitID);
          }
        
        }
      });
  }

  ngOnDestroy() {
    if (this.nurseMasterDataSubscription)
      this.nurseMasterDataSubscription.unsubscribe();
    if (this.getInvestigationDetails)
      this.getInvestigationDetails.unsubscribe();
      if (this.rbsTestResultSubscription) {
        this.rbsTestResultSubscription.unsubscribe();
      }
  }

  getInvestigationDetails: any;
  getInvestigation(benRegID, visitID) {
    this.getInvestigationDetails = this.doctorService.getVisitComplaintDetails(benRegID, visitID)
      .subscribe(value => {
        if (value != null && value.statusCode == 200 && value.data != null) {
          let visitComplaintDetail = value.data;
          this.patientInvestigationDetails = value.data.Investigation;
          this.checkLabTest();
        }
      });
  }


  checkLabTest() {
    let formArray = this.patientInvestigationsForm.controls['laboratoryList'] as FormArray;
    let result = [];
    if (this.patientInvestigationDetails) {
      let temp = this.patientInvestigationDetails.laboratoryList;
      if (temp) {
        for (let i = 0; i < temp.length; i++) {
          let testType = this.selectLabTest.filter(item => {
            return item.procedureID == temp[i].procedureID;
          })
          if (testType.length > 0) {
            result.push(testType[0]);
          }
        }
        let k = formArray;
        k.patchValue(result);

        temp.forEach((element) => {
          if (element.procedureName == environment.RBSTest) {
            this.nurseService.setRbsSelectedInInvestigation(true);
          }
         
        });
      }
    }
  }

  checkInvestigation(laboratoryList) {
  }

  get laboratoryList() {
    return this.patientInvestigationsForm.controls['laboratoryList'];
  }


  rbsTestValidation() {

    this.rbsTestResultSubscription =
      this.nurseService.rbsTestResultCurrent$.subscribe((response) => {
        if (response !== undefined && response !== null) {
          this.RBSTestScore = response;
          this.RBStestDone = true;
          this.rbsTestResultCurrent = response;
        } else {
          this.rbsTestResultCurrent = null;
        }
      });
  }

  canDisable(test) {
    if (
      ((this.rbsTestResultCurrent != null &&
        this.rbsTestResultCurrent != undefined) ||
        this.nurseService.rbsTestResultFromDoctorFetch != null) &&
      test.procedureName == environment.RBSTest
    ) {
     
      return true;
    }
   
  
  }

  checkTestName(event) {
    console.log("testName", event);
    this.RBStestDone = false;
    let item = event.value;
    let oneSelected = 0;
    this.nurseService.setRbsSelectedInInvestigation(false);
    item.forEach((element) => {
      if (element.procedureName == environment.RBSTest) {
        this.RBStestDone = true;
        this.nurseService.setRbsSelectedInInvestigation(true);
        oneSelected++;
      }
    });
  }
}
