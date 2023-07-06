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
