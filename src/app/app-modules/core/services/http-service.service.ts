import { Injectable } from "@angular/core";
import { HttpInterceptor } from "./http-interceptor.service";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import { Http } from "@angular/http";
import { environment } from "environments/environment";

@Injectable()
export class HttpServiceService {
  private _listners = new Subject<any>();

  listen(): Observable<any> {
     return this._listners.asObservable();
  }

  filter(filterBy: string) {
     this._listners.next(filterBy);
  }
  language: any;
  appCurrentLanguge = new BehaviorSubject(this.language);
  currentLangugae$ = this.appCurrentLanguge.asObservable();

  constructor( private _http: HttpClient,
    private http: Http,) { }

  fetchLanguageSet() {
    console.log("Here i come");
    
      return this.http.get(environment.getLanguageList).map(res => res.json().data);
                                                                                           
  }
  // languageAvailable(url: string): Observable<boolean> {
  //   return this._http.get(url).subscribe();
  // }
  getLanguage(url: string) {
    // if (this.languageAvailable(url) == true) {
    //   return this._http.get(url);
    // } else {
    //   console.log("error here");
    // }
    return this._http.get(url);
  }
  getCurrentLanguage(response) {
    console.log("here at one", response);
    this.language = response;
    console.log("teste",this.language);
    this.appCurrentLanguge.next(response) ;
    console.log("here at two",this.appCurrentLanguge.value);
  }
}
