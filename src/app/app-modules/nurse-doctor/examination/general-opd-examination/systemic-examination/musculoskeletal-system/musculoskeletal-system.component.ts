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
import { MasterdataService } from '../../../../shared/services';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'nurse-musculoskeletal-system',
  templateUrl: './musculoskeletal-system.component.html',
  styleUrls: ['./musculoskeletal-system.component.css']
})
export class MusculoskeletalSystemComponent implements OnInit {

  @Input('musculoSkeletalSystemForm')
  musculoSkeletalSystemForm: FormGroup;
  current_language_set: any;

  selectTypeOfJoint = [];

  selectJointLaterality = [
    {
      name: 'Left',
      id: 1
    },
    {
      name: 'Right',
      id: 2
    },
    {
      name: 'Bilateral',
      id: 3
    }
  ]

  selectJointAbnormality = [
    {
      name: 'Swelling',
      id: 1
    },
    {
      name: 'Tenderness',
      id: 2
    },
    {
      name: 'Deformity',
      id: 3
    },
    {
      name: 'Restriction',
      id: 4
    }
  ]

  selectUpperLimbsLaterality = [
    {
      name: 'Left',
      id: 1
    },
    {
      name: 'Right',
      id: 2
    },
    {
      name: 'Bilateral',
      id: 3
    }
  ]

  selectUpperLimbsAbnormality = [
    {
      name: 'Swelling',
      id: 1
    },
    {
      name: 'Tenderness',
      id: 2
    },
    {
      name: 'Deformity',
      id: 3
    },
    {
      name: 'Restriction',
      id: 4
    }
  ]

  selectLowerLimbsLaterality =
  [
    {
      name: 'Left',
      id: 1
    },
    {
      name: 'Right',
      id: 2
    },
    {
      name: 'Bilateral',
      id: 3
    }
  ]

  selectLowerLimbsAbnormality = [
    {
      name: 'Swelling',
      id: 1
    },
    {
      name: 'Tenderness',
      id: 2
    },
    {
      name: 'Deformity',
      id: 3
    },
    {
      name: 'Restriction',
      id: 4
    }
  ]

  constructor(
    private fb: FormBuilder,
    private masterdataService: MasterdataService,
    public httpServiceService: HttpServiceService ) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
    this.getMasterData();
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
    if(this.nurseMasterDataSubscription)
      this.nurseMasterDataSubscription.unsubscribe();
  }

  nurseMasterDataSubscription: any;
  getMasterData() {
    this.nurseMasterDataSubscription = this.masterdataService.nurseMasterData$.subscribe(masterData => {
      if (masterData)
      this.selectTypeOfJoint = masterData.jointTypes;
    })
  }

}
