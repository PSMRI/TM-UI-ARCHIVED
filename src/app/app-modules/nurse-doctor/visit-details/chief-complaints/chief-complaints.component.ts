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


import { Component, OnInit, EventEmitter, Input, OnChanges, Output, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { MasterdataService, DoctorService, NurseService } from '../../shared/services';
import { BeneficiaryDetailsService } from '../../../core/services/beneficiary-details.service';
import { ValidationUtils } from '../../shared/utility/validation-utility';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { Observable } from "rxjs/Rx";
import { VisitDetailUtils } from '../../shared/utility/visit-detail-utility';
import { VisitDetailsComponent } from 'app/app-modules/nurse-doctor/visit-details/visit-details.component';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { environment } from 'environments/environment';

@Component({
  selector: 'patient-chief-complaints',
  templateUrl: './chief-complaints.component.html',
  styleUrls: ['./chief-complaints.component.css']
})
export class ChiefComplaintsComponent implements OnInit, DoCheck {
  @Input('patientChiefComplaintsForm')
  patientChiefComplaintsForm: FormGroup;

  @Input('mode')
  mode: String;

  formUtility:any;

  complaintDuration = ["Hours", "Days", "Weeks", "Months", "Years"];

  benChiefComplaints: any;

  chiefComplaintMaster: any;
  chiefComplaintTemporarayList = [];
  selectedChiefComplaintList = [];
  suggestedChiefComplaintList = [];
  enableLungAssessment: boolean = false;
  enableProvisionalDiag: boolean = false;
  jsonObj = [];

  public jsonObj$: Observable<any[]>
  currentLanguageSet: any;
  visitComplaintDet: any;

  constructor(
    private fb: FormBuilder,
    private masterdataService: MasterdataService,
    private doctorService: DoctorService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    public httpServiceService: HttpServiceService,
    private nurseService:NurseService,
    private confirmationService: ConfirmationService) { 
      this.formUtility = new VisitDetailUtils(this.fb);
    }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.enableLungAssessment = false;
    this.enableProvisionalDiag = false;
    if(parseInt(localStorage.getItem("specialistFlag")) == 100)
    {
    this.getMMUNurseMasterData();
    }
    else{
      this.getNurseMasterData();
    }
    this.getBeneficiaryDetails();
    this.nurseService.clearNCDScreeningProvision();
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
      .subscribe(data => {
        if (data && data.chiefComplaintMaster) {
        
          // this.nurseMasterDataSubscription.unsubscribe();
      
          this.chiefComplaintMaster = data.chiefComplaintMaster.slice();
          this.chiefComplaintTemporarayList[0] = this.chiefComplaintMaster.slice();

          if (this.mode == 'view') {
            let visitID = localStorage.getItem('visitID');
            let benRegID = localStorage.getItem('beneficiaryRegID')
            this.getChiefComplaints(benRegID, visitID);
          }
          // if(parseInt(localStorage.getItem("specialistFlag")) == 100)
          // {
          //    let visitID = localStorage.getItem('visitID');
          //   let benRegID = localStorage.getItem('beneficiaryRegID')
          //   this.getMMUChiefComplaints(benRegID, visitID);
           
          // }
        }
      });
  }

  getMMUNurseMasterData() {
    this.nurseMasterDataSubscription = this.masterdataService.nurseMasterData$
      .subscribe(data => {
        if (data && data.chiefComplaintMaster) {
        
          this.nurseMasterDataSubscription.unsubscribe();
      
          this.chiefComplaintMaster = data.chiefComplaintMaster.slice();
          this.chiefComplaintTemporarayList[0] = this.chiefComplaintMaster.slice();

          if (this.mode == 'view') {
            let visitID = localStorage.getItem('visitID');
            let benRegID = localStorage.getItem('beneficiaryRegID')
            this.getChiefComplaints(benRegID, visitID);
          }
          if(parseInt(localStorage.getItem("specialistFlag")) == 100)
          {
             let visitID = localStorage.getItem('visitID');
            let benRegID = localStorage.getItem('beneficiaryRegID')
            this.getMMUChiefComplaints(benRegID, visitID);
           
          }
        }
      });
  }

  getMMUChiefComplaintDetails: any;
  getMMUChiefComplaints(benRegID, visitID) {
    this.getMMUChiefComplaintDetails = this.doctorService.getVisitComplaintDetails(benRegID, visitID).subscribe(value => {
      if (value != null && value.statusCode == 200 && value.data != null) {
        this.visitComplaintDet = value.data.BenChiefComplaints;
        // this.addChiefComplaint();
        this.handleChiefComplaintData();
         
        
 
      }
    });
  }



  handleChiefComplaintData() {
    let formArray = this.patientChiefComplaintsForm.controls['complaints'] as FormArray;
    let temp = [];
    if (this.visitComplaintDet)
      temp = this.visitComplaintDet.slice();

    for (let i = 0; i < temp.length; i++) {
      let chiefComplaintType = this.chiefComplaintMaster.filter(item => {
        return item.chiefComplaint == temp[i].chiefComplaint;
      });

      if (chiefComplaintType.length > 0)
        temp[i].chiefComplaint = chiefComplaintType[0];


      if (temp[i].chiefComplaint) {
        let k = formArray.get('' + i);
        k.patchValue(temp[i]);
        k.markAsTouched();
        this.filterComplaints(temp[i].chiefComplaint, i);
      }

      if (i + 1 < temp.length)
        // this.addChiefComplaint();
        this.addCheifComplaint()
    }
  }


 



 


  getChiefComplaintDetails: any;
  getChiefComplaints(benRegID, visitID) {
    this.getChiefComplaintDetails = this.doctorService.getVisitComplaintDetails(benRegID, visitID).subscribe(value => {
      if (value != null && value.statusCode == 200 && value.data != null) {
        let visitComplaintDetail = value.data;
        if (visitComplaintDetail)
          this.benChiefComplaints = visitComplaintDetail.BenChiefComplaints;
          let flag=false;
          this.enableLungAssessment = false;
          this.enableProvisionalDiag = false;
          if(this.benChiefComplaints!=undefined && this.benChiefComplaints.length>0)
    {
    for(let i=0;i<this.benChiefComplaints.length;i++)
    {
      this.enableProvisionalDiag = true;
       if(this.benChiefComplaints[i] !=undefined && 
        this.benChiefComplaints[i] !=null && this.benChiefComplaints[i].chiefComplaint !=undefined && this.benChiefComplaints[i].chiefComplaint !=null && this.benChiefComplaints[i].chiefComplaint.toLowerCase() === "fever")
       {
       flag=true;
       break;
       }
       if(environment.isTMOffline) {
       if(this.benChiefComplaints[i] !=undefined && 
        this.benChiefComplaints[i] !=null && this.benChiefComplaints[i].chiefComplaint !=undefined && this.benChiefComplaints[i].chiefComplaint !=null && 
        (this.benChiefComplaints[i].chiefComplaint.toLowerCase().includes("fever") || this.benChiefComplaints[i].chiefComplaint.toLowerCase().includes("cough") || 
          this.benChiefComplaints[i].chiefComplaint.toLowerCase().includes("congestion") || this.benChiefComplaints[i].chiefComplaint.toLowerCase().includes("breathing problems") ||
          this.benChiefComplaints[i].chiefComplaint.toLowerCase().includes("asthma") || this.benChiefComplaints[i].chiefComplaint.toLowerCase().includes("copd") ||
          this.benChiefComplaints[i].chiefComplaint.toLowerCase().includes("influenza") || this.benChiefComplaints[i].chiefComplaint.toLowerCase().includes("pneumonia") ||
          this.benChiefComplaints[i].chiefComplaint.toLowerCase().includes("tuberculosis") || this.benChiefComplaints[i].chiefComplaint.toLowerCase().includes("lung cancer")))
       {
        this.enableLungAssessment=true;
       break;
       }
      }
    }
  }
  if(flag)
  this.nurseService.setNCDTemp(true);
  else
  this.nurseService.setNCDTemp(false);

  if(this.enableLungAssessment)
  this.nurseService.setEnableLAssessment(true);
  else
  this.nurseService.setEnableLAssessment(false);

  if(this.enableProvisionalDiag)
  this.nurseService.setNCDScreeningProvision(true);
  else
  this.nurseService.setNCDScreeningProvision(false);
      }
    });
  }

  getSCTid(event, index) {
    this.masterdataService.getSnomedCTRecord(event.chiefComplaint)
      .subscribe((res) => {
        if (res && res.statusCode == 200) {
          this.loadConceptID(res.data, index);
        }
      }, error => {

      })
  }

  loadConceptID(data, index) {
    const id = <FormArray>this.patientChiefComplaintsForm.controls['complaints'];
    id.at(index).patchValue({
      conceptID: data.conceptID
    })
  }

  ngOnDestroy() {
    if (this.nurseMasterDataSubscription)
      this.nurseMasterDataSubscription.unsubscribe();

    if (this.getChiefComplaintDetails)
      this.getChiefComplaintDetails.unsubscribe();

      if (this.getMMUChiefComplaintDetails)
      this.getMMUChiefComplaintDetails.unsubscribe();

    if (this.beneficiaryDetailSubscription)
      this.beneficiaryDetailSubscription.unsubscribe();
  }

  beneficiaryDetailSubscription: any;
  beneficiary: any;
  getBeneficiaryDetails() {
    this.beneficiaryDetailSubscription = this.beneficiaryDetailsService.beneficiaryDetails$
      .subscribe(beneficiary => {
        this.beneficiary = beneficiary;
      })
  }

  filterComplaints(chiefComplaintValue, i) {
    this.suggestChiefComplaintList(this.fb.group({ chiefComplaint: chiefComplaintValue }), i);

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
    this.enableLungAssessment = false;
    this.enableProvisionalDiag = false;
    let flag=false;
    if(this.selectedChiefComplaintList !=null && this.selectedChiefComplaintList !=undefined && this.selectedChiefComplaintList.length >0)
    {
      this.selectedChiefComplaintList.forEach(val=>{
        this.enableProvisionalDiag = true;
        if(val !=undefined && val !=null && val.chiefComplaint !=undefined && val.chiefComplaint !=null && val.chiefComplaint.toLowerCase() === "fever")
        flag=true;
        if(environment.isTMOffline) {
        if(val !=undefined && val !=null && val.chiefComplaint !=undefined && val.chiefComplaint !=null && 
          (val.chiefComplaint.toLowerCase().includes("fever") || val.chiefComplaint.toLowerCase().includes("cough") || 
          val.chiefComplaint.toLowerCase().includes("congestion") || val.chiefComplaint.toLowerCase().includes("breathing difficulty") ||
          val.chiefComplaint.toLowerCase().includes("asthma") || val.chiefComplaint.toLowerCase().includes("copd") ||
          val.chiefComplaint.toLowerCase().includes("influenza") || val.chiefComplaint.toLowerCase().includes("pneumonia") ||
          val.chiefComplaint.toLowerCase().includes("tuberculosis") || val.chiefComplaint.toLowerCase().includes("lung cancer")))
        this.enableLungAssessment=true;
        }
      })
    }
    if(flag)
    this.nurseService.setNCDTemp(true);
    else
    this.nurseService.setNCDTemp(false);

    if(this.enableLungAssessment)
    this.nurseService.setEnableLAssessment(true);
    else
    this.nurseService.setEnableLAssessment(false);

    if(this.enableProvisionalDiag)
    this.nurseService.setNCDScreeningProvision(true);
    else
    this.nurseService.setNCDScreeningProvision(false);
  }

  addCheifComplaint() {
    const complaintFormArray = <FormArray>this.patientChiefComplaintsForm.controls['complaints'];
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
    complaintFormArray.push(this.formUtility.createPatientChiefComplaintsForm());
  }

  removeCheifComplaint(i: number, complaintForm?: FormGroup) {
    this.confirmationService.confirm(`warn`, this.currentLanguageSet.alerts.info.warn).subscribe(result => {
      if (result) {
        const complaintFormArray = <FormArray>this.patientChiefComplaintsForm.controls['complaints'];
        this.patientChiefComplaintsForm.markAsDirty();

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
      }
      let flag=false;
      this.enableLungAssessment = false;
      this.enableProvisionalDiag = false;
    if(this.selectedChiefComplaintList !=null && this.selectedChiefComplaintList !=undefined && this.selectedChiefComplaintList.length >0)
    {
      this.selectedChiefComplaintList.forEach(val=>{
        this.enableProvisionalDiag = true;
        if(val !=undefined && val !=null && val.chiefComplaint !=undefined && val.chiefComplaint !=null && val.chiefComplaint.toLowerCase() === "fever")
        flag=true;
        if(environment.isTMOffline) {
        if(val !=undefined && val !=null && val.chiefComplaint !=undefined && val.chiefComplaint !=null && 
          (val.chiefComplaint.toLowerCase().includes("fever") || val.chiefComplaint.toLowerCase().includes("cough") || 
            val.chiefComplaint.toLowerCase().includes("congestion") || val.chiefComplaint.toLowerCase().includes("breathing problems") ||
            val.chiefComplaint.toLowerCase().includes("asthma") || val.chiefComplaint.toLowerCase().includes("copd") ||
            val.chiefComplaint.toLowerCase().includes("influenza") || val.chiefComplaint.toLowerCase().includes("pneumonia") ||
            val.chiefComplaint.toLowerCase().includes("tuberculosis") || val.chiefComplaint.toLowerCase().includes("lung cancer")))
        this.enableLungAssessment=true;
        }
      })
    }
    if(flag)
    this.nurseService.setNCDTemp(true);
    else
    this.nurseService.setNCDTemp(false);

    if(this.enableLungAssessment)
    this.nurseService.setEnableLAssessment(true);
    else
    this.nurseService.setEnableLAssessment(false);

    if(this.enableProvisionalDiag)
    this.nurseService.setNCDScreeningProvision(true);
    else
    this.nurseService.setNCDScreeningProvision(false);
    });
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
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.durationGreaterThanAge);
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
