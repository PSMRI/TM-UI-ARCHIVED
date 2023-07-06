import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers } from '@angular/http';
import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class PharmacistService {

  constructor(private http: Http) { }

  getPharmacistWorklist() {
    let vanID = JSON.parse(localStorage.getItem('serviceLineDetails')).vanID;
    let fetchUrl = localStorage.getItem('providerServiceID') + `/${localStorage.getItem('serviceID')}/${vanID}`
    return this.http.get(environment.pharmacistWorklist + fetchUrl).map((res) => res.json());
  }
}
