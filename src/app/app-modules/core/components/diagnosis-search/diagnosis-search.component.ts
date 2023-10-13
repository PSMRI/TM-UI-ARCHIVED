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


import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { MasterdataService } from '../../../nurse-doctor/shared/services/masterdata.service';
import { Observable, Subject } from 'rxjs';
import { HttpServiceService } from '../../services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'app-diagnosis-search',
  templateUrl: './diagnosis-search.component.html',
  styleUrls: ['./diagnosis-search.component.css']
})
export class DiagnosisSearchComponent implements OnInit {

  searchTerm: string;
  // diagnosis$: Observable<any>;
  diagnosis$ = [];
  pageCount: any;
  selectedDiagnosisList = [];
  currentPage: number = 1;
  pager: any = {
    totalItems: 0,
    currentPage: 0,
    totalPages: 0,
    startPage: 0,
    endPage: 0,
    pages: 0
  };
  pagedItems = [];
  placeHolderSearch: any
  currentLanguageSet: any;


  constructor( @Inject(MD_DIALOG_DATA) public input: any,
    public dialogRef: MdDialogRef<DiagnosisSearchComponent>,
    private masterdataService: MasterdataService,
    public httpServiceService: HttpServiceService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    //this.httpServiceService.currentLangugae$.subscribe(response =>this.currentLanguageSet = response);
    this.search(this.input.searchTerm, 0);
    if (this.input.diagonasisType)
      this.placeHolderSearch = this.input.diagonasisType
     
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  selectDiagnosis(event, item) {
    if (event.checked) {
      item.selected = true;
      this.selectedDiagnosisList.push(item);
    } else {
      let index = this.selectedDiagnosisList.indexOf(item);
      this.selectedDiagnosisList.splice(index, 1);
      item.selected = false;
    }
  }
  checkSelectedDiagnosis(item) {
    let addedDiagnosis = this.input.addedDiagnosis;
    if (addedDiagnosis.length > 1) {
      let temp = addedDiagnosis.filter(diagnosis => diagnosis.conceptID == item.conceptID);
      if (temp.length > 0) {
        return true;
      } else {
        let tempCurrent = this.checkCurrentSelection(item);
        return tempCurrent;
      }
    } else {
      let tempCurrent = this.checkCurrentSelection(item);
      return tempCurrent;
    }
  }

  checkCurrentSelection(item) {
    if (this.selectedDiagnosisList.length > 0) {
      let currentSelection = this.selectedDiagnosisList.filter(diagnosis => diagnosis.conceptID == item.conceptID);
      if (currentSelection.length > 0) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }
  disableSelection(item) {
    let addedDiagnosis = this.input.addedDiagnosis;
    if (addedDiagnosis.length > 1) {
      let temp = addedDiagnosis.filter(diagnosis => diagnosis.conceptID == item.conceptID);
      if (temp.length > 0) {
        return true;
      } else {
        let enableCurrent = this.enableCurrentSelection(item);
        return enableCurrent
      }
    } else {
      let enableCurrent = this.enableCurrentSelection(item);
      return enableCurrent;
    }

  }
  enableCurrentSelection(item) {
    if (this.selectedDiagnosisList.length > 0) {
      let currentSelection = this.selectedDiagnosisList.filter(diagnosis => diagnosis.conceptID == item.conceptID);
      if (currentSelection.length > 0) {
        return false
      } else {
        let selectionLimit = this.checkSelectionLimit();
        return selectionLimit;
      }
    } else {
      let selectionLimit = this.checkSelectionLimit();
      return selectionLimit;
    }
  }

  checkSelectionLimit() {
    let selectedDiagnosislength = this.input.addedDiagnosis.length + this.selectedDiagnosisList.length - 1
    if (selectedDiagnosislength < 30) {
      return false
    } else {
      return true
    }
  }

  // checkSelectedDiagnosis(item) {
  //   let addedDiagnosis = this.input.addedDiagnosis;
  //   let temp = addedDiagnosis.filter(diagnosis => diagnosis.conceptID == item.conceptID);
  //   if (temp.length > 0)
  //     return true;
  //   else {
  //     let currentSelection = this.selectedDiagnosisList.filter(diagnosis => diagnosis.conceptID == item.conceptID);
  //     if (currentSelection.length > 0) {
  //       return true
  //     } else {
  //       return false
  //     }
  //   }
  // }
  // disableSelection(item) {
  //   let addedDiagnosis = this.input.addedDiagnosis;
  //   let temp = addedDiagnosis.filter(diagnosis => diagnosis.conceptID == item.conceptID);
  //   if (temp.length > 0) {
  //     return true;
  //   } else {
  //     let currentSelection = this.selectedDiagnosisList.filter(diagnosis => diagnosis.conceptID == item.conceptID);
  //     let selectedDiagnosislength = this.input.addedDiagnosis.length +  this.selectedDiagnosisList.length - 1
  //     if (currentSelection.length > 0) {
  //       return false
  //     } else {
  //       if (selectedDiagnosislength < 30) {
  //         return false
  //       } else {
  //         return true
  //       }
  //     }
  //   }
  // }
  submitDiagnosisList() {
    this.dialogRef.close(this.selectedDiagnosisList);
  }
  showProgressBar: Boolean = false;
  search(term: string, pageNo): void {
    if (term.length > 2) {
      this.showProgressBar = true;
      this.masterdataService.searchDiagnosisBasedOnPageNo(term, pageNo).subscribe((res) => {
        if (res.statusCode == 200) {
          this.showProgressBar = false;
          if (res.data && res.data.sctMaster.length > 0) {
            this.showProgressBar = true;
            this.diagnosis$ = res.data.sctMaster;
            if (pageNo == 0) {
              this.pageCount = res.data.pageCount;
            }
            this.pager = this.getPager(pageNo);
            this.showProgressBar = false;
          }
        } else {
          this.resetData();
          this.showProgressBar = false;
        }
      }, err => {
        this.resetData();
        this.showProgressBar = false;
      })
    }

  }
  checkPager(pager, page) {
    if (page == 0 && pager.currentPage != 0) {
      this.setPage(page);
    } else if (pager.currentPage < page) {
      this.setPage(page);
    }
  }
  setPage(page: number) {
    if (page <= this.pageCount - 1 && page >= 0) {
      this.search(this.input.searchTerm, page);
      // get pager object
      this.pager = this.getPager(page);
    }

  }
  getPager(page) {
    // Total page count
    let totalPages = this.pageCount;
    // ensure current page isn't out of range
    if (page > totalPages) {
      page = totalPages - 1;
    }
    let startPage: number, endPage: number;
    if (totalPages <= 5) {
      // less than 5 total pages so show all
      startPage = 0;
      endPage = totalPages - 1;
    } else {
      // more than 5 total pages so calculate start and end pages
      if (page <= 2) {
        startPage = 0;
        endPage = 4;
      } else if (page + 2 >= totalPages) {
        startPage = totalPages - 5;
        endPage = totalPages - 1;
      } else {
        startPage = page - 2;
        endPage = page + 2;
      }
    }
    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);
    // return object with all pager properties required by the view
    return {
      currentPage: page,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      pages: pages
    };
  }
  resetData() {
    this.diagnosis$ = [];
    this.pageCount = null;
    this.pager = {
      totalItems: 0,
      currentPage: 0,
      totalPages: 0,
      startPage: 0,
      endPage: 0,
      pages: 0
    };
  }
}
