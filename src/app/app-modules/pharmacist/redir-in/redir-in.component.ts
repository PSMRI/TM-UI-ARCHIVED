/* 
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/


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
