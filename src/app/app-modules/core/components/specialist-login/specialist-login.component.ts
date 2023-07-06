import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
@Component({
  selector: 'app-specialist-login',
  templateUrl: './specialist-login.component.html',
  styleUrls: ['./specialist-login.component.css']
})
export class SpecialistLoginComponent implements OnInit {

  specialistTMLoginForm: FormGroup;
  constructor( @Inject(MAT_SNACK_BAR_DATA) public data: any, public snackBarRef: MatSnackBarRef<SpecialistLoginComponent>, public formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log(' this.data', this.data);
    this.specialistTMLoginForm = this.createSpecialistTMLoginForm();

    if (localStorage.getItem('swymedLogin')) {
      let logggedInDoctor = JSON.parse(localStorage.getItem('swymedLogin')).userName
      let loginPassWord = JSON.parse(localStorage.getItem('swymedLogin')).password
      let domainValue = JSON.parse(localStorage.getItem('swymedLogin')).domain
      if (logggedInDoctor != null && domainValue != null && loginPassWord) {
        this.specialistTMLoginForm.patchValue({
          userName: logggedInDoctor,
          password: loginPassWord,
          domain: domainValue
        })
      }
    }
  }

  closeSnackBar(close) {
    if (close) {
      this.snackBarRef.dismiss();
    }
    else {
      localStorage.setItem('swymedLogin', JSON.stringify(this.specialistTMLoginForm.value))
      this.snackBarRef.dismiss();
    }
  }
  dynamictype = 'password'
  showPWD() {
    this.dynamictype = 'text';
  }

  hidePWD() {
    this.dynamictype = 'password';
  }

  createSpecialistTMLoginForm() {
    return this.formBuilder.group({
      userName: null,
      password: null,
      domain: null
    })
  }

}

