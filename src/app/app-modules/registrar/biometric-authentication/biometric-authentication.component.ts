import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material/dialog';
import { RegistrarService } from '../shared/services/registrar.service';
import { ConfirmationService } from 'app/app-modules/core/services';

@Component({
  selector: 'app-biometric-authentication',
  templateUrl: './biometric-authentication.component.html',
  styleUrls: ['./biometric-authentication.component.css']
})
export class BiometricAuthenticationComponent implements OnInit {

  enableImage: Boolean = false;
  messageInfo: any;

  constructor(
    public mdDialogRef: MdDialogRef<BiometricAuthenticationComponent>,
    private registrarService: RegistrarService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
  }



  connectDevice(){
    this.enableImage = true;
    this.messageInfo = "Please wait while connecting to the device"
  //call the method to connect device discover ADVM
  let pidValue = "P";
  this.registrarService.getBiometricData(pidValue).subscribe((res: any) => {
    this.messageInfo = "Please place your finger on the device to authenticate";
    if(res !== undefined && res !== null && res.statusCode == 200){
      console.log("DATA STATUS", res);
      this.enableImage = true;
      this.messageInfo = "Fingerprint captured successfully";
    }
    else if(res.statusCode != 200){
      this.enableImage = true;
      this.messageInfo = "Issue in capturing fingerprint"
    } else {
      this.enableImage = true;
      this.messageInfo = "Issue in connecting with device"
    }
  }, (err: any) => {
    this.enableImage = false;
    this.confirmationService.alert("Capture timed out", err.error);
  }) 
  //Second method calling 
  // let resposne = "success"
  // if(resposne == "success"){
  //   this.messageInfo = "Finger print captured successfully"
  // }
   }

  closeDialog(){
    this.mdDialogRef.close();
    this.enableImage = false;
  }

}
