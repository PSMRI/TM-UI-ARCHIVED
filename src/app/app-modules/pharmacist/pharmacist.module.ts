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

import { PharmacistRoutingModule } from './pharmacist-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WorklistComponent } from './worklist/worklist.component';

import { PharmacistService } from './shared/services/pharmacist.service';
import { RedirInComponent } from './redir-in/redir-in.component';
import { RedirFallbackComponent } from './redir-fallback/redir-fallback.component';

@NgModule({
  imports: [
    CommonModule,
    PharmacistRoutingModule,
    CoreModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [DashboardComponent, WorklistComponent, RedirInComponent, RedirFallbackComponent],
  providers: [PharmacistService]
})
export class PharmacistModule { }
