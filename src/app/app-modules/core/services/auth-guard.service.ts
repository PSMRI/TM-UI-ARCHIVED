import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'app/app-modules/core/services';
import { HttpServiceService } from '../../core/services/http-service.service';
@Injectable()
export class AuthGuard implements CanActivate {
  current_language_set: any;
  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private http_service: HttpServiceService) { }

  canActivate(route, state) {
    this.http_service.currentLangugae$.subscribe(response =>this.current_language_set = response);
    return this.auth.validateSessionKey()
      .map(res => {
        if (res && res.statusCode == 200 && res.data) {
          return true;
        }
        else {
          let componentName = route.component ? route.component.name : "";
          //alert(this.current_language_set.alerts.info.notAuthorized + componentName);
          this.router.navigate(['/login']);
          return false;
        }
      });
  }

  // canActivateChild() {
  //   if (sessionStorage.getItem('isAuthenticated'))
  //     return true;
  //   else {
  //     this.router.navigate(['/login']);
  //   }
  // }

}
