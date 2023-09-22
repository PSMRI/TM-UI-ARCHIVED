import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-biometric-authentication',
  templateUrl: './biometric-authentication.component.html',
  styleUrls: ['./biometric-authentication.component.css']
})
export class BiometricAuthenticationComponent implements OnInit {

  enableImage: Boolean = false;
  messageInfo: any;

  constructor(
    public mdDialogRef: MdDialogRef<BiometricAuthenticationComponent>
  ) { }

  ngOnInit() {
  }



  connectDevice(){
    this.enableImage = true;
    this.messageInfo = "Connecting Device..."
  //call the method to connect device discover ADVM
  let res : any;
  if(res !== undefined && res !== null && res.toLowerCase() == "ready"){
    this.enableImage = true;
    this.messageInfo = "Please place your finger on the device to authenticate"
  }
  else{
    this.enableImage = true;
    this.messageInfo = "Issue in connecting with the device"
  }
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
