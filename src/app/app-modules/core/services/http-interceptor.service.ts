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
import { Http, ConnectionBackend, RequestOptions, RequestOptionsArgs, Response, Headers, Request } from '@angular/http';

import { SpinnerService } from './spinner.service';
import { ConfirmationService } from './confirmation.service';
import { Router } from '@angular/router';

import { environment } from '../../../../environments/environment';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class HttpInterceptor extends Http {

  donotShowSpinnerUrl = [environment.syncDownloadProgressUrl, environment.ioturl];
  timerRef: any;
  current_language_set: any;

  constructor(
    backend: ConnectionBackend,
    defaultOptions: RequestOptions,
    private router: Router,
    private spinnerService: SpinnerService,
    private confirmationService: ConfirmationService) {

    super(backend, defaultOptions);
  }

  get(url: string, options?: RequestOptionsArgs): Observable<any> {
    if (!(url.indexOf(environment.ioturl) >= 0)) {
      url = this.beforeRequest(url);
      return super.get(url, this.requestOptions(options))
        .catch(this.onCatch)
        .do((res: Response) => {
          this.onSuccess(url, res);
        }, (error: any) => {
          this.onError(error);
        });
    }
    else {
      return super.get(url, this.requestOptions(options))
        .catch(this.onIOTCatch)
        .do((res: Response) => {
          this.onSuccess(url, res);
        }, (error: any) => {
          this.onError(error);
        });

    }
  }

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    if ((url.indexOf(environment.getResultStatusURL) >= 0)) {
      url = this.beforeRequest(url);
      return super.post(url, body, this.requestOptionsForSwaasa(options))
        .catch(this.onCatch)
        .do((res: Response) => {
          this.onSuccess(url, res);
        }, (error: any) => {
          this.onError(error);
        });
    }
    else if (!(url.indexOf(environment.ioturl) >= 0)) {
      url = this.beforeRequest(url);
      return super.post(url, body, this.requestOptions(options))
        .catch(this.onCatch)
        .do((res: Response) => {
          this.onSuccess(url, res);
        }, (error: any) => {
          this.onError(error);
        });
    }
    else {
      return super.post(url, body, this.requestOptions(options))
        .catch(this.onIOTCatch)
        .do((res: Response) => {
          this.onSuccess(url, res);
        }, (error: any) => {
          this.onError(error);
        });

    }
  }

  private requestOptions(options?: RequestOptionsArgs): RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': sessionStorage.getItem('key'),
        // 'Access-control-Allow-origin': '*',
        'ServerAuthorization': localStorage.getItem('serverKey')
      });
    }
    return options;
  }

  postForSwaasa(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    if (!(url.indexOf(environment.ioturl) >= 0)) {
      url = this.beforeRequest(url);
      return super.post(url, body, this.requestOptionsForSwaasa(options))
        .catch(this.onCatch)
        .do((res: Response) => {
          this.onSuccess(url, res);
        }, (error: any) => {
          this.onError(error);
        });
    }
    else {
      return super.post(url, body, this.requestOptionsForSwaasa(options))
        .catch(this.onIOTCatch)
        .do((res: Response) => {
          this.onSuccess(url, res);
        }, (error: any) => {
          this.onError(error);
        });

    }
  }

  private requestOptionsForSwaasa(options?: RequestOptionsArgs): RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = new Headers({
        // 'Content-Type': undefined,
        'Accept':'application/json',
        'Authorization': sessionStorage.getItem('key'),
        // 'Access-control-Allow-origin': '*',
        'ServerAuthorization': localStorage.getItem('serverKey')
      });
    }
    return options;
  }

  private beforeRequest(url, body?: any): string {
    console.log("loading............");
    if (this.donotShowSpinnerUrl.indexOf(url) < 0)
      this.spinnerService.show();
    if (sessionStorage.getItem('apimanClientKey'))
      return url + `?apiKey=${sessionStorage.getItem('apimanClientKey')}`;
    return url;
  }

  // private onCatch(error: any, caught: Observable<any>): Observable<any> {
  //   console.log("API error", error);
  //   if(error._body != undefined && )
  //   return Observable.throw("Service not available");
  // }

  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    let errorMsg = null;
    if (typeof error._body === "object" && error._body !== null) {
      return Observable.throw("Service not available");
    } else {
      if (error._body != undefined && error._body != null) {
        if (JSON.parse(error._body).errorMessage != undefined)
          errorMsg = JSON.parse(error._body).errorMessage;
      }
      if (errorMsg != undefined && errorMsg != null)
        return Observable.throw(errorMsg);
      else
        return Observable.throw("Service not available");
    }
  }


  private onSuccess(url, res: Response): void {
    console.log("success............");
    console.log("here", Date());

    let data = res.json();

    if (this.donotShowSpinnerUrl.indexOf(url) < 0)
      setTimeout(() => this.spinnerService.hide(), 500);

    if (this.timerRef)
      clearTimeout(this.timerRef);

    if (data.statusCode == 5002 && url.indexOf("user/userAuthenticate") < 0) {
      sessionStorage.clear();
      this.spinnerService.clear();
      setTimeout(() => this.router.navigate(["/login"]), 0);
      this.confirmationService.alert(data.errorMessage, "error");
    } else {
      this.startTimer();
    }
  }

  private onError(error: any): void {
    console.log("error", error);
    this.spinnerService.clear();
  }

  startTimer() {
    this.timerRef = setTimeout(() => {
      console.log("there", Date());

      if (sessionStorage.getItem('key') && sessionStorage.getItem('isAuthenticated')) {
        this.confirmationService.startTimer(this.current_language_set.alerts.info.wantToContinueService, this.current_language_set.alerts.info.sessionGoingToExpire, 120)
          .subscribe(result => {
            if (result.action == 'continue') {
              this.post(environment.extendSessionUrl, {}).subscribe(res => { }, err => { });
            } else if (result.action == 'timeout') {
              clearTimeout(this.timerRef);
              sessionStorage.clear();
              localStorage.clear();
              this.confirmationService.alert(this.current_language_set.alerts.info.sessionExpire, "error");
              this.router.navigate(["/login"]);
            } else if (result.action == 'cancel') {
              setTimeout(() => {
                clearTimeout(this.timerRef);
                sessionStorage.clear();
                localStorage.clear();
                this.confirmationService.alert(this.current_language_set.alerts.info.sessionExpire, "error");
                this.router.navigate(["/login"]);
              }, result.remainingTime * 1000);
            }
          })
      }
    }, 27 * 60 * 1000);
  }
  private onIOTCatch(error: any, caught: Observable<any>): Observable<any> {
    console.log("API error", error);
    return Observable.throw(error);
  }
  put(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    if (!(url.indexOf(environment.ioturl) >= 0)) {
      url = this.beforeRequest(url);
      return super.put(url, body, this.requestOptions(options))
        .catch(this.onCatch)
        .do((res: Response) => {
          this.onSuccess(url, res);
        }, (error: any) => {
          this.onError(error);
        });
    }
    else {
      return super.put(url, body, this.requestOptions(options))
        .catch(this.onIOTCatch)
        .do((res: Response) => {
          this.onSuccess(url, res);
        }, (error: any) => {
          this.onError(error);
        });

    }
  }
}
