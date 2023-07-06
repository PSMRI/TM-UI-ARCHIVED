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
