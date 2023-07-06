import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WorklistComponent } from './worklist/worklist.component';
import { RedirInComponent } from './redir-in/redir-in.component';
import { RedirFallbackComponent } from './redir-fallback/redir-fallback.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'pharmacist-worklist',
        pathMatch: 'full'
      },
      {
        path: 'pharmacist-worklist',
        component: WorklistComponent
      },
      {
        path: 'redirin',
        component: RedirInComponent
      },
      {
        path: 'redirfallback',
        component: RedirFallbackComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PharmacistRoutingModule { }
