import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';

export class MasterdataServiceStub {
 
  visitDetailMasterDataSource = new BehaviorSubject<any>(null);
  visitDetailMasterData$ = this.visitDetailMasterDataSource.asObservable();
  
  nurseMasterDataSource = new Subject<any>();
  nurseMasterData$ = this.nurseMasterDataSource.asObservable();

  doctorMasterDataSource = new Subject<any>();
  doctorMasterData$ = this.doctorMasterDataSource.asObservable();

  getVisitDetailMasterData() {
  }

  getNurseMasterData(visitID: string) {
  }

  getDoctorMasterData(visitID: string, providerServiceID) {
  }

  reset() {
  }
}