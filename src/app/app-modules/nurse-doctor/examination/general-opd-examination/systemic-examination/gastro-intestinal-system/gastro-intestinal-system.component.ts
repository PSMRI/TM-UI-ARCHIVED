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
  selector: 'nurse-gastro-intestinal-system',
  templateUrl: './gastro-intestinal-system.component.html',
  styleUrls: ['./gastro-intestinal-system.component.css']
})
export class GastroIntestinalSystemComponent implements OnInit {

  @Input('gastroIntestinalSystemForm')
  gastroIntestinalSystemForm: FormGroup;



  selectAbdomenTexture = [
    {
      name: 'Soft',
      id: 1
    },
    {
      name: 'Firm',
      id: 2
    },
    {
      name: 'Tense',
      id: 3
    },
    {
      name: 'Rigid',
      id: 4
    }
  ];

  selectLiver =
  [
    {
      name: 'Not Palpable',
      id: 1
    },
    {
      name: 'Just Palpable',
      id: 2
    },
    {
      name: 'Enlarged',
      id: 3
    },
  ]
  selectSpleen =
  [
    {
      name: 'Not Palpable',
      id: 1
    },
    {
      name: 'Just Palpable',
      id: 2
    },
    {
      name: 'Enlarged',
      id: 3
    },
  ]
  current_language_set: any;

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

  checkWithTenderness() {
    this.gastroIntestinalSystemForm.patchValue({ palpation_LocationOfTenderness: null })
  }

  get palpation_Tenderness() {
    return this.gastroIntestinalSystemForm.controls['palpation_Tenderness'].value;
  }

  get palpation_LocationOfTenderness() {
    return this.gastroIntestinalSystemForm.controls['palpation_LocationOfTenderness'].value;
  }

}
