/* 
* AMRIT � Accessible Medical Records via Integrated Technology 
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


import { Component, OnInit, Input, OnChanges, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService } from '../../../../core/services/confirmation.service';
import { MasterdataService, NurseService } from '../../../shared/services';
import { BeneficiaryDetailsService } from '../../../../core/services/beneficiary-details.service';

import { PreviousDetailsComponent } from '../../../../core/components/previous-details/previous-details.component';
import { MdDialog } from '@angular/material';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'nurse-cancer-personal-history',
  templateUrl: './personal-history.component.html',
  styleUrls: ['./personal-history.component.css']
})
export class PersonalHistoryComponent implements OnInit, DoCheck {
  @Input('cancerPatientPerosnalHistoryForm')
  cancerPatientPerosnalHistoryForm: FormGroup;
  currentLanguageSet: any;

  constructor(private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private dialog: MdDialog,
    private nurseService: NurseService,
    private masterdataService: MasterdataService,
    public httpServiceService: HttpServiceService,
    private beneficiaryDetailsService: BeneficiaryDetailsService) { }

  templateNurseMasterData: any;
  templateBeneficiaryDetails: any;

  templateAlcoholUseStatus: any;
  templateDietTypes: any;
  templateOilConsumed: any;
  filteredOilConsumed: any;
  templatePhysicalActivityType: any;
  templateTobaccoUseStatus: any;
  templateFrequecyOfAlcohol: any;
  templateTobaccoProductUsed: any;
  dummy: any;
  ngOnInit() {
    this.getNurseMasterData();
    this.httpServiceService.currentLangugae$.subscribe(response =>this.currentLanguageSet = response);
this.dummy = this.cancerPatientPerosnalHistoryForm.value;
    this.cancerPatientPerosnalHistoryForm.controls['typeOfTobaccoProductList'].valueChanges
      .subscribe(value => {
        this.tobaccoSelected();
      });
  }

  ngOnDestroy() {
    if (this.nurseMasterDataSubscription)
      this.nurseMasterDataSubscription.unsubscribe();

    if (this.beneficiaryDetailSubscription)
      this.beneficiaryDetailSubscription.unsubscribe();
  }

  nurseMasterDataSubscription: any;
  getNurseMasterData() {
    this.getBenificiaryDetails();
    this.nurseMasterDataSubscription = this.masterdataService.nurseMasterData$.subscribe((nurseMasterData) => {
      if (nurseMasterData) {
        this.templateNurseMasterData = nurseMasterData;
        this.templateAlcoholUseStatus = this.templateNurseMasterData.alcoholUseStatus;
        this.templateDietTypes = this.templateNurseMasterData.dietTypes;
        this.templateOilConsumed = this.templateNurseMasterData.oilConsumed;
        this.filteredOilConsumed = this.templateOilConsumed;
        this.templatePhysicalActivityType = this.templateNurseMasterData.physicalActivityType;
        this.templateTobaccoUseStatus = this.templateNurseMasterData.tobaccoUseStatus;
        this.templateTobaccoProductUsed = this.templateNurseMasterData.typeOfTobaccoProducts;
        this.templateFrequecyOfAlcohol = this.templateNurseMasterData.frequencyOfAlcoholIntake
      }
    });
  }

  patientAge: any;
  spaceIndex: any;

  beneficiaryDetailSubscription: any;
  getBenificiaryDetails() {
    this.beneficiaryDetailSubscription = this.beneficiaryDetailsService.beneficiaryDetails$
      .subscribe(beneficiaryDetails => {
        if (beneficiaryDetails) {
          this.templateBeneficiaryDetails = beneficiaryDetails;
          this.patientAge = this.templateBeneficiaryDetails.ageVal;
        }
      })
  }
  checkTobaccoUseStatus(tobaccoUse) {
    if (tobaccoUse != null && tobaccoUse != undefined) {
      this.cancerPatientPerosnalHistoryForm.patchValue({ startAge_year: null });
      this.cancerPatientPerosnalHistoryForm.patchValue({ endAge_year: null });
      this.cancerPatientPerosnalHistoryForm.patchValue({ typeOfTobaccoProductList: null });
    }
  }

  checkBetelQuid() {
    this.cancerPatientPerosnalHistoryForm.patchValue({ durationOfBetelQuid: null });
  }

  checkUsageOfAlcohol() {
    this.cancerPatientPerosnalHistoryForm.patchValue({ ssAlcoholUsed: null });
    this.cancerPatientPerosnalHistoryForm.patchValue({ frequencyOfAlcoholUsed: null });
  }
  checkLastAlcoholUsage() {
    this.cancerPatientPerosnalHistoryForm.patchValue({ frequencyOfAlcoholUsed: null });
  }

  get tobaccoUse() {
    return this.cancerPatientPerosnalHistoryForm.get('tobaccoUse').value;
  }

  get isBetelNutChewing() {
    return this.cancerPatientPerosnalHistoryForm.get('isBetelNutChewing').value;
  }

  get ssAlcoholUsed() {
    return this.cancerPatientPerosnalHistoryForm.get('ssAlcoholUsed').value;
  }

  get alcoholUse() {
    return this.cancerPatientPerosnalHistoryForm.get('alcoholUse').value;
  }

  get dietType() {
    return this.cancerPatientPerosnalHistoryForm.get('dietType').value;
  }

  get fruitConsumptionDays() {
    return this.cancerPatientPerosnalHistoryForm.get('fruitConsumptionDays').value;
  }

  get vegetableConsumptionDays() {
    return this.cancerPatientPerosnalHistoryForm.get('vegetableConsumptionDays').value;
  }

  get typeOfOilConsumedList() {
    return this.cancerPatientPerosnalHistoryForm.get('typeOfOilConsumedList').value;
  }
  get typeOfTobaccoProductList() {
    return this.cancerPatientPerosnalHistoryForm.get('typeOfTobaccoProductList').value;
  }

  doSmokeCigarettes = false;
  doSmokeBeedi = false;
  tobaccoSelected() {
    if (this.typeOfTobaccoProductList && this.typeOfTobaccoProductList.indexOf('Beedi') >= 0) {
      this.doSmokeBeedi = true;
    } else {
      this.doSmokeBeedi = false;
      // this.cancerPatientPerosnalHistoryForm.patchValue({ quantityPerDay: null })
    }

    if (this.typeOfTobaccoProductList && this.typeOfTobaccoProductList.indexOf('Cigarettes') >= 0)
      this.doSmokeCigarettes = true;
    else {
      this.doSmokeCigarettes = false
      // this.cancerPatientPerosnalHistoryForm.patchValue({ quantityPerDay: null });
      this.cancerPatientPerosnalHistoryForm.patchValue({ isFilteredCigaerette: null });
    }
  }

  oilSelected() {
    if (this.typeOfOilConsumedList.length != 0) {
      if (this.typeOfOilConsumedList.indexOf("Don’t know.") > -1)
        this.templateOilConsumed = this.templateOilConsumed.filter(item => {
          return item.habitValue == "Don’t know."
        })
      else
        this.templateOilConsumed = this.templateOilConsumed.filter(item => {
          return item.habitValue != "Don’t know."
        })
    } else
      this.templateOilConsumed = this.filteredOilConsumed;
  }

  preventFruitConsumption(event: any) {
    if (+event.key > 7) {
      event.preventDefault();
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.daysInWeek);
    }
  }

  checkFruitConsumption() {
    this.cancerPatientPerosnalHistoryForm.patchValue({ fruitQuantityPerDay: null });
  }

  preventVegetableConsumption(event: any) {
    if (+event.key > 7) {
      event.preventDefault();
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.daysInWeek);
    }
  }

  checkVegetableConsumption() {
    this.cancerPatientPerosnalHistoryForm.patchValue({ vegetableQuantityPerDay: null });
  }

  startAgeYear: any;
  checkStartAge(event: any) {
    let startAge = parseInt(event.target.value);
    this.startAgeYear = startAge;
    if (startAge > this.patientAge) {
      this.cancerPatientPerosnalHistoryForm.patchValue({ startAge_year: null });
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.startAge);
    }
    if (startAge == 0) {
      this.cancerPatientPerosnalHistoryForm.patchValue({ startAge_year: null });
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.invalidLessThan);
    }
  }

  stopAgeYear: any;
  checkStopAge(event: any) {
    let stopAge = parseInt(event.target.value);
    if (stopAge > this.patientAge) {
      this.cancerPatientPerosnalHistoryForm.patchValue({ endAge_year: null })
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.stopAge);
    }
    if (stopAge < this.startAgeYear) {
      this.cancerPatientPerosnalHistoryForm.patchValue({ endAge_year: null })
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.ageLess);
    }
    if (stopAge == 0) {
      this.cancerPatientPerosnalHistoryForm.patchValue({ endAge_year: null })
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.invalidLessThan);
    }
  }

  fruitConsumptionPerDayCheck(event) {
    let checkFruitPerDay = event.target.value;
    if (+checkFruitPerDay == 0) {
      this.cancerPatientPerosnalHistoryForm.patchValue({ fruitQuantityPerDay: null })
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.invalidLessThan);
    }
  }

  vegetableConsumptionPerDayCheck(event) {
    let checkVegPerDay = event.target.value;
    if (+checkVegPerDay == 0) {
      this.cancerPatientPerosnalHistoryForm.patchValue({ vegetableQuantityPerDay: null })
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.invalidLessThan);
    }
  }

  getPreviousCancerPersonalHabitHistory() {
    let benRegID = localStorage.getItem('beneficiaryRegID');
    this.nurseService.getPreviousCancerPersonalHabitHistory(benRegID)
      .subscribe(data => {
        if (data != null && data.data != null) {
          if (data.data.data.length > 0) {
            this.viewPreviousData(data.data);
          } else {
            this.confirmationService.alert(this.currentLanguageSet.alerts.previousHistoryDetailsAlert.prevHabitDiet);
          }
        } else {
          this.confirmationService.alert(data.errorMessage, 'error');
        }
      }, err => {
        this.confirmationService.alert(err, 'error');
      })
  }

  getPreviousCancerPersonalDietHistory() {
    let benRegID = localStorage.getItem('beneficiaryRegID');
    this.nurseService.getPreviousCancerPersonalDietHistory(benRegID)
      .subscribe(data => {
        if (data != null && data.data != null) {
          if (data.data.data.length > 0) {
            this.viewPreviousData(data.data);
          } else {
            this.confirmationService.alert(this.currentLanguageSet.alerts.previousHistoryDetailsAlert.prevHabitDiet);
          }
        } else {
          this.confirmationService.alert(data.errorMessage, 'error');
        }
      }, err => {
        this.confirmationService.alert(err, 'error');
      })
  }

  viewPreviousData(data) {
    this.dialog.open(PreviousDetailsComponent, {
      data: { 'dataList': data, title:  this.currentLanguageSet.historyData.personalhistory.previouspersonalhistory }
    });
  }



  minimumvaluenonZeroBetelQuid(event: any) {
    if (event.target.value == 0) {
      this.cancerPatientPerosnalHistoryForm.patchValue({
        durationOfBetelQuid: null
      })
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
