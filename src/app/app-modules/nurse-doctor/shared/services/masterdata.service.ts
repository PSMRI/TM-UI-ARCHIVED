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


import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';

import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';

import { environment } from 'environments/environment';

@Injectable()
export class MasterdataService {
  private _listners = new Subject<any>();

    listen(): Observable<any> {
       return this._listners.asObservable();
    }

    filter(filterBy: string) {
       this._listners.next(filterBy);
    }
    contactfilter(filterBy: string) {
      this._listners.next(filterBy);
   }
  /**
   * All master Data Urls
   */
  visitDetailMasterDataUrl = environment.visitDetailMasterDataUrl;
  nurseMasterDataUrl = environment.nurseMasterDataUrl;
  doctorMasterDataUrl = environment.doctorMasterDataUrl;
  snoMedDataURL = environment.snomedCTRecordURL;
  diagnosisSnomedCTRecordUrl = environment.snomedCTRecordListURL;
  diagnosisSnomedCTRecordUrl1 = environment.snomedCTRecordListURL1;
  getCalibrationStrips = environment.getCalibrationStrips;
  vaccinationTypeAndDoseMasterUrl = environment.vaccinationTypeAndDoseMasterUrl;
  previousCovidVaccinationUrl = environment.previousCovidVaccinationUrl;

  

  /**
   * Visit details master data observable and source
   */
  visitDetailMasterDataSource = new BehaviorSubject<any>(null);
  visitDetailMasterData$ = this.visitDetailMasterDataSource.asObservable();

  /**
   * Nurse master data observable and source
   */
  nurseMasterDataSource = new BehaviorSubject<any>(null);
  nurseMasterData$ = this.nurseMasterDataSource.asObservable();

  /**
   * Doctor master data observable and source
   */
  doctorMasterDataSource = new BehaviorSubject<any>(null);
  doctorMasterData$ = this.doctorMasterDataSource.asObservable();

  constructor(private http: Http) { }

  /**
   * Visit details master data api call
   */
  getVisitDetailMasterData() {
    return this.http.get(this.visitDetailMasterDataUrl)
      .subscribe(res => {
        this.visitDetailMasterDataSource.next(res.json().data);
      })
  }

  /**
   * Nurse master data api call
   */
  getNurseMasterData(visitID: string, providerServiceID) {
    let gender = localStorage.getItem('beneficiaryGender');
    return this.http.get(this.nurseMasterDataUrl + visitID + "/" + providerServiceID + "/" + gender)
      // return this.http.get(this.nurseMasterDataUrl+visitID)
      .subscribe(res => {
        this.nurseMasterDataSource.next(res.json().data);
      })
  }

  /**
  * Doctor master data api call
  */
  getDoctorMasterData(visitID: string, providerServiceID) {
    let facilityID = 0;
    if (JSON.parse(localStorage.getItem('serviceLineDetails')).facilityID != undefined && JSON.parse(localStorage.getItem('serviceLineDetails')).facilityID != null) {
      facilityID = JSON.parse(localStorage.getItem('serviceLineDetails')).facilityID;
    }
    let vanID = 0;
    if (JSON.parse(localStorage.getItem('serviceLineDetails')).vanID != undefined && JSON.parse(localStorage.getItem('serviceLineDetails')).vanID != null) {
      vanID = JSON.parse(localStorage.getItem('serviceLineDetails')).vanID;
    }
    let gender = localStorage.getItem('beneficiaryGender');
    console.log('facility', facilityID);

    return this.http.get(this.doctorMasterDataUrl + visitID + "/" + providerServiceID + "/" + gender + "/" + facilityID + "/" + vanID)
      //return this.http.get(this.doctorMasterDataUrl+visitID+"/"+providerServiceID)
      .subscribe(res => {
        console.log('res.json().data', res.json().data);

        this.doctorMasterDataSource.next(res.json().data);
      })
  }

  getSnomedCTRecord(term) {
    return this.http.post(this.snoMedDataURL, { term: term })
      .map(res => res.json());

  }

  reset() {
    this.visitDetailMasterDataSource.next(null);
    this.nurseMasterDataSource.next(null);
    this.doctorMasterDataSource.next(null);
  }

  getJSON(_jsonURL) {
    return this.http.get(_jsonURL)
      .map((response: any) => response.json())
  }
  
  searchDiagnosisBasedOnPageNo(searchTerm, pageNo) {
    const body = {
      "term": searchTerm,
      "pageNo":pageNo
    }
    return this.http.post(this.diagnosisSnomedCTRecordUrl, body)
      .map(res => res.json());
  }

  searchDiagnosisBasedOnPageNo1(searchTerm, pageNo) {
    const body = {
      "term": searchTerm,
      "pageNo":pageNo
    }
    return this.http.post(this.diagnosisSnomedCTRecordUrl1, body)
      .map(res => res.json());
  }

  fetchCalibrationStrips(providerServiceID, pageNo) {
    const body = {
      "providerServiceMapID": providerServiceID,
      "pageNo": pageNo
    }
    return this.http.post(this.getCalibrationStrips, body)
      .map(res => res.json());
  }

  getVaccinationTypeAndDoseMaster() {
    
    return this.http.get(this.vaccinationTypeAndDoseMasterUrl)
      .map(res => res.json());
  }

  getPreviousCovidVaccinationDetails(beneficiaryRegID) {
    const reqObj = {
      "beneficiaryRegID": beneficiaryRegID
    }
    return this.http.post(this.previousCovidVaccinationUrl, reqObj)
      .map(res => res.json());
  }

}
