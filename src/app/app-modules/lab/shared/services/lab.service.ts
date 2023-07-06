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
