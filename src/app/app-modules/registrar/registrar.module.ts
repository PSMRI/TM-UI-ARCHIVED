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
