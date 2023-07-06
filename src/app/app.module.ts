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
