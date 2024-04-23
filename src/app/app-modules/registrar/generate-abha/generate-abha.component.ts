import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RegistrationUtils } from '../shared/utility/registration-utility';
import { MD_DIALOG_DATA, MdDialog, MdDialogRef } from '@angular/material';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { RegistrarService } from '../shared/services/registrar.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { HealthIdOtpGenerationComponent } from '../health-id-otp-generation/health-id-otp-generation.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generate-abha',
  templateUrl: './generate-abha.component.html',
  styleUrls: ['./generate-abha.component.css']
})
export class GenerateAbhaComponent implements OnInit {
  utils = new RegistrationUtils(this.fb);
  
  abhaGenerateForm: FormGroup;
  currentLanguageSet: any;
  modeofAbhaHealthID: any;
  aadharNumber: any;
  disableGenerateOTP: boolean;

  constructor(
    public dialogRef: MdDialogRef<GenerateAbhaComponent>,
    private fb: FormBuilder,
    private dialog: MdDialog,
    public httpServiceService: HttpServiceService,
    private registrarService: RegistrarService,
    private router: Router
  ) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.abhaGenerateForm = this.createAbhaGenerateForm();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  closeDialog() {
    this.dialogRef.close();
    this.modeofAbhaHealthID = null;
      this.aadharNumber = null;
  }

  createAbhaGenerateForm() {
    return this.fb.group({
      modeofAbhaHealthID: null,
      aadharNumber: null
    });
  }

  resetAbhaValidateForm() {
    this.abhaGenerateForm.patchValue({
      aadharNumber: null,
    });
    this.abhaGenerateForm.patchValue({
      modeofAbhaHealthID: null,
    });
  }

  getAbhaValues(){
    this.modeofAbhaHealthID=this.abhaGenerateForm.controls["modeofAbhaHealthID"].value;
    this.aadharNumber=this.abhaGenerateForm.controls["aadharNumber"].value;
  }

  generateABHACard() {
    this.dialogRef.close();
    this.modeofAbhaHealthID=this.abhaGenerateForm.controls["modeofAbhaHealthID"].value;
    this.aadharNumber=this.abhaGenerateForm.controls["aadharNumber"].value;
    if (this.modeofAbhaHealthID==="AADHAR") {
      this.generateHealthIDCard();
      this.getOTP(); 
    } else if (this.modeofAbhaHealthID==="BIOMETRIC"){
      this.aadharNumber=this.abhaGenerateForm.controls["aadharNumber"].value;
      this.router.navigate(['/registrar/rdServiceBio/', {aadharNumber: this.aadharNumber}]);
    }
  }

  generateHealthIDCard() {
    const id = {
      "aadharNumber"     : this.aadharNumber,
      "modeofAbhaHealthID" : this.modeofAbhaHealthID
    }
    this.registrarService.passIDsToFetchOtp(id);
  }

  getOTP() {
    let dialogRef = this.dialog.open(HealthIdOtpGenerationComponent, {
      height: '250px',
      width: '420px',
      data: {
        "aadharNumber"     : this.aadharNumber,
        "healthIdMode" : this.modeofAbhaHealthID
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('resultGoldy', result)
      if (result) {
        (<FormGroup>this.abhaGenerateForm.controls['otherDetailsForm']).patchValue({ healthId: result.healthId });
        (<FormGroup>this.abhaGenerateForm.controls['otherDetailsForm']).patchValue({ healthIdNumber: result.healthIdNumber });
        (<FormGroup>this.abhaGenerateForm.controls['otherDetailsForm']).controls['healthId'].disable();
        this.disableGenerateOTP=true;
      }
  })
  }
}

  @Component({
    selector: 'auth-method',
    templateUrl: './auth-method.html',
    styleUrls: ['./generate-abha.component.css']
  })
  export class authMethodComponent implements OnInit {
    authOption: boolean = false;
    modeofAuthMethod: any;
    abhaAuthMethodForm: FormGroup;

    constructor(
      private fb: FormBuilder,
      public dialogRef: MdDialogRef<authMethodComponent>,
      private registerService: RegistrarService,
    ) {}

  ngOnInit(): void {
    this.abhaAuthMethodForm = this.createAbhaAuthMethod();
  }
  
  createAbhaAuthMethod() {
    return this.fb.group({
      modeofAuthMethod: null,
    });
  }

  closeDialogAuth() {
    this.dialogRef.close();
    this.modeofAuthMethod = null;
  }

  getAbhaAuthMethod(){
    this.modeofAuthMethod=this.abhaAuthMethodForm.controls["modeofAuthMethod"].value;
    this.dialogRef.close(this.modeofAuthMethod);
    console.log("AUTH METHOD", this.modeofAuthMethod);
  }
}
