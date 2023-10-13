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
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class TestInVitalsService {

  constructor() { }
  


  vitalRBSTest: any;

  vitalRBSTestResult = new BehaviorSubject(this.vitalRBSTest);
  vitalRBSTestResult$ = this.vitalRBSTestResult.asObservable();

  vitalRBSTestUpdate: any;
  vitalRBSTestResultInUpdate = new BehaviorSubject(this.vitalRBSTestUpdate);
  vitalRBSTestResultInUpdate$ = this.vitalRBSTestResultInUpdate.asObservable();


  //Change in Vitals RBS Test result during fetch
   setVitalsRBSValueInReports(value) {
    this.vitalRBSTest = value;
    this.vitalRBSTestResult.next(value);
  }
  clearVitalsRBSValueInReports() {
    this.vitalRBSTest = 0;
    this.vitalRBSTestResult.next(0);
  }

  //Change in Vitals RBS Test result during update
  setVitalsRBSValueInReportsInUpdate(value) {
    this.vitalRBSTestUpdate = value;
    this.vitalRBSTestResultInUpdate.next(value);
  }
  clearVitalsRBSValueInReportsInUpdate() {
    this.vitalRBSTestUpdate = 0;
    this.vitalRBSTestResultInUpdate.next(0);
  }
}
