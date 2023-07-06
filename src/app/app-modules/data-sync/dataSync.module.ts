import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { DataSYNCRoutingModule } from './dataSync-routing.module';
import { WorkareaComponent } from './workarea/workarea.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { DataSyncService } from './shared/service/data-sync.service';
import { DataSyncLoginComponent } from './data-sync-login/data-sync-login.component';
import { MasterDownloadComponent } from './master-download/master-download.component';

@NgModule({
  imports: [
    CommonModule,
    DataSYNCRoutingModule,
    CoreModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [WorkareaComponent, DashboardComponent, DataSyncLoginComponent, MasterDownloadComponent],
  entryComponents: [DataSyncLoginComponent, MasterDownloadComponent],
  exports: [DataSyncLoginComponent],
  providers: [DataSyncService, MasterDownloadComponent]
})
export class DataSYNCModule { }
