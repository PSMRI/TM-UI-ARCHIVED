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


import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CameraService } from '../../../../core/services/camera.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'doctor-gynecological-examination',
  templateUrl: './gynecological-examination.component.html',
  styleUrls: ['./gynecological-examination.component.css']
})
export class GynecologicalExaminationComponent implements OnInit {

  @Input('gynecologicalExaminationForm')
  gynecologicalExaminationForm: FormGroup;

  @ViewChild('gynaecologicalImage')
  private gynaecologicalImage: ElementRef;

  imagePoints: any;
  current_language_set: any;
  constructor(
    private fb: FormBuilder,
    private cameraService: CameraService,
    public httpServiceService: HttpServiceService ) { }

  ngOnInit() {
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
    this.assignSelectedLanguage();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }

  checkWithRTIOrSTI() {
    this.gynecologicalExaminationForm.patchValue({ rTIOrSTIDetail: null })
  }
  
  get sufferedFromRTIOrSTI() {
    return this.gynecologicalExaminationForm.get('sufferedFromRTIOrSTI');
  }

  get observation() {
    return this.gynecologicalExaminationForm.get('observation');
  }

  selectedFiles(event) {
    let filesObject = event.target.files;
    let fileList = [];

    for (let file of filesObject) {
      fileList.push(file);
    }

    this.gynecologicalExaminationForm.patchValue({
      'filePath': fileList
    });
  }

  annotateImage() {
    this.cameraService.annotate(this.gynaecologicalImage.nativeElement.attributes.src.nodeValue, this.gynecologicalExaminationForm.controls['image'].value)
      .subscribe(result => {
        if (result) {
          this.imagePoints = result;
          this.imagePoints.imageID = 4;
          this.gynecologicalExaminationForm.patchValue({ image: this.imagePoints });
          this.gynecologicalExaminationForm.markAsDirty();
        }
      })
  }

}
