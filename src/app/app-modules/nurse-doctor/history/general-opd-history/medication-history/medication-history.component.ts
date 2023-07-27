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


import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';

import { PreviousDetailsComponent } from '../../../../core/components/previous-details/previous-details.component';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { MasterdataService, NurseService, DoctorService } from '../../../shared/services';
import { ConfirmationService } from '../../../../core/services/confirmation.service';
import { ValidationUtils } from '../../../shared/utility/validation-utility';
import { BeneficiaryDetailsService } from '../../../../core/services/beneficiary-details.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'general-medication-history',
  templateUrl: './medication-history.component.html',
  styleUrls: ['./medication-history.component.css']
})
export class MedicationHistoryComponent implements OnInit, DoCheck {

  @Input('medicationHistory')
  medicationHistoryForm: FormGroup;
  medicationHistoryData: any;
  masterData: any;

  @Input('mode')
  mode: string;

  @Input('visitCategory')
  visitType: any;
  currentLanguageSet: any;

  constructor(
    private fb: FormBuilder,
    private dialog: MdDialog,
    private nurseService: NurseService,
    private doctorService: DoctorService,
    private confirmationService: ConfirmationService,
    private masterdataService: MasterdataService,
    public httpServiceService: HttpServiceService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
  ) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.getMasterData();
    this.getBeneficiaryDetails();
    this.addMedicationHistory();
  }
ngOnChanges()
{

}
  ngOnDestroy() {
    if (this.nurseMasterDataSubscription)
      this.nurseMasterDataSubscription.unsubscribe();
    if (this.generalHistorySubscription)
      this.generalHistorySubscription.unsubscribe();
    if (this.beneficiaryDetailSubscription)
      this.beneficiaryDetailSubscription.unsubscribe();
  }

  nurseMasterDataSubscription: any;
  getMasterData() {
    this.nurseMasterDataSubscription = this.masterdataService.nurseMasterData$.subscribe(masterData => {
      if (masterData) {
        this.nurseMasterDataSubscription.unsubscribe();
        this.masterData = masterData;

        if (this.mode == 'view') {
          let visitID = localStorage.getItem('visitID');
          let benRegID = localStorage.getItem('beneficiaryRegID')
          this.getGeneralHistory(benRegID, visitID);
        }
        if(parseInt(localStorage.getItem("specialistFlag")) == 100)
        {
           let visitID = localStorage.getItem('visitID');
          let benRegID = localStorage.getItem('beneficiaryRegID')
          this.getGeneralHistory(benRegID, visitID);
        }
       
      }
    })
  }

  beneficiaryDetailSubscription: any;
  beneficiary: any;
  getBeneficiaryDetails() {
    this.beneficiaryDetailSubscription = this.beneficiaryDetailsService.beneficiaryDetails$
      .subscribe(beneficiary => {
        this.beneficiary = beneficiary;
      })
  }

  generalHistorySubscription: any;
  getGeneralHistory(benRegID, visitID) {
    this.generalHistorySubscription = this.doctorService.getGeneralHistoryDetails(benRegID, visitID).subscribe(history => {
      if (history != null && history.statusCode == 200 && history.data != null && history.data.MedicationHistory) {
        this.medicationHistoryData = history.data.MedicationHistory;
        this.handleMedicationHistoryData();
      }
    })
  }

  handleMedicationHistoryData() {
    let formArray = this.medicationHistoryForm.controls['medicationHistoryList'] as FormArray;
    let temp = this.medicationHistoryData.medicationHistoryList.slice();
    for (let i = 1; i < temp.length; i++) {
      this.addMedicationHistory();
    }
    formArray.patchValue(temp);
    formArray.markAsTouched();
  }

  addMedicationHistory() {
    let medicationHistoryList = <FormArray>this.medicationHistoryForm.controls['medicationHistoryList'];
    medicationHistoryList.push(this.initMedicationHistory());
  }

  removeMedicationHistory(i, medicationHistoryForm?: FormGroup) {
    this.confirmationService.confirm(`warn`, this.currentLanguageSet.alerts.info.warn).subscribe(result => {
      if (result) {
        let medicationHistoryList = <FormArray>this.medicationHistoryForm.controls['medicationHistoryList'];
        this.medicationHistoryForm.markAsDirty();
        this.medicationHistoryForm.parent.markAsDirty();
        if (medicationHistoryList.length == 1 && !!medicationHistoryForm) {
          medicationHistoryList.controls[i].patchValue({
            currentMedication: null,
            timePeriodAgo: null,
            timePeriodUnit: null
          })
        }
        else
          medicationHistoryList.removeAt(i);
        this.medicationHistoryForm.updateValueAndValidity();
        console.log(this.medicationHistoryForm.dirty);
      }
    });

  }

  createMedicationHistoryForm() {
    this.medicationHistoryForm = this.fb.group({
      medicationHistoryList: new FormArray([this.initMedicationHistory()])
    })
  }

  getPreviousMedicationHistory() {
    let benRegID = localStorage.getItem('beneficiaryRegID');
    this.nurseService.getPreviousMedicationHistory(benRegID, this.visitType)
      .subscribe(res => {
        if (res.statusCode == 200 && res.data != null) {
          if (res.data.data.length > 0) {
            this.viewPreviousData(res.data);
          } else {
            this.confirmationService.alert(this.currentLanguageSet.alerts.info.pastHistoryNot);
          }
        } else {
          this.confirmationService.alert(this.currentLanguageSet.alerts.info.errorFetchingHistory, 'error');
        }
      }, err => {
        this.confirmationService.alert(this.currentLanguageSet.alerts.info.errorFetchingHistory, 'error');
      })
  }

  viewPreviousData(data) {
    this.dialog.open(PreviousDetailsComponent, {
      data: { 'dataList': data, title: this.currentLanguageSet.historyData.Medicationhistorydetails.previousmedicationhistorydetails }
    });
  }

  initMedicationHistory() {
    return this.fb.group({
      currentMedication: null,
      timePeriodAgo: null,
      timePeriodUnit: null
    })
  }

  validateDuration(formGroup: FormGroup, event?: Event) {
    let duration = null;
    let durationUnit = null;
    let flag = true;

    if (formGroup.value.timePeriodAgo)
      duration = formGroup.value.timePeriodAgo;

    if (formGroup.value.timePeriodUnit)
      durationUnit = formGroup.value.timePeriodUnit;

    if (duration != null && durationUnit != null)
      flag = new ValidationUtils().validateDuration(duration, durationUnit, this.beneficiary.age);

    if (!flag) {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.durationGreaterThanAge);
      formGroup.patchValue({ timePeriodAgo: null, timePeriodUnit: null })
    }
  }

  checkValidity(medicationForm) {
    let temp = medicationForm.value;
    if (temp.currentMedication && temp.timePeriodAgo && temp.timePeriodUnit) {
      return false;
    } else {
      return true;
    }
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }

}
