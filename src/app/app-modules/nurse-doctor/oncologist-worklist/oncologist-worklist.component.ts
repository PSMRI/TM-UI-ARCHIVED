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

@Component({
  selector: 'app-oncologist-worklist',
  templateUrl: './oncologist-worklist.component.html',
  styleUrls: ['./oncologist-worklist.component.css']
})
export class OncologistWorklistComponent implements OnInit, DoCheck {
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
    public httpServiceService: HttpServiceService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private doctorService: DoctorService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    localStorage.setItem('currentRole', 'Oncologist');
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
  }
  pageChanged(event): void {
    console.log('called', event)
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedList = this.filteredBeneficiaryList.slice(startItem, endItem);
    console.log('list', this.pagedList)

  }
  loadWorklist() {
    this.doctorService.getOncologistWorklist()
      .subscribe(data => {
        if (data.statusCode == 200 && data.data != null) {
          console.log("worklist", data.data);
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
    localStorage.setItem('visitCode', beneficiary.visitCode);
    if (beneficiary.visitFlowStatusFlag == 'N') {
      this.confirmationService.confirm(`info`, this.currentLanguageSet.alerts.info.confirmtoProceedFurther)
        .subscribe(result => {
          if (result) {
            localStorage.setItem('benFlowID', beneficiary.benFlowID);
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
    } else {
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
