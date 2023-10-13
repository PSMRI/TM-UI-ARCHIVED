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


import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';

import { BeneficiaryDetailsService } from '../../core/services/beneficiary-details.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { DoctorService } from '../shared/services/doctor.service';
import { CameraService } from '../../core/services/camera.service';

import { environment } from 'environments/environment';

import * as moment from 'moment';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { t } from '@angular/core/src/render3';

@Component({
  selector: 'app-radiologist-worklist',
  templateUrl: './radiologist-worklist.component.html',
  styleUrls: ['./radiologist-worklist.component.css']
})
export class RadiologistWorklistComponent implements OnInit , DoCheck{
  rowsPerPage = 5;
  activePage = 1;
  pagedList = [];
  rotate = true;
  beneficiaryList: any;
  filteredBeneficiaryList = [];
  blankTable = [1, 2, 3, 4, 5];
  filterTerm;
  currentLanguageSet: any;
  currentPage: number;
  constructor(
    private dialog: MdDialog,
    private cameraService: CameraService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private doctorService: DoctorService,
    public httpServiceService: HttpServiceService
 ) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    localStorage.setItem('currentRole', 'Radiologist');
    this.removeBeneficiaryDataForVisit();
    this.loadWorklist();
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
    this.doctorService.getRadiologistWorklist()
      .subscribe(data => {
        if (data.statusCode == 200 && data.data != null) {
          console.log("radiologist worklist", data.data);

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

  loadDataToBenList(data) {
    data.forEach(element => {
      element.genderName = element.genderName || 'Not Available'
      element.age = element.age || 'Not Available'
      element.statusMessage = element.statusMessage || 'Not Available'
      element.VisitCategory = element.VisitCategory || 'Not Available'
      element.benVisitNo = element.benVisitNo || 'Not Available'
      element.districtName = element.districtName || 'Not Available'
      element.villageName = element.villageName || 'Not Available'
      element.preferredPhoneNum = element.preferredPhoneNum || 'Not Available'
      element.visitDate = moment(element.visitDate).format('DD-MM-YYYY HH:mm A ') || 'Not Available'
      element.benVisitDate = moment(element.benVisitDate).format('DD-MM-YYYY HH:mm A ') || 'Not Available';
    })
    return data;
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
  pageChanged(event): void {
    console.log('called', event)
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedList = this.filteredBeneficiaryList.slice(startItem, endItem);
    console.log('list', this.pagedList)

  }
  patientImageView(benregID: any) {
    this.beneficiaryDetailsService.getBeneficiaryImage(benregID)
      .subscribe(data => {
        if (data && data.benImage)
          this.cameraService.viewImage(data.benImage);
        else
          this.confirmationService.alert(this.currentLanguageSet.alerts.info.imageNotFound);
      });
  }

  loadDoctorExaminationPage(beneficiary: any) {
    localStorage.setItem('benFlowID', beneficiary.benFlowID);
    localStorage.setItem('visitCode', beneficiary.visitCode);
    if (beneficiary.visitFlowStatusFlag == 'N') {
      this.confirmationService.confirm(`info`, this.currentLanguageSet.alerts.info.confirmtoProceedFurther)
        .subscribe(result => {
          if (result) {
            localStorage.setItem('visitID', beneficiary.benVisitID);
            localStorage.setItem('doctorFlag', beneficiary.doctorFlag);
            localStorage.setItem('nurseFlag', beneficiary.nurseFlag);
            localStorage.setItem('pharmacist_flag', beneficiary.pharmacist_flag);
            localStorage.setItem('beneficiaryRegID', beneficiary.beneficiaryRegID);
            localStorage.setItem('beneficiaryID', beneficiary.beneficiaryID);
            localStorage.setItem('visitCategory', beneficiary.VisitCategory);
            this.router.navigate(['/common/patient', beneficiary.beneficiaryRegID]);
          }
        });
    }
    else {
      this.confirmationService.confirm("info", this.currentLanguageSet.alerts.info.consulation)
        .subscribe((res) => {
          if (res) {
            localStorage.setItem('caseSheetBenFlowID', beneficiary.benFlowID);
            localStorage.setItem('caseSheetVisitCategory', beneficiary.VisitCategory);
            localStorage.setItem('caseSheetBeneficiaryRegID', beneficiary.beneficiaryRegID);
            localStorage.setItem('caseSheetVisitID', beneficiary.benVisitID);
            this.router.navigate(["/common/print/"+'TM'+'/'+ 'current']);
          }
        });
      // this.confirmationService.confirm(`info`,"Consultation done. Want to print current casesheet ?")
      //   .subscribe((res) => {
      //     if (res) {
      //       localStorage.setItem('caseSheetBenFlowID', beneficiary.benFlowID);
      //       localStorage.setItem('caseSheetVisitCategory', beneficiary.VisitCategory);
      //       localStorage.setItem('caseSheetBeneficiaryRegID', beneficiary.beneficiaryRegID);
      //       localStorage.setItem('caseSheetVisitID', beneficiary.benVisitID);
      //       localStorage.setItem('visitCategory', beneficiary.VisitCategory);
      //       let visitDateTime = new Date().toISOString();
      //       window.open(environment.printCancerCase_sheet_url + '/#/common/casesheet/' + beneficiary.beneficiaryRegID + '/' + beneficiary.benVisitID + '/' + visitDateTime);
      //     }
      //   });
    }
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
}
