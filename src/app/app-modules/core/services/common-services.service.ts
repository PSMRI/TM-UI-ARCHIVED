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