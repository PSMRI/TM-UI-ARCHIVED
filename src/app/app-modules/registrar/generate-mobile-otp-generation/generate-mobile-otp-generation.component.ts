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


import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { ConfirmationService } from 'app/app-modules/core/services';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { RegistrarService } from '../shared/services/registrar.service';

@Component({
  selector: 'app-generate-mobile-otp-generation',
  templateUrl: './generate-mobile-otp-generation.component.html',
  styleUrls: ['./generate-mobile-otp-generation.component.css']
})
export class GenerateMobileOtpGenerationComponent implements OnInit {

  generateMobileOTPForm: FormGroup;
  currentLanguageSet: any;
  showProgressBar: boolean = false;
  txnId: any;
  // mobileNumber: any = this.data.mobileNumber;
  enableMobileOTPForm: boolean = false;
  // mobileLinkedOTP: boolean = false;
  
  constructor(private fb: FormBuilder,
    public dialogSucRef: MdDialogRef<GenerateMobileOtpGenerationComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    public httpServiceService: HttpServiceService,
    private registrarService: RegistrarService, 
    private confirmationService: ConfirmationService
    )     
    {
      dialogSucRef.disableClose = true;
    }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.txnId = this.data.transactionId;
    // this.mobileLinkedOTP = this.data.mobileLinked;
    // if(this.mobileLinkedOTP === false) {
    //   this.enableMobileOTPForm = true;
    // } else{
    //   this.enableMobileOTPForm = false;
    // }
    this.generateMobileOTPForm =  this.createmobileOTPValidationForm();
    
  }
  
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }

    createmobileOTPValidationForm() {
    return this.fb.group({
      mobileNo: null,
      mobileOtp: null
    })
  }

  closeDialog() {
    this.dialogSucRef.close();
  }
  
  //while clicking on submit after entering the mobile number
  onSubmitOfMobileNo()
  {
    if(this.enableMobileOTPForm === false) {
    this.showProgressBar = true;
      let reqObj = {
        "mobile": this.generateMobileOTPForm.controls.mobileNo.value,
        "txnId": this.txnId
      };
    this.registrarService.checkAndGenerateMobileOTPHealthId(reqObj)
        .subscribe((res) => {
          if(res.statusCode ==  200 && res.data) {
            this.showProgressBar = false;
            if(res.data.mobileLinked === false || res.data.mobileLinked === "false") {
              this.confirmationService.confirm('info', this.currentLanguageSet.enterOTPToVerify).subscribe((responseData) => {
                if(responseData === false) {
                  this.enableMobileOTPForm = false;
                }
                else {
                  this.enableMobileOTPForm = true;
                }
              });
            } else{
              this.dialogSucRef.close(res.data);
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
  }

  resendOTP()
  {
    this.showProgressBar = true;
      let reqObj = {
        "mobile": this.generateMobileOTPForm.controls.mobileNo.value,
        "txnId": this.txnId
      };
    this.registrarService.checkAndGenerateMobileOTPHealthId(reqObj)
        .subscribe((res) => {
          if(res.statusCode ==  200 && res.data) {
            this.showProgressBar = false;
            
          } else {
            this.showProgressBar = false;
            this.confirmationService.alert(res.errorMessage, 'error');
          }
        }, err => {
          this.showProgressBar = false;
          this.confirmationService.alert(this.currentLanguageSet.issueInGettingBeneficiaryABHADetails, 'error');
        })

  }

  //entering OTP for mobile verification
  verifyMobileOtp() {
    if(this.enableMobileOTPForm === true) {
    let reqObj = null;
        reqObj = {
          "otp": this.generateMobileOTPForm.controls['mobileOtp'].value,
          "txnId": this.txnId,
        }
        this.registrarService.verifyMobileOTPForAadhar(reqObj)
        .subscribe((res) => {
          if(res.statusCode ==  200) {
            this.dialogSucRef.close(res.data);
        } else{
          this.confirmationService.alert(res.errorMessage, "error");
        }
      })
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
}