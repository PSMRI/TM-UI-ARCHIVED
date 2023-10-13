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


import { Component, OnInit, Inject } from "@angular/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from "@angular/material";
import { IotService } from "app/app-modules/core/services/iot.service";
import { ConfirmationService } from "../../services";
import { HttpServiceService } from '../../services/http-service.service';
import { CalibrationComponent } from "../calibration/calibration.component";
import { SetLanguageComponent } from "../set-language.component";

@Component({
  selector: "app-iotcomponent",
  templateUrl: "./iotcomponent.component.html",
  styleUrls: ["./iotcomponent.component.css"]
})
export class IotcomponentComponent implements OnInit {

  errorMsg:any;
  progressMsg:any;
  statuscall:any;
  startAPI:any;
  output:any;
  currentLanguageSet: any;
  procedure: any;
  stripCode: any;
  msgCalibration:Boolean=false;
  startedCalibration: boolean=false;
  stoppedCalibration: boolean=false;
  statusCalibration: boolean=false;
  stripShowMsg:Boolean=false;
  constructor(
    @Inject(MD_DIALOG_DATA) public input: any,
    public dialogRef: MdDialogRef<IotcomponentComponent>,
    public service: IotService,
    private http_service: HttpServiceService,
    private confirmationService: ConfirmationService,public httpServiceService: HttpServiceService,
    private dialog: MdDialog,
  ) {}

  ngOnInit() {
    this.msgCalibration=false;
    this.startedCalibration=false;
    this.stripShowMsg=false;
    this.statusCalibration=false;
    this.stoppedCalibration=false;
    this.errorMsg=undefined;
    console.log("input", this.input);
    this.startAPI=this.input['startAPI']
    this.output=this.input['output'];
    this.procedure=this.input['procedure'];
    let providerServiceMapID= localStorage.getItem('providerServiceID');
    if(this.procedure !=undefined && this.procedure.value !=undefined && this.procedure.value.calibrationStartAPI !=undefined && this.procedure.value.calibrationStartAPI !=null)
          {
          let dialogRef = this.dialog.open(CalibrationComponent,{"width": "600px",
          "disableClose": true, data: { providerServiceMapID: providerServiceMapID}});
         
          dialogRef.afterClosed().subscribe(result => {
            console.log("calibration", result);
            if (result != null) {
              this.stripCode=result;
              this.msgCalibration=true;
              this.calibStart();
            }
            else if(result==null)
            this.dialogRef.close();
          });
          }
          else
    this.start();
    
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }
  calibStart()
  {
    try{
      this.service.startAPI(this.procedure.value.calibrationStartAPI).subscribe(res =>{
        console.log("dfasdas",res);
        if(res.status==202){
          this.progressMsg=JSON.parse(res["_body"])['message'];
          this.startedCalibration=true;
          this.stripShowMsg=true;
         // this.getCalibStatus();
         
        }else{
          this.errorMsg=res['message'];
        }
      },(err)=>{
        if((typeof(err['_body'])!="object")){
          this.errorMsg=JSON.parse(err['_body'])['message'];
          }
          else{
            this.errorMsg=this.currentLanguageSet.alerts.info.bluetoothDevicenotwork;
          }
      }
    );
  }catch(e){
    this.errorMsg=this.currentLanguageSet.alerts.info.servicesNotFunctional;
  }
  }
  getCalibStatus()
  {
    let statusAPI=this.procedure.value.calibrationStatusAPI.replace('{cs_code}',this.stripCode);
    this.service.statusAPI(statusAPI).subscribe(res =>{
      console.log("dfasdas",res);
      if(res.status==202 ||res.status==200){
        this.stripShowMsg=false;
        this.statusCalibration=true;
        // this.getstatus();
        // this.datasave=res["_body"];
        this.progressMsg=JSON.parse(res["_body"])['message'];
        clearTimeout(this.statuscall);
        //this.calibStop();
        // if(this.output==undefined){
        //   this.dialogRef.close(JSON.parse(res["_body"]) )
        // }
        this.confirmationService.confirmCalibration('success', this.currentLanguageSet.calibrationTestSuccess)
        .subscribe((res) => {
          if (res === true) { 
          this.start();
            
           }
           else
           this.dialogRef.close();
        })
        //else{
        //   this.closeOperation(JSON.parse(res["_body"]));
        // }
      }else if(res.status==206){
        this.stripShowMsg=false;
        this.statusCalibration=true;
        this.progressMsg=JSON.parse(res["_body"])['message'];
        this.statuscall= setTimeout(() => {          
          this.getCalibStatus();
        },5000);
      }else{
        this.stripShowMsg=false;
        this.statusCalibration=true;
        clearTimeout(this.statuscall)
        this.errorMsg=res['message'];
        
      }
    },(err)=>{
      this.stripShowMsg=false;
      this.statusCalibration=true;
      if((typeof(err['_body'])!="object")){
      this.errorMsg=JSON.parse(err['_body'])['message'];
      }
      else{
        this.errorMsg=this.currentLanguageSet.alerts.info.bluetoothDevicenotwork;
      }
    }) 
  }
  start(){
    this.msgCalibration=false;
    this.startedCalibration=false;
    this.stripShowMsg=false;
    this.statusCalibration=false;
    this.stoppedCalibration=false;
    // var x="api/v1/physical_tests/weight";
    this.progressMsg=undefined;
    try{
      this.service.startAPI(this.startAPI).subscribe(res =>{
        console.log("dfasdas",res);
        if(res.status==202){
          this.progressMsg=JSON.parse(res["_body"])['message'];
          this.getstatus();
         
        }else{
          this.errorMsg=res['message'];
        }
      },(err)=>{
        if((typeof(err['_body'])!="object")){
        this.errorMsg=JSON.parse(err['_body'])['message'];
        }
        else{
          this.errorMsg=this.currentLanguageSet.alerts.info.bluetoothDevicenotwork;
        }
      })
    }catch(e){
      this.errorMsg=this.currentLanguageSet.alerts.info.servicesNotFunctional;
    }
   
  }

  getstatus(){

    // this.statuscall =  setTimeout(() => {
      this.service.statusAPI(this.startAPI+"/status").subscribe(res =>{
        console.log("dfasdas",res);
        if(res.status==200){
          // this.getstatus();
          // this.datasave=res["_body"];

          this.statuscall=undefined;
          // clearTimeout(this.statuscall)
          
          if(this.output==undefined){
            this.dialogRef.close(JSON.parse(res["_body"]));
          }else{
            this.closeOperation(JSON.parse(res["_body"]));
          }
        }else if(res.status==206){
          this.progressMsg=JSON.parse(res["_body"])['message'];
           this.getstatus();
           this.statuscall=1;
          // this.statuscall= setTimeout(() => {          
          //   this.getstatus();
          // },500);
        }
       
        else{
          
          // clearTimeout(this.statuscall)
          this.statuscall=undefined;
          this.errorMsg=res['message'];
        }
      },(err)=>{
        if((typeof(err['_body'])!="object")){
        this.errorMsg=JSON.parse(err['_body'])['message'];
        }
        else{
          this.errorMsg=this.currentLanguageSet.alerts.info.bluetoothDevicenotwork;
        }
      }) 

    
  }

  stop(){
    if(this.msgCalibration)
    this.calibStop();
    else
    {
    if(this.statuscall!=undefined){
      this.statuscall=undefined;
      // clearTimeout(this.statuscall)
    
      this.service.endAPI(this.startAPI).subscribe(res =>{
        console.log("dfasdas",res);
        if(res.status==202){
          //do something
          
        }else{
          this.errorMsg=res['message'];
          
        }
      }) 
    }
    this.dialogRef.close();
  }
  }
  calibStop()
{
  if(this.statuscall!=undefined){
    clearTimeout(this.statuscall)
    this.service.endCalibrationAPI(this.procedure.value.calibrationEndAPI).subscribe(res =>{
      console.log("dfasdas",res);
      if(res.status==202||res.status==200){
        //do something
        this.stoppedCalibration=true;
        this.dialogRef.close();
      }else{
        this.errorMsg=res['message'];
        this.dialogRef.close(this.errorMsg );
      }
    },(err)=>{
      if((typeof(err['_body'])!="object")){
        this.errorMsg=JSON.parse(err['_body'])['message'];
        }
        else{
          this.errorMsg=this.currentLanguageSet.alerts.info.bluetoothDevicenotwork;
        }
    })
  }
  else
  {
    this.service.endCalibrationAPI(this.procedure.value.calibrationEndAPI).subscribe(res =>{
      console.log("dfasdas",res);
      if(res.status==202||res.status==200){
        //do something
        this.stoppedCalibration=true;
        this.dialogRef.close();
      }else{
        this.errorMsg=res['message'];
        this.dialogRef.close(this.errorMsg );
      }
    },(err)=>{
      if((typeof(err['_body'])!="object")){
        this.errorMsg=JSON.parse(err['_body'])['message'];
        }
        else{
          this.errorMsg=this.currentLanguageSet.alerts.info.bluetoothDevicenotwork;
        }
    })
  }
  this.dialogRef.close();
  
}
  closeOperation(input:any){
    let result=[];
    this.output.forEach(element => {
      result.push(input[element]);
    });
    this.dialogRef.close(result )
  }
}
