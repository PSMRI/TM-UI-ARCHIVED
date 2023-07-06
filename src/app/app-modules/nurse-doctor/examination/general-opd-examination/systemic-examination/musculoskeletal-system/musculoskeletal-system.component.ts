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
