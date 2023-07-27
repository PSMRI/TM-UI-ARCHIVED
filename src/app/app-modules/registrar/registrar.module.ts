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


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Md2Module } from 'md2';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { RegistrarRoutingModule } from './registrar-routing.module';
import { CoreModule } from '../core/core.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { RegistrationComponent } from './registration/registration.component';
import { SearchComponent } from './search/search.component';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';

import { RegisterPersonalDetailsComponent } from './registration/register-personal-details/register-personal-details.component';
import { RegisterDemographicDetailsComponent } from './registration/register-demographic-details/register-demographic-details.component';
import { HealthIdValidateComponent, RegisterOtherDetailsComponent } from './registration/register-other-details/register-other-details.component';

import { RegistrarService } from './shared/services/registrar.service';

import { ViewHealthIdCardComponent } from './registration/register-other-details/view-health-id-card/view-health-id-card.component';
import { HealthIdOtpGenerationComponent, HealthIdOtpSuccessComponent } from './health-id-otp-generation/health-id-otp-generation.component';
import { QuickSearchComponent } from './quick-search/quick-search.component';
import { GenerateMobileOtpGenerationComponent } from './generate-mobile-otp-generation/generate-mobile-otp-generation.component';
import { SetPasswordForAbhaComponent } from './set-password-for-abha/set-password-for-abha.component';

@NgModule({
  imports: [
    CommonModule,
    Md2Module,
    FormsModule,
    CoreModule,
    RegistrarRoutingModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot()
  ],
  entryComponents: [SearchDialogComponent,HealthIdOtpGenerationComponent,HealthIdOtpSuccessComponent,HealthIdValidateComponent,QuickSearchComponent,ViewHealthIdCardComponent,
    GenerateMobileOtpGenerationComponent,SetPasswordForAbhaComponent],
  providers: [ 
    RegistrarService 
  ],
  declarations: [
    DashboardComponent,
    RegistrationComponent,
    SearchComponent,
    SearchDialogComponent,
    RegisterPersonalDetailsComponent,
    RegisterDemographicDetailsComponent,
    RegisterOtherDetailsComponent,
    HealthIdOtpGenerationComponent,
    HealthIdOtpSuccessComponent,
    HealthIdValidateComponent,
    ViewHealthIdCardComponent,
    QuickSearchComponent,
    GenerateMobileOtpGenerationComponent,
    SetPasswordForAbhaComponent
    
  ],
})
export class RegistrarModule { }
