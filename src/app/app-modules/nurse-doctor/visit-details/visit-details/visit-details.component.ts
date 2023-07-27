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


import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';

import { MasterdataService, DoctorService, NurseService } from '../../shared/services';
import { BeneficiaryDetailsService } from '../../../core/services/beneficiary-details.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'patient-visit-details',
  templateUrl: './visit-details.component.html',
  styleUrls: ['./visit-details.component.css']
})
export class VisitDetailsComponent implements OnInit {

  @Input('patientVisitDetailsForm')
  patientVisitDetailsForm: FormGroup;

  @Input('mode')
  mode: String;

  templateNurseMasterData: any;
  templateVisitCategories: any;
  // templateVisitReasons: any="Pandemic";
  templateVisitReasons : any;
  templateBeneficiaryDetails: any;
  templateFilterVisitCategories: any;
  templatePregnancyStatus = ["Yes", "No", "Don't Know"];

  showPregnancyStatus = true;
  currentLanguageSet: any;
  disableVisit: boolean=false;
  cbacData: any=[];

  constructor(
    private masterdataService: MasterdataService,
    private doctorService: DoctorService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    public httpServiceService: HttpServiceService,
    private nurseService:NurseService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.cbacData=this.beneficiaryDetailsService.cbacData;
    this.assignSelectedLanguage();
    this.getBenificiaryDetails();
    this.getVisitReasonAndCategory();
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
    //this.nurseService.mmuVisitData=false;
    if (this.mode == 'view') {
      let visitID = localStorage.getItem('visitID');
      let benRegID = localStorage.getItem('beneficiaryRegID')
      this.disableVisit=true;
      this.getVisitDetails(visitID, benRegID);
    }
    if(parseInt(localStorage.getItem("specialistFlag")) == 100)
    {
       console.log("MMUSpecialist===========")
       let visitID = localStorage.getItem('visitID');
      let benRegID = localStorage.getItem('beneficiaryRegID')
      this.getMMUVisitDetails(visitID, benRegID);
    }

    // if (this.patientVisitDetailsForm) {
    //   this.setCancerDefaultforMCSU();
    // }
  }

  ngOnDestroy() {
    if (this.visitCategorySubscription)
      this.visitCategorySubscription.unsubscribe();

    if (this.visitDetailsSubscription)
      this.visitDetailsSubscription.unsubscribe();

      if (this.visitDetSubscription)
      this.visitDetSubscription.unsubscribe();

    if (this.beneficiaryDetailsSubscription)
      this.beneficiaryDetailsSubscription.unsubscribe();
     // this.nurseService.mmuVisitData=false;
  }


  // setCancerDefaultforMCSU() {
  //   if (localStorage.getItem('vanType') && localStorage.getItem('vanType') == 'MCSU') {
  //     this.patientVisitDetailsForm.patchValue({
  //       visitReason: 'Screening',
  //       visitCategory: 'Cancer Screening'
  //     })
  //   }
  // }

  visitCategorySubscription: any;
  getVisitReasonAndCategory() {
    this.visitCategorySubscription = this.masterdataService.visitDetailMasterData$.subscribe((masterData) => {
      if (masterData) {
        this.templateNurseMasterData = masterData;
        console.log('Visit reason and category', this.templateNurseMasterData);
        this.templateVisitReasons = this.templateNurseMasterData.visitReasons;
        this.templateVisitCategories = this.templateNurseMasterData.visitCategories;
        this.templateFilterVisitCategories = this.templateVisitCategories;
      }
    });
    //this.templateVisitReasons ="Pandemic";
    //this.templateVisitCategories="Pandemic";
  }


  visitDetSubscription: any;
  getMMUVisitDetails(visitID, benRegID) {
   
    let visitCategory = localStorage.getItem('visitCategory');    
    this.visitDetSubscription = this.doctorService.getVisitComplaintDetails(benRegID, visitID)
      .subscribe(value => {
        if (value != null && value.statusCode == 200 && value.data != null) {
          if (visitCategory == 'Cancer Screening' || visitCategory == 'General OPD (QC)') {
            let visitDetails = value.data.benVisitDetails;
            visitDetails.visitCode = visitDetails.visitCode;
            this.doctorService.fileIDs = value.data.benVisitDetails.fileIDs;
            this.patientVisitDetailsForm.patchValue(visitDetails);
            this.disableVisit=true;
            // this.patientVisitDetailsForm.disable();
          }
          if (visitCategory == 'ANC') {
            let visitDetails = value.data.ANCNurseVisitDetail;
            visitDetails.visitCode = visitDetails.visitCode;
            this.doctorService.fileIDs = value.data.ANCNurseVisitDetail.fileIDs;
            this.patientVisitDetailsForm.patchValue(visitDetails);
            this.disableVisit=true;
            // this.patientVisitDetailsForm.disable();
          }
          if (visitCategory == 'General OPD') {
            let visitDetails = value.data.GOPDNurseVisitDetail;
            visitDetails.visitCode = visitDetails.visitCode;
            this.doctorService.fileIDs = value.data.GOPDNurseVisitDetail.fileIDs;
            this.patientVisitDetailsForm.patchValue(visitDetails);
            this.disableVisit=true;
            // this.patientVisitDetailsForm.disable();
          }
          if (visitCategory == 'NCD screening') {
            let visitDetails = value.data.NCDScreeningNurseVisitDetail;
            visitDetails.visitCode = visitDetails.visitCode;
            this.doctorService.fileIDs = value.data.NCDScreeningNurseVisitDetail.fileIDs;
            this.patientVisitDetailsForm.patchValue(visitDetails);
            this.disableVisit=true;
            // if(this.route.snapshot.params["attendant"]  == "nurse")
            // this.nurseService.mmuVisitData=true;
            // this.patientVisitDetailsForm.disable();
          }
          if (visitCategory == 'NCD care') {
            let visitDetails = value.data.NCDCareNurseVisitDetail;
            visitDetails.visitCode = visitDetails.visitCode;
            this.patientVisitDetailsForm.patchValue(visitDetails);
            this.disableVisit=true;
            // this.patientVisitDetailsForm.disable();
          }
          if (visitCategory == 'PNC') {
            let visitDetails = value.data.PNCNurseVisitDetail;
            visitDetails.visitCode = visitDetails.visitCode;
            this.patientVisitDetailsForm.patchValue(visitDetails);
            this.disableVisit=true;
            // this.patientVisitDetailsForm.disable();
          }
          if (visitCategory == 'COVID-19 Screening') {
            console.log("visitData",value.data);            
            let visitDetails = value.data.covid19NurseVisitDetail;            
            this.patientVisitDetailsForm.patchValue(visitDetails);
            this.disableVisit=true;
            // this.patientVisitDetailsForm.disable();
          }
        }
      })
  }



  visitDetailsSubscription: any;
  getVisitDetails(visitID, benRegID) {
    // localStorage.setItem('visitCategory', "General OPD");
    let visitCategory = localStorage.getItem('visitCategory');    
    this.visitDetailsSubscription = this.doctorService.getVisitComplaintDetails(benRegID, visitID)
      .subscribe(value => {
        if (value != null && value.statusCode == 200 && value.data != null) {
          if (visitCategory == 'Cancer Screening' || visitCategory == 'General OPD (QC)') {
            let visitDetails = value.data.benVisitDetails;
            visitDetails.visitCode = visitDetails.visitCode;
            this.doctorService.fileIDs = value.data.benVisitDetails.fileIDs;
            this.patientVisitDetailsForm.patchValue(visitDetails);
           
          }
          if (visitCategory == 'ANC') {
            let visitDetails = value.data.ANCNurseVisitDetail;
            visitDetails.visitCode = visitDetails.visitCode;
            this.doctorService.fileIDs = value.data.ANCNurseVisitDetail.fileIDs;
            this.patientVisitDetailsForm.patchValue(visitDetails);
           
          }
          if (visitCategory == 'General OPD') {
            let visitDetails = value.data.GOPDNurseVisitDetail;
            visitDetails.visitCode = visitDetails.visitCode;
            this.doctorService.fileIDs = value.data.GOPDNurseVisitDetail.fileIDs;
            this.patientVisitDetailsForm.patchValue(visitDetails);
           
          }
          if (visitCategory == 'NCD screening') {
            let visitDetails = value.data.NCDScreeningNurseVisitDetail;
            visitDetails.visitCode = visitDetails.visitCode;
            this.doctorService.fileIDs = value.data.NCDScreeningNurseVisitDetail.fileIDs;
            this.patientVisitDetailsForm.patchValue(visitDetails);
            
          }
          if (visitCategory == 'NCD care') {
            let visitDetails = value.data.NCDCareNurseVisitDetail;
            visitDetails.visitCode = visitDetails.visitCode;
            this.patientVisitDetailsForm.patchValue(visitDetails);
           
          }
          if (visitCategory == 'PNC') {
            let visitDetails = value.data.PNCNurseVisitDetail;
            visitDetails.visitCode = visitDetails.visitCode;
            this.patientVisitDetailsForm.patchValue(visitDetails);
           
          }
          if (visitCategory == 'COVID-19 Screening') {
            console.log("visitData",value.data);            
            let visitDetails = value.data.covid19NurseVisitDetail;            
            this.patientVisitDetailsForm.patchValue(visitDetails);
            
          }
        }
      })
  }

  beneficiaryGender: any;
  beneficiary: any;
  beneficiaryDetailsSubscription: any;
  getBenificiaryDetails() {
    this.beneficiaryDetailsSubscription = this.beneficiaryDetailsService.beneficiaryDetails$
      .subscribe(beneficiaryDetails => {
        if (beneficiaryDetails) {
          this.beneficiary = beneficiaryDetails;
          this.beneficiaryGender = beneficiaryDetails.genderName;

          if (beneficiaryDetails && beneficiaryDetails.genderName != null && beneficiaryDetails.genderName == 'Male')
            this.showPregnancyStatus = false;
          else if (beneficiaryDetails && beneficiaryDetails.ageVal != null && beneficiaryDetails.ageVal < 19)
            this.showPregnancyStatus = false;
          else
            this.showPregnancyStatus = true;
        }
      })
  }

  reasonSelected(visitReason) {
    if (visitReason == 'Screening') {
      this.templateFilterVisitCategories = this.templateVisitCategories.filter(item => item.visitCategory.toLowerCase().indexOf('screening') >= 0)
    } else if (visitReason == 'Pandemic') {
      this.templateFilterVisitCategories = this.templateVisitCategories.filter(item => item.visitCategory.indexOf('COVID-19') >= 0)
    }   
    else {

      /**
       * Filtering ANC for male and child (hardcoded)
       * TODO : need to filter based on api
       */
      if (this.beneficiary.genderName == "Male" || this.beneficiary.ageVal < 12)
        this.templateFilterVisitCategories = this.templateVisitCategories.filter(item => (item.visitCategory.toLowerCase() != "anc" && item.visitCategory.toLowerCase() != "pnc"));
      else
        this.templateFilterVisitCategories = this.templateVisitCategories.slice();
    }
  }

  checkCategoryDependent(visitCategory) {
    localStorage.setItem("visiCategoryANC",visitCategory);
    if (visitCategory == 'ANC') {
      this.templatePregnancyStatus = [ 'Yes' ];
      this.patientVisitDetailsForm.patchValue({ 'pregnancyStatus': 'Yes' });
    } else{
      this.templatePregnancyStatus = ["Yes", "No", "Don't Know"];
      this.patientVisitDetailsForm.patchValue({ 'pregnancyStatus': null });
    }

    this.patientVisitDetailsForm.patchValue({ 'rCHID': null });
  }

  get visitReason() {
    return this.patientVisitDetailsForm.controls['visitReason'].value;
  }

  get visitCategory() {
    return this.patientVisitDetailsForm.controls['visitCategory'].value;
  }

  get pregnancyStatus() {
    return this.patientVisitDetailsForm.controls['pregnancyStatus'].value;
  }

  get rCHID() {
    return this.patientVisitDetailsForm.controls['rCHID'].value;
  }

}
