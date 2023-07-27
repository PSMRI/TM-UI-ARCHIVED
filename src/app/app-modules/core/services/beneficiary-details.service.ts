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
import { Http } from '@angular/http';

import { environment } from 'environments/environment';

import { Observable, BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class BeneficiaryDetailsService {

  beneficiaryDetails = new BehaviorSubject<any>(null);
  beneficiaryDetails$ = this.beneficiaryDetails.asObservable();


  HRPPositive: any="";

  HRPPositiveFlag = new BehaviorSubject(this.HRPPositive);
  HRPPositiveFlag$ = this.HRPPositiveFlag.asObservable();
  cbacData:any=[];
  healthID:any;
  constructor(private http: Http) { }

  getBeneficiaryDetails(beneficiaryRegID: string, benFlowID: string) {
    this.http.post(environment.getBeneficiaryDetail, { beneficiaryRegID: beneficiaryRegID, benFlowID: benFlowID })
      .subscribe(res => {
        if (res.json().data) {
          this.beneficiaryDetails.next(res.json().data);
        }
      }, err => {
        this.beneficiaryDetails.next(null);
      });
  }

  getBeneficiaryImage(beneficiaryRegID: string) {
    return this.http.post(environment.getBeneficiaryImage, { beneficiaryRegID: beneficiaryRegID })
      .map(res => res.json().data);
  }

  reset() {
    this.beneficiaryDetails.next(null);
  }

  setHRPPositive() {
    this.HRPPositive = 1;
    this.HRPPositiveFlag.next(1);
  }

  resetHRPPositive()
  {
    this.HRPPositive = 0;
    this.HRPPositiveFlag.next(0);
  }

  // getCheck() {
  //   return this.http.get('http://localhost:3000/profile')
  //   .map(res => res.json());
  // }
  getCBACDetails(beneficiaryRegID: string) {
    return  this.http.post(environment.getBenCBACDetails, { benRegID: beneficiaryRegID})
      .map(res => res.json());
  }


}
