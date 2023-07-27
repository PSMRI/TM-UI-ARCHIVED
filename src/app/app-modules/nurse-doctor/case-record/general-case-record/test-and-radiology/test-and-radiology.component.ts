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


import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { ViewTestReportComponent } from './view-test-report/view-test-report.component';
import { ViewRadiologyUploadedFilesComponent } from "../../../../lab/view-radiology-uploaded-files/view-radiology-uploaded-files.component";
import { LabService } from '../../../../lab/shared/services';
import { ConfirmationService } from '../../../../core/services/confirmation.service';
import { DoctorService } from '../../../shared/services';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { IdrsscoreService } from 'app/app-modules/nurse-doctor/shared/services/idrsscore.service';
import { environment } from 'environments/environment';
import { DomSanitizer } from '@angular/platform-browser'
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { TestInVitalsService } from 'app/app-modules/nurse-doctor/shared/services/test-in-vitals.service';

@Component({
  selector: 'app-test-and-radiology',
  templateUrl: './test-and-radiology.component.html',
  styleUrls: ['./test-and-radiology.component.css']
})
export class TestAndRadiologyComponent implements OnInit {
  current_language_set: any;
  stripsNotAvailable: any;
  testMMUResultsSubscription: any;
  enableFetosenseView: boolean = false;
  fetosenseDataToView: any;
  fetosenseTestName: any;
  imgUrl: any;
  amritFilePath: any;
  vitalsRBSResp: any = null;


  constructor(private doctorService: DoctorService,
    public httpServiceService: HttpServiceService,
    private dialog: MdDialog,
    private labService: LabService,
    private confirmationService: ConfirmationService,
    private idrsScoreService: IdrsscoreService, public sanitizer: DomSanitizer,
    private testInVitalsService: TestInVitalsService) { }

  currentLabRowsPerPage = 5;
  currentLabActivePage = 1;
  previousLabRowsPerPage = 5;
  previousLabActivePage = 1;
  rotate = true;
  beneficiaryRegID: any;
  visitID: any;
  visitCategory: any;
  ngOnInit() {
    this.beneficiaryRegID = localStorage.getItem('beneficiaryRegID');
    this.visitID = localStorage.getItem('visitID');
    this.assignSelectedLanguage();
    this.testInVitalsService.clearVitalsRBSValueInReports();
    this.testInVitalsService.clearVitalsRBSValueInReportsInUpdate();
    // this.httpServiceService.currentLangugae$.subscribe(response => this.current_language_set = response);
    this.visitCategory = localStorage.getItem('visitCategory');
    // if (localStorage.getItem("referredVisitCode") == "undefined" || localStorage.getItem("referredVisitCode") == null) {
    //   this.getTestResults(this.beneficiaryRegID, this.visitID, this.visitCategory);
    // }
    // else {
    //   this.getMMUTestResults(this.beneficiaryRegID, this.visitID, this.visitCategory);
    // }

    this.testInVitalsService.vitalRBSTestResult$.subscribe(response => {
    if(response.visitCode)
    {
       if(response.rbsTestResult)
      {
      this.vitalsRBSResp = null;
       this.vitalsRBSResp={
        "prescriptionID": null,
        "procedureID": null,
        "createdDate": response.createdDate,
        "procedureName": "RBS Test",
        "procedureType": "Laboratory",
        "referredVisit" : false,
        "componentList": [
          {
            "testResultValue": response.rbsTestResult,
            "remarks": response.rbsTestRemarks,
            "fileIDs": [
              null
            ],
            "testResultUnit": "mg/dl",
            "testComponentID": null,
            "componentName": null
          }
        ]
       };

     
          }

      if (localStorage.getItem("referredVisitCode") == "undefined" || localStorage.getItem("referredVisitCode") == null) {
      this.getTestResults(this.beneficiaryRegID, this.visitID, this.visitCategory);
        }
      else {
      this.getMMUTestResults(this.beneficiaryRegID, this.visitID, this.visitCategory);
          }

  }

 });

 this.testInVitalsService.vitalRBSTestResultInUpdate$.subscribe(vitalsresp => {

       this.checkRBSResultInVitalsUpdate(vitalsresp);
 });

  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }

  ngOnDestroy() { 
    if (this.testResultsSubscription)
      this.testResultsSubscription.unsubscribe();
  }

  checkRBSResultInVitalsUpdate(vitalsresp)
  {
    if(vitalsresp.rbsTestResult)
    {
     let vitalsRBSResponse = null;
     vitalsRBSResponse={
          "prescriptionID": null,
          "procedureID": null,
          "createdDate": vitalsresp.createdDate,
          "procedureName": "RBS Test",
          "procedureType": "Laboratory",
          "referredVisit": false,
          "componentList": [
            {
              "testResultValue": vitalsresp.rbsTestResult,
              "remarks": vitalsresp.rbsTestRemarks,
              "fileIDs": [
                null
              ],
              "testResultUnit": "mg/dl",
              "testComponentID": null,
              "componentName": null
            }
          ]
         };
  
      this.labResults.forEach((element,index)=>{
        if(element.procedureName === "RBS Test" && element.procedureID === null && element.referredVisit === false) 
                    this.labResults.splice(index,1);
     });
  
    //  this.labResults.push(vitalsRBSResponse);
    this.labResults=[vitalsRBSResponse].concat(this.labResults);
     
     this.filteredLabResults = this.labResults;

     this.currentLabPageChanged({
      page: this.currentLabActivePage,
      itemsPerPage: this.currentLabRowsPerPage
    });
    }
    else
    {
        this.labResults.forEach((element,index)=>{
        if(element.procedureName === "RBS Test" && element.procedureID === null && element.referredVisit === false) 
                    this.labResults.splice(index,1);
     });

     
     this.filteredLabResults = this.labResults;

     this.currentLabPageChanged({
      page: this.currentLabActivePage,
      itemsPerPage: this.currentLabRowsPerPage
    });
    }
  }

  labResults = [];
  radiologyResults = [];
  archivedResults = [];
  fetosenseData = [];
  testResultsSubscription: any;
  getTestResults(beneficiaryRegID, visitID, visitCategory) {
    this.testResultsSubscription = this.doctorService.getCaseRecordAndReferDetails(beneficiaryRegID, visitID, visitCategory)
      .subscribe(res => {
        console.log('response archive', res);
        if (res && res.statusCode == 200 && res.data) {
          console.log('labresult', res.data.LabReport);
          this.labResults = res.data.LabReport.filter((lab) => {
            return lab.procedureType == 'Laboratory'
          })
       

        
         

          if (visitCategory == 'NCD screening') {


            this.filteredLabResults.forEach(element => {
              if (element.procedureName == environment.RBSTest) {
                return element.componentList.forEach(element1 => {
                  if (element1.stripsNotAvailable === true) {

                    this.idrsScoreService.setReferralSuggested();
                  }
                });
              }

            });
          }
          console.log("stripsNotAvailable", this.filteredLabResults);


            if(this.vitalsRBSResp)
            {
        
              // this.labResults.push(this.vitalsRBSResp);
              this.labResults=[this.vitalsRBSResp].concat(this.labResults);
          
            }

          this.filteredLabResults = this.labResults;

          this.radiologyResults = res.data.LabReport.filter((radiology) => {
            return radiology.procedureType == 'Radiology'
          })
          this.archivedResults = res.data.ArchivedVisitcodeForLabResult;
          this.currentLabPageChanged({
            page: this.currentLabActivePage,
            itemsPerPage: this.currentLabRowsPerPage
          });

          this.fetosenseData = res.data.fetosenseData;
        }
      })
  }

  getMMUTestResults(beneficiaryRegID, visitID, visitCategory) {
    let labTestArray = [];
    let mmulabResults = [];
    let mmulabResultsRef = [];
    let respObj;
    //Calling TM Reports
    this.testResultsSubscription = this.doctorService.getMMUCaseRecordAndReferDetails(beneficiaryRegID, visitID, visitCategory, localStorage.getItem("visitCode"))
      .subscribe(res => {
        console.log('response archive', res);
        if (res && res.statusCode == 200 && res.data) {
          console.log('labresult', res.data.LabReport);
          mmulabResults = res.data.LabReport.filter((lab) => {
            return lab.procedureType == 'Laboratory'
          })
          this.filteredLabResults = mmulabResults;


          //Calling MMU Reports
          this.testMMUResultsSubscription = this.doctorService.getMMUCaseRecordAndReferDetails(beneficiaryRegID, localStorage.getItem("referredVisitID"), visitCategory, localStorage.getItem("referredVisitCode"))
            .subscribe(response => {
              if (response && response.statusCode == 200 && response.data) {
                mmulabResultsRef = response.data.LabReport.filter((lab) => {
                  return lab.procedureType == 'Laboratory'
                })
                labTestArray = mmulabResultsRef;



                for (let i = 0, j = this.filteredLabResults.length; i < labTestArray.length; i++, j++) {
                  this.filteredLabResults[j] = labTestArray[i];
                }
                console.log("labTestArray", labTestArray);

                this.labResults = this.filteredLabResults;

                
        

                if (visitCategory == 'NCD screening') {


                  this.filteredLabResults.forEach(element => {
                    if (element.procedureName == environment.RBSTest) {
                      return element.componentList.forEach(element1 => {
                        if (element1.stripsNotAvailable === true) {

                          this.idrsScoreService.setReferralSuggested();
                        }
                      });
                    }

                  });
                }
                console.log("stripsNotAvailable", this.filteredLabResults);

                  if(this.vitalsRBSResp)
                  {
        
                      // this.labResults.push(this.vitalsRBSResp);
                      this.labResults=[this.vitalsRBSResp].concat(this.labResults);
          
                   }

                  this.filteredLabResults = this.labResults;

                this.radiologyResults = res.data.LabReport.filter((radiology) => {
                  return radiology.procedureType == 'Radiology'
                })

                let radiologyResponse = response.data.LabReport.filter((radiology) => {
                  return radiology.procedureType == 'Radiology'
                })

                for (let i = 0, j = this.radiologyResults.length; i < radiologyResponse.length; i++, j++) {
                  this.radiologyResults[j] = radiologyResponse[i];
                }


                this.archivedResults = res.data.ArchivedVisitcodeForLabResult;
                let archivedResponse = response.data.ArchivedVisitcodeForLabResult

                for (let i = 0, j = this.archivedResults.length; i < archivedResponse.length; i++, j++) {
                  this.archivedResults[j] = archivedResponse[i];
                }

                this.currentLabPageChanged({
                  page: this.currentLabActivePage,
                  itemsPerPage: this.currentLabRowsPerPage
                });

                this.getGeneralVitalsData(beneficiaryRegID, visitID);
              }
            })




        }
      })
  }


  getGeneralVitalsData(beneficiaryRegID, visitID) {
  this.doctorService.getGenericVitalsForMMULabReport({
        benRegID: beneficiaryRegID,
        benVisitID: visitID,
      })
      .subscribe((vitalsData) => {
        if (vitalsData.benPhysicalVitalDetail) {
          // let temp = Object.assign(
          //   {},
          //   vitalsData.benAnthropometryDetail,
          //   vitalsData.benPhysicalVitalDetail
          // );

          if(vitalsData.benPhysicalVitalDetail.rbsTestResult)
          {
            let vitalsRBSResponse = null;
            vitalsRBSResponse={
                 "prescriptionID": null,
                 "procedureID": null,
                 "createdDate": vitalsData.benPhysicalVitalDetail.createdDate,
                 "procedureName": "RBS Test",
                 "procedureType": "Laboratory",
                 "referredVisit" : true,
                 "componentList": [
                   {
                     "testResultValue": vitalsData.benPhysicalVitalDetail.rbsTestResult,
                     "remarks": vitalsData.benPhysicalVitalDetail.rbsTestRemarks,
                     "fileIDs": [
                       null
                     ],
                     "testResultUnit": "mg/dl",
                     "testComponentID": null,
                     "componentName": null
                   }
                 ]
                };
         
            
            // this.labResults.push(vitalsRBSResponse);
            this.labResults=[vitalsRBSResponse].concat(this.labResults);
            this.filteredLabResults = this.labResults;
       
            this.currentLabPageChanged({
             page: this.currentLabActivePage,
             itemsPerPage: this.currentLabRowsPerPage
           });
          }
      

        }
      });
  }


  filteredLabResults = [];
  filterProcedures(searchTerm?: string) {
    if (!searchTerm) {
      this.filteredLabResults = this.labResults;
    }
    else {
      this.filteredLabResults = [];
      this.labResults.forEach((item) => {
        const value: string = '' + item.procedureName;
        if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
          this.filteredLabResults.push(item);
        }
      });
    }


    this.currentLabActivePage = 1;
    this.currentLabPageChanged({
      page: 1,
      itemsPerPage: this.currentLabRowsPerPage
    });

  }
  currentLabPagedList = [];
  currentLabPageChanged(event): void {
    console.log('called', event)
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.currentLabPagedList = this.filteredLabResults.slice(startItem, endItem);
    console.log('list', this.currentLabPagedList)

  }

  showTestResult(fileIDs) {
    let ViewTestReport = this.dialog.open(ViewRadiologyUploadedFilesComponent,
      {
        width: "40%",
        data: {
          filesDetails: fileIDs,
          // width: 0.8 * window.innerWidth + "px",
          panelClass: 'dialog-width',
          disableClose: false
        }
      });
    ViewTestReport.afterClosed().subscribe((result) => {
      if (result) {
        let fileID = {
          "fileID": result
        }
        this.labService.viewFileContent(fileID).subscribe((res) => {
          if (res.data.statusCode == 200) {
            let fileContent = res.data.data.response;
            location.href = fileContent;
          }

        }, (err) => {
          this.confirmationService.alert(err.errorMessage, 'err');
        })
      }
    })
  }
  enableArchiveView: Boolean = false;
  archivedLabResults = [];
  filteredArchivedLabResults = [];
  archivedRadiologyResults = [];
  visitedDate: any;
  visitCode: any;
  showArchivedTestResult(visitCode) {
    let archivedReport = {
      beneficiaryRegID: localStorage.getItem('beneficiaryRegID'),
      visitCode: visitCode.visitCode
    }
    this.doctorService.getArchivedReports(archivedReport).subscribe((response) => {
      if (response.statusCode == 200) {
        this.archivedLabResults = response.data.filter((lab) => {
          return lab.procedureType == 'Laboratory'
        })
        this.filteredArchivedLabResults = this.archivedLabResults;
        this.previousLabPageChanged({
          page: this.previousLabActivePage,
          itemsPerPage: this.previousLabRowsPerPage
        });
        this.archivedRadiologyResults = response.data.filter((radiology) => {
          return radiology.procedureType == 'Radiology'
        })
        this.enableArchiveView = true;
        this.visitedDate = visitCode.date
        this.visitCode = visitCode.visitCode
      }
    })

  }

  filterArchivedProcedures(searchTerm?: string) {
    if (!searchTerm) {
      this.filteredArchivedLabResults = this.archivedLabResults;
    }
    else {
      this.filteredArchivedLabResults = [];
      this.archivedLabResults.forEach((item) => {
        const value: string = '' + item.procedureName;
        if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
          this.filteredArchivedLabResults.push(item);
        }
      });
    }

    this.previousLabActivePage = 1;
    this.previousLabPageChanged({
      page: 1,
      itemsPerPage: this.previousLabRowsPerPage
    });
  }

  previousLabPagedList = [];
  previousLabPageChanged(event): void {
    console.log('called', event)
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.previousLabPagedList = this.filteredArchivedLabResults.slice(startItem, endItem);
    console.log('list', this.previousLabPagedList)

  }

  showArchivedRadiologyTestResult(radiologyReport) {
    console.log('reports', radiologyReport)
    let ViewTestReport = this.dialog.open(ViewTestReportComponent,
      {
        data: radiologyReport,
        width: 0.8 * window.innerWidth + "px",
        panelClass: 'dialog-width',
        disableClose: false
      });
  }

  resetArchived() {
    console.log('hwere');

    this.archivedLabResults = [];
    this.filteredArchivedLabResults = [];
    this.archivedRadiologyResults = [];
    this.visitCode = null;
    this.visitedDate = null;
    this.enableArchiveView = false;
    this.previousLabPagedList = [];
  }
  fetosenseView: Array<{ name: string, value: number }> = [];
  showFetosenseReport(fetosenseDataToshow) {
    this.fetosenseView = [];
    // if (this.enableFetosenseView)
    //   this.enableFetosenseView = false;
    // else
      this.enableFetosenseView = true;
    this.fetosenseDataToView = fetosenseDataToshow;

    this.fetosenseTestName = fetosenseDataToshow.testName;

    this.amritFilePath = fetosenseDataToshow.aMRITFilePath;

    this.imgUrl = undefined;

    this.fetosenseView.push({ name: "Duration", value: fetosenseDataToshow.lengthOfTest });
    this.fetosenseView.push({ name: "Mother Name", value: fetosenseDataToshow.partnerName });
    this.fetosenseView.push({ name: "Mother LMP Date", value: fetosenseDataToshow.motherLMPDate });
    this.fetosenseView.push({ name: "Basel Heart Rate ", value: fetosenseDataToshow.basalHeartRate });
    this.fetosenseView.push({ name: "Test ID", value: fetosenseDataToshow.testId });
    this.fetosenseView.push({ name: "Device ID", value: fetosenseDataToshow.deviceId });
  }
  getTestName(fetosenseTestID) {

  }
  showFetosenseGraph() {
    let content = undefined;
    //let srcPath=content.replace('data:application/pdf;base64,','');
    var reportPath = this.amritFilePath;
    let obj = {
      aMRITFilePath: reportPath
    }
    this.doctorService.getReportsBase64(obj).subscribe((response) => {
      if (response.statusCode == 200) {
        content = response.data.response;
        if (content != undefined) {
          var byteCharacters = atob(content);
          var byteNumbers = new Array(byteCharacters.length);
          for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          var byteArray = new Uint8Array(byteNumbers);
          const blob1 = new Blob([byteArray], { type: 'application/pdf;base64' });
          // let reader = new FileReader();
          // reader.readAsDataURL(blob1);
          // reader.onload = (_event) => {
          //   this.imgUrl = reader.result;
          // }
          var fileURL = URL.createObjectURL(blob1);
          this.imgUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        }
      }
      else
        this.confirmationService.alert(response.errorMessage, 'error');
    }, (err) => {
      this.confirmationService.alert(err, 'error');
    });

    // else
    // this.confirmationService.alert("Report not found", 'info');
  }
}
