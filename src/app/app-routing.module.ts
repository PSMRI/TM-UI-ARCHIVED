import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ServicePointComponent } from './service-point/service-point.component';
import { ServiceComponent } from './service/service.component';

import { SetPasswordComponent } from './set-password/set-password.component';
import { SetSecurityQuestionsComponent } from './set-security-questions/set-security-questions.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthGuard } from './app-modules/core/services/auth-guard.service';
import { ServicePointResolve } from './service-point/service-point-resolve.service';

import { PreviousDetailsComponent } from './app-modules/core/components/previous-details/previous-details.component';
import { TmLogoutComponent } from './tm-logout/tm-logout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout-tm',
    component: TmLogoutComponent
  },
  {
    path: 'set-security-questions',
    component: SetSecurityQuestionsComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'set-password',
    component: SetPasswordComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'service',
    component: ServiceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'servicePoint',
    component: ServicePointComponent,
    canActivate: [AuthGuard],
    resolve: {
      servicePoints: ServicePointResolve
    }
  },
  {
    path: 'registrar',
    canActivate: [AuthGuard],
    loadChildren: './app-modules/registrar/registrar.module#RegistrarModule'
  },
  {
    path: 'common',
    canActivate: [AuthGuard],
    loadChildren: './app-modules/nurse-doctor/nurse-doctor.module#NurseDoctorModule'
  },
  {
    path: 'lab',
    canActivate: [AuthGuard],
    loadChildren: './app-modules/lab/lab.module#LabModule'
  },
  {
    path: 'pharmacist',
    canActivate: [AuthGuard],
    loadChildren: './app-modules/pharmacist/pharmacist.module#PharmacistModule'
  },
  {
    path: 'datasync',
    canActivate: [AuthGuard],
    loadChildren: './app-modules/data-sync/dataSync.module#DataSYNCModule'
  },
  // {
  //   path: '**',
  //   redirectTo: 'login',
  //   pathMatch: 'full'
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
