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

import { environment } from 'environments/environment';

import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { shareReplay } from 'rxjs/operators';

@Injectable()
export class RegistrarService {

  registrationMasterDetails = new BehaviorSubject<any>(null);
  registrationMasterDetails$ = this.registrationMasterDetails.asObservable();

  beneficiaryDetails = new BehaviorSubject<any>(null);
  beneficiaryDetails$ = this.beneficiaryDetails.asObservable();


  beneficiaryEditDetails = new BehaviorSubject<any>(null);
  beneficiaryEditDetails$ = this.beneficiaryEditDetails.asObservable();

  healthId : any;
  healthIdOtp = new BehaviorSubject(this.healthId);
  generateHealthIdOtp$ = this.healthIdOtp.asObservable();

  healthIdMobVerificationValue: any = null;
  healthIdMobVerification = new BehaviorSubject(this.healthIdMobVerificationValue);
  healthIdMobVerificationCheck$ = this.healthIdMobVerification.asObservable();

  public dialogData = new BehaviorSubject<any>(null);
  dialogResult$ = this.dialogData.asObservable();

  changePersonalDetailsData(res) {
    this.dialogData.next(res);
  }
  // GenerateOTPEnable: any;
  // GenerateOTP = new BehaviorSubject(this.GenerateOTPEnable);
  // GenerateOTP$ = this.GenerateOTP.asObservable();

  // setGenerateOTPFlag(value) {
  //   this.GenerateOTPEnable = value;
    
  //   this.GenerateOTP.next(value);
    
  // }


  constructor(private http: Http) { }

  getRegistrationMaster(servicePointID: any) {
    var tmpSPID = { "spID": servicePointID };
    return this.http.post(environment.registrarMasterDataUrl, tmpSPID)
      .subscribe(res => {
        console.log(JSON.stringify(res.json().data), 'json data');
        if (res.json().data)
          this.registrationMasterDetails.next(res.json().data);
      })
  }

  getPatientDataAsObservable(benRegID: any) {
    return this.http.post(environment.getCompleteBeneficiaryDetail, { beneficiaryRegID: benRegID })
      .subscribe(res => {
        if (res.json().data) {
          console.log(res.json().data, 'res json data')
          this.beneficiaryDetails.next(res.json().data);
        }
      })
  }

  getPatientData(benRegID: any) {
    return this.http.post(environment.getCompleteBeneficiaryDetail, { beneficiaryRegID: benRegID })
      .map((res) => res.json().data);
  }
  
  registerBeneficiary(beneficiary: any) {
    var benData = { "benD": beneficiary };
    return this.http.post(environment.registerBeneficiaryUrl, benData)
      .map((res) => res.json().data);
  }

  quickSearch(searchTerm: any) {
    return this.http.post(environment.quickSearchUrl, searchTerm)
      .map((res) => res.json().data);
  }

  identityQuickSearch(searchTerm: any) {
    return this.http.post(environment.identityQuickSearchUrl, searchTerm)
      .map((res) => res.json().data);
  }

  // quickSearchByPhoneNO(searchTerm: any) {
  //   return this.http.get(environment.quickSearchUrl, searchTerm)
  //     .map((res) => res.json().data);
  // }
  
  clearBeneficiaryEditDetails() {
    this.beneficiaryEditDetails.next(null);
  }

  saveBeneficiaryEditDataASobservable(beneficiary){
      this.beneficiaryEditDetails.next(beneficiary);
  }

  advanceSearch(searchTerms: any) {
    return this.http.post(environment.advanceSearchUrl, searchTerms)
      .map((res) => res.json());
  }

  advanceSearchIdentity(searchTerms: any) {
    return this.http.post(environment.advanceSearchIdentityUrl, searchTerms)
      .map((res) => res.json().data);
  }
  
  externalSearchIdentity(searchTerms: any) {
    return this.http.post(environment.externalSearchIdentityUrl, searchTerms)
      .map((res) => res.json().data);
  }

  migrateBenToAmrit(benDetails)
  {
    return this.http.post(environment.externalSearchIdentityUrl, benDetails)
    .map((res) => res.json().data);
  }

  loadMasterData(servicePointID: any) {
    var tmpSPID = { "spID": servicePointID };
    return this.http.post(environment.registrarMasterDataUrl, tmpSPID).map((res) => res.json().data);
  }

  patientRevisit(benRegID: any) {
    return this.http.post(environment.patientRevisitSubmitToNurse, benRegID)
      .map((res) => res.json().data);
  }


  identityPatientRevisit(ben: any) {
    return this.http.post(environment.identityPatientRevisitSubmitToNurseURL, ben)
      .map((res) => res.json());
  }

  updatePatientData(beneficiary: any) {
    return this.http.post(environment.updateBeneficiaryUrl, beneficiary).map((res) => res.json().data);
  }

  getDistrictBlocks(servicePointID: any) {
    return this.http.post(environment.servicePointVillages, { servicePointID: servicePointID })
      .map((res) => res.json().data);
  }

  submitBeneficiary(iEMRForm) {
    return this.http.post(environment.submitBeneficiaryIdentityUrl, iEMRForm)
    .map((res) => res.json()).pipe(shareReplay(1));
  }

  updateBeneficiary(iEMRForm) {
    return this.http.post(environment.updateBeneficiaryIdentityUrl, iEMRForm)
    .map((res) => res.json()).pipe(shareReplay(1));
  }

  getVillageList(blockId: any) {
    return this.http.get(`${environment.getVillageListUrl}${blockId}`)
      .map((res) => res.json());
  }


  getSubDistrictList(districtId: any) {
    return this.http.get(`${environment.getSubDistrictListUrl}${districtId}`)
      .map((res) => res.json());
  }


  getDistrictList(stateId: any) {
    return this.http.get(`${environment.getDistrictListUrl}${stateId}`)
      .map((res) => res.json());
  }

  generateOTP(mobileNo,mode) {
    if (mode == "MOBILE"){
      return this.http.post(environment.otpGenerationUrl,mobileNo)
    .map((res) => res.json());
    }
    else if (mode == "AADHAR"){
      return this.http.post(environment.otpGenerationWithUIDUrl,mobileNo)
      .map((res) => res.json());
    }    
  }

  generateHealthId(reqObj) {
    return this.http.post(environment.healthIdGenerationUrl,reqObj)
    .map((res) => res.json());
  }

  generateHealthIdWithUID(reqObj) {
    return this.http.post(environment.healthIdGenerationWithUIDUrl,reqObj)
    .map((res) => res.json());
  }

  verifyOTPForAadharHealthId(reqObj) {
    return this.http.post(environment.verifyOTPUrl,reqObj)
    .map((res) => res.json());
  }

  checkAndGenerateMobileOTPHealthId(reqObj) {
    return this.http.post(environment.checkAndGenerateMobileOTPUrl,reqObj)
    .map((res) => res.json());
  }

  verifyMobileOTPForAadhar(reqObj) {
    return this.http.post(environment.verifyMobileOTPUrl,reqObj)
    .map((res) => res.json());
  }

  mapHealthId(reqObj) {
    return this.http.post(environment.mapHealthIdUrl,reqObj)
    .map((res) => res.json());
  }

  getHealthIdDetails(reqObj) {
    return this.http.post(environment.gethealthIdDetailsUrl,reqObj)
    .map((res) => res.json());
  }
  generateOtpForMappingCareContext(reqObjForMapping) {
    return this.http.post(environment.careContextGenerateOtpUrl, reqObjForMapping)
    .map((res) => res.json());
  }
  verifyOtpForMappingCarecontext(reqObjForVerifyOtp) {
    return this.http.post(environment.verifyOtpForMappingContextUrl, reqObjForVerifyOtp)
    .map((res) => res.json())

  }
  generateOTPValidateHealthID(healthID) {
    return this.http.post(environment.generateOTPForHealthIDValidation,healthID)
    .map((res) => res.json());
  }
  verifyOTPForHealthIDValidation(reqObjForValidateOTP) {
    return this.http.post(environment.verifyOTPForHealthIDValidation,reqObjForValidateOTP)
    .map((res) => res.json());
  }

  generateHealthIDCard(healthID) {
    return this.http.post(environment.generateOTPForHealthIDCard,healthID).map((res) => res.json());
  }
  verifyOTPForHealthIDCard(reqObjForValidateOTP) {
    return this.http.post(environment.verifyOTPAndGenerateHealthCard,reqObjForValidateOTP)
    .map((res) => res.json());
  }

  passIDsToFetchOtp(id) {
    this.healthId = id;
    this.healthIdOtp.next(id);
  }

  setHealthIdMobVerification(obj) {
    this.healthIdMobVerificationValue = obj;
    this.healthIdMobVerification.next(this.healthIdMobVerificationValue);
  }

  
  clearHealthIdMobVerification() {
    this.healthIdMobVerificationValue = null;
    this.healthIdMobVerification.next(this.healthIdMobVerificationValue);
  }

  updateBenDetailsInMongo(amritID) {
    return this.http.post(environment.updateAmritIDInMongo,amritID).map((res) => res.json());
  }
}
