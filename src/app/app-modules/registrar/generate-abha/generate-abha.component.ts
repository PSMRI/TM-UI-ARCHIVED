import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RegistrationUtils } from '../shared/utility/registration-utility';
import { MdDialog, MdDialogRef } from '@angular/material';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { RegistrarService } from '../shared/services/registrar.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { HealthIdOtpGenerationComponent } from '../health-id-otp-generation/health-id-otp-generation.component';
import { BiometricAuthenticationComponent } from '../biometric-authentication/biometric-authentication.component';

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
      let mdDialogRef: MdDialogRef<BiometricAuthenticationComponent> = this.dialog.open(BiometricAuthenticationComponent,
        {
          width:"500px",
          height:"320px",
          disableClose: true,
        }
      );
     mdDialogRef.afterClosed().subscribe((res) => {
     });
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
