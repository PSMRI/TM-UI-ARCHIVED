import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'nurse-head-to-toe-examination',
  templateUrl: './head-to-toe-examination.component.html',
  styleUrls: ['./head-to-toe-examination.component.css']
})
export class HeadToToeExaminationComponent implements OnInit {

  @Input('headToToeExaminationForm')
  headToToeExaminationForm: FormGroup;
  current_language_set: any;

  constructor(private fb: FormBuilder,
    public httpServiceService: HttpServiceService) { }

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
    
  checkWithHeadToToe() {
    this.headToToeExaminationForm.patchValue({ head: null });
    this.headToToeExaminationForm.patchValue({ eyes: null });
    this.headToToeExaminationForm.patchValue({ ears: null });
    this.headToToeExaminationForm.patchValue({ nose: null });
    this.headToToeExaminationForm.patchValue({ oralCavity: null });
    this.headToToeExaminationForm.patchValue({ throat: null });
    this.headToToeExaminationForm.patchValue({ breastAndNipples: null });
    this.headToToeExaminationForm.patchValue({ trunk: null });
    this.headToToeExaminationForm.patchValue({ upperLimbs: null });
    this.headToToeExaminationForm.patchValue({ lowerLimbs: null });
    this.headToToeExaminationForm.patchValue({ skin: null });
    this.headToToeExaminationForm.patchValue({ hair: null });
    this.headToToeExaminationForm.patchValue({ nails: null });
  }
  get headtoToeExam() {
    return this.headToToeExaminationForm.controls['headtoToeExam'].value;
  }

  get head() {
    return this.headToToeExaminationForm.controls['head'].value;
  }
  get eyes() {
    return this.headToToeExaminationForm.controls['eyes'].value;
  }
  get ears() {
    return this.headToToeExaminationForm.controls['ears'].value;
  }
  get nose() {
    return this.headToToeExaminationForm.controls['nose'].value;
  }
  get oralCavity() {
    return this.headToToeExaminationForm.controls['oralCavity'].value;
  }
  get throat() {
    return this.headToToeExaminationForm.controls['throat'].value;
  }
  get breastAndNipples() {
    return this.headToToeExaminationForm.controls['breastAndNipples'].value;
  }
  get trunk() {
    return this.headToToeExaminationForm.controls['trunk'].value;
  }
  get upperLimbs() {
    return this.headToToeExaminationForm.controls['upperLimbs'].value;
  }
  get lowerLimbs() {
    return this.headToToeExaminationForm.controls['lowerLimbs'].value;
  }
  get skin() {
    return this.headToToeExaminationForm.controls['skin'].value;
  }
  get hair() {
    return this.headToToeExaminationForm.controls['hair'].value;
  }
  get nails() {
    return this.headToToeExaminationForm.controls['nails'].value;
  }

}
