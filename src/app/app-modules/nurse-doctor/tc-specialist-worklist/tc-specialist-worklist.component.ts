import { Component, OnInit, OnDestroy, Input, OnChanges, DoCheck } from "@angular/core";
import { Router } from "@angular/router";
import { MdDialogRef, MdDialog, MdDialogConfig } from "@angular/material";

import { BeneficiaryDetailsService } from "../../core/services/beneficiary-details.service";
import { ConfirmationService } from "../../core/services/confirmation.service";
import { DoctorService, MasterdataService } from "../shared/services";
import { CameraService } from "../../core/services/camera.service";
import { TelemedicineService } from "../../core/services/telemedicine.service";
import { environment } from "environments/environment";

import * as moment from "moment";
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";

@Component({
  selector: "app-tc-specialist-worklist",
  templateUrl: "./tc-specialist-worklist.component.html",
  styleUrls: ["./tc-specialist-worklist.component.css"]
})
export class TcSpecialistWorklistComponent implements OnInit, OnDestroy, OnChanges, DoCheck {
  rowsPerPage = 5;
  activePage = 1;
  pagedList = [];
  rotate = true;
  beneficiaryList: any;
  filteredBeneficiaryList = [];
  blankTable = [1, 2, 3, 4, 5];
  filterTerm: any;
currentLanguageSet: any;
  cbacData: any=[];
  diseases: any;
  currentPage: number;
  beneficiaryMetaData: any;

  constructor(
    private dialog: MdDialog,
    private cameraService: CameraService,
    private router: Router,
    private masterdataService: MasterdataService,
    private confirmationService: ConfirmationService,
    private telemedicineService: TelemedicineService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private doctorService: DoctorService,
    public httpServiceService: HttpServiceService
  ) { }
  intervalref: any;
  @Input('getChangedTab')
  getChangedTab: any;
  ngOnInit() {
    this.assignSelectedLanguage();
    localStorage.setItem("currentRole", "Doctor");
    this.removeBeneficiaryDataForDoctorVisit();
    this.reLoadWorklist();
    this.beneficiaryDetailsService.reset();
    this.masterdataService.reset();
    this.setTimer();
  }


  ngOnChanges() {
    console.log('this.getChangedTab', this.getChangedTab);
    if (this.getChangedTab == 'current')
      this.setTimer();

    if (this.getChangedTab == 'future')
      clearInterval(this.intervalref)
  }

  setTimer() {
    this.intervalref = setInterval(() => {
      this.loadWorklist();
    }, 1 * 60 * 1000);
  }


  ngOnDestroy() {
    localStorage.removeItem("currentRole");
    clearInterval(this.intervalref);
  }

  removeBeneficiaryDataForDoctorVisit() {
    localStorage.removeItem("visitCode");
    localStorage.removeItem("beneficiaryGender");
    localStorage.removeItem("benFlowID");
    localStorage.removeItem("visitCategory");
    localStorage.removeItem("beneficiaryRegID");
    localStorage.removeItem("visitID");
    localStorage.removeItem("beneficiaryID");
    localStorage.removeItem("doctorFlag");
    localStorage.removeItem("nurseFlag");
    localStorage.removeItem("pharmacist_flag");
    localStorage.removeItem("referredVisitCode");
    localStorage.removeItem("referredVisitID");


  }

  pageChanged(event): void {
    console.log("called", event);
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedList = this.filteredBeneficiaryList.slice(startItem, endItem);
    console.log("list", this.pagedList);
  }
  reLoadWorklist() {
    this.filterTerm = null;
    this.loadWorklist()
  }
  loadWorklist() {
    this.beneficiaryMetaData = [];
    this.doctorService.getSpecialistWorklist().subscribe(
      data => {
        if (data && data.statusCode == 200 && data.data) {
          console.log("doctor worklist", JSON.stringify(data.data, null, 4));
          this.beneficiaryMetaData = data.data;
          data.data.map(item => {
            let temp = this.getVisitStatus(item);
            item.statusMessage = temp.statusMessage;
            item.statusCode = temp.statusCode;
          });
          // this.beneficiaryList = data.data;
          // this.filteredBeneficiaryList = data.data;
          const benlist = this.loadDataToBenList(data.data);
          this.beneficiaryList = benlist;
          this.filteredBeneficiaryList = benlist;
          // this.filterTerm = null;
          this.currentPage=1;
          this.pageChanged({
            page: this.activePage,
            itemsPerPage: this.rowsPerPage
          });
          this.filterBeneficiaryList(this.filterTerm);
        } else this.confirmationService.alert(data.errorMessage, "error");
      },
      err => {
        this.confirmationService.alert(err, "error");
      }
    );
  }


  loadDataToBenList(data) {
    data.forEach(element => {
      element.genderName = element.genderName || "Not Available";
      element.age = element.age || "Not Available";
      element.statusMessage = element.statusMessage || "Not Available";
      element.VisitCategory = element.VisitCategory || "Not Available";
      element.benVisitNo = element.benVisitNo || "Not Available";
      element.districtName = element.districtName || "Not Available";
      element.villageName = element.villageName || "Not Available";
      element.arrival = false;
      element.preferredPhoneNum = element.preferredPhoneNum || "Not Available";
      element.visitDate = moment(element.visitDate).format("DD-MM-YYYY") || "Not Available";
      element.tCRequestDate = moment(element.tCRequestDate).format('DD-MM-YYYY HH:mm A ') || 'Not Available';
      element.benVisitDate = moment(element.benVisitDate).format('DD-MM-YYYY HH:mm A ') || 'Not Available';
    });
    return data;
  }

  filterBeneficiaryList(searchTerm: string) {
    if (!searchTerm) this.filteredBeneficiaryList = this.beneficiaryList;
    else {
      this.filteredBeneficiaryList = [];
      this.beneficiaryList.forEach(item => {
        console.log("item", JSON.stringify(item, null, 4));
        for (let key in item) {
          if (
            key == "beneficiaryID" ||
            key == "benName" ||
            key == "genderName" ||
            key == "age" ||
            key == "statusMessage" ||
            key == "VisitCategory" ||
            key == "benVisitNo" ||
            key == "districtName" ||
            key == "preferredPhoneNum" ||
            key == "villageName" ||
            key == "beneficiaryRegID" ||
            key ||
            "visitDate"
          ) {
            let value: string = "" + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredBeneficiaryList.push(item);
              break;
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
    this.beneficiaryDetailsService
      .getBeneficiaryImage(benregID)
      .subscribe(data => {
        if (data && data.benImage) this.cameraService.viewImage(data.benImage);
        else this.confirmationService.alert(this.currentLanguageSet.alerts.info.imageNotFound);
      });
  }

  loadTcConsultation(beneficiary: any) {
    localStorage.setItem("visitCode", beneficiary.visitCode);
    console.log("benficiary", beneficiary);
    if (beneficiary.statusCode == 1) {
      this.redirectToWorkArea(beneficiary);
    } else if (beneficiary.statusCode == 2) {
      this.confirmationService.alert(beneficiary.statusMessage)
    } else if (beneficiary.statusCode == 3) {
      this.redirectToWorkArea(beneficiary);
    } else if (beneficiary.statusCode == 5) {
      this.confirmationService.alert(beneficiary.statusMessage)
    } else if (beneficiary.statusCode == 9) {
      this.viewAndPrintCaseSheet(beneficiary)
    } else if (beneficiary.statusCode == 10) {
      this.confirmationService.alert(beneficiary.statusMessage);
    } else if (beneficiary.statusCode == 11) {
      this.redirectToWorkArea(beneficiary);
    }
  }

  viewAndPrintCaseSheet(beneficiary) {
    this.confirmationService.confirm("info", this.currentLanguageSet.alerts.info.consulation)
      .subscribe((res) => {
        if (res) {
          localStorage.setItem('caseSheetBenFlowID', beneficiary.benFlowID);
          localStorage.setItem('caseSheetVisitCategory', beneficiary.VisitCategory);
          localStorage.setItem('caseSheetBeneficiaryRegID', beneficiary.beneficiaryRegID);
          localStorage.setItem('caseSheetVisitID', beneficiary.benVisitID);
          this.router.navigate(["/common/print/" + 'TM' + '/' + 'current']);
        }
      });
  }

  checkBeneficiaryStatus(beneficiary) {
    this.redirectToWorkArea(beneficiary);
  }

  beneficiaryTCRequestStatus(benficiary) {
    let beneficiaryTCRequest = {
      benflowID: benficiary.benFlowID,
      benRegID: benficiary.beneficiaryRegID,
      visitCode: benficiary.visitCode,
      userID: localStorage.getItem('userID')
    }
    this.doctorService.beneficiaryTCRequestStatus(beneficiaryTCRequest).subscribe((res) => {
      if (res.statusCode == 200) {
        this.loadTcConsultation(benficiary);
      } else {
        this.confirmationService.alert(this.currentLanguageSet.alerts.info.beneficiaryNotArrived)
      }
    })
  }

  redirectToWorkArea(beneficiary) {
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
          if(this.cbacData !=undefined && this.cbacData !=null && this.cbacData.length >0)
          {
            this.confirmationService
      .confirm(`info`, this.currentLanguageSet.alerts.info.confirmtoProceedFurther)
      .subscribe(result => {
        if (result) {
          const dataSetted = this.setDataForWorkArea(beneficiary);
          if (dataSetted) {
            this.router.navigate(["/common/attendant/tcspecialist/patient/", beneficiary.beneficiaryRegID]);
          }
              }
            });
          }
          else{
            this.cbacData=null;
          this.beneficiaryDetailsService.cbacData=this.cbacData;
          this.confirmationService
          .confirm(`info`, this.currentLanguageSet.alerts.info.confirmtoProceedFurther)
          .subscribe(result => {
            if (result) {
              const dataSetted = this.setDataForWorkArea(beneficiary);
              if (dataSetted) {
                this.router.navigate(["/common/attendant/tcspecialist/patient/", beneficiary.beneficiaryRegID]);
              }
            }
          });
          }
         
        }
        else
        {
          this.cbacData=null;
          this.beneficiaryDetailsService.cbacData=this.cbacData;
          this.confirmationService
          .confirm(`info`, this.currentLanguageSet.alerts.info.confirmtoProceedFurther)
          .subscribe(result => {
            if (result) {
              const dataSetted = this.setDataForWorkArea(beneficiary);
              if (dataSetted) {
                this.router.navigate(["/common/attendant/tcspecialist/patient/", beneficiary.beneficiaryRegID]);
              }
            }
          });
        }
      }
      else
      {
        this.cbacData=null;
        this.beneficiaryDetailsService.cbacData=this.cbacData;
        this.confirmationService.alert(res.errorMessage, 'error');
      }
     
  }, err => {
    this.cbacData=null;
    this.beneficiaryDetailsService.cbacData=this.cbacData;
    this.confirmationService.alert(err, 'error');
  });
   
   
  }

  setDataForWorkArea(beneficiary) {
    let serviceLineDetails = {
      vanID: beneficiary.vanID,
      parkingPlaceID: beneficiary.parkingPlaceID,
    }
    localStorage.setItem('serviceLineDetails', JSON.stringify(serviceLineDetails))
    localStorage.setItem("beneficiaryGender", beneficiary.genderName);
    localStorage.setItem("benFlowID", beneficiary.benFlowID);
    localStorage.setItem("visitCategory", beneficiary.VisitCategory);
    localStorage.setItem("specialist_flag", beneficiary.specialist_flag)
    localStorage.setItem("beneficiaryRegID", beneficiary.beneficiaryRegID);
    localStorage.setItem("visitID", beneficiary.benVisitID);
    localStorage.setItem("beneficiaryID", beneficiary.beneficiaryID);
    localStorage.setItem("doctorFlag", beneficiary.doctorFlag);
    localStorage.setItem("nurseFlag", beneficiary.nurseFlag);
    localStorage.setItem("pharmacist_flag", beneficiary.pharmacist_flag);
    localStorage.setItem("referredVisitCode", beneficiary.referredVisitCode);
    localStorage.setItem("referredVisitID", beneficiary.referred_visit_id);

    return true;
  }
  getVisitStatus(beneficiaryVisitDetials) {
    let status = {
      statusCode: 0,
      statusMessage: ""
    };

    
    //fetosense changes
    //if(labFlag == 2)
    ////pending for NST/CTG
    //

    if (beneficiaryVisitDetials.lab_technician_flag === 2) {
      status.statusCode = 10;
      status.statusMessage = this.currentLanguageSet.alerts.info.fetosenseTest_pending;
    } else if (beneficiaryVisitDetials.doctorFlag == 2 || beneficiaryVisitDetials.nurseFlag == 2) {
      status.statusMessage = this.currentLanguageSet.alerts.info.pendingforLabtestResult;
      status.statusCode = 2;
    } else if (beneficiaryVisitDetials.specialist_flag == 1) {
      status.statusMessage = this.currentLanguageSet.common.pendingForConsultation;
      status.statusCode = 1;
    } else if (beneficiaryVisitDetials.specialist_flag == 2) {
      status.statusMessage = this.currentLanguageSet.alerts.info.pendingforLabtestResult;
      status.statusCode = 2;
    }     
    //else if(labFlag == 3)
    ////NST/CTG done

    else if (beneficiaryVisitDetials.lab_technician_flag === 3) {
      status.statusCode = 11;
      status.statusMessage = this.currentLanguageSet.alerts.info.fetosenseTest_done;
    } else if (beneficiaryVisitDetials.specialist_flag == 3) {
      status.statusMessage = this.currentLanguageSet.alerts.info.labtestDone;
      status.statusCode = 3;
    } else if (beneficiaryVisitDetials.specialist_flag == 9) {
      status.statusMessage = "Consultation done";
      status.statusCode = 9;
    }
    return status;
  }

  navigateToTeleMedicine() {
    this.telemedicineService.routeToTeleMedecine();
  }

  cancelTCRequest(beneficiary) {
    this.confirmationService.confirm("info", this.currentLanguageSet.alerts.info.cancelReq, "Yes", "No")
      .subscribe(res => {
        if (res) {
          this.doctorService.cancelBeneficiaryTCRequest({
            benflowID: beneficiary.benFlowID,
            benRegID: beneficiary.beneficiaryRegID,
            visitCode: beneficiary.visitCode,
            userID: beneficiary.tCSpecialistUserID,
            modifiedBy: localStorage.getItem('userName'),
          }).subscribe(res => {
            if (res && res.statusCode && res.data) {
              this.confirmationService.alert(res.data.response, "success");
              this.reLoadWorklist();
            } else {
              this.confirmationService.alert(res.errorMessage, "error")
            }
          }, error => {
            this.confirmationService.alert(error, "error");
          });
        }
      });
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
    if(this.currentLanguageSet !== undefined && this.currentLanguageSet !== null && this.beneficiaryMetaData !== undefined && 
      this.beneficiaryMetaData !== null) {
        this.beneficiaryMetaData.map(item => {
          let temp = this.getVisitStatus(item);
          item.statusMessage = temp.statusMessage;
          item.statusCode = temp.statusCode;
        });
    }
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
}
