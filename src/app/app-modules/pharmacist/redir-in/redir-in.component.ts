import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService } from './../../core/services/confirmation.service';
import { HttpServiceService } from '../../core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
@Component({
    selector: 'app-redir-in',
    templateUrl: './redir-in.component.html',
    styleUrls: ['./redir-in.component.css']
})
export class RedirInComponent implements OnInit {
    current_language_set: any;
    constructor(private router: Router,
        private route: ActivatedRoute,
        private confirmationService: ConfirmationService, 
        private httpServiceService: HttpServiceService) { }

    ngOnInit() {
        this.assignSelectedLanguage();
        // this.httpServiceService.currentLangugae$.subscribe(response =>
        //     {this.current_language_set = response;    
               
        //     });        
            sessionStorage.removeItem('setLanguage');
            this.getresponse();
    }

    ngDoCheck() {
        this.assignSelectedLanguage();
      }
      assignSelectedLanguage() {
        const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
        getLanguageJson.setLanguage();
        this.current_language_set = getLanguageJson.currentLanguageObject;
        }

    getresponse() {
        let resolve;
        let language;
        this.route.queryParams.subscribe(params => {
            resolve = params['resolve'] === 'undefined' ? undefined : params['resolve'];
            language = params['currentLanguage'] === 'undefined' ? undefined : params['currentLanguage'];
        });
        console.log('resolve', resolve)
        

        if (resolve) {
            this.confirmationService.alert("Item Dispensed", 'info');
        }
        sessionStorage.setItem('setLanguage', language)
        this.router.navigate(['/pharmacist/pharmacist-worklist']);
       

    }
    routeToDesignation(designation) {
        switch (designation) {
            case 'Registrar':
                this.router.navigate(['/registrar/registration']);
                break;
            case 'Nurse':
                this.router.navigate(['/common/nurse-worklist']);
                break;
            case 'Doctor':
                this.router.navigate(['/common/doctor-worklist']);
                break;
            case 'Lab Technician':
                this.router.navigate(['/lab']);
                break;
            case 'Pharmacist':
                this.router.navigate(['/pharmacist']);
                break;
            case 'Radiologist':
                this.router.navigate(['/common/radiologist-worklist']);
                break;
            case 'Oncologist':
                this.router.navigate(['/common/oncologist-worklist']);
                break;
            default:
        }
    }


}
