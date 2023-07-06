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
