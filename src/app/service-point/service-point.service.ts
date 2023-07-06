import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Rx';
import { environment } from 'environments/environment';

@Injectable()
export class ServicePointService {

  constructor(
    private http: Http,
    private router: Router) { }

  getServicePoints(userId: string, serviceProviderId: string) {
    return this.http.post(environment.servicePointUrl, { userID: userId, providerServiceMapID: serviceProviderId })
      .map(res => res.json())
      .catch(err => {
        return Observable.throw(err);
      });
  }

  getMMUDemographics() {
    const vanID = JSON.parse(localStorage.getItem('serviceLineDetails')).vanID;
    const spPSMID = localStorage.getItem('providerServiceID');

    return this.http.post(environment.demographicsCurrentMasterUrl, { vanID: vanID, spPSMID: spPSMID })
      .map(res => res.json())
      .catch(err => {
        return Observable.throw(err);
      })
  }

  getSwymedMailLogin() {

    let userID = localStorage.getItem('userID');
    return this.http.get(environment.getSwymedMailLoginUrl + userID)
      .map(res => res.json())
      .catch(err => {
        return Observable.throw(err);
      })
  }

}