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


import { Component, SimpleChanges, OnInit, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MasterdataService } from '../../shared/services';
import { ConfirmationService } from '../../../core/services/confirmation.service';

import { BeneficiaryDetailsService } from '../../../core/services/beneficiary-details.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'nurse-obstetric-formula',
  templateUrl: './obstetric-formula.component.html',
  styleUrls: ['./obstetric-formula.component.css']
})
export class ObstetricFormulaComponent implements OnInit {

  @Input('obstetricFormulaForm')
  obstetricFormulaForm: FormGroup;

  @Input('gravidaStatus')
  gravidaStatus: any;

  @Input('mode')
  mode: String;

  selectBloodGroupType: any;
  current_language_set: any;
  constructor(
    private fb: FormBuilder,
    private masterdataService: MasterdataService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private confirmationService: ConfirmationService,
    public httpServiceService: HttpServiceService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
   
    this.getNurseMasterData();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.gravidaStatus && this.gravidaStatus) {
      this.obstetricFormulaForm.patchValue({ gravida_G: 1 });
      this.obstetricFormulaForm.patchValue({ pretermDeliveries_P: null });
      this.obstetricFormulaForm.patchValue({ termDeliveries_T: null });
      this.obstetricFormulaForm.patchValue({ livebirths_L: null });
      this.obstetricFormulaForm.patchValue({ abortions_A: null });
      this.obstetricFormulaForm.patchValue({ stillBirth: null });
    }

    if (simpleChanges.gravidaStatus && !(this.gravidaStatus)) {
      this.calculateGravida();
    }
  }

  getNurseMasterData() {
    this.masterdataService.nurseMasterData$.subscribe(data => {
      if (data) {
        this.selectBloodGroupType = data.bloodGroups;
        this.getBenificiaryDetails();
      }
    });
  }

  beneficiaryDetailsSubscription: any;
  disableBloodGroup = false;
  getBenificiaryDetails() {
    this.beneficiaryDetailsSubscription = this.beneficiaryDetailsService.beneficiaryDetails$
      .subscribe(beneficiaryDetails => {
        if (!this.mode) {
          if (beneficiaryDetails && beneficiaryDetails.bloodGroup) {
            if (beneficiaryDetails.bloodGroup != "Don't Know")
              this.disableBloodGroup = true;

           

          

            this.obstetricFormulaForm.patchValue({ bloodGroup: beneficiaryDetails.bloodGroup });
          }
        }
      
      })
  }

  calculateGravida(formControlName?: string) {
    let gravidaValue = 1;
    if (this.termDeliveries_T)
      gravidaValue = gravidaValue + (+this.termDeliveries_T);
    if (this.pretermDeliveries_P)
      gravidaValue = gravidaValue + (+this.pretermDeliveries_P);
    if (this.abortions_A)
      gravidaValue = gravidaValue + (+this.abortions_A);
    if (this.stillBirth)
      gravidaValue = gravidaValue + (+this.stillBirth);

    if (formControlName == "abortions_A" && this.abortions_A && this.abortions_A > 5) {
      this.confirmationService.alert(this.current_language_set.alerts.info.recheckValue);
    }

    if (formControlName == "stillBirth" && this.stillBirth && this.stillBirth > 9) {
      this.confirmationService.alert(this.current_language_set.alerts.info.recheckValue);
    }
    this.obstetricFormulaForm.patchValue({ gravida_G: gravidaValue });
  }

  checkLivingChildren(livebirths_L) {
    if (livebirths_L > 9) {
      this.confirmationService.alert(this.current_language_set.alerts.info.recheckValue);
      // this.obstetricFormulaForm.controls['livebirths_L'].reset();
    }
  }

  checkAbortions(abortions_A) {
    if (abortions_A > 5) {
      this.confirmationService.alert(this.current_language_set.alerts.info.valueRange);
      // this.obstetricFormulaForm.controls['abortions_A'].reset();
    }
  }

  



  get gravida_G() {
    return this.obstetricFormulaForm.controls['gravida_G'].value;
  }

  get termDeliveries_T() {
    return this.obstetricFormulaForm.controls['termDeliveries_T'].value;
  }

  get pretermDeliveries_P() {
    return this.obstetricFormulaForm.controls['pretermDeliveries_P'].value;
  }

  get abortions_A() {
    return this.obstetricFormulaForm.controls['abortions_A'].value;
  }

  get livebirths_L() {
    return this.obstetricFormulaForm.controls['livebirths_L'].value;
  }

  get bloodGroup() {
    return this.obstetricFormulaForm.controls['bloodGroup'].value;
  }

  get stillBirth()
  {
    return this.obstetricFormulaForm.controls['stillBirth'].value;
  }

}
