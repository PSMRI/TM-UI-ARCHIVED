import { NgModule, ErrorHandler, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http, XHRBackend, RequestOptions } from '@angular/http';
import { MaterialModule } from './material.module';
import { Md2Module } from 'md2';
import { ChartsModule } from 'ng2-charts';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WebCamModule } from 'ack-angular-webcam';

import { CommonDialogComponent } from './components/common-dialog/common-dialog.component';
import { CameraDialogComponent } from './components/camera-dialog/camera-dialog.component';
import { TextareaDialogComponent } from './components/textarea-dialog/textarea-dialog.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { BeneficiaryDetailsComponent } from './components/beneficiary-details/beneficiary-details.component';
import { AppFooterComponent } from './components/app-footer/app-footer.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { PreviousDetailsComponent } from './components/previous-details/previous-details.component';
import { SpecialistLoginComponent } from './components/specialist-login/specialist-login.component'

import { HttpInterceptor } from './services/http-interceptor.service';
import { SpinnerService } from './services/spinner.service';
import { ConfirmationService } from './services/confirmation.service';
import { CameraService } from './services/camera.service';
import { AuthGuard } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { BeneficiaryDetailsService } from './services/beneficiary-details.service';
import { TextareaDialog } from './components/textarea-dialog/textarea-dialog.service';
import { CommonService } from './services/common-services.service';
import { GlobalErrorHandler } from './services/global-error-handler.service';
import { TelemedicineService } from './services/telemedicine.service';

import { myEmail } from './directives/email/myEmail.directive';
import { myMobileNumber } from './directives/MobileNumber/myMobileNumber.directive';
import { myName } from './directives/name/myName.directive';
import { myPassword } from './directives/password/myPassword.directive';
import { StringValidator } from './directives/stringValidator.directive';
import { NumberValidator } from './directives/numberValidator.directive';
import { DisableFormControlDirective } from './directives/disableFormControl.directive';
import { NullDefaultValueDirective } from './directives/null-default-value.directive';
import { InventoryService } from './services/inventory.service';

import { DiagnosisSearchComponent } from './components/diagnosis-search/diagnosis-search.component';
import { DiagnosisSearchDirective } from './directives/provisionalDiagnosis.directive';
import { ConfirmatoryDiagnosisDirective } from './directives/confirmatory-diagnosis.directive';
import { ShowCommitAndVersionDetailsComponent } from './components/show-commit-and-version-details/show-commit-and-version-details.component'
import { ViewRadiologyUploadedFilesComponent } from '../lab/view-radiology-uploaded-files/view-radiology-uploaded-files.component';
import { CanDeactivateGuardService } from './services/can-deactivate-guard.service';
import { IotcomponentComponent } from 'app/app-modules/core/components/iotcomponent/iotcomponent.component';
import { IotService } from 'app/app-modules/core/services/iot.service';
import { IotBluetoothComponent } from 'app/app-modules/core/components/iot-bluetooth/iot-bluetooth.component';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { HttpClientModule } from '@angular/common/http';
import { AllergenSearchComponent } from './components/allergen-search/allergen-search.component';
import { CalibrationComponent } from './components/calibration/calibration.component';
import { MasterdataService } from '../nurse-doctor/shared/services/masterdata.service';
import { HealthIdDisplayModalComponent } from './components/health-id-display-modal/health-id-display-modal.component';
import { myHealthId } from './directives/myHealthId/myHealthId.directive';

import { SetLanguageComponent } from './components/set-language.component';
import {MmuRbsDetailsComponent} from './components/mmu-rbs-details/mmu-rbs-details.component';
import { OpenPreviousVisitDetailsComponent } from './components/open-previous-visit-details/open-previous-visit-details.component';
//import { AppHeaderComponent } from '../core/components/app-header/app-header.component';
@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    WebCamModule,
    MaterialModule,
    Md2Module,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,

    PaginationModule.forRoot()
  ],
  declarations: [
    CommonDialogComponent,
    CameraDialogComponent,
    TextareaDialogComponent,
    SpinnerComponent,
    BeneficiaryDetailsComponent,
    AppFooterComponent,
    AppHeaderComponent,
    PreviousDetailsComponent,
    MmuRbsDetailsComponent,
    SpecialistLoginComponent,
    myEmail, myMobileNumber, myName, myPassword, StringValidator, NullDefaultValueDirective, NumberValidator, DisableFormControlDirective,
    DiagnosisSearchComponent, DiagnosisSearchDirective, ConfirmatoryDiagnosisDirective, ShowCommitAndVersionDetailsComponent, ViewRadiologyUploadedFilesComponent,
    DiagnosisSearchComponent, DiagnosisSearchDirective, ConfirmatoryDiagnosisDirective, ShowCommitAndVersionDetailsComponent
    , IotcomponentComponent, IotBluetoothComponent,AllergenSearchComponent,CalibrationComponent,
    SetLanguageComponent,HealthIdDisplayModalComponent,OpenPreviousVisitDetailsComponent,
    myHealthId
  ],
  exports: [
    MaterialModule,
    Md2Module,
    CommonDialogComponent,
    CameraDialogComponent,
    TextareaDialogComponent,
    SpinnerComponent,
    BeneficiaryDetailsComponent,
    SpecialistLoginComponent,
    AppFooterComponent,
    AppHeaderComponent,
    PreviousDetailsComponent,
    MmuRbsDetailsComponent,
    PaginationModule, ShowCommitAndVersionDetailsComponent,
    myEmail, myMobileNumber, myName, myPassword, DisableFormControlDirective, StringValidator, NumberValidator, NullDefaultValueDirective,
    DiagnosisSearchComponent, DiagnosisSearchDirective, ConfirmatoryDiagnosisDirective,
    IotcomponentComponent, IotBluetoothComponent,AllergenSearchComponent,CalibrationComponent,
    SetLanguageComponent,HealthIdDisplayModalComponent,OpenPreviousVisitDetailsComponent
  ],
  entryComponents: [
    CommonDialogComponent,
    CameraDialogComponent,
    TextareaDialogComponent,
    SpinnerComponent,
    PreviousDetailsComponent,
    MmuRbsDetailsComponent,
    SpecialistLoginComponent,
    DiagnosisSearchComponent,
    ShowCommitAndVersionDetailsComponent,
    ViewRadiologyUploadedFilesComponent,
    IotcomponentComponent,
    IotBluetoothComponent,
    AllergenSearchComponent,
    CalibrationComponent,
    HealthIdDisplayModalComponent,
    OpenPreviousVisitDetailsComponent
  ]
})
export class CoreModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        HttpInterceptor,
        HttpServiceService,
        ConfirmationService,
        CameraService,
        TextareaDialog,
        AuthGuard,
        AppHeaderComponent,
        AuthService,
        SpinnerService,
        BeneficiaryDetailsService,
        CommonService,
        InventoryService,
        CanDeactivateGuardService,
        TelemedicineService,
        IotService,
        HttpServiceService,
        MasterdataService,
        {
          provide: Http,
          useFactory: HttpInterceptorFactory,
          deps: [XHRBackend, RequestOptions, Router, SpinnerService, ConfirmationService]
        }
      ]
    };
  }
}

export function HttpInterceptorFactory(backend: XHRBackend, options: RequestOptions, router: Router, spinner: SpinnerService, confirmation: ConfirmationService) {
  return new HttpInterceptor(backend, options, router, spinner, confirmation);
}
