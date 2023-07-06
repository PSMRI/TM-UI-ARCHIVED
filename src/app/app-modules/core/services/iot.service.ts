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
