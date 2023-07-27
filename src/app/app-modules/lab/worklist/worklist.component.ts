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


import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';

import { BeneficiaryDetailsService } from '../../core/services/beneficiary-details.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { LabService, MasterDataService } from '../shared/services';
import { CameraService } from '../../core/services/camera.service';

import { environment } from 'environments/environment';
import * as moment from 'moment';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'app-worklist',
  templateUrl: './worklist.component.html',
  styleUrls: ['./worklist.component.css']
})
export class WorklistComponent implements OnInit, OnDestroy {
  rowsPerPage = 5;
  activePage = 1;
  pagedList = [];
  rotate = true;
  beneficiaryList: any;
  filteredBeneficiaryList = [];
  blankTable = [1, 2, 3, 4, 5];
  filterTerm;
  current_language_set: any;
  currentPage: number;
  constructor(
    private dialog: MdDialog,
    private cameraService: CameraService,
    private router: Router,
    private masterdataService: MasterDataService,
    private confirmationService: ConfirmationService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    public httpServiceService: HttpServiceService,
 
    private labService: LabService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    localStorage.setItem('currentRole', 'Lab Technician');
    this.loadWorklist();
    this.beneficiaryDetailsService.reset();
    this.removeBeneficiaryDataForVisit();
    //this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);

  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }

  removeBeneficiaryDataForVisit() {
    localStorage.removeItem('visitCode');
    localStorage.removeItem('beneficiaryGender');
    localStorage.removeItem('benFlowID');
    localStorage.removeItem('visitCategory');
    localStorage.removeItem('beneficiaryRegID');
    localStorage.removeItem('visitID');
    localStorage.removeItem('beneficiaryID');
    localStorage.removeItem('doctorFlag');
    localStorage.removeItem('nurseFlag');
    localStorage.removeItem('pharmacist_flag');
    localStorage.removeItem('specialistFlag');
  }



  ngOnDestroy() {
    localStorage.removeItem('currentRole');
  }

  loadWorklist() {
    this.labService.getLabWorklist()
      .subscribe(data => {
        if (data && data.statusCode == 200 && data.data) {
          console.log("lab worklist", data.data);

          const benlist = this.loadDataToBenList(data.data);
          this.beneficiaryList = benlist;
          this.filteredBeneficiaryList = benlist;
          this.pageChanged({
            page: this.activePage,
            itemsPerPage: this.rowsPerPage
          });
          this.filterTerm = null;
          this.currentPage=1;
        } else {
          this.confirmationService.alert(data.errorMessage, 'error');
        }
      }, err => {
        this.confirmationService.alert(err, 'error');
      });
  }

  pageChanged(event): void {
    console.log('called', event)
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedList = this.filteredBeneficiaryList.slice(startItem, endItem);
    console.log('list', this.pagedList)
  }

  loadDataToBenList(data) {
    const benDataList = [];
    data.forEach(element => {
      benDataList.push({
        beneficiaryID: element.beneficiaryID,
        beneficiaryRegID: element.beneficiaryRegID,
        benName: element.benName,
        genderName: element.genderName || 'Not Available',
        age: element.age || 'Not Available',
        // statusMessage: element.statusMessage || 'Not Available',
        VisitCategory: element.VisitCategory || 'Not Available',
        benVisitNo: element.benVisitNo || 'Not Available',
        districtName: element.districtName || 'Not Available',
        villageName: element.villageName || 'Not Available',
        preferredPhoneNum: element.preferredPhoneNum || 'Not Available',
        benFlowID: element.benFlowID,
        benVisitID: element.benVisitID,
        visitDate: moment(element.visitDate).format('DD-MM-YYYY HH:mm A ') || 'Not Available',
        benVisitDate: moment(element.benVisitDate).format('DD-MM-YYYY HH:mm A ') || 'Not Available',
        labObject: element
      })

    });
    return benDataList;

  }

  filterBeneficiaryList(searchTerm: string) {
    if (!searchTerm)
      this.filteredBeneficiaryList = this.beneficiaryList;
    else {
      this.filteredBeneficiaryList = [];
      this.beneficiaryList.forEach((item) => {
        for (let key in item) {
          if (key == 'beneficiaryID' || key == 'benName' || key == 'genderName' || key == 'age' || key == 'VisitCategory' || key == 'benVisitNo' || key == 'districtName' || key == 'preferredPhoneNum' || key == 'villageName' || key == 'beneficiaryRegID' || key || 'visitDate') {

            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredBeneficiaryList.push(item); break;
            }
          }
        }
      });
    }
    this.activePage = 1;
    this.pageChanged({
      page: 1,
      itemsPerPage: this.rowsPerPage
    });
    this.currentPage=1;
  }

  patientImageView(benregID: any) {
    if (benregID && benregID != null && benregID != '' && benregID != undefined) {
      this.beneficiaryDetailsService.getBeneficiaryImage(benregID)
        .subscribe(data => {
          if (data && data.benImage)
            this.cameraService.viewImage(data.benImage);
          else
            this.confirmationService.alert(this.current_language_set.alerts.info.imageNotFound);
        });
    }
  }

  loadLabExaminationPage(beneficiary: any) {
    // if (beneficiary.visitFlowStatusFlag == 'N') {
    console.log('beneficiary', JSON.stringify(beneficiary, null, 4));

    this.confirmationService.confirm(`info`, this.current_language_set.alerts.info.confirmtoProceedFurther).subscribe(result => {
      if (result) {
        localStorage.setItem('doctorFlag', beneficiary.labObject.doctorFlag);
        localStorage.setItem('nurseFlag', beneficiary.labObject.nurseFlag);
        localStorage.setItem('visitID', beneficiary.benVisitID);
        localStorage.setItem('beneficiaryRegID', beneficiary.beneficiaryRegID);
        localStorage.setItem('beneficiaryID', beneficiary.beneficiaryID);
        localStorage.setItem('visitCategory', beneficiary.VisitCategory);
        localStorage.setItem('benFlowID', beneficiary.benFlowID);
        localStorage.setItem('visitCode', beneficiary.labObject.visitCode);
        if(beneficiary.labObject.specialist_flag && beneficiary.labObject.specialist_flag >= 0){
        localStorage.setItem('specialist_flag', beneficiary.labObject.specialist_flag)
        }else{
          localStorage.setItem('specialist_flag',null);
        }
        console.log(localStorage.getItem('visitCode'), 'visitCodebeforedave')
        this.router.navigate(['/lab/patient/', beneficiary.beneficiaryRegID]);
      }
    });
    // }
    // else {
    //   //this.confirmationService.alert('Consultation Done.');
    //   this.confirmationService.confirm("Current visit case-sheet Confirmation", "Consultation Done. Want to Print Current Case-sheet ???").subscribe((res) => {
    //     if (res) {
    //       localStorage.setItem('visitCategory', beneficiary.VisitCategory);
    //       let visitDateTime = new Date().toISOString();
    //       window.open(environment.printCancerCase_sheet_url + '/#/common/casesheet/' + beneficiary.beneficiaryRegID + '/' + beneficiary.benVisitID + '/' + visitDateTime);
    //     }
    //   }, (err) => { })
    // }
  }
}
