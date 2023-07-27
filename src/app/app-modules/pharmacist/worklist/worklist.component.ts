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

import { BeneficiaryDetailsService } from '../../core/services/beneficiary-details.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { PharmacistService } from '../shared/services/pharmacist.service';
import { CameraService } from '../../core/services/camera.service';
import { InventoryService } from '../../core/services/inventory.service';

import * as moment from 'moment';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { RegistrarService } from 'app/app-modules/registrar/shared/services/registrar.service';

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
  benDetails: any;
  healthIDArray: any=[];
  healthIDValue: string='';
  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private pharmacistService: PharmacistService,
    private cameraService: CameraService,
    public httpServiceService: HttpServiceService,
    private inventoryService: InventoryService,
    private registrarService: RegistrarService
  ) { }

  ngOnInit() {
    localStorage.setItem('currentRole', 'Pharmacist');
    this.removeBeneficiaryDataForVisit();
    this.loadPharmaWorklist();
    this.beneficiaryDetailsService.reset();
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
    this.assignSelectedLanguage();

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
  }

  ngOnDestroy() {
    localStorage.removeItem('currentRole');
  }

  loadPharmaWorklist() {
    this.pharmacistService.getPharmacistWorklist()
      .subscribe(data => {
        if (data && data.statusCode == 200 && data.data) {
          console.log("pharmacist worklist", data.data);

          const benlist = this.loadDataToBenList(data.data);
          this.beneficiaryList = benlist;
          this.filteredBeneficiaryList = benlist;
          this.pageChanged({
            page: this.activePage,
            itemsPerPage: this.rowsPerPage
          });
          this.filterTerm = null;
          this.currentPage=1;
          console.log('this.filteredBeneficiaryList', this.filteredBeneficiaryList)
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

  patientImageView(benregID: any) {
    if (benregID && benregID != null && benregID != '' && benregID != undefined) {
      this.beneficiaryDetailsService.getBeneficiaryImage(benregID)
        .subscribe(data => {
          if (data && data.benImage) {
            this.cameraService.viewImage(data.benImage);
          } else {
            this.confirmationService.alert(this.current_language_set.alerts.info.imageNotFound);
          }
        });
    }
  }

  loadPharmaPage(beneficiary: any) {
    console.log(beneficiary)
    // let benDetails = Object.assign({},beneficiary , {"currentlanguage":sessionStorage.getItem('setLanguage')});
    let data = {
      "beneficiaryRegID":  beneficiary.beneficiaryRegID,
      "beneficiaryID": null
    }
    this.registrarService.getHealthIdDetails(data)
      .subscribe((healthIDDetails) => {
        if (healthIDDetails.statusCode == 200) {
          console.log("healthID",healthIDDetails);
          if(healthIDDetails.data.BenHealthDetails !=undefined && healthIDDetails.data.BenHealthDetails !=null)
          {
          this.benDetails=healthIDDetails.data.BenHealthDetails;
          if(this.benDetails.length >0)
          {
          this.benDetails.forEach((healthID,index) => {
            if(healthID.healthId !=undefined && healthID.healthId !=null && (index != this.benDetails.length-1))
            this.healthIDArray.push(healthID.healthId+',');
            else if(healthID.healthId !=undefined && healthID.healthId !=null)
            this.healthIDArray.push(healthID.healthId);
            if(healthID.healthId !=undefined && healthID.healthId !=null)
            this.healthIDValue=this.healthIDValue+healthID.healthId+',';
          })
        }
          if(this.healthIDValue !=undefined && this.healthIDValue !=null && this.healthIDValue.length >1)
          {
            this.healthIDValue=this.healthIDValue.substring(0,this.healthIDValue.length-1);
          }
        }
        } else {
          this.confirmationService.alert(this.current_language_set.issueInGettingBeneficiaryABHADetails, 'error');
        }
      }, (err) => {
        this.confirmationService.alert(this.current_language_set.issueInGettingBeneficiaryABHADetails, 'error');

      })
    this.confirmationService.confirm(`info`, this.current_language_set.alerts.info.confirmtoProceedFurther).subscribe(result => {
    if (result) {
      
    this.inventoryService.moveToInventory(
      beneficiary.beneficiaryID,
      beneficiary.visitCode,
      beneficiary.benFlowID,
      beneficiary.beneficiaryRegID,
      sessionStorage.getItem('setLanguage'),
      this.healthIDValue
      );
    }
    });
    // this.confirmationService.confirm(`info`, `Currently pharma not available`).subscribe(result => {
    //   if (result) {
    //     localStorage.setItem('visitID', beneficiary.benVisitID);
    //     localStorage.setItem('beneficiaryRegID', beneficiary.beneficiaryRegID);
    //     localStorage.setItem('beneficiaryID', beneficiary.beneficiaryID);
    //     localStorage.setItem('visitCategory', beneficiary.VisitCategory);
    //     // this.router.navigate(['/pharmacist/patient/', beneficiary.beneficiaryRegID]);
    //   }
    // });
  }
}

