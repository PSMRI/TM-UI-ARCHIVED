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
