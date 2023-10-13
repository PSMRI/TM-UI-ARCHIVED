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
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'nurse-respiratory-system',
  templateUrl: './respiratory-system.component.html',
  styleUrls: ['./respiratory-system.component.css']
})
export class RespiratorySystemComponent implements OnInit {

  @Input('respiratorySystemForm')
  respiratorySystemForm: FormGroup;
  current_language_set: any;

  selectTrachea = [
    {
      name: 'Central',
      id: 1
    },
    {
      name: 'Deviated to Right',
      id: 2
    },
    {
      name: 'Deviated to Left',
      id: 3
    },
  ]

  selectBreathSounds = [
    {
      name: 'Normal',
      id: 1
    },
    {
      name: 'Decreased',
      id: 2
    },
    {
      name: 'Abnormal Breath Sounds',
      id: 3
    },
  ]

  selectPercussion = [
    {
      name: 'Dull',
      id: 1
    },
    {
      name: 'Stony Dull',
      id: 2
    },
    {
      name: 'Resonant',
      id: 3
    },
    {
      name: 'Hyper Resonant',
      id: 4
    },
  ]

  constructor(private fb: FormBuilder,
    public httpServiceService: HttpServiceService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }

}
