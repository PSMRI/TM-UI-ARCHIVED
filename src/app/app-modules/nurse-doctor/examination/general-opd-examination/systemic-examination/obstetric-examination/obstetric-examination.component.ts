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
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BeneficiaryDetailsService, ConfirmationService } from 'app/app-modules/core/services';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { MasterdataService, NurseService } from 'app/app-modules/nurse-doctor/shared/services';
import { DatePipe } from '@angular/common';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
@Component({
  selector: 'nurse-anc-obstetric-examination',
  templateUrl: './obstetric-examination.component.html',
  styleUrls: ['./obstetric-examination.component.css'],
  providers: [DatePipe]
})
export class ObstetricExaminationComponent implements OnInit {

  @Input('obstetricExaminationForANCForm')
  obstetricExaminationForANCForm: FormGroup;
  current_language_set: any;

  selectFundalHeight =
    [
      {
        name: 'Not Palpable',
        id: 1
      },
      {
        name: '12th Week',
        id: 2
      },
      {
        name: '16th Week',
        id: 3
      },
      {
        name: '20th Week',
        id: 4
      },
      {
        name: '24th Week',
        id: 5
      },
      {
        name: '28th Week',
        id: 6
      },
      {
        name: '32th Week',
        id: 7
      },
      {
        name: '36th Week',
        id: 8
      },
      {
        name: '40th Week',
        id: 9
      },
    ]

  selectFHPOAStatus =
    [
      {
        name: 'FH=POA',
        id: 1
      },
      {
        name: 'FH>POA',
        id: 2
      },
      {
        name: 'FH<POA',
        id: 3
      },
    ]

  selectInterpretationFHAndPOA =
    [
      {
        name: 'Corresponding',
        id: 1
      },
      {
        name: 'Not Corresponding',
        id: 2
      }
    ]

  selectFetalHeartRate =
    [
      {
        name: '<120',
        id: 1
      },
      {
        name: '120-160',
        id: 2
      },
      {
        name: '>160',
        id: 3
      },
    ]

  selectFetalPositionOrLie =
    [
      {
        name: 'Longitudinal',
        id: 1
      },
      {
        name: 'Oblique',
        id: 2
      },
      {
        name: 'Transverse',
        id: 3
      },
    ]

  selectFetalPresentation =
    [
      {
        name: 'Cepahlic',
        id: 1
      },
      {
        name: 'Breech',
        id: 2
      },
      {
        name: 'Face',
        id: 3
      },
      {
        name: 'Shoulder',
        id: 4
      },
    ]

  selectAbdominalScars =
    [
      {
        name: 'Absent',
        id: 1
      },
      {
        name: 'LSCS Scar',
        id: 2
      },
      {
        name: 'Other Surgical Scars',
        id: 3
      },
    ]

    fetosenseTestMaster :any[];

  
  
  beneficiaryDetailsSubscription: any;
  beneficiary: any;
  lmpDate: any=null;
  testStaus: any;
  nurseMasterDataSubscription: any;
  prescribedTestArray: any=[];
  today: Date;
  constructor(private fb: FormBuilder,
    public httpServiceService: HttpServiceService,
    private nurseService: NurseService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private confirmationService: ConfirmationService,
    private masterdataService: MasterdataService,private datePipe:DatePipe) { }

    ngOnDestroy() {
      if (this.beneficiaryDetailsSubscription)
        this.beneficiaryDetailsSubscription.unsubscribe();
        if (this.nurseMasterDataSubscription)
        this.nurseMasterDataSubscription.unsubscribe();
    }
 
  ngOnInit() {
  

    this.getNurseMasterData();
    this.nurseService.clearLMPForFetosenseTest();
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
   
    this.beneficiaryDetailsSubscription = this.beneficiaryDetailsService.beneficiaryDetails$
    .subscribe(res => {
      if (res != null) {
        this.beneficiary = res;
        this.getPrescribedTestDetails();
      }
    });
    this.nurseService.lmpFetosenseTestValue$.subscribe(response => {
      this.lmpDate= response;
    });

    

  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }

  getNurseMasterData() {

    this.nurseMasterDataSubscription = this.masterdataService.nurseMasterData$.subscribe(
      masterData => {
        if (masterData && masterData!==null && masterData!==undefined) 
        {

        this.fetosenseTestMaster = masterData.fetosenseTestMaster;
        
        }
        
      
     
      }
    );
   
  }




  resetFetalHeartRate(event) {
    if(event.value == "Not Audible")
    this.obstetricExaminationForANCForm.patchValue({fetalHeartRate_BeatsPerMinute: null});
  }

  get fetalHeartSounds() {
    return this.obstetricExaminationForANCForm.controls['fetalHeartSounds'].value;
  }

  get SFH() {
    console.log("sfh");
    return this.obstetricExaminationForANCForm.controls['sfh'].value;
  }



 /**
   * (C)
   * DE40034072
   *25-06-21
   */

   /*Visit Category - ANC
     Gender - Female
     Fetosense Test
    */ 

  sendTestDetails(testId,testName) {
    if(this.lmpDate !== null && this.lmpDate !== undefined && !(isNaN(this.lmpDate.getTime())))
     {
      //var newLmpDate = new Date(new Date(this.lmpDate).setHours(0, 0, 0, 0));
      let newLmpDate=this.datePipe.transform(this.lmpDate, 'yyyy-MM-dd');
      this.today = new Date();
      var todayDate = new Date(this.today +'UTC');
      todayDate.toString();
  
   
      let reqObj=
      {
        'beneficiaryRegID':this.beneficiary.beneficiaryRegID,
        'benFlowID':this.beneficiary.benFlowID,
        'testTime':todayDate,
        'motherLMPDate':newLmpDate,
        'motherName':this.beneficiary.beneficiaryName,
        'fetosenseTestId':testId,
        'testName':testName,
        'vanID' : JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
        'ProviderServiceMapID':parseInt(localStorage.getItem('providerServiceID')),
        'createdBy':localStorage.getItem('userName')
      };

   this.nurseService.sendTestDetailsToFetosense(reqObj)
    .subscribe(res => {
      if (res && res.statusCode === 200 && res.data) {
      this.testStaus=res.data.response;
      this.getPrescribedTestDetails();
      this.confirmationService.alertFetsenseMessage(this.testStaus, 'Fetosense Device');

      }
      else
      {
        this.confirmationService.alert(res.errorMessage, 'error')
      }
    },
    err => {
      this.confirmationService.alert(
        err,
        'error'
      );
    });
  }
  else{
    this.confirmationService.alert(this.current_language_set.pleaseSelectLastMenstrualPeriod, 'info');
  }

  }
 

  getPrescribedTestDetails() {
   
    this.nurseService.fetchPrescribedFetosenseTests(this.beneficiary.benFlowID)
    .subscribe(response => {
      if (response && response.statusCode === 200 && response.data) {
        this.prescribedTestArray=response.data.benFetosenseData; 
        
  
        }
        else
        {
          this.confirmationService.alert(response.errorMessage, 'error')
        }

   },
   err => {
    this.confirmationService.alert(
      err,
      'error'
    );
   });

   
  }

  /* Disabling the Test if it is already prescribed*/

  checkTestPrescribed(testValue) {

   return this.prescribedTestArray.some((item) => item.fetosenseTestId === testValue)

  }


  /*END*/


 



  /** -- Neeraj 26 dec, build error was there, so added this line  */
  getPreviousPastHistory() { }
  

}
