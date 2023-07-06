import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class WorkareaCanActivate implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!(localStorage.getItem('visitCode') &&
      localStorage.getItem('benFlowID') &&
      localStorage.getItem('visitCategory') &&
      localStorage.getItem('beneficiaryRegID') &&
      localStorage.getItem('visitID') &&
      localStorage.getItem('beneficiaryID') &&
      localStorage.getItem('doctorFlag') &&
      localStorage.getItem('nurseFlag'))) {
      // this.router.navigate(['/common/doctor-worklist']);
      return false;
    } else {
      return true;
    }
  }

}
