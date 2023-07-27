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
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { ServicePointService } from './service-point.service';

@Injectable()
export class ServicePointResolve implements Resolve<any> {

  constructor(
    private servicePointService: ServicePointService,
    private router: Router) { }

  resolve(route: ActivatedRouteSnapshot) {
    let serviceProviderId = localStorage.getItem('providerServiceID');
    let userId = localStorage.getItem('userID');
    return this.servicePointService.getServicePoints(userId, serviceProviderId)
      .map((res) => {
        if (res) {
          return res;
        } else { 
          this.router.navigate(['/service']);
          return null;
        }
      });
  }

}
