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


import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { ConfirmationService } from '../../core/services/confirmation.service';

@Injectable()
export class TelemedicineService {
  telemedicineUrl:any;

  constructor( @Inject(DOCUMENT) private document, private confirmationService: ConfirmationService) { }
  
  routeToTeleMedecine() {
    const authKey = this.getAuthKey();
    const protocol = this.getProtocol();
    const host = this.getHost();
    if (authKey && protocol && host){
      this.telemedicineUrl = `${environment.TELEMEDICINE_URL}protocol=${protocol}&host=${host}&user=${authKey}&app=${environment.app}&fallback=${environment.fallbackMMUUrl}&back=${environment.redirInMMUUrl}`
      window.location.href = this.telemedicineUrl;
    }
  }

  getAuthKey() {
    if (sessionStorage.getItem('isAuthenticated')) {
      return sessionStorage.getItem('key');
    }
  }

  getProtocol() {
    return this.document.location.protocol;
  }

  getHost() {
    return `${this.document.location.host}${this.document.location.pathname}`;
  }

}
