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


import { Component, OnInit, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';

import { MasterdataService, DoctorService, NurseService } from '../../../shared/services';

import { BeneficiaryDetailsService } from '../../../../core/services/beneficiary-details.service';
import { ValidationUtils } from '../../../shared/utility/validation-utility';
import { ConfirmationService } from '../../../../core/services/confirmation.service';

import { GeneralUtils } from '../../../shared/utility/general-utility';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-findings',
  templateUrl: './findings.component.html',
  styleUrls: ['./findings.component.css']
})
export class FindingsComponent implements OnInit {

  @Input('generalFindingsForm')
  generalFindingsForm: FormGroup;

  @Input('caseRecordMode')
  caseRecordMode: string;

  beneficiaryRegID: string;
  visitID: string;
  visitCategory: string;
  formUtils: GeneralUtils;

  complaintDuration = ["Hours", "Weeks", "Days", "Months", "Years"];

  chiefComplaintMaster: any;
  chiefComplaintTemporarayList = [];
  selectedChiefComplaintList = [];
  suggestedChiefComplaintList = [];
  enableProvisionalDiag: boolean = false;

  beneficiary: any;
  complaintList: any = [];
  current_language_set: any;
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private masterdataService: MasterdataService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private doctorService: DoctorService,
    private confirmationService: ConfirmationService,
    public httpServiceService: HttpServiceService,
    private nurseService:NurseService
    ) {
      this.formUtils = new GeneralUtils(this.fb);
     }

  ngOnInit() {
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(response => this.current_language_set = response);
    this.getDoctorMasterData();
    this.getBeneficiaryDetails();
    this.nurseService.clearNCDScreeningProvision();
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
    if (this.doctorMasterDataSubscription)
      this.doctorMasterDataSubscription.unsubscribe();
    if (this.beneficiaryDetailSubscription)
      this.beneficiaryDetailSubscription.unsubscribe();
  }

  findingSubscription: any;
  getFindingDetails(beneficiaryRegID, visitID, visitCategory) {
    this.findingSubscription = this.doctorService.getCaseRecordAndReferDetails(beneficiaryRegID, visitID, visitCategory)
      .subscribe(res => {
        if (res && res.statusCode == 200 && res.data && res.data.findings) {
          let findings = res.data.findings;
          this.complaintList = findings.complaints.slice();
          this.complaintList.forEach((element, i) => {
            this.filterInitialComplaints(element);
          });
          findings.complaints = [];
          this.generalFindingsForm.patchValue(res.data.findings);
        }
      })
  }


  testMMUFindingsSubscription:any;
  getMMUFindingDetails(beneficiaryRegID, visitID, visitCategory,visitCode) {
    this.findingSubscription = this.doctorService.getMMUCaseRecordAndReferDetails(beneficiaryRegID, visitID, visitCategory,visitCode)
    .subscribe(res => {
      if (res && res.statusCode == 200 && res.data && res.data.findings) {
        let findings = res.data.findings;
        this.complaintList = findings.complaints.slice();
        this.complaintList.forEach((element, i) => {
          this.filterInitialComplaints(element);
        });
        findings.complaints = [];
        this.generalFindingsForm.patchValue(res.data.findings);
      }
    })
  }
  // testMMUFindingsSubscription:any;
  // getMMUFindingDetails(beneficiaryRegID, visitID, visitCategory) {
  //   this.findingSubscription = this.doctorService.getMMUCaseRecordAndReferDetails(beneficiaryRegID, visitID, visitCategory,localStorage.getItem("visitCode"))
  //     .subscribe(res => {
  //       if (res && res.statusCode == 200 && res.data && res.data.findings) {
  //         let findings = res.data.findings;
  //         this.complaintList = findings.complaints.slice();


  //         this.testMMUFindingsSubscription = this.doctorService.getMMUCaseRecordAndReferDetails(beneficiaryRegID, localStorage.getItem("referredVisitID"), visitCategory,localStorage.getItem("referredVisitCode"))
  //         .subscribe(response => {

  //           if (response && response.statusCode == 200 && response.data) {
  //             let  complaintListResp=response.data.findings.complaints.slice();

  //             for(let i=0,j=this.complaintList.length;i<complaintListResp.length;i++,j++)
  //             {
  //               this.complaintList[j]=complaintListResp[i];
  //             }

  //           this.complaintList.forEach((element, i) => {
  //             this.filterInitialComplaints(element);
  //           });
  //           findings.complaints = [];
  //           this.generalFindingsForm.patchValue(res.data.findings);
  //         }
  //         })



        
  //       }
  //     })
  // }

  filterInitialComplaints(element) {
    let arr = this.chiefComplaintMaster.filter(item => {
      return item.chiefComplaint == element.chiefComplaint;
    })

    if (arr.length > 0) {
      let index = this.chiefComplaintTemporarayList[0].indexOf(arr[0]);
      let index2 = this.chiefComplaintMaster.indexOf(arr[0]);

      if (index >= 0)
        this.chiefComplaintTemporarayList[0].splice(index, 1);

      if (index2 >= 0)
        this.chiefComplaintMaster.splice(index2, 1);
    }
  }

  beneficiaryDetailSubscription: any;
  getBeneficiaryDetails() {
    this.beneficiaryDetailSubscription = this.beneficiaryDetailsService.beneficiaryDetails$
      .subscribe(beneficiary => {
        this.beneficiary = beneficiary;
      })
  }

  doctorMasterDataSubscription: any;
  getDoctorMasterData() {
    this.doctorMasterDataSubscription = this.masterdataService.nurseMasterData$.subscribe(masterData => {
      if (masterData) {
        this.chiefComplaintMaster = masterData.chiefComplaintMaster.slice();
        this.chiefComplaintTemporarayList[0] = this.chiefComplaintMaster.slice();

        if (this.caseRecordMode == 'view') {
          this.beneficiaryRegID = localStorage.getItem('beneficiaryRegID');
          this.visitID = localStorage.getItem('visitID');
          this.visitCategory = localStorage.getItem('visitCategory');


          if(localStorage.getItem("referredVisitCode") == "undefined" || localStorage.getItem("referredVisitCode") == null)
          {
            this.getFindingDetails(this.beneficiaryRegID, this.visitID, this.visitCategory);
          }
        
          else
          if(parseInt(localStorage.getItem("specialist_flag")) == 3){
            this.getMMUFindingDetails(this.beneficiaryRegID, this.visitID, this.visitCategory,localStorage.getItem("visitCode"));
          
          }
        else
        {
          this.getMMUFindingDetails(this.beneficiaryRegID,localStorage.getItem("referredVisitID"), this.visitCategory,localStorage.getItem("referredVisitCode"));
          
        }

         
        }
      }
    });
  }
  getSCTid(event, index) {
    console.log('called',index, event);
    this.masterdataService.getSnomedCTRecord(event.chiefComplaint)
      .subscribe((res) => {
        if (res && res.statusCode == 200) {
            this.loadConceptID(res.data, index);
        }

      }, error => {

      })
  }

  loadConceptID(data, index) {
    console.log(this.generalFindingsForm.value, data)
 const id = <FormArray>this.generalFindingsForm.controls['complaints'];
      id.at(index).patchValue({
        conceptID: data.conceptID
      })
  }

  filterComplaints(chiefComplaintValue, i) {
    this.suggestChiefComplaintList(this.fb.group({ chiefComplaint: chiefComplaintValue }), i);
    this.setTempvalidation();
    let arr = this.chiefComplaintMaster.filter(item => {
      return item.chiefComplaint == chiefComplaintValue.chiefComplaint;
    })

    if (this.selectedChiefComplaintList && this.selectedChiefComplaintList[i]) {
      this.chiefComplaintTemporarayList.map((item, t) => {
        if (t != i) {
          item.push(this.selectedChiefComplaintList[i]);
          this.sortChiefComplaintList(item);
        }
      })
    }

    if (arr.length > 0) {
      this.chiefComplaintTemporarayList.map((item, t) => {
        let index = item.indexOf(arr[0]);
        if (index != -1 && t != i)
          item = item.splice(index, 1);
      })
      this.selectedChiefComplaintList[i] = arr[0];
    }
  }

  addCheifComplaint() {
    const complaintFormArray = <FormArray>this.generalFindingsForm.controls['complaints'];
    this.setTempvalidation();
    const complaintFormArrayValue = complaintFormArray.value;
    let temp = this.chiefComplaintMaster.filter(item => {
      let arr = complaintFormArrayValue.filter((value) => {
        return value.chiefComplaint.chiefComplaint == item.chiefComplaint;
      })
      let flag = arr.length == 0 ? true : false;
      return flag;
    })
    if (temp.length > 0) {
      this.chiefComplaintTemporarayList.push(temp);
    }
    complaintFormArray.push(this.formUtils.initChiefComplaints());
  }

  removeCheifComplaint(i: number, complaintForm?: FormGroup) {
    this.confirmationService.confirm(`warn`, this.current_language_set.alerts.info.warn).subscribe(result => {
      if (result) {
        const complaintFormArray = <FormArray>this.generalFindingsForm.controls['complaints'];
        this.generalFindingsForm.markAsDirty();

        let arr = [];
        if (complaintForm.value.chiefComplaint) {
          arr = this.chiefComplaintMaster.filter(item => {
            return item.chiefComplaint == complaintForm.value.chiefComplaint.chiefComplaint;
          })
        }
        if (arr.length > 0) {
          this.chiefComplaintTemporarayList.forEach((element, t) => {
            if (t != i)
              element.push(arr[0]);
            this.sortChiefComplaintList(element);
          })
        }
        if (this.selectedChiefComplaintList[i])
          this.selectedChiefComplaintList[i] = null;

        if (this.suggestChiefComplaintList[i])
          this.suggestedChiefComplaintList[i] = null;

        if (complaintFormArray.length == 1 && complaintForm)
          complaintForm.reset();
        else
          complaintFormArray.removeAt(i);
        this.setTempvalidation();
      }
    });
  }

  setTempvalidation(){
    let chiefComplaintForm = <FormGroup>this.generalFindingsForm.controls['complaints'];
    let flag = false;
    this.enableProvisionalDiag = false;
    if (chiefComplaintForm != undefined && chiefComplaintForm.value.length > 0) {
      for (let i = 0; i < chiefComplaintForm.value.length; i++) {
        if (chiefComplaintForm.value[i].chiefComplaint !== null) {
          this.enableProvisionalDiag = true;
          if (chiefComplaintForm.value[i].chiefComplaint.chiefComplaint === "Fever") {
            flag = true;
            break;
          }
          if(environment.isTMOffline) {
          if (
            chiefComplaintForm.value[i].chiefComplaint.chiefComplaint.toLowerCase().includes("fever") ||
            chiefComplaintForm.value[i].chiefComplaint.chiefComplaint.toLowerCase().includes("cough") ||
            chiefComplaintForm.value[i].chiefComplaint.chiefComplaint.toLowerCase().includes("congestion") ||
            chiefComplaintForm.value[i].chiefComplaint.chiefComplaint.toLowerCase().includes("asthma") ||
            chiefComplaintForm.value[i].chiefComplaint.chiefComplaint.toLowerCase().includes("copd") ||
            chiefComplaintForm.value[i].chiefComplaint.chiefComplaint.toLowerCase().includes("influenza") ||
            chiefComplaintForm.value[i].chiefComplaint.chiefComplaint.toLowerCase().includes("pneumonia") ||
            chiefComplaintForm.value[i].chiefComplaint.chiefComplaint.toLowerCase().includes("tuberculosis") || 
            chiefComplaintForm.value[i].chiefComplaint.chiefComplaint.toLowerCase().includes("lung cancer") ||
            chiefComplaintForm.value[i].chiefComplaint.chiefComplaint.toLowerCase().includes("breathing problems")
          ) {
            flag = true;
            break;
          }
        }
        }
      }
    }
    if (flag)
      this.nurseService.setNCDTemp(true);
    else
      this.nurseService.setNCDTemp(false);
    if (flag) 
      this.nurseService.setEnableLAssessment(true);
    else 
      this.nurseService.setEnableLAssessment(false);
    if (this.enableProvisionalDiag) 
      this.nurseService.setNCDScreeningProvision(true);
    else 
      this.nurseService.setNCDScreeningProvision(false);
  }
  validateDuration(formGroup: FormGroup, event?: Event) {
    let duration = null;
    let durationUnit = null;
    let flag = true;

    if (formGroup.value.duration)
      duration = formGroup.value.duration;

    if (formGroup.value.unitOfDuration)
      durationUnit = formGroup.value.unitOfDuration;

    if (duration != null && durationUnit != null)
      flag = new ValidationUtils().validateDuration(duration, durationUnit, this.beneficiary.age);

    if (!flag) {
      this.confirmationService.alert(this.current_language_set.alerts.info.DurationAge);
      formGroup.patchValue({ duration: null, unitOfDuration: null })
    }
  }

  displayChiefComplaint(complaint) {
    return complaint && complaint.chiefComplaint;
  }

  suggestChiefComplaintList(complaintForm: FormGroup, i) {
    let complaint = complaintForm.value.chiefComplaint;
    if (complaint !== undefined && complaint !== null && typeof complaint === 'string') {
      this.suggestedChiefComplaintList[i] = this.chiefComplaintTemporarayList[i].filter(compl =>
        compl.chiefComplaint.toLowerCase().indexOf(complaint.toLowerCase().trim()) >= 0);
    } else if (complaint !== undefined && complaint !== null && typeof complaint == 'object' && complaint 
    && complaint.chiefComplaint !== undefined && complaint.chiefComplaint !== null) {
      this.suggestedChiefComplaintList[i] = this.chiefComplaintTemporarayList[i].filter(compl =>
        compl.chiefComplaint.toLowerCase().indexOf(complaint.chiefComplaint.toLowerCase().trim()) >= 0);
    }

    if (this.suggestedChiefComplaintList[i].length == 0)
      complaintForm.reset();
  }

  sortChiefComplaintList(complaintList) {
    complaintList.sort((a, b) => {
      if (a.chiefComplaint == b.chiefComplaint) return 0;
      if (a.chiefComplaint < b.chiefComplaint) return -1;
      else return 1;
    })
  }

  checkComplaintFormValidity(complaintForm) {
    let temp = complaintForm.value;
    if (temp.chiefComplaint && temp.duration && temp.unitOfDuration) {
      return false;
    } else {
      return true;
    }
  }
}
