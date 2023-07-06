import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WorklistComponent } from './worklist/worklist.component';
import { WorkareaComponent } from './workarea/workarea.component';

import { CanDeactivateGuardService } from '../../app-modules/core/services/can-deactivate-guard.service';

import { WorkareaCanActivate } from './workarea/workarea.canactivate.service';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'worklist',
        pathMatch: 'full'
      },
      {
        path: 'worklist',
        component: WorklistComponent
      },
      {
        path: 'patient/:beneficiaryRegID',
        component: WorkareaComponent,
        canActivate: [WorkareaCanActivate],
        canDeactivate: [CanDeactivateGuardService]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabRoutingModule { }
