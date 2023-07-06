import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { LabRoutingModule } from './lab-routing.module';
import { WorkareaComponent } from './workarea/workarea.component';
import { WorklistComponent } from './worklist/worklist.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { LabService, MasterDataService } from './shared/services';

import { WorkareaCanActivate } from './workarea/workarea.canactivate.service';
import { ViewFileComponent } from './view-file/view-file.component';


@NgModule({
  imports: [
    CommonModule,
    LabRoutingModule,
    CoreModule,
    ReactiveFormsModule,
    FormsModule
  ],
   entryComponents: [ViewFileComponent],
  declarations: [WorkareaComponent, WorklistComponent, DashboardComponent, ViewFileComponent],
  providers: [LabService, MasterDataService, WorkareaCanActivate]
})
export class LabModule { }
