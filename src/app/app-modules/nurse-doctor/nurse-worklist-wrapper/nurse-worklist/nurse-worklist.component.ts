import { Component, DoCheck, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ConfirmationService } from '../../../core/services/confirmation.service';
import { NurseService } from '../../shared/services';
import { CameraService } from '../../../core/services/camera.service';
import { BeneficiaryDetailsService } from '../../../core/services/beneficiary-details.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'app-nurse-worklist',
  templateUrl: './nurse-worklist.component.html',
  styleUrls: ['./nurse-worklist.component.css']
})
export class NurseWorklistComponent implements OnInit, DoCheck {
  rowsPerPage = 5;
  activePage = 1;
  pagedList = [];
  rotate = true;

  cbacData :any=[];
  blankTable = [1, 2, 3, 4, 5];
  beneficiaryList: any;
  filteredBeneficiaryList = [];
  filterTerm;
  currentLanguageSet: any;
  currentPage: number;
  constructor(
    private nurseService: NurseService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private cameraService: CameraService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    public httpServiceService: HttpServiceService
) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    localStorage.setItem('currentRole', 'Nurse');
    this.removeBeneficiaryDataForNurseVisit();
    this.getNurseWorklist();
    this.beneficiaryDetailsService.reset();
  }

  ngOnDestroy() {
    localStorage.removeItem('currentRole');
  }

  removeBeneficiaryDataForNurseVisit() {
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

  getNurseWorklist() {
    this.nurseService.getNurseWorklist()
      .subscribe((res) => {
        if (res.statusCode == 200 && res.data != null) {
          const benlist = this.loadDataToBenList(res.data);
          this.beneficiaryList = benlist;
          this.filteredBeneficiaryList = benlist;
          this.pageChanged({
            page: this.activePage,
            itemsPerPage: this.rowsPerPage
          });
          this.filterTerm = null;
          this.currentPage=1;
        } else
          this.confirmationService.alert(res.errorMessage, 'error');
      }, err => {
        this.confirmationService.alert(err, 'error');
      });
  }

  loadDataToBenList(data) {
    data.forEach(element => {
      element.genderName = element.genderName || 'Not Available'
      element.age = element.age || 'Not Available'
      element.benVisitNo = element.benVisitNo || 'Not Available'
      element.districtName = element.districtName || 'Not Available'
      element.villageName = element.villageName || 'Not Available'
      element.fatherName = element.fatherName || 'Not Available'
      element.preferredPhoneNum = element.preferredPhoneNum || 'Not Available'
    })
    return data;
  }

  pageChanged(event): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedList = this.filteredBeneficiaryList.slice(startItem, endItem);
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

  loadNursePatientDetails(beneficiary) {
    this.cbacData=[];
    this.beneficiaryDetailsService.cbacData=this.cbacData;
    this.beneficiaryDetailsService.getCBACDetails(beneficiary.beneficiaryRegID)
    .subscribe((res) => {
      if (res.statusCode == 200 && res.data != null) {
        if(res.data.benRegID !=undefined && res.data.benRegID !=null &&
          ((res.data.suspectedTB !=undefined && res.data.suspectedTB !=null) || 
          (res.data.suspectedNCD !=undefined && res.data.suspectedNCD !=null) ||
           (res.data.suspectedHRP != undefined && res.data.suspectedHRP !=null) ||
           (res.data.suspectedNCDDiseases != undefined && res.data.suspectedNCDDiseases != null)))
        {
          if(res.data.suspectedHRP !=undefined && res.data.suspectedHRP !=null && (res.data.suspectedHRP).toLowerCase() ==="yes")
          this.cbacData.push("High Risk Pregnancy");
          if(res.data.suspectedTB !=undefined && res.data.suspectedTB !=null && (res.data.suspectedTB).toLowerCase() ==="yes")
          this.cbacData.push("Tuberculosis");
          if(res.data.suspectedNCDDiseases !=undefined && res.data.suspectedNCDDiseases !=null
           && ((res.data.suspectedNCDDiseases).length) >0 )
           {
             let diseases=(res.data.suspectedNCDDiseases).split(",");
            if(diseases.length >0)
            {
              diseases.forEach(element => {
                console.log(element.toLowerCase);
                if(element.toLowerCase() ==="diabetes")
                this.cbacData.push("Diabetes");
                if(element.toLowerCase() ==="hypertension")
                this.cbacData.push("Hypertension");
                if(element.toLowerCase() ==="breast cancer")
                this.cbacData.push("Breast cancer");
                if(element.toLowerCase() ==="mental health disorder")
                this.cbacData.push("Mental health disorder");
                if(element.toLowerCase() ==="oral cancer")
                this.cbacData.push("Oral cancer");
              });
            }
             
           }
          this.beneficiaryDetailsService.cbacData=this.cbacData;
          this.loadNursePatientDetailsCBAC(beneficiary);
        }
        else{
          this.cbacData=null;
          this.beneficiaryDetailsService.cbacData=this.cbacData;
          localStorage.removeItem('visitCategory');
          if (beneficiary.nurseFlag == 100) {
            this.confirmationService.confirm(`info`, this.currentLanguageSet.alerts.info.confirmtoProceedFurther)
              .subscribe(result => {
                if (result) {
                  localStorage.setItem('visitCode', beneficiary.visitCode);
                  localStorage.setItem('beneficiaryGender', beneficiary.genderName);
                  localStorage.setItem('visitCategory', "NCD screening");
                  localStorage.setItem('visitID', beneficiary.benVisitID);
                  localStorage.setItem('nurseFlag', beneficiary.nurseFlag);
                  localStorage.setItem('beneficiaryRegID', beneficiary.beneficiaryRegID);
                  localStorage.setItem('benFlowID', beneficiary.benFlowID);
                  localStorage.setItem('beneficiaryID', beneficiary.beneficiaryID);
                  localStorage.setItem('benVisitNo', beneficiary.benVisitNo);
                  this.router.navigate(['/common/attendant/nurse/patient/', beneficiary.beneficiaryRegID]);
                }
              });
          } else {
            this.confirmationService.confirm(`info`, this.currentLanguageSet.alerts.info.confirmtoProceedFurther)
              .subscribe(result => {
                if (result) {
                  localStorage.setItem('beneficiaryGender', beneficiary.genderName);
                  localStorage.setItem('beneficiaryRegID', beneficiary.beneficiaryRegID);
                  localStorage.setItem('benFlowID', beneficiary.benFlowID);
                  localStorage.setItem('beneficiaryID', beneficiary.beneficiaryID);
                  localStorage.setItem('benVisitNo', beneficiary.benVisitNo);
                  this.router.navigate(['/common/attendant/nurse/patient/', beneficiary.beneficiaryRegID]);
                }
              });
          }
        
        }
       
      } else
      {
        this.confirmationService.alert(res.errorMessage, 'error');
        this.cbacData=null;
        this.beneficiaryDetailsService.cbacData=this.cbacData;
      }
        
    }, err => {
      this.cbacData=null;
      this.beneficiaryDetailsService.cbacData=this.cbacData;
      this.confirmationService.alert(err, 'error');
    });
  }
  loadNursePatientDetailsCBAC(beneficiary)
  {
    if(this.cbacData !=undefined && this.cbacData !=null && this.cbacData.length >0)
    {
      localStorage.removeItem('visitCategory');
      if (beneficiary.nurseFlag == 100) {
        this.confirmationService.confirmCBAC(`info`, this.currentLanguageSet.alerts.info.confirmtoProceedFurther,this.cbacData)
          .subscribe(result => {
            if (result) {
              localStorage.setItem('visitCode', beneficiary.visitCode);
              localStorage.setItem('beneficiaryGender', beneficiary.genderName);
              localStorage.setItem('visitCategory', "NCD screening");
              localStorage.setItem('visitID', beneficiary.benVisitID);
              localStorage.setItem('nurseFlag', beneficiary.nurseFlag);
              localStorage.setItem('beneficiaryRegID', beneficiary.beneficiaryRegID);
              localStorage.setItem('benFlowID', beneficiary.benFlowID);
              localStorage.setItem('beneficiaryID', beneficiary.beneficiaryID);
              localStorage.setItem('benVisitNo', beneficiary.benVisitNo);
              this.router.navigate(['/common/attendant/nurse/patient/', beneficiary.beneficiaryRegID]);
            }
          });
      } else {
        this.confirmationService.confirmCBAC(`info`, this.currentLanguageSet.alerts.info.confirmtoProceedFurther,this.cbacData)
          .subscribe(result => {
            if (result) {
              localStorage.setItem('beneficiaryGender', beneficiary.genderName);
              localStorage.setItem('beneficiaryRegID', beneficiary.beneficiaryRegID);
              localStorage.setItem('benFlowID', beneficiary.benFlowID);
              localStorage.setItem('beneficiaryID', beneficiary.beneficiaryID);
              localStorage.setItem('benVisitNo', beneficiary.benVisitNo);
              this.router.navigate(['/common/attendant/nurse/patient/', beneficiary.beneficiaryRegID]);
            }
          });
      }
    }
    else{
      this.cbacData=null;
      this.beneficiaryDetailsService.cbacData=this.cbacData;
      localStorage.removeItem('visitCategory');
      if (beneficiary.nurseFlag == 100) {
        this.confirmationService.confirm(`info`, this.currentLanguageSet.alerts.info.confirmtoProceedFurther)
          .subscribe(result => {
            if (result) {
              localStorage.setItem('visitCode', beneficiary.visitCode);
              localStorage.setItem('beneficiaryGender', beneficiary.genderName);
              localStorage.setItem('visitCategory', "NCD screening");
              localStorage.setItem('visitID', beneficiary.benVisitID);
              localStorage.setItem('nurseFlag', beneficiary.nurseFlag);
              localStorage.setItem('beneficiaryRegID', beneficiary.beneficiaryRegID);
              localStorage.setItem('benFlowID', beneficiary.benFlowID);
              localStorage.setItem('beneficiaryID', beneficiary.beneficiaryID);
              localStorage.setItem('benVisitNo', beneficiary.benVisitNo);
              this.router.navigate(['/common/attendant/nurse/patient/', beneficiary.beneficiaryRegID]);
            }
          });
      } else {
        this.confirmationService.confirm(`info`, this.currentLanguageSet.alerts.info.confirmtoProceedFurther)
          .subscribe(result => {
            if (result) {
              localStorage.setItem('beneficiaryGender', beneficiary.genderName);
              localStorage.setItem('beneficiaryRegID', beneficiary.beneficiaryRegID);
              localStorage.setItem('benFlowID', beneficiary.benFlowID);
              localStorage.setItem('beneficiaryID', beneficiary.beneficiaryID);
              localStorage.setItem('benVisitNo', beneficiary.benVisitNo);
              this.router.navigate(['/common/attendant/nurse/patient/', beneficiary.beneficiaryRegID]);
            }
          });
      }
  
    }
   
  }
  filterBeneficiaryList(searchTerm: string) {
    if (!searchTerm)
      this.filteredBeneficiaryList = this.beneficiaryList;
    else {
      this.filteredBeneficiaryList = [];
      this.beneficiaryList.forEach((item) => {
        console.log('item', JSON.stringify(item, null, 4))
        for (let key in item) {
          if (key == 'beneficiaryID' || key == 'benName' || key == 'genderName' || key == 'fatherName' || key == 'districtName' || key == 'preferredPhoneNum' || key == 'villageName') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredBeneficiaryList.push(item); break;
            }
          } else {
            if (key == 'benVisitNo') {
              let value: string = '' + item[key];
              if (value == '1') {
                let val = 'First visit'
                if (val.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
                  this.filteredBeneficiaryList.push(item); break;
                }
              } else {
                let val = 'Revist'
                if (val.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
                  this.filteredBeneficiaryList.push(item); break;
                }
              }
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
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
}
