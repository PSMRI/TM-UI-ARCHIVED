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


import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CameraService } from '../../../../core/services/camera.service';
import { BeneficiaryDetailsService } from '../../../../core/services/beneficiary-details.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'doctor-breast-examination',
  templateUrl: './breast-examination.component.html',
  styleUrls: ['./breast-examination.component.css']
})
export class BreastExaminationComponent implements OnInit {

  @Input('breastExaminationForm')
  breastExaminationForm: FormGroup;
  
  @ViewChild('breastsImage')
  private breastsImage: ElementRef;
  
  female = false;
  imagePoints: any;
  current_language_set: any;

  constructor(
    private fb: FormBuilder,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private cameraService: CameraService,
    public httpServiceService: HttpServiceService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
    this.getBeneficiaryDetails();
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
    if(this.beneficiarySubs)
    this.beneficiarySubs.unsubscribe();
  }

  beneficiarySubs: any;
  getBeneficiaryDetails() {
    this.beneficiaryDetailsService.beneficiaryDetails$
    .subscribe(beneficiaryDetails => {
      if ((beneficiaryDetails && beneficiaryDetails.genderName && beneficiaryDetails.genderName.toLocaleLowerCase() == 'female') || (beneficiaryDetails && beneficiaryDetails.genderName && beneficiaryDetails.genderName.toLocaleLowerCase() == 'transgender'))
        this.female = true;
    })
  }

  checkBreastFeed() {
    this.breastExaminationForm.patchValue({ breastFeedingDurationGTE6months: null });
  }

  checkLump() {
    this.breastExaminationForm.patchValue({ lumpSize: null });
    this.breastExaminationForm.patchValue({ lumpShape: null });
    this.breastExaminationForm.patchValue({ lumpTexture: null });
  }

  get everBreastFed() {
    return this.breastExaminationForm.get('everBreastFed');
  }

  get lumpInBreast() {
    return this.breastExaminationForm.get('lumpInBreast');
  }

  annotateImage() {
    this.cameraService.annotate(this.breastsImage.nativeElement.attributes.src.nodeValue, this.breastExaminationForm.controls['image'].value)
      .subscribe(result => {
        if (result) {
          this.imagePoints = result;
          this.imagePoints.imageID = 2;
          this.breastExaminationForm.patchValue({ image: this.imagePoints });
          this.breastExaminationForm.markAsDirty();
        }
      })
  }

}
