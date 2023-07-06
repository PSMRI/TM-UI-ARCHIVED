import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Router } from "@angular/router";
import { MdDialogRef, MdDialog, MdDialogConfig } from "@angular/material";

import { BeneficiaryDetailsService } from "../../core/services/beneficiary-details.service";
import { ConfirmationService } from "../../core/services/confirmation.service";
import { DoctorService, MasterdataService } from "../shared/services";
import { CameraService } from "../../core/services/camera.service";

import { environment } from "environments/environment";

import * as moment from "moment";
import { SchedulerComponent } from './../scheduler/scheduler.component';
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";
@Component({
  selector: "app-doctor-worklist",
  templateUrl: "./doctor-worklist.component.html",
  styleUrls: ["./doctor-worklist.component.css"]
})
export class DoctorWorklistComponent implements OnInit, OnDestroy {

  rowsPerPage = 5;
  activePage = 1;
  pagedList = [];
  rotate = true;
  beneficiaryList: any;
  filteredBeneficiaryList = [];
  blankTable = [1, 2, 3, 4, 5];
  filterTerm;
  currentLanguageSet: any;
  cbacData: any=[];
  beneficiaryMetaData: any;
  currentPage: number;
  constructor(
    private dialog: MdDialog,
    private cameraService: CameraService,
    private router: Router,
    private masterdataService: MasterdataService,
    private confirmationService: ConfirmationService,
    public httpServiceService: HttpServiceService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private doctorService: DoctorService
  ) { }

  ngOnInit() {
    localStorage.setItem("currentRole", "Doctor");
    // this.httpServiceService.currentLangugae$.subscribe(response => {
    //   if (response) {
    //     this.currentLanguageSet = response;
    //     this.loadWorklist();
    //   }
    // });
    this.assignSelectedLanguage();
    this.loadWorklist();
    this.removeBeneficiaryDataForDoctorVisit();
    this.beneficiaryDetailsService.reset();
    this.masterdataService.reset();
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

  ngOnDestroy() {
    localStorage.removeItem("currentRole");
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
    localStorage.removeItem("specialistFlag");
  }

  pageChanged(event): void {
    console.log("called", event);
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedList = this.filteredBeneficiaryList.slice(startItem, endItem);
    console.log("list", this.pagedList);
  }

  loadWorklist() {
    this.filterTerm = null;
    this.beneficiaryMetaData = [];
    this.doctorService.getDoctorWorklist().subscribe(
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
          this.filterTerm = null;
          this.currentPage=1;
          this.pageChanged({
            page: this.activePage,
            itemsPerPage: this.rowsPerPage
          });
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
      element.visitDate = moment(element.visitDate).format("DD-MM-YYYY HH:mm A") || "Not Available";
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

  loadDoctorExaminationPage(beneficiary: any) {
    console.log('beneficiary', JSON.stringify(beneficiary, null, 4));
    localStorage.setItem("visitCode", beneficiary.visitCode);
    if (beneficiary.statusCode == 1) {
      this.routeToWorkArea(beneficiary);
    } else if (beneficiary.statusCode == 2) {
      this.confirmationService.alert(beneficiary.statusMessage);
    } else if (beneficiary.statusCode == 3) {
      this.routeToWorkArea(beneficiary);
    } else if (beneficiary.statusCode == 4) {
      this.checkDoctorStatusAtTcCancelled(beneficiary);
    } else if (beneficiary.statusCode == 5) {
      this.confirmationService.alert(beneficiary.statusMessage)
    } else if (beneficiary.statusCode == 9) {
      this.viewAndPrintCaseSheet(beneficiary);
    } else if (beneficiary.statusCode == 10) {
      this.confirmationService.alert(beneficiary.statusMessage);
    } else if (beneficiary.statusCode == 11) {
      this.routeToWorkArea(beneficiary);
    }
  }

  viewAndPrintCaseSheet(beneficiary) {
    this.confirmationService.confirm("info", this.currentLanguageSet.alerts.info.consulation).subscribe(res => {
      if (res) {
        this.routeToCaseSheet(beneficiary)
      }
    });
  }

  routeToCaseSheet(beneficiary) {
    localStorage.setItem("caseSheetBenFlowID", beneficiary.benFlowID);
    localStorage.setItem("caseSheetVisitCategory", beneficiary.VisitCategory);
    localStorage.setItem("caseSheetBeneficiaryRegID", beneficiary.beneficiaryRegID);
    localStorage.setItem("caseSheetVisitID", beneficiary.benVisitID);
    this.router.navigate(["/common/print/" + 'TM' + '/' + 'current']);
  }

  routeToWorkArea(beneficiary) {
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
            this.confirmationService.confirmCBAC(`info`, this.currentLanguageSet.alerts.info.confirmtoProceedFurther,this.cbacData).subscribe(result => {
              if (result) {
                this.updateWorkArea(beneficiary)
              }
            });
          }
          else
          {
            this.cbacData=null;
          this.beneficiaryDetailsService.cbacData=this.cbacData;
          this.confirmationService.confirm(`info`, this.currentLanguageSet.alerts.info.confirmtoProceedFurther).subscribe(result => {
            if (result) {
              this.updateWorkArea(beneficiary)
            }
          });
          }
        }
        else
        {
          this.cbacData=null;
          this.beneficiaryDetailsService.cbacData=this.cbacData;
          this.confirmationService.confirm(`info`, this.currentLanguageSet.alerts.info.confirmtoProceedFurther).subscribe(result => {
            if (result) {
              this.updateWorkArea(beneficiary)
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
  updateWorkArea(beneficiary) {
    const dataSeted = this.setDataForWorkArea(beneficiary);
    if (dataSeted) {
      this.router.navigate(["/common/attendant/doctor/patient/", beneficiary.beneficiaryRegID]);
    }
  }

  setDataForWorkArea(beneficiary) {
    localStorage.setItem("beneficiaryGender", beneficiary.genderName);
    localStorage.setItem("benFlowID", beneficiary.benFlowID);
    localStorage.setItem("visitCategory", beneficiary.VisitCategory);
    localStorage.setItem("beneficiaryRegID", beneficiary.beneficiaryRegID);
    localStorage.setItem("visitID", beneficiary.benVisitID);
    localStorage.setItem("beneficiaryID", beneficiary.beneficiaryID);
    localStorage.setItem("doctorFlag", beneficiary.doctorFlag);
    localStorage.setItem("nurseFlag", beneficiary.nurseFlag);
    localStorage.setItem("pharmacist_flag", beneficiary.pharmacist_flag);

    return true;
  }

  checkDoctorStatusAtTcCancelled(beneficiary) {
    if (beneficiary.doctorFlag == 2 || beneficiary.nurseFlag == 2) {
      this.confirmationService.alert(beneficiary.statusMessage);
    } else if (beneficiary.doctorFlag == 1) {
      this.routeToWorkArea(beneficiary);
    } else if (beneficiary.doctorFlag == 3) {
      this.routeToWorkArea(beneficiary);
    } else if (beneficiary.doctorFlag == 9) {
      this.viewAndPrintCaseSheet(beneficiary);
    }
  }

  toggleArrivalStatus(evt, benFlowID, index) {
    let message: string;
    if (evt.checked) {
      message = this.currentLanguageSet.alerts.info.beneficiaryArrive;
    } else {
      message = this.currentLanguageSet.alerts.info.cancelStatus;
    }

    console.log(benFlowID, "", evt, "", this.beneficiaryList);

    let filteredBenIndex = -1;
    this.confirmationService.confirm("info", message, "YES", "NO")
      .subscribe(res => {
        if (res) {
          this.beneficiaryList.forEach((benef, i) => {
            if (benef.benFlowID == benFlowID) {
              filteredBenIndex = i;
            }
          });
          if (filteredBenIndex >= 0) {
            this.beneficiaryList[filteredBenIndex].benArrivedFlag = evt.checked;
            this.filteredBeneficiaryList = this.beneficiaryList;
            if (this.filterTerm !== null && this.filterTerm !== undefined && this.filterTerm !== "") {
                this.filterBeneficiaryList(this.filterTerm);
            }
            let arrivedBeneficiary = this.beneficiaryList[filteredBenIndex];
            this.doctorService.updateBeneficiaryArrivalStatus({
              benflowID: arrivedBeneficiary.benFlowID,
              benRegID: arrivedBeneficiary.beneficiaryRegID,
              visitCode: arrivedBeneficiary.visitCode,
              status: evt.checked,
              userID: arrivedBeneficiary.tCSpecialistUserID,
              modifiedBy: localStorage.getItem('userName'),
            }).subscribe(res => {
              if (res && res.statusCode && res.data) {
                // this.confirmationService.alert(res.data.response, "success");
                this.confirmationService.alert(this.currentLanguageSet.alerts.info.confirmArrival, "success");
              } else {
                this.beneficiaryList[filteredBenIndex].benArrivedFlag = !evt.checked;
                this.confirmationService.alert(res.errorMessage, "error")
              }
            }, error => {
              this.beneficiaryList[filteredBenIndex].benArrivedFlag = !evt.checked;
              this.confirmationService.alert(error, "error");
            });
          }
        } else {
          this.pagedList[index].benArrivedFlag = !evt.checked;
        }
      });

    console.log(benFlowID, "", evt, "", this.beneficiaryList);
  }


  getVisitStatus(beneficiaryVisitDetials) {
    const status = {
      statusCode: 0,
      statusMessage: ""
    };


    if (beneficiaryVisitDetials.specialist_flag == 0) {

      if (beneficiaryVisitDetials.lab_technician_flag === 2) {
        status.statusCode = 10;
        status.statusMessage = this.currentLanguageSet.alerts.info.fetosenseTest_pending;
      } else if (beneficiaryVisitDetials.nurseFlag == 2 || beneficiaryVisitDetials.doctorFlag == 2) {
        status.statusCode = 2;
        status.statusMessage = this.currentLanguageSet.alerts.info.pending;
      } else if (beneficiaryVisitDetials.doctorFlag == 1) {
        status.statusCode = 1;
        status.statusMessage = this.currentLanguageSet.common.pendingForConsultation;
      }
      else if (beneficiaryVisitDetials.lab_technician_flag === 3) {
        status.statusCode = 11;
        status.statusMessage = this.currentLanguageSet.alerts.info.fetosenseTest_done;
      } else if (beneficiaryVisitDetials.doctorFlag == 3) {
        status.statusCode = 3;
        status.statusMessage = this.currentLanguageSet.alerts.info.labtestDone;
      } else if (beneficiaryVisitDetials.doctorFlag == 9) {
        status.statusCode = 9;
        status.statusMessage = this.currentLanguageSet.alerts.info.consultation_done;
      }

    } else {
       if (beneficiaryVisitDetials.specialist_flag == 9) {
        status.statusCode = 9;
        status.statusMessage = this.currentLanguageSet.alerts.info.consultation_done;
      }
      else if (beneficiaryVisitDetials.lab_technician_flag === 2) {
        status.statusCode = 10;
        status.statusMessage = this.currentLanguageSet.alerts.info.fetosenseTest_pending;
      } else if (beneficiaryVisitDetials.doctorFlag == 2 || beneficiaryVisitDetials.nurseFlag == 2) {
        status.statusCode = 2;
        status.statusMessage = this.currentLanguageSet.alerts.info.pending;
      } else if (beneficiaryVisitDetials.specialist_flag == 1 || beneficiaryVisitDetials.specialist_flag == 2 || beneficiaryVisitDetials.specialist_flag == 3) {
        status.statusCode = 5;
        status.statusMessage = this.currentLanguageSet.alerts.info.pendingForConsultation;
      } else if (beneficiaryVisitDetials.specialist_flag == 4) {
        status.statusCode = 4; // MMUFloW
        status.statusMessage = this.currentLanguageSet.alerts.info.teleCancel;
      }
      else if (beneficiaryVisitDetials.lab_technician_flag === 3) {
        status.statusCode = 11;
        status.statusMessage = this.currentLanguageSet.alerts.info.fetosenseTest_done;
      } else if (beneficiaryVisitDetials.doctorFlag == 3) {
        status.statusCode = 3;
        status.statusMessage = this.currentLanguageSet.alerts.info.labtestDone;
      }  else if (beneficiaryVisitDetials.doctorFlag == 1) {
        status.statusCode = 1;
        status.statusMessage = this.currentLanguageSet.common.pendingForConsultation;
      }
    }

    return status;
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
              this.loadWorklist();
            } else {
              this.confirmationService.alert(res.errorMessage, "error")
            }
          }, error => {
            this.confirmationService.alert(error, "error");
          });
        }
      });
  }
  openScheduler(beneficiary) {
    let mdDialogRef: MdDialogRef<SchedulerComponent> = this.dialog.open(SchedulerComponent, {
    })
    mdDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.scheduleTC(beneficiary, result.tmSlot);
      }
      console.log(JSON.stringify(result, null, 4));
    })
  }
  scheduleTC(beneficiary, tcRequest) {
    const scedulerRequest = {
      benFlowID: beneficiary.benFlowID,
      beneficiaryRegID: beneficiary.beneficiaryRegID,
      benVisitID: beneficiary.benVisitID,
      visitCode: beneficiary.visitCode,
      vanID: beneficiary.vanID,
      providerServiceMapID: localStorage.getItem('providerServiceID'),
      createdBy: localStorage.getItem('userName'),
      tcRequest: tcRequest
    }
    this.doctorService.scheduleTC(scedulerRequest).subscribe((res) => {
      console.log('res', res);

      if (res.statusCode == 200) {
        this.confirmationService.alert(this.currentLanguageSet.alerts.info.beneficiaryDetails, 'success');
        this.loadWorklist();
      } else {
        this.confirmationService.alert(res.errorMessage, "error")
      }
    }, error => {
      this.confirmationService.alert(error, "error");
    })
  }
  initiateTC(beneficiary) {
    console.log('ben', beneficiary);

    if (beneficiary.benArrivedFlag) {
      this.doctorService.invokeSwymedCall(beneficiary.tCSpecialistUserID).subscribe((res) => {
        if (res.statusCode == 200 && res.data) {
          window.location.href = res.data.response;
          this.updateTCStartTime(beneficiary);
        } else {
          this.confirmationService.alert(res.errorMessage, "error")
        }
      }, error => {
        this.confirmationService.alert(error, "error");
      })
    } else {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.benificiary);
    }
  }
  updateTCStartTime(beneficiary) {
    let tCStartTimeObj = {
      benRegID: beneficiary.beneficiaryRegID,
      visitCode: beneficiary.visitCode
    }
    this.doctorService.updateTCStartTime(tCStartTimeObj).subscribe((res) => {
      console.log(res);
    })
  }

}
