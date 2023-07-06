import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { ConfirmationService } from '../../core/services/confirmation.service';

@Injectable()
export class TelemedicineService {
  telemedicineUrl:any;

  constructor( @Inject(DOCUMENT) private document, private confirmationService: ConfirmationService) { }
  
  routeToTeleMedecine() {
    const authKey = this.getAuthKey();
    const protocol = this.getProtocol();
    const host = this.getHost();
    if (authKey && protocol && host){
      this.telemedicineUrl = `${environment.TELEMEDICINE_URL}protocol=${protocol}&host=${host}&user=${authKey}&app=${environment.app}&fallback=${environment.fallbackMMUUrl}&back=${environment.redirInMMUUrl}`
      window.location.href = this.telemedicineUrl;
    }
  }

  getAuthKey() {
    if (sessionStorage.getItem('isAuthenticated')) {
      return sessionStorage.getItem('key');
    }
  }

  getProtocol() {
    return this.document.location.protocol;
  }

  getHost() {
    return `${this.document.location.host}${this.document.location.pathname}`;
  }

}
