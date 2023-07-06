import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class TestInVitalsService {

  constructor() { }
  


  vitalRBSTest: any;

  vitalRBSTestResult = new BehaviorSubject(this.vitalRBSTest);
  vitalRBSTestResult$ = this.vitalRBSTestResult.asObservable();

  vitalRBSTestUpdate: any;
  vitalRBSTestResultInUpdate = new BehaviorSubject(this.vitalRBSTestUpdate);
  vitalRBSTestResultInUpdate$ = this.vitalRBSTestResultInUpdate.asObservable();


  //Change in Vitals RBS Test result during fetch
   setVitalsRBSValueInReports(value) {
    this.vitalRBSTest = value;
    this.vitalRBSTestResult.next(value);
  }
  clearVitalsRBSValueInReports() {
    this.vitalRBSTest = 0;
    this.vitalRBSTestResult.next(0);
  }

  //Change in Vitals RBS Test result during update
  setVitalsRBSValueInReportsInUpdate(value) {
    this.vitalRBSTestUpdate = value;
    this.vitalRBSTestResultInUpdate.next(value);
  }
  clearVitalsRBSValueInReportsInUpdate() {
    this.vitalRBSTestUpdate = 0;
    this.vitalRBSTestResultInUpdate.next(0);
  }
}
