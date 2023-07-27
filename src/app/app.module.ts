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


import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Md2Module } from 'md2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Import custom route module....
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './app-modules/core/core.module';

// Custom components import....
import { LoginComponent } from './login/login.component';
import { ServicePointComponent } from './service-point/service-point.component';

// Custom services import....
import { ServicePointService } from './service-point/service-point.service';
import { ServicePointResolve } from './service-point/service-point-resolve.service';

import { ServiceComponent } from './service/service.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { SetSecurityQuestionsComponent } from './set-security-questions/set-security-questions.component';

import { DataSYNCModule } from './app-modules/data-sync/dataSync.module';
import { TmLogoutComponent } from './tm-logout/tm-logout.component';
import { importExpr } from '@angular/compiler/src/output/output_ast';
import { HttpServiceService } from './app-modules/core/services/http-service.service';
import { RegistrarService } from './app-modules/registrar/shared/services/registrar.service';
import { AudioRecordingService } from './app-modules/nurse-doctor/shared/services/audio-recording.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ServicePointComponent,
    ServiceComponent,
    ResetPasswordComponent,
    SetPasswordComponent,
    SetSecurityQuestionsComponent,
    TmLogoutComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Md2Module,
    BrowserAnimationsModule,
    AppRoutingModule,
    DataSYNCModule,
    CoreModule.forRoot()
  ],
  providers: [ServicePointService, ServicePointResolve,HttpServiceService,RegistrarService,AudioRecordingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
