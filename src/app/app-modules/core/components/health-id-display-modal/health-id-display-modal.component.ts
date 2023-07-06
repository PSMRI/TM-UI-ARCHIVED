import { Component, Inject, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RegistrarService } from '../../../registrar/shared/services/registrar.service';
import { ConfirmationService } from '../../services/confirmation.service';
import { DatePipe } from '@angular/common';
import { SetLanguageComponent } from '../set-language.component';
import { HealthIdValidateComponent } from 'app/app-modules/registrar/registration/register-other-details/register-other-details.component';

@Component({
  selector: 'app-health-id-display-modal',
  templateUrl: './health-id-display-modal.component.html',
  styleUrls: ['./health-id-display-modal.component.css'],
  providers:[DatePipe]
})
export class HealthIdDisplayModalComponent implements OnInit {

  healthIDArray: any = [];
  chooseHealthID: any;
  currentLanguageSet: any;
  healthIDMapped: any;
  benDetails: any;
  enablehealthIdOTPForm: boolean = false;
  healthIDMapping: Boolean = false;
  transactionId: any;
  selectedHealthID: any;
  healthIdOTPForm: FormGroup;
  showProgressBar: Boolean = false;
  searchDetails: any=[];
  searchPopup: boolean=false;

  constructor(public dialogRef: MdDialogRef<HealthIdDisplayModalComponent>,
    @Inject(MD_DIALOG_DATA) public input: any,
    public httpServiceService: HttpServiceService,
    private formBuilder: FormBuilder,
    private registrarService: RegistrarService,
    private confirmationService: ConfirmationService,private datePipe:DatePipe,
    private dialogMd: MdDialog) { 
      dialogRef.disableClose = true;
    }

  ngOnInit() {
    console.log("datalist",this.input);
    this.searchDetails=null;
    this.selectedHealthID=null;
    this.searchPopup=false;
    this.assignSelectedLanguage();
    this.searchPopup=this.input.search !=undefined ? this.input.search :false;
    // this.httpServiceService.currentLangugae$.subscribe(response => this.currentLanguageSet = response);
    this.healthIDMapping = this.input.healthIDMapping;
    if(this.input.dataList !=undefined && this.input.dataList.length >0 && this.input.search == true)
    this.searchDetails= this.input.dataList;
    if(this.input.dataList !=undefined && this.input.dataList.data !=undefined && 
      this.input.dataList.data.BenHealthDetails !=undefined)
    this.benDetails = this.input.dataList.data.BenHealthDetails;
    this.healthIdOTPForm = this.createOtpGenerationForm();
    this.createList();
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }
  createOtpGenerationForm() {
    return this.formBuilder.group({
      otp: null
    })
  }
  createList() {
    if(this.benDetails.length >0)
          {
    this.benDetails.forEach((healthID) => {
      healthID.createdDate=this.datePipe.transform(healthID.createdDate, 'yyyy-MM-dd hh:mm:ss a');
      // let date = new Date(healthID.createdDate);
      // let mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      //   day = ("0" + date.getDate()).slice(-2);
      // let newDate = [day, mnth, date.getFullYear()].join("-");
      // healthID.createdDate = newDate;
      this.healthIDArray.push(healthID);

    })
  }

  }
  onRadioChange(data) {
    this.selectedHealthID = data;
  }
  generateOtpForMapping() {
    this.showProgressBar = true;
    let reqObj = { 
      "healthID": this.selectedHealthID.healthId ? this.selectedHealthID.healthId : null,
      "healthIdNumber": this.selectedHealthID.healthIdNumber ? this.selectedHealthID.healthIdNumber : null,
      "authenticationMode":this.selectedHealthID.authenticationMode
    }
    this.registrarService.generateOtpForMappingCareContext(reqObj).subscribe(receivedOtpResponse => {
      if (receivedOtpResponse.statusCode == 200) {
        this.showProgressBar = false;
        this.confirmationService.alert(this.currentLanguageSet.OTPSentToRegMobNo, 'success');
        this.transactionId = receivedOtpResponse.data.txnId;
        this.enablehealthIdOTPForm = true;
      } else {
        this.confirmationService.alert(receivedOtpResponse.errorMessage, 'error');
        this.enablehealthIdOTPForm = false;
        this.showProgressBar = false;
      }
    }, err => {
      this.showProgressBar = false;
      this.confirmationService.alert(err.errorMessage, 'error');
      this.enablehealthIdOTPForm = false;
    })

  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

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

  verifyOtp() {
    this.showProgressBar= true;
    let verifyOtpData = {
      "otp": this.healthIdOTPForm.controls['otp'].value,
      "txnId": this.transactionId,
      "beneficiaryID": this.selectedHealthID.beneficiaryRegID,
      "healthID": this.selectedHealthID.healthId ? this.selectedHealthID.healthId : null,
      "healthIdNumber": this.selectedHealthID.healthIdNumber ? this.selectedHealthID.healthIdNumber : null,
      "visitCode": this.input.visitCode,
      "visitCategory": localStorage.getItem('visiCategoryANC') === "General OPD (QC)" ? "Emergency" : localStorage.getItem('visiCategoryANC')
    }
    this.registrarService.verifyOtpForMappingCarecontext(verifyOtpData).subscribe((verifiedMappingData) => {
      if (verifiedMappingData.statusCode == 200) {
        this.showProgressBar = false;
        this.confirmationService.alert(verifiedMappingData.data.response, "success")
        this.closeDialog();
      } else {
        this.showProgressBar = false;
        this.confirmationService.alert(verifiedMappingData.errorMessage, 'error');
      }
    }, err => {
      this.showProgressBar = false;
      this.confirmationService.alert(err.errorMessage, 'error');
    })

  }
  resendOtp() {
    this.healthIdOTPForm.controls['otp'].reset;
    this.healthIdOTPForm.controls['otp'].patchValue(null);
    this.generateOtpForMapping();
  }
  closeDialog() {
    this.dialogRef.close();
  }

  openDialogForprintHealthIDCard(data,txnId)
  {
   let dialogRefValue=this.dialogMd.open(HealthIdValidateComponent, {
    height: '250px',
    width: '420px',
      disableClose: true,
      data: {
        "healthId": data.healthId,
        "authenticationMode": data.authenticationMode,
        "generateHealthIDCard": true,
        "healthIDDetailsTxnID":txnId
      }
    });

    dialogRefValue.afterClosed().subscribe(result => {
      console.log('result', result)
    
    });

   
    // this.closeDialog();
  }


  printHealthIDCard(data) {
 
    let healthMode=null;
    if(data.authenticationMode !== undefined && data.authenticationMode !== null && data.authenticationMode === "AADHAR")
    healthMode = "AADHAAR";
    else if(data.authenticationMode !== undefined && data.authenticationMode !== null && data.authenticationMode === "MOBILE")
    healthMode = "MOBILE";
 
      this.showProgressBar = true;
      let reqObj = {
        "authMethod":(healthMode !=null && healthMode !=undefined) ? healthMode + '_OTP' : null ,
        "healthid": data.healthId,
        "healthIdNumber": data.healthIdNumber
      }
      this.registrarService.generateHealthIDCard(reqObj)
      .subscribe((res)=> {
        if(res.statusCode == 200 && Object.keys(res.data).length>0) {
         
          this.dialogRef.close();
          // this.confirmationService.confirmHealthId('success', this.currentLanguageSet.OTPSentToRegMobNo).subscribe((result) => {
          //   if(result)
          //   {
          this.dialogRef.afterClosed().subscribe(result => {
            // console.log('result', result)
            this.transactionId = res.data.txnId;
            if (healthMode == "MOBILE")
            {
            this.confirmationService.confirmHealthId('success', this.currentLanguageSet.OTPSentToRegMobNo).subscribe((result) => {
              if(result)
              {
                this.openDialogForprintHealthIDCard(data,this.transactionId);
              }
            });
          }
           
          else if (healthMode == "AADHAAR")
          {
            this.confirmationService.confirmHealthId('success', this.currentLanguageSet.OTPSentToAadharLinkedNo).subscribe((result) => {
              if(result)
              {
                this.openDialogForprintHealthIDCard(data,this.transactionId);
              }
            });
          }
          
          });
          
        // }
        this.showProgressBar = false;
            // });
        }

        else {
          // let dat={
          //   "clearHealthID":true
          // };
          this.showProgressBar = false;
          // this.dialogRef.close();
          this.confirmationService.alert(res.status, 'error');
        }
      }, err => {
        this.showProgressBar = false;
        this.confirmationService.alert(err.errorMessage, 'error');
      })
    }

 
  
}

