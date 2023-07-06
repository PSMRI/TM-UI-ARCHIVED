import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'nurse-central-nervous-system',
  templateUrl: './central-nervous-system.component.html',
  styleUrls: ['./central-nervous-system.component.css']
})
export class CentralNervousSystemComponent implements OnInit {
  
  @Input('centralNervousSystemForm')
  centralNervousSystemForm: FormGroup;
  current_language_set: any;

  selectHandedness = [
    {
      name: 'No',
      id: 1
    },
    {
      name: 'Right Handed',
      id: 2
    },
    {
      name: 'Left Handed',
      id: 3
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
