/* 
* AMRIT � Accessible Medical Records via Integrated Technology 
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


import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { ConfirmationService } from 'app/app-modules/core/services';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { GenerateMobileOtpGenerationComponent } from '../generate-mobile-otp-generation/generate-mobile-otp-generation.component';
import { HealthIdValidateComponent } from '../registration/register-other-details/register-other-details.component';
import { SetPasswordForAbhaComponent } from '../set-password-for-abha/set-password-for-abha.component';
import { RegistrarService } from '../shared/services/registrar.service';

@Component({
  selector: 'app-health-id-otp-generation',
  templateUrl: './health-id-otp-generation.component.html',
  styleUrls: ['./health-id-otp-generation.component.css']
})
export class HealthIdOtpGenerationComponent implements OnInit {

  healthIdOTPForm: FormGroup;
  healthIdMobileForm: FormGroup;
  currentLanguageSet:any;
  altNum: any;
  mobileNum: any;
  enablehealthIdOTPForm: boolean=false;
  transactionId: any;
  showProgressBar: Boolean = false;
  password: any;
  // mobileLinkedOtp: any;
  aadharNum: any;

  constructor(private fb: FormBuilder,public dialogRef: MdDialogRef<HealthIdOtpGenerationComponent>,
    public httpServiceService: HttpServiceService,@Inject(MD_DIALOG_DATA) public data: any,
    private registrarService: RegistrarService,
    private confirmationService: ConfirmationService,private dialog: MdDialog) 
     {
      dialogRef.disableClose = true;
     }

  mobileNumber: any = this.data.mobileNumber;
  healthIdMode: any = this.data.healthIdMode;

  ngOnInit() {
    this.assignSelectedLanguage();
    this.healthIdMobileForm =  this.createmobileValidationForm();
    this.healthIdOTPForm =  this.createOtpGenerationForm();
    if(this.healthIdMode == 'AADHAR'){
      this.enablehealthIdOTPForm = true;
      this.getHealthIdOtpForInitial();
    }
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  createmobileValidationForm() {
    return this.fb.group({
      mobileNo: null
    })
  }
  createOtpGenerationForm() {
    return this.fb.group({
      otp: null
    })
  }
  closeDialog() {
    this.dialogRef.close();
  }
  enableMobileNo(event)
  {
    if(event.checked)
    {
      this.altNum=true;
    }
    else{
      this.altNum=false;
      this.healthIdMobileForm.reset();
    }

  }

  getHealthIdOtpForInitial()
  {
   
    this.healthIdOTPForm.patchValue({
      otp: null
    })
    if(this.altNum == true)
    {
      this.mobileNum=this.healthIdMobileForm.controls['mobileNo'].value;
    }
    else{
      this.mobileNum=this.mobileNumber;
    }
    //
    this.enablehealthIdOTPForm=true;
    this.showProgressBar = true;
    let reqObj = null;
    if (this.healthIdMode == "MOBILE"){
      reqObj = {
        'mobile': this.mobileNum
      }
    }
    else if (this.healthIdMode == "AADHAR"){
      reqObj = {
        'aadhaar': this.data.aadharNumber
      }
      if(this.data.aadharNumber !== undefined && this.data.aadharNumber !== null){
        this.aadharNum =  this.data.aadharNumber;
      }
    }
    this.registrarService.generateOTP(reqObj,this.healthIdMode)
    .subscribe((res) => {
      if (res.statusCode == 200) {
        this.showProgressBar = false;
        if (this.healthIdMode == "MOBILE")
          this.confirmationService.alert(this.currentLanguageSet.OTPSentToMobNo + res.data.mobile, 'success');
        else if (this.healthIdMode == "AADHAR")
          this.confirmationService.alert(this.currentLanguageSet.OTPSentToAadharLinkedNo, 'success');

        this.transactionId=res.data.txnId;
        this.enablehealthIdOTPForm=true;
      } else {
         this.showProgressBar = false;
          this.dialogRef.close();
          this.dialogRef.afterClosed().subscribe(result => {
            this.confirmationService.alert(res.errorMessage, 'error');
          });
      }
    }, err => {
            this.showProgressBar = false;
              this.dialogRef.close();
              this.dialogRef.afterClosed().subscribe(result => {
                this.confirmationService.alert(this.currentLanguageSet.issueInGettingBeneficiaryABHADetails, 'error');
              });
          })


  }

  getHealthIdOtp()
  {
   
    this.healthIdOTPForm.patchValue({
      otp: null
    })
    if(this.altNum == true)
    {
      this.mobileNum=this.healthIdMobileForm.controls['mobileNo'].value;
    }
    else{
      this.mobileNum=this.mobileNumber;
    }
    //
    this.enablehealthIdOTPForm=true;
    this.showProgressBar = true;
    let reqObj = null;
    if (this.healthIdMode == "MOBILE"){
      reqObj = {
        'mobile': this.mobileNum
      }
    }
    else if (this.healthIdMode == "AADHAR"){
      reqObj = {
        'aadhaar': this.data.aadharNumber
      }
    }
    this.registrarService.generateOTP(reqObj,this.healthIdMode)
    .subscribe((res) => {
      if (res.statusCode == 200) {
        this.showProgressBar = false;
        if (this.healthIdMode == "MOBILE")
          this.confirmationService.alert(this.currentLanguageSet.OTPSentToMobNo + res.data.mobile, 'success');
        else if (this.healthIdMode == "AADHAR")
          this.confirmationService.alert(this.currentLanguageSet.OTPSentToAadharLinkedNo, 'success');

        this.transactionId=res.data.txnId;
        this.enablehealthIdOTPForm=true;
      } else {
         this.showProgressBar = false;
        this.confirmationService.alert(res.errorMessage, 'error');
        if (this.healthIdMode == "MOBILE")
          this.enablehealthIdOTPForm = false;
        else
          this.enablehealthIdOTPForm = true;
      }
    }, err => {
            this.showProgressBar = false;
            this.confirmationService.alert(err.errorMessage, 'error');
            if (this.healthIdMode == "MOBILE")
              this.enablehealthIdOTPForm = false;
            else
              this.enablehealthIdOTPForm = true;
          })
  }
  posthealthIDButtonCall()
  {
    let dialogRefPass = this.dialog.open(SetPasswordForAbhaComponent, {
      height: '300px',
      width: '420px',
      disableClose: true
    });
    dialogRefPass.afterClosed().subscribe((result) => {
        this.password = result;
      let reqObj = {
        "email": this.data.email,
        "firstName": this.data.firstName,
        "middleName":  this.data.middleName,
        "lastName": this.data.lastName,
        "password": this.password,
        "txnId": this.transactionId,
        "profilePhoto": this.data.profilePhoto,
        "healthId": this.data.healthId,
        "createdBy":localStorage.getItem('userName'),
        "providerServiceMapID":localStorage.getItem('providerServiceID')
      }
      this.registrarService.generateHealthIdWithUID(reqObj)
        .subscribe((res) => {
          if (res.statusCode == 200 && res.data) {
            this.registrarService.abhaGenerateData = res.data;
            this.registrarService.aadharNumberNew = this.aadharNum;
            this.registrarService.getabhaDetail(true);
            let dialogRefSuccess = this.dialog.open(HealthIdOtpSuccessComponent, {
              height: '300px',
              width: '420px',
              disableClose: true,
              data: res
            });
            this.showProgressBar = false;
            dialogRefSuccess.afterClosed().subscribe(result => {
            
            let dat = {
              "healthIdNumber": res.data.healthIdNumber,
              "healthId": res.data.healthId,
            }
            this.registrarService.setHealthIdMobVerification(dat);
            this.dialogRef.close(dat);
          });
          } else {
            this.showProgressBar = false;
            this.confirmationService.alert(res.errorMessage, 'error');
          }
        }, err => {
          this.showProgressBar = false;
          this.confirmationService.alert(this.currentLanguageSet.issueInGettingBeneficiaryABHADetails, 'error');
        });
      
    });
}

verifyOTPOnSubmit() {
  this.showProgressBar = true;
  let reqObj = null;
    reqObj = {
      "otp": this.healthIdOTPForm.controls['otp'].value,
      "txnId": this.transactionId,
    }
    this.registrarService.verifyOTPForAadharHealthId(reqObj)
        .subscribe((res) => {
          if(res.statusCode ==  200 && res.data) {
            this.dialogRef.close();
            if(res.data.mobileNumber == undefined || res.data.mobileNumber == null) {
              this.transactionId = res.data.tnxId;
              // this.mobileLinkedOtp = null;
              this.checkandGenerateToVerifyMobileOTP();
          } 
          else {
            let requestObj = {
              "mobile": res.data.mobileNumber,
              "txnId": res.data.tnxId,
            }
            this.registrarService.checkAndGenerateMobileOTPHealthId(requestObj)
            .subscribe((resOtp) => {
              if(resOtp.statusCode ==  200 && resOtp.data) {
                this.transactionId = resOtp.data.tnxId;
                // if(resOtp.data.mobileLinked === false) {
                //   this.mobileLinkedOtp = resOtp.data.mobileLinked;
                //   this.checkandGenerateToVerifyMobileOTP();
                // } else{
                  this.dialogRef.close();
                this.posthealthIDButtonCall();
                // }
              }
            })
          }
        } else {
            this.showProgressBar = false;
            this.confirmationService.alert(res.errorMessage, 'error');
          }
        }, err => {
          this.showProgressBar = false;
          this.confirmationService.alert(this.currentLanguageSet.issueInGettingBeneficiaryABHADetails, 'error');
        })
}

checkandGenerateToVerifyMobileOTP() {
  let dialogRefMobile = this.dialog.open(GenerateMobileOtpGenerationComponent, {
    height: '250px',
    width: '420px',
    disableClose: true,
    data: { "transactionId": this.transactionId}
  });
  this.showProgressBar = false;
  dialogRefMobile.afterClosed().subscribe((response)=> {
    if(response != undefined && response != null) {
      this.transactionId = response.tnxId; 
      this.posthealthIDButtonCall();
    }
  })
}
checkOTP()
  {
    let otp=this.healthIdOTPForm.controls['otp'].value;
    let cflag=false;
    if(otp != "" && otp != undefined
    && otp != null)
    {
      let hid=otp;
      if(hid.length >=4 && hid.length <=32)
      {
      for(var i=0;i<hid.length;i++)
      {
        if(!this.is_numeric(hid.charAt(i)))
        {
              cflag=true;
              break;
        }
      }
      if(cflag)
      return false;
    }
    else
    return false;
    }
    else
    return false;
    return true;
   
      
  }
  isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
  }
   is_numeric(str){
    return /^\d+$/.test(str);
}

}

@Component({
  selector: 'health-id-otp-succespopup',
  templateUrl: './health-id-otp-succespopup.html',
  styleUrls: ['./health-id-otp-generation.component.css']
})
export class HealthIdOtpSuccessComponent implements OnInit {
  verify:boolean=false;
  genderName: string;
  currentLanguageSet: any;
  transactionId: any;
  showProgressBar: boolean;
  fetchHealthIds: any;
  otherDetailsForm: any;
  constructor(public dialogSucRef: MdDialogRef<HealthIdOtpSuccessComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,private dialog: MdDialog,public httpServiceService: HttpServiceService, private registrarService: RegistrarService, private confirmationValService: ConfirmationService){
   
    console.log("popupdata");
  }
  succdata: any = this.data.data;
  ngOnInit() {
    this.assignSelectedLanguage();
    this.fetchHealthIdsValue();
    console.log("popupdata", this.succdata);

    if (this.succdata.Auth) {
      if (this.succdata.Auth.Patient != undefined && this.succdata.Auth.Patient != null)
        this.verify = true;
      if (this.succdata.Auth.Patient.Gender != undefined && this.succdata.Auth.Patient.Gender != null) {
        this.genderName = this.succdata.Auth.Patient.Gender == "0" ? "Male"
          : this.succdata.Auth.Patient.Gender == "1" ? "Female"
            : this.succdata.Auth.Patient.Gender == "2" ? "Transgender" : "Transgender";
      }
    }
  }
  closeSuccessDialog() {
    this.dialogSucRef.close();
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }

  fetchHealthIdsValue() {
    const fetchHealthIdSubscription = this.registrarService.generateHealthIdOtp$.subscribe(healthIdResponse => {
      this.fetchHealthIds = healthIdResponse;
    },
    (err) => {
      console.log(err);
    },
    () => {
      console.log("completed");
    }
  );
  fetchHealthIdSubscription.unsubscribe();

  }
  
  openDialogForprintHealthIDCard(data,txnId)
  {
   let dialogRefValue=this.dialog.open(HealthIdValidateComponent, {
    height: '250px',
    width: '420px',
      disableClose: true,
      data: {
        "healthId": data,
        "authenticationMode": this.fetchHealthIds.healthIdMode,
        "generateHealthIDCard": true,
        "healthIDDetailsTxnID":txnId
      }
    });

    dialogRefValue.afterClosed().subscribe(result => {
      console.log('result', result)
    
    });

   
   
  }


  fetchOtp(healthIdValue, healthIdNumber){
    this.dialogSucRef.close();
    let healthMode=null;
    if(this.fetchHealthIds.healthIdMode !== undefined && this.fetchHealthIds.healthIdMode !== null && this.fetchHealthIds.healthIdMode === "AADHAR")
    healthMode = "AADHAAR";
    else if(this.fetchHealthIds.healthIdMode !== undefined && this.fetchHealthIds.healthIdMode !== null && this.fetchHealthIds.healthIdMode === "MOBILE")
    healthMode = "MOBILE";
 
      this.showProgressBar = true;
      let reqObj = {
        "authMethod":healthMode + '_OTP' ,
        "healthid": healthIdValue ? healthIdValue : null,
        "healthIdNumber": healthIdNumber ? healthIdNumber : null
      }
      this.registrarService.generateHealthIDCard(reqObj)
      .subscribe((res)=> {
       
        if(res.statusCode == 200 && Object.keys(res.data).length>0) {
         
          if (healthMode === "MOBILE")
          {
          this.transactionId = res.data.txnId;
          if(this.dialogSucRef.componentInstance !== null)
          {
          this.dialogSucRef.afterClosed().subscribe(result => {
          this.confirmationValService.confirmHealthId('success', this.currentLanguageSet.OTPSentToRegMobNo).subscribe((result) => {
            if(result)
            {
              this.openDialogForprintHealthIDCard(healthIdValue,this.transactionId);
            }
          });
        });
      }
      else
      {
        this.confirmationValService.confirmHealthId('success', this.currentLanguageSet.OTPSentToRegMobNo).subscribe((result) => {
          if(result)
          {
            this.openDialogForprintHealthIDCard(healthIdValue,this.transactionId);
          }
        });
      }
        }
        else if (healthMode == "AADHAAR")
        {
          this.transactionId = res.data.txnId;
          if(this.dialogSucRef.componentInstance !== null)
          {
          this.dialogSucRef.afterClosed().subscribe(result => {
          this.confirmationValService.confirmHealthId('success', this.currentLanguageSet.OTPSentToAadharLinkedNo).subscribe((result) => {
            if(result)
            {
              this.openDialogForprintHealthIDCard(healthIdValue,this.transactionId);
            }
            });
          });
          }
          else
          {
            this.confirmationValService.confirmHealthId('success', this.currentLanguageSet.OTPSentToAadharLinkedNo).subscribe((result) => {
              if(result)
              {
                this.openDialogForprintHealthIDCard(healthIdValue,this.transactionId);
              }
              });
          }
        }
      
        this.showProgressBar = false;
        
        }

        else {
          this.showProgressBar = false;
          this.dialogSucRef.afterClosed().subscribe(result => {
          this.confirmationValService.alert(res.status, 'error');
          });
        }
      }, err => {
        this.showProgressBar = false;
        this.dialogSucRef.afterClosed().subscribe(result => {
        this.confirmationValService.alert(this.currentLanguageSet.issueInGettingBeneficiaryABHADetails, 'error');
        });
      })
    }
}
