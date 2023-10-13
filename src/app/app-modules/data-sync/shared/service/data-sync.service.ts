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
import { Http, RequestOptions, Headers, Response } from '@angular/http';

import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { environment } from 'environments/environment';

@Injectable()
export class DataSyncService {

  constructor(private http: Http) { }

  getDataSYNCGroup() {
    return this.http.get(environment.getDataSYNCGroupUrl)
      .map((res: Response) => res.json());
  }

  dataSyncLogin(userName: string, password: string) {
    return this.http.post(environment.syncLoginUrl, { userName, password })
      .map(res => res.json());
  }

  syncUploadData(groupID) {
    let req = {
      groupID: groupID,
      user: localStorage.getItem('userName')
    }
    console.log(req, 'reqobj');

    return this.http.post(environment.syncDataUploadUrl, req)
      .map(res => res.json());
  }

  syncDownloadData(reqObj) {
    return this.http.post(environment.syncDataDownloadUrl, reqObj)
      .map(res => res.json());
  }

  syncDownloadDataProgress() {
    return this.http.get(environment.syncDownloadProgressUrl)
      .map(res => res.json());
  }

  getVanDetailsForMasterDownload() {
    return this.http.get(environment.getVanDetailsForMasterDownloadUrl)
      .map(res => res.json());
  }
}
