import { Http, RequestOptions, Headers } from '@angular/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class MasterDataService {

  constructor(private http: Http) { }

  getLabRequirements(beneficiaryRegID, visitID, visitCode) {
    return this.http.post(environment.getprescribedTestDataUrl,
      { 'beneficiaryRegID': beneficiaryRegID, 'benVisitID': visitID, 'visitCode': visitCode })
      .map((res) => res.json())
  }

}
