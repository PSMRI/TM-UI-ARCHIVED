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


import { Injectable } from "@angular/core";
import { Http  } from "@angular/http";

import { environment } from "environments/environment";

import { Observable, BehaviorSubject } from "rxjs/Rx";

@Injectable()
export class IotService {

  baseurl=environment.ioturl;
  deviceStatusurl=environment.deviceStatusurl;
  deviceBluetoothurl=environment.deviceBluetoothurl;
  connectdeviceBluetoothurl=environment.connectdeviceBluetoothurl;
  disconnectdeviceBluetoothurl=environment.deviceDisconnectUrl;
  constructor(private http: Http) {
    
  }
  disconnect: Boolean=false;

  disconnectValue = new BehaviorSubject(this.disconnect);
  disconnectValue$ = this.disconnectValue.asObservable();
  setBluetoothConnected(val) {
    this.disconnect = val;
    this.disconnectValue.next(val);
  }
  startAPI(input: any) {
    return this.http
      .post(this.baseurl + input, null)
  }
  // startCalibrationAPI(input: any) {
  //   return this.http
  //     .post(this.baseurl, input)
  // }
  statusAPI(input: any) {
    return this.http
      .get(this.baseurl + input);
  }

  endAPI(input: any) {
    return this.http
      .put(this.baseurl + input, null);
  }
  endCalibrationAPI(input: any) {
    let content=["application/json"];
    const headerDict = {
      'Content-Type': content
    }
    return this.http
      .put(this.baseurl + input, {headers:headerDict});
  }
  // endCalibrationAPI(input: any) {
  //   return this.http
  //     .put(this.baseurl , input);
  // }
  getDeviceStatus(){
    return this.http
    .get(this.deviceStatusurl);
  }

  getBluetoothDevice(){
    return this.http
    .get(this.deviceBluetoothurl);
  }

  connectBluetoothDevice(str:string){
    return this.http
    .post(this.connectdeviceBluetoothurl+"/"+str, {});
  }
  disconnectBluetoothDevice(){
    return this.http
    .post(this.disconnectdeviceBluetoothurl, null);
  }
  pairExternalDevice(url:string){
    return this.http
    .post(this.baseurl+url, {});
  }
}
