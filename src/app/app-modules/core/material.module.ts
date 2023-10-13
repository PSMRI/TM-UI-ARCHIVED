/* 
* AMRIT � Accessible Medical Records via Integrated Technology 
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
import { MdToolbarModule } from '@angular/material';
import { MdIconModule } from '@angular/material';
import { MatStepperModule } from '@angular/material';
import { MdButtonModule } from '@angular/material';
import { MatListModule } from '@angular/material';
import { MatCardModule } from '@angular/material';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule, MatTooltipModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material';
import { MatButtonToggleModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MD_ERROR_GLOBAL_OPTIONS, showOnDirtyErrorStateMatcher } from '@angular/material';
import { MatSelectModule, MatSidenavModule } from '@angular/material';
import { MatProgressSpinnerModule, MatCheckboxModule } from '@angular/material';
import { MatDialogModule, MatMenuModule, MdDatepickerModule } from '@angular/material';
import { MatDatepickerModule, MdNativeDateModule } from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';
import { NativeDateAdapter, DateAdapter, MD_DATE_FORMATS } from '@angular/material';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MdGridListModule } from '@angular/material/grid-list';
import {MatSnackBarModule} from '@angular/material'
// extend NativeDateAdapter's format method to specify the date format.
// export class CustomDateAdapter extends NativeDateAdapter {
//   format(date: Date, displayFormat: Object): string {
//      if (displayFormat === 'input') {
//         const day = date.getUTCDate();
//         const month = date.getUTCMonth() + 1;
//         const year = date.getFullYear();
//         // Return the format as per your requirement
//         return `${day}/${month}/${year}`;
//      } else {
//         return date.toDateString();
//      }
//   }

//   // If required extend other NativeDateAdapter methods.
// }

// const MY_DATE_FORMATS = {
//   parse: {
//      dateInput: {month: 'short', year: 'numeric', day: 'numeric'}
//   },
//   display: {
//      dateInput: 'input',
//      monthYearLabel: {year: 'numeric', month: 'short'},
//      dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
//      monthYearA11yLabel: {year: 'numeric', month: 'long'},
//   }
// };
// export class AppDateAdapter extends NativeDateAdapter {
//   parse(value: any): Date | null {
//       if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
//         const str = value.split('/');
//         const year = Number(str[2]);
//         const month = Number(str[1]) - 1;
//         const date = Number(str[0]);
//         return new Date(date, month, year);
//       }
//       const timestamp = typeof value === 'number' ? value : Date.parse(value);
//       return isNaN(timestamp) ? null : new Date(timestamp);
//     }
//  format(date: Date, displayFormat: Object): string {
//     //  if (displayFormat == "input") {
//          let day = date.getDate();
//          let month = date.getMonth() + 1;
//          let year = date.getFullYear();
//          return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
//     //  } else {
//         //  return date.toDateString();
//     //  }
//  }

//  private _to2digit(n: number) {
//      return ('00' + n).slice(-2);
//  }
// }


@NgModule({
  imports: [
    MdIconModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MdNativeDateModule,
    MatDatepickerModule,
    MatChipsModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatMenuModule,
    MdDatepickerModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatInputModule,
    MdToolbarModule,
    MatRadioModule,
    MatStepperModule,
    MdButtonModule,
    MatExpansionModule,
    MdGridListModule,
    MatCardModule,
    MatTabsModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatListModule,
    MatSnackBarModule
  ],
  providers: [
    // {
    //   provide: MD_ERROR_GLOBAL_OPTIONS,
    //   useValue: {
    //     errorStateMatcher: showOnDirtyErrorStateMatcher
    //   }
    // }
    // {
    //    provide: DateAdapter, useClass: CustomDateAdapter
    // },
    // {
    //    provide: MD_DATE_FORMATS, useValue: MY_DATE_FORMATS
    // }
    // {
    //   provide: DateAdapter, useClass: AppDateAdapter
    // }
  ],
  exports: [
    MdIconModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MdNativeDateModule,
    MatDatepickerModule,
    MatChipsModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatMenuModule,
    MdDatepickerModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatInputModule,
    MdToolbarModule,
    MatRadioModule,
    MatStepperModule,
    MdButtonModule,
    MatExpansionModule,
    MatListModule,
    MatCardModule,
    MatTabsModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatListModule,
    MatSnackBarModule
  ]
})
export class MaterialModule { }

