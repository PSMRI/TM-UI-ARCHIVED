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


import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';

export class MasterdataServiceStub {
 
  visitDetailMasterDataSource = new BehaviorSubject<any>(null);
  visitDetailMasterData$ = this.visitDetailMasterDataSource.asObservable();
  
  nurseMasterDataSource = new Subject<any>();
  nurseMasterData$ = this.nurseMasterDataSource.asObservable();

  doctorMasterDataSource = new Subject<any>();
  doctorMasterData$ = this.doctorMasterDataSource.asObservable();

  getVisitDetailMasterData() {
  }

  getNurseMasterData(visitID: string) {
  }

  getDoctorMasterData(visitID: string, providerServiceID) {
  }

  reset() {
  }
}