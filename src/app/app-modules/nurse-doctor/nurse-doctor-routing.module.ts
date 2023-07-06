import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { NurseWorklistWrapperComponent } from './nurse-worklist-wrapper/nurse-worklist-wrapper.component';
import { DoctorTmWorklistWrapperComponent } from './doctor-tm-worklist-wrapper/doctor-tm-worklist-wrapper.component';
import { RadiologistWorklistComponent } from './radiologist-worklist/radiologist-worklist.component';
import { OncologistWorklistComponent } from './oncologist-worklist/oncologist-worklist.component';
import { WorkareaComponent } from './workarea/workarea.component';
import { CaseSheetComponent } from './case-sheet/case-sheet.component';
import { TcSpecialistWorklistWrapperComponent } from './tc-specialist-worklist-wrapper/tc-specialist-worklist-wrapper.component';
import { GeneralCaseRecordComponent } from './case-record/general-case-record/general-case-record.component';
import { CanDeactivateGuardService } from '../core/services/can-deactivate-guard.service';

import { WorkareaCanActivate } from './workarea/workarea-can-activate.service';



const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'nurse-worklist',
        pathMatch: 'full'
      },
      {
        path: 'nurse-worklist',
        component: NurseWorklistWrapperComponent
      },
      // {
      //   path: 'doctor-worklist',
      //   component: DoctorWorklistComponent
      // },
      {
        path: 'doctor-worklist',
        component: DoctorTmWorklistWrapperComponent
      },
      {
        path: 'radiologist-worklist',
        component: RadiologistWorklistComponent
      },
      {
        path: 'oncologist-worklist',
        component: OncologistWorklistComponent
      },
      {
        path: 'tcspecialist-worklist',
        component: TcSpecialistWorklistWrapperComponent
      },
      {
        path: 'attendant/:attendant/patient/:beneficiaryRegID',
        component: WorkareaComponent,
        canActivate: [WorkareaCanActivate],
        canDeactivate: [CanDeactivateGuardService]
      }
    ]
  },
  {
    path: 'print/:serviceType/:printablePage',
    component: CaseSheetComponent
  },
  {
    path: 'generalcaserec',
    component: GeneralCaseRecordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NurseDoctorRoutingModule { }
