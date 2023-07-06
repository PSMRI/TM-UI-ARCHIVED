import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';

import { BeneficiaryDetailsService } from '../../../../core/services/beneficiary-details.service';

import { CancerUtils } from '../../../shared/utility'
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'doctor-signs-and-symptoms',
  templateUrl: './signs-and-symptoms.component.html',
  styleUrls: ['./signs-and-symptoms.component.css']
})
export class SignsAndSymptomsComponent implements OnInit {

  @Input('signsForm')
  signsForm: FormGroup;

  female18 = false;
  female30 = false;
  female = false;
  current_language_set: any;
  constructor(
    private fb: FormBuilder,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
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
    if (this.beneficiaryDetailsSubs)
      this.beneficiaryDetailsSubs.unsubscribe();
  }

  beneficiaryDetailsSubs: any;
  getBeneficiaryDetails() {
    this.beneficiaryDetailsSubs = this.beneficiaryDetailsService.beneficiaryDetails$
      .subscribe(beneficiaryDetails => {
        if ((beneficiaryDetails && beneficiaryDetails.genderName && (beneficiaryDetails.genderName.toLocaleLowerCase() == 'female' || beneficiaryDetails.genderName.toLocaleLowerCase() == 'transgender')))
          this.female = true;
        else
          this.female = false;

        if (beneficiaryDetails && beneficiaryDetails.genderName && beneficiaryDetails.genderName.toLocaleLowerCase() == 'female' && beneficiaryDetails.ageVal >= 18)
          this.female18 = true;
        else
          this.female18 = false;

        if (beneficiaryDetails && beneficiaryDetails.genderName && beneficiaryDetails.genderName.toLocaleLowerCase() == 'female' && beneficiaryDetails.ageVal >= 30)
          this.female30 = true;
        else
          this.female30 = false;
      })
  }

  checkLymph(lymphNode_Enlarged) {
    if (lymphNode_Enlarged == false) {
      this.signsForm.patchValue({ lymphNodes: new CancerUtils(this.fb).lymphNodesArray.map(item => (item)) })
    }
  }

  get observation() {
    return this.signsForm.get('observation');
  }

  get lymphNode_Enlarged() {
    return this.signsForm.controls['lymphNode_Enlarged'].value;
  }

  get lymphNodes() {
    return this.signsForm.controls['lymphNodes'].value;
  }

}
