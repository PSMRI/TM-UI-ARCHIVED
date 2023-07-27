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
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { environment } from 'environments/environment';

import { Observable, Subject } from 'rxjs/Rx';

@Injectable()
export class CommonService {

    //headers = new Headers( { 'Content-Type': 'application/json' } );

    commonServices = new Subject<any>();
    commonServices$ = this.commonServices.asObservable();

    getStatesURL = environment.getStatesURL; 
    getDistrictsURL = environment.getDistrictsURL;

    constructor(private http: Http) { }

    // getStates( countryId: number ) {
    //    return this.http.get(this.getStatesURL+countryId, this.options).map(res => res.json().data);
    // }

    getStates( countryId: number ) {
        return this.http.get(this.getStatesURL).map(res => res.json().data);
     }

    getDistricts ( stateId: number ) {
       return this.http.get(this.getDistrictsURL + stateId).map(res => res.json().data);
    }
}