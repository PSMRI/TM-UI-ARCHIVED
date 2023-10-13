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


import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers } from '@angular/http';
import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable()
export class LabService {

  constructor(private http: Http) { }

  getLabWorklist() {
    let vanID = JSON.parse(localStorage.getItem('serviceLineDetails')).vanID;
    let fetchUrl = localStorage.getItem('providerServiceID') + `/${localStorage.getItem('serviceID')}/${vanID}`
    return this.http.get(environment.labWorklist + fetchUrl).map((res) => res.json());
  }


  saveLabWork(techForm) {
    return this.http.post(environment.labSaveWork, techForm).map((res) => res.json()).pipe(shareReplay(1));
  }

  saveFile(file) {
    return this.http.post(environment.saveFile, file).map((res) => res.json())
  }
  viewFileContent(viewFileIndex) {
    return this.http.post(environment.viewFileData, viewFileIndex).map((res) => res.json());
  }
}
