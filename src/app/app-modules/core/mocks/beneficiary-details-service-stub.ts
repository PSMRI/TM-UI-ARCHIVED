import { Observable, BehaviorSubject } from 'rxjs/Rx';

export class BeneficiaryDetailsServiceStub {
  
  beneficiaryDetails = new BehaviorSubject<any>(null);
  beneficiaryDetails$ = this.beneficiaryDetails.asObservable();

  getBeneficiaryDetails(beneficiaryRegID: string) {
  }

  getBeneficiaryImage(beneficiaryRegID: string) {
  }

  reset() {
  }
}