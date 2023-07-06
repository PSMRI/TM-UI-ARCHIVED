import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WorkareaComponent } from './workarea/workarea.component';

import { DataSyncLoginComponent } from './data-sync-login/data-sync-login.component';

import { CanDeactivateGuardService } from '../../app-modules/core/services/can-deactivate-guard.service';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'sync-login',
        pathMatch: 'full'
      },
      {
        path: 'workarea',
        component: WorkareaComponent,
        canDeactivate: [CanDeactivateGuardService]
      },
      {
        path: 'sync-login',
        component: DataSyncLoginComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataSYNCRoutingModule { }
