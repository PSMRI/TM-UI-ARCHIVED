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
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class WorkareaCanActivate implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let visitCategory = localStorage.getItem('visitCategory');
    if (visitCategory) {
      if (!(localStorage.getItem('visitCode') &&
        localStorage.getItem('beneficiaryGender') &&
        localStorage.getItem('benFlowID') &&
        localStorage.getItem('visitCategory') &&
        localStorage.getItem('beneficiaryRegID') &&
        localStorage.getItem('visitID') &&
        localStorage.getItem('beneficiaryID') &&
        localStorage.getItem('nurseFlag') 
        // && localStorage.getItem('doctorFlag') &&
        // localStorage.getItem('pharmacist_flag')
      )) {
        return false;
      } else {
        return true;
      }
    } else {
      if (!(localStorage.getItem('beneficiaryGender') &&
        localStorage.getItem('beneficiaryRegID') &&
        localStorage.getItem('beneficiaryID') &&
        localStorage.getItem('benFlowID'))) {
        return false;
      } else {
        return true;
      }
    }
  }

}
