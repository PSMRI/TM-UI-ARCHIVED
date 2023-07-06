import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class WorkareaCanActivate implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let visitCategory = localStorage.getItem('visitCategory');
    if (visitCategory) {
      if (!(localStorage.getItem('visitCode') &&
        localStorage.getItem('beneficiaryGender') &&
        localStorage.getItem('benFlowID') &&
        localStorage.getItem('visitCategory') &&
        localStorage.getItem('beneficiaryRegID') &&
        localStorage.getItem('visitID') &&
        localStorage.getItem('beneficiaryID') &&
        localStorage.getItem('nurseFlag') 
        // && localStorage.getItem('doctorFlag') &&
        // localStorage.getItem('pharmacist_flag')
      )) {
        return false;
      } else {
        return true;
      }
    } else {
      if (!(localStorage.getItem('beneficiaryGender') &&
        localStorage.getItem('beneficiaryRegID') &&
        localStorage.getItem('beneficiaryID') &&
        localStorage.getItem('benFlowID'))) {
        return false;
      } else {
        return true;
      }
    }
  }

}
