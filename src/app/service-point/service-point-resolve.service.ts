import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { ServicePointService } from './service-point.service';

@Injectable()
export class ServicePointResolve implements Resolve<any> {

  constructor(
    private servicePointService: ServicePointService,
    private router: Router) { }

  resolve(route: ActivatedRouteSnapshot) {
    let serviceProviderId = localStorage.getItem('providerServiceID');
    let userId = localStorage.getItem('userID');
    return this.servicePointService.getServicePoints(userId, serviceProviderId)
      .map((res) => {
        if (res) {
          return res;
        } else { 
          this.router.navigate(['/service']);
          return null;
        }
      });
  }

}
