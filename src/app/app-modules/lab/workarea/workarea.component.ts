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


import { DataManipulation } from './LabSubmissionDataManipulation';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { LabService, MasterDataService } from '../shared/services';
import { CameraService } from '../../core/services/camera.service';
import { BeneficiaryDetailsService } from '../../core/services/beneficiary-details.service';
import { LabUtils } from './../shared/utility/lab-utility';

import { CanComponentDeactivate } from '../../core/services/can-deactivate-guard.service';
import { Observable } from 'rxjs/Observable';
import { ViewRadiologyUploadedFilesComponent } from "./../view-radiology-uploaded-files/view-radiology-uploaded-files.component"
import { ViewFileComponent } from "./../view-file/view-file.component";
import { IotcomponentComponent } from 'app/app-modules/core/components/iotcomponent/iotcomponent.component';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { environment } from "environments/environment";
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';


@Component({
  selector: 'app-workarea',
  templateUrl: './workarea.component.html',
  styleUrls: ['./workarea.component.css']
})
export class WorkareaComponent implements OnInit, OnDestroy, CanComponentDeactivate {


  @ViewChild('sidenav')
  sidenav: any;

  utils = new LabUtils(this.fb);
  dataLoad = new DataManipulation;

  beneficiaryRegID;
  visitID;
  visitCode;
  technicianForm: FormGroup;
  labForm: FormArray;
  radiologyForm: FormArray;
  compDetails: FormArray;
  externalForm: FormGroup;
  archiveList = [];
  filteredArchiveList = [];
  blankTable = [, , , ,];
  loadingErrorMessage = 'There were some issues fetching Beneficiary Information, Please try again.';
  removable = true;
  valid_file_extensions = ['msg', 'pdf', 'png', 'jpeg', 'jpg', 'doc', 'docx', 'xlsx', 'xls', 'csv', 'txt'];
  // invalid_file_extensions_flag: boolean = false;
  stepExpand: number;
  currentLanguageSet: any;
  testName: string;
  stripSelected: boolean=true;
  maxFileSize = 5;
  constructor(
    
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private dialog: MdDialog,
    private router: Router,
    private masterdataService: MasterDataService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    public httpServiceService: HttpServiceService,
    private labService: LabService) { }


  ngOnInit() {
    this.assignSelectedLanguage();
    this.visitID = localStorage.getItem('visitID');
    this.visitCode = localStorage.getItem('visitCode');
    this.beneficiaryRegID = localStorage.getItem('beneficiaryRegID');
    this.httpServiceService.currentLangugae$.subscribe(response =>this.currentLanguageSet = response);

    this.getTestRequirements();
    this.stepExpand = 0;
    // this.mergeForms();
    this.testName = environment.RBSTest;
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }

  ngOnDestroy() {
    // localStorage.removeItem('visitID');
    // localStorage.removeItem('beneficiaryRegID');
    // localStorage.removeItem('beneficiaryID');
    // localStorage.removeItem('visitCategory');
    // localStorage.removeItem('visitCode');
  }




  /**
   * MERGE ALL 3 FORMS after getting data
   */
  mergeForms() {
    this.technicianForm = this.utils.createLabMasterForm();
    this.technicianForm.setControl('labForm', this.labForm)
    this.technicianForm.setControl('radiologyForm', this.radiologyForm)
    this.technicianForm.setControl('externalForm', this.externalForm);
    console.log('full wala form here', this.technicianForm, 'valuessss', JSON.stringify(this.technicianForm.value, null, 4));
  }

  /////////////////////////////// CALLING AND LOADING ALL TESTS CODE BELOW/////////////////////////////
  /**
   * Call Service for getting Test Details Requirements
  */
  getTestRequirements() {
    if (this.visitID && this.beneficiaryRegID && this.visitCode) {
      this.masterdataService.getLabRequirements(this.beneficiaryRegID, this.visitID, this.visitCode)
        .subscribe((res) => {
          if (res.statusCode === 200 && res.data) {
            /**
             * Get Test Requirements populated to UI -- CALLED
             */
            this.loadTests(res.data);

          } else {
            // this.errorLoading(this.loadingErrorMessage);
          }

        }, (error) => {
          this.errorLoading(this.loadingErrorMessage);
        })

    } else {
      this.errorLoading(this.loadingErrorMessage);
    }
  }

  /**
  * Get Test Requirements populated to UI
  */
  loadTests(tests) {
    if (tests.laboratoryList &&
      tests.radiologyList
      /* && tests.external */) {
      console.log(JSON.stringify(tests, null, 4));
      this.loadlabTests(Object.assign(tests.laboratoryList, []));
      this.loadRadiologyTests(Object.assign(tests.radiologyList, []));
      this.loadExternalTests(tests.externalTests);
      this.loadArchive(tests.archive);
      this.mergeForms();
    } else {
      this.errorLoading(this.loadingErrorMessage)
    }


  }
  /////////////////////////////// CALLING AND LOADING ALL TESTS CODE ABOVE/////////////////////////////

  ////////////////////////////////////////////////LAB TESTS RELATED CODE BELOW/////////////////////

  /**
   *
   * labtests loading out of response
   */
  loadlabTests(labtests) {
    // this.beneficiaryDetailsService.beneficiaryDetails$
    //   .subscribe((res) => console.log(res, 'bendict'));

    if (labtests.length) {
      this.labForm = this.fb.array([this.utils.createLabProcedureForm()]);
      labtests.forEach((test, i) => {

        // patch values at current position
        this.patchLabTestProcedureMasterData(test, i);

        if (i < labtests.length - 1) {
          this.labForm.push(this.utils.createLabProcedureForm());
        }
      });
    }

    //  console.log(this.labForm, 'labform', this.labForm.value);
  }


  /**
   * Patch Values for Lab Test Procedure
   */
  patchLabTestProcedureMasterData(test, index) {
    this.labForm.at(index).patchValue({
      procedureType: test.procedureType,
      procedureName: test.procedureName,
      procedureID: test.procedureID,
      prescriptionID: test.prescriptionID,
      procedureDesc: test.procedureDesc,
      procedureStartAPI: test.procedureStartAPI,
      procedureCode: test.procedureCode,
      isMandatory: test.isMandatory,
      calibrationStartAPI:test.calibrationStartAPI,
      calibrationStatusAPI:test.calibrationStatusAPI,
      calibrationEndAPI:test.calibrationEndAPI
      // gender: test.gender,
      // compListDetails: this.fb.array([this.utils.createLabComponent()])
    })
    this.patchLabTestComponentCommonMasterData(test.compListDetails, index);
  }

  /**
   * Patch Lab Test Component Common Master Data
   */

  patchLabTestComponentCommonMasterData(compListDetails, index) {
    const compListArray = <FormArray>(<FormGroup>this.labForm.at(index)).controls['compListDetails'];

    compListDetails.forEach((element, key) => {

      if (element.inputType === 'TextBox') {

        this.addTextBoxComponentControls(compListArray, key, element);
      } else {
        this.addSelectComponentControls(compListArray, key, element);
      }

    });
  }


  /**
   * Add additional Controls for TextBox Component -- key is to be interpreted as index
   */
  addTextBoxComponentControls(compListArray, key, element) {
    compListArray.push(this.utils.createLabComponentOfFields());

    (<FormArray>compListArray).at(key).patchValue({
      inputType: element.inputType,
      measurementUnit: element.measurementUnit,
      range_max: element.range_max,
      range_min: element.range_min,
      range_normal_max: element.range_normal_max,
      range_normal_min: element.range_normal_min,
      isDecimal: element.isDecimal,
      allowText: element.isDecimal === true ? 'decimal' : 'number',
      testComponentDesc: element.testComponentDesc,
      testComponentID: element.testComponentID,
      testComponentName: element.testComponentName,
      componentCode: element.componentCode,
      remarks: element.remarks
    });

  }
  /**
 * Add additional Controls for Radio/ Dropdown Component -- key is to be interpreted as index
 */
  addSelectComponentControls(compListArray, key, element) {
    compListArray.push(this.utils.createLabComponentOfRadioDropDowns());

    (<FormArray>compListArray).at(key).patchValue({
      inputType: element.inputType,
      testComponentDesc: element.testComponentDesc,
      testComponentID: element.testComponentID,
      testComponentName: element.testComponentName,
      remarks: element.remarks,
      componentCode: element.componentCode

    });
    const arrayCompOpt = <FormArray>(<FormGroup>(<FormArray>compListArray).at(key)).controls['compOpt']
    this.addDropDownListValuesforComponent(arrayCompOpt, element.compOpt);
  }

  /**
   * Add Values for DropDown List or Radio Button
  */
  addDropDownListValuesforComponent(arrayCompOpt, compOpt) {
    compOpt.forEach((element, i) => {
      arrayCompOpt.push(this.utils.createComponentRadioDropDownList());
      (<FormArray>arrayCompOpt).at(i).patchValue({
        name: element.name
      })
    });
  }

  /**
   * Check whether the Input belongs to normal range
   *
   */
  checkNormalRange(procedureIndex, componentIndex) {
    const procedure = <FormGroup>this.labForm.at(procedureIndex);
    const component = (<FormArray>procedure.controls['compListDetails']).at(componentIndex);
    // firstComponent.patchValue({abnormal: true});

    if (component.valueChanges && component.value.inputValue) {
      if (component.value.inputValue < component.value.range_normal_min ||
        component.value.inputValue > component.value.range_normal_max) {
        component.patchValue({
          abnormal: true
        })
      } else {
        component.patchValue({
          abnormal: false
        })
      }
    }
  }


  /**
   * Check Whether the Input belongs to Range specified
   */
  checkRange(procedureIndex, componentIndex) {
    const procedure = <FormGroup>this.labForm.at(procedureIndex);
    const component = (<FormArray>procedure.controls['compListDetails']).at(componentIndex);
    var numbers = null;
    if (component.value.allowText == "decimal")
      numbers = new RegExp(/^[.0-9]+$/);
    else
      numbers = new RegExp(/^[0-9]+$/);
    if (!numbers.test(component.value.inputValue)) {
      component.patchValue({
        inputValue: ''
      })
      // this.confirmationService.alert('Please enter a valid result');
    }
    else {
      if (component.value.inputValue && (component.value.inputValue < component.value.range_min ||
        component.value.inputValue > component.value.range_max)) {
        component.patchValue({
          inputValue: ''
        })
        this.confirmationService.alert(this.currentLanguageSet.alerts.info.valueDetails + " " + `${component.value.range_min} to ${component.value.range_max}`);
      }
    }

  }



  ////////////////////////////////////////////////LAB TESTS RELATED CODE ABOVE/////////////////////


  //////////////////////////////////////////RADIOLOGY TESTS RELATED CODE BELOW/////////////////////

  /**
   *
   * Radiology Tests loading out of response
   */
  loadRadiologyTests(radiologytests) {
    console.log(radiologytests, 'radiotests');
    console.log('restructuring lab', this.radiologyForm);

    if (radiologytests.length) {
      this.radiologyForm = this.fb.array([this.utils.createRadiologyProcedureForm()]);
      radiologytests.forEach((test, i) => {

        //patch values at current position
        this.patchRadiologyProcedureMasterData(test, i);

        if (i < radiologytests.length - 1) {
          this.radiologyForm.push(this.utils.createRadiologyProcedureForm());
        }
      });

    }
  }

  /**
 * Patch Values for Radiology Procedure
 */
  patchRadiologyProcedureMasterData(test, index) {
    this.radiologyForm.at(index).patchValue({
      procedureType: test.procedureType,
      procedureName: test.procedureName,
      procedureID: test.procedureID,
      prescriptionID: test.prescriptionID,
      procedureDesc: test.procedureDesc,
      gender: test.gender,
      // compListDetails: this.fb.array([this.utils.createLabComponent()])
    })
    this.patchRadiologyComponentCommonMasterData(test.compDetails, index);
  }

  patchRadiologyComponentCommonMasterData(test, index) {
    const compList = <FormGroup>(<FormGroup>this.radiologyForm.at(index)).controls['compDetails'];
    // compListArray.push(this.utils.createRadiologyComponent());
    // test.forEach((element, i) => {
    compList.patchValue({
      inputType: test.inputType,

      inputValue: test.compOpt,
      testComponentDesc: test.testComponentDesc,
      testComponentID: test.testComponentID,
      testComponentName: test.testComponentName,
      remarks: test.remarks
    });
    // });

  }

  fileList: FileList;
  file: any;
  fileContent: any;
  /*
  * FILE UPLOAD RELATED CODE
  */
  fileIndex: any;
  uploadFile(event, index) {
    this.fileIndex = index;
    this.fileList = event.target.files;
    if(this.fileList.length > 0) {
    this.file = event.target.files[0];

    let fileNameExtension = this.file.name.split(".");
    let fileName = fileNameExtension[0];

    if(fileName !== undefined && fileName !== null && fileName !== "")
    {
    var validFormat = this.checkExtension(this.file);
    if (!validFormat) {
      this.confirmationService.alert(this.currentLanguageSet.invalidFileExtensionSupportedFileFormats, 'error');
    }
    else {
      if ((this.fileList[0].size / 1000 / 1000) > this.maxFileSize) {
        console.log("File Size" + this.fileList[0].size / 1000 / 1000);
        this.confirmationService.alert(this.currentLanguageSet.fileSizeShouldNotExceed +" "+ this.maxFileSize + " " + this.currentLanguageSet.mb, 'error');
      }
      else if (this.file) {
      const myReader: FileReader = new FileReader();
      myReader.onloadend = this.onLoadFileCallback.bind(this)
      myReader.readAsDataURL(this.file);
    }
  }

}
else
this.confirmationService.alert(this.currentLanguageSet.invalidFileName, 'error');
   }
}
  onLoadFileCallback = (event) => {
    console.log(event, "myReaderevent");

    let fileContent = event.currentTarget.result;
    this.assignFileObject(this.fileIndex, fileContent);

  }
  /*
  *  check for valid file extensions
  */
  checkExtension(file) {
    var count = 0;
    console.log("FILE DETAILS", file);
    if (file) {
      var array_after_split = file.name.split(".");
      if(array_after_split.length == 2) {
      var file_extension = array_after_split[array_after_split.length - 1];
      for (let i = 0; i < this.valid_file_extensions.length; i++) {
        if (file_extension.toUpperCase() === this.valid_file_extensions[i].toUpperCase()) {
          count = count + 1;
        }
      }

      if (count > 0) {
        return true;
      } else {
        return false;
      }
    }
    else
    {
      return false;
    }
    }
    else {
      return true;
    }
  }

  fileObj: any;
  assignFileObject(fileIndex, fileContent) {
    let kmFileManager =
      {
        "fileName": (this.file != undefined) ? this.file.name : '',
        "fileExtension": (this.file != undefined) ? '.' + this.file.name.split('.')[1] : '',
        "providerServiceMapID": localStorage.getItem('providerServiceID'),
        "userID": localStorage.getItem('userID'),
        "fileContent": (fileContent != undefined) ? fileContent.split(',')[1] : '',
        "createdBy": localStorage.getItem('userName'),
        "vanID": JSON.parse(localStorage.getItem("serviceLineDetails")).vanID,
        "isUploaded": false
      }

    if (this.fileObj != undefined) {
      if (this.fileObj[fileIndex] != undefined) {
        if (this.fileObj[fileIndex].fileName == kmFileManager.fileName) {
          return true;
        } else {
          this.fileObj[fileIndex].push(kmFileManager);
        }
      } else {
        console.log("this.fileObj", this.fileObj);
        this.fileObj[fileIndex] = [];
        this.fileObj[fileIndex].push(kmFileManager);
      }
    } else {
      this.fileObj = {};
      this.fileObj[fileIndex] = [];
      this.fileObj[fileIndex].push(kmFileManager);
    }
    console.log(this.fileObj);
  }

  savedFileData: any;
  saveUploadDetails(procedureID) {
    if (this.fileObj != undefined) {
      if (this.savedFileData && this.savedFileData[procedureID] != undefined) {
        if (this.fileObj[procedureID].length > this.savedFileData[procedureID].length) {
          let result;
          result = this.fileObj[procedureID].filter((savedDataName) => {
            let arrresult = this.savedFileData[procedureID].filter((uniqueFileName) => {
              if (savedDataName.isUploaded == uniqueFileName.isUploaded) {
                return true
              } else {
                return false;
              }
            })
            if (arrresult.length == 0) {
              return true;
            } else {
              return false;
            }
          })
          console.log("result", result);
          if (result && result.length > 0) {
            this.saveFileData(procedureID, result);
          } else {
            this.confirmationService.alert(this.currentLanguageSet.alerts.info.selectNewFile, 'info');
          }
        } else {
          this.confirmationService.alert(this.currentLanguageSet.alerts.info.selectNewFile, 'info');
        }

      } else {
        if (this.fileObj && this.fileObj[procedureID] && this.fileObj[procedureID].length > 0)
          this.saveFileData(procedureID, this.fileObj[procedureID]);
        else
          this.confirmationService.alert(this.currentLanguageSet.alerts.info.selectNewFile, 'info');
      }
    } else {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.selectNewFile, 'info');
    }

  }

  /*
  *  Upload file 
  */
  saveFileData(procedureID, fileReq) {
    this.labService.saveFile(fileReq).subscribe((res) => {
      if (res.statusCode == 200) {
        console.log("file response", res.data);
        res.data.forEach((savedFileData) => {
          if (this.savedFileData != undefined) {
            if (this.savedFileData[procedureID] != undefined) {
              this.savedFileData[procedureID].push(savedFileData);
            } else {
              this.savedFileData[procedureID] = [];
              this.savedFileData[procedureID].push(savedFileData);
            }
          } else {
            this.savedFileData = {};
            this.savedFileData[procedureID] = [];
            this.savedFileData[procedureID].push(savedFileData);

          }
          console.log(this.savedFileData);
        })

        for (var key in this.fileObj) {
          if (key == procedureID) {
            this.fileObj[procedureID].map((file) => {
              file.isUploaded = true;
            })
          }
        }
         for (var key in this.savedFileData) {
          if (key == procedureID) {
            this.savedFileData[procedureID].map((file) => {
              file.isUploaded = true;
            })
          }
        }
        console.log('fileobj after upload', this.fileObj);
        this.confirmationService.alert(this.currentLanguageSet.alerts.info.successMsg, 'success');
      }

    }, (err) => {
      this.confirmationService.alert(err.errorMessage, 'err');
    })
  }

  validateSubmit(labCompleted) {
    if (this.fileObj) {
      if (this.savedFileData) {
        let objLength = 0;
        let fileObjLength = Object.keys(this.fileObj);
        let saveObjlength = Object.keys(this.savedFileData)
        if (fileObjLength.length == saveObjlength.length) {
          for (var fileObjKey in this.fileObj) {
            if (this.savedFileData[fileObjKey]) {
              if (this.savedFileData[fileObjKey].length == this.fileObj[fileObjKey].length) {
                objLength++;
                if (objLength == fileObjLength.length) {
                  this.submitDetails(labCompleted);
                }
              } else {
                this.confirmationService.alert(this.currentLanguageSet.alerts.info.uploadSelectedFile);
                break;
              }
            } else {
              this.confirmationService.alert(this.currentLanguageSet.alerts.info.uploadSelectedFile);
              break;
            }
          }

        } else {
          this.confirmationService.alert(this.currentLanguageSet.alerts.info.uploadSelectedFile);
        }
      } else {
        this.confirmationService.alert(this.currentLanguageSet.alerts.info.uploadSelectedFile);
      }
    } else {
      this.submitDetails(labCompleted);
    }

  }
  viewFileContent(fileIDs) {
    console.log(fileIDs);

    let dialogRef = this.dialog.open(ViewRadiologyUploadedFilesComponent, {
      width: "40%",
      data: {
        filesDetails: fileIDs
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
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
  openToViewFile(procedureID) {
    let dialogRef = this.dialog.open(ViewFileComponent, {
      width: "50%",
      data: {
        viewFileObj: this.fileObj,
        procedureID: procedureID
      }

    })
    dialogRef.afterClosed().subscribe((result) => {
      this.fileObj = result;

      if (this.fileObj[procedureID] && this.fileObj[procedureID].length == 0) {
        delete this.fileObj[procedureID];
      }
    })
  }

  //////////////////////////////////////////RADIOLOGY TESTS RELATED CODE ABOVE/////////////////////


  ///////////////////////////////////////////EXTERNAL TESTS RELATED CODE BELOW/////////////////////

  /**
  *
  * External Tests loading out of response
  */
  loadExternalTests(externaltests) {
    if (externaltests && externaltests.tests) {
      this.externalForm = this.utils.createExternalTestForm();
      this.externalForm.patchValue({
        tests: externaltests.tests
      })
    }
  }
  ///////////////////////////////////////////EXTERNAL TESTS RELATED CODE ABOVE/////////////////////

  /**
   * Loading Error COMMON
   */
  errorLoading(errorMessage) {
    this.confirmationService.alert(errorMessage);
    this.router.navigate(['/lab/worklist']);
  }
  ///////////////////////////////////////////ARCHIVE RELATED CODE BELOW/////////////////////
  radiologyFile = [];
  laboratoryData = [];
  filteredRadiologyData=[];
  filteredLaboratoryData=[];
  loadArchive(archive) {
    if (archive && archive.length) {
      this.archiveList = archive;

      this.filteredArchiveList = this.archiveList;
      this.archiveList.forEach((fileSplit) => {
        if (fileSplit.procedureType == "Radiology") {
          this.radiologyFile.push(fileSplit);
          this.filteredRadiologyData= this.radiologyFile;
        } else {
          this.laboratoryData.push(fileSplit);
          this.filteredLaboratoryData= this.laboratoryData;
        }
      })
    }

  }


  filterProceduresLab(searchTerm?: string) {
    if (!searchTerm) {
      this.laboratoryData = this.filteredLaboratoryData;
    }
    else {
      this.laboratoryData = [];
      this.filteredLaboratoryData.forEach((item) => {
        for (let key in item) {
          if (key == 'procedureName') {
        let value: string = '' + item[key];
        if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
          this.laboratoryData.push(item);
          // this.filteredLaboratoryData.push(item);
          break;
        }
        }
      }
      });
    }
  }

  filterProceduresRadiology(searchTerm?: string) {
    if (!searchTerm) {
      this.radiologyFile = this.filteredRadiologyData;
    }
    else {
      this.radiologyFile = [];
      this.filteredRadiologyData.forEach((item) => {
        for (let key in item) {
          if (key == 'procedureName') {
        let value: string = '' + item[key];
        if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
          this.radiologyFile.push(item);
       
          break;
        }
        }
      }
      });
    }
  }

  // filterProcedures(searchTerm?: string) {
  //   if (!searchTerm) {
  //     this.filteredArchiveList = this.archiveList;
  //   }
  //   else {
  //     this.filteredArchiveList = [];
  //     this.archiveList.forEach((item) => {
  //       // for (let key in item) {
  //       const value: string = '' + item.procedureName;
  //       if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
  //         this.filteredArchiveList.push(item);
  //         // break;
  //       }
  //       // }
  //     });
  //   }
  // }

  ///////////////////////////////////////////ARCHIVE RELATED CODE ABOVE/////////////////////

  //////////////FORM RESET CODE BELOW////////////////
  confirmFormReset() {
    if (this.technicianForm.dirty) {
      this.confirmationService.confirm('info', this.currentLanguageSet.alerts.info.resetDetails)
        .subscribe((res) => {
          if (res) { this.formReCall(); }
        })
    }
  }
  /**
   * ReInitialize the Form by calling API
   */
  formReCall() {
    this.technicianForm.reset();
    this.stripSelected=true;
    this.getTestRequirements();
    this.mergeForms();
    console.log(this.technicianForm, 'formere')

  }

  //////////////FORM RESET CODE ABOVE////////////////

  fileIDs = [];
  radiologyObj: any;
  radiologyTestArrayResults = [];

  /**
   * submitDetails for Submit // SUBMIT BUTTON ACTION CODE
   */
  submitDetails(labCompleted) {
    let option;
    // if (!this.technicianForm.dirty) {
    //   this.confirmationService.alert('Please enter details to save.', 'info');
    // } else {
    if (labCompleted) { option = this.currentLanguageSet.common.submit } else { option = 'save'; }
    this.confirmationService.confirm('info', this.currentLanguageSet.alerts.info.confirmSubmit + " " + `${option}` + " " + this.currentLanguageSet.alerts.info.labObservation).subscribe((res) => {
      if (res) {
        const techForm = this.dataLoad.technicalDataRestruct(Object.assign({}, this.technicianForm.value));
        // if (techForm && ((techForm.labTestResults && techForm.labTestResults.length) || (techForm.radiologyTestResults && techForm.radiologyTestResults.length))) {
        techForm['labCompleted'] = labCompleted;
        techForm['createdBy'] = localStorage.getItem('userName');
        techForm['doctorFlag'] = localStorage.getItem('doctorFlag');
        techForm['nurseFlag'] = localStorage.getItem('nurseFlag');
        techForm['beneficiaryRegID'] = localStorage.getItem('beneficiaryRegID');
        techForm['beneficiaryID'] = localStorage.getItem('beneficiaryID');
        techForm['benFlowID'] = localStorage.getItem('benFlowID');
        techForm['visitID'] = localStorage.getItem('visitID');
        techForm['visitCode'] = localStorage.getItem('visitCode');
        techForm['providerServiceMapID'] = localStorage.getItem('providerServiceID');

        if (localStorage.getItem('specialist_flag') == 'null') {
          techForm['specialist_flag'] = null;
        } else {
          techForm['specialist_flag'] = localStorage.getItem('specialist_flag')
        }

        let servicePointDetails = JSON.parse(localStorage.getItem("serviceLineDetails"));

        techForm['vanID'] = servicePointDetails.vanID;
        techForm['parkingPlaceID'] = servicePointDetails.parkingPlaceID;
        if (!techForm.labTestResults) {
          techForm['labTestResults'] = [];
        }
        if (!techForm.radiologyTestResults) {
          for (var key in this.savedFileData) {
            this.technicianForm.value.radiologyForm.forEach((procedureDetails) => {
              if (key == procedureDetails.procedureID) {
                this.savedFileData[key].forEach((fileId) => {
                  this.fileIDs.push(fileId.kmFileManagerID);
                })
                this.radiologyObj = {
                  "procedureID": procedureDetails.procedureID,
                  "prescriptionID": procedureDetails.prescriptionID,
                  "testComponentID": procedureDetails.compDetails.testComponentID,
                  "remarks": procedureDetails.compDetails.remarks,
                  "fileIDs": this.fileIDs
                }
                this.radiologyTestArrayResults.push(this.radiologyObj);
                this.fileIDs = [];
              }
            })

          }
          techForm['radiologyTestResults'] = this.radiologyTestArrayResults;
        }

        console.log('technicianForm', JSON.stringify(this.technicianForm.value, null, 4))
        console.log(JSON.stringify(techForm, null, 4), 'techForm');
        this.labService.saveLabWork(techForm)
          .subscribe(response => {
            console.log(response, 'responseddd')
            if (response && response.statusCode == 200) {
              this.confirmationService.alert(this.currentLanguageSet.alerts.info.datafillSuccessfully, 'success');
              localStorage.removeItem('doctorFlag');
              localStorage.removeItem('nurseFlag');
              localStorage.removeItem('visitID');
              localStorage.removeItem('beneficiaryRegID');
              localStorage.removeItem('beneficiaryID');
              localStorage.removeItem('visitCategory');
              localStorage.removeItem('benFlowID');
              localStorage.removeItem('visitCode');
              localStorage.removeItem('specialist_flag');
              localStorage.removeItem("specialistFlag");
              this.technicianForm.reset();
              this.router.navigate(['/lab/worklist']);
              console.log('data input done', res);
            } else {
              this.confirmationService.alert(response.errorMessage, 'error');
            }
          })
      } 
    }, (err) => { })
  }
  sideNavModeChange(sidenav) {
    let deviceHeight = window.screen.height;
    let deviceWidth = window.screen.width;

    if (deviceWidth < 700)
      sidenav.mode = "over";
    else
      sidenav.mode = "side";

    sidenav.toggle();
  }
  canDeactivate(): Observable<boolean> {
    console.log("deactivate called");
    if (this.technicianForm.dirty)
      return this.confirmationService.confirm(`info`, this.currentLanguageSet.alerts.info.navigateFurtherAlert, 'Yes', 'No');
    else
      return Observable.of(true);
  }

  openIOTModal(api: FormGroup, i: number) {
    this.stepExpand = i;
    console.log(this.stepExpand);
    console.log(api, "sfasdfasfgasdfasfa");
    let output = [];
    api.value.compListDetails.forEach(element => {
      output.push(element.componentCode);
    });
    console.log("calibration", api)
    let dialogRef = this.dialog.open(IotcomponentComponent, {
      "width": "600px",
      "height": "200px",
      "disableClose": true,
      data: {
        "startAPI": api.value.procedureStartAPI,
        "output": output,
        "procedure":api
      }

    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("he;;p", result, result['result']);
      if (result != null) {
        //result['result']
        let comarr = api.controls.compListDetails as FormArray;
        for (let i = 0; i < result.length; i++) {
          if (result[i] != undefined) {
            if (comarr.at(i).value.inputType == "TextBox") {
              comarr.at(i).patchValue({
                inputValue: result[i]
              });
            }
            else if (comarr.at(i).value.inputType == "RadioButton" || "DropDown") {
              comarr.at(i).patchValue({
                'compOptSelected': result[i]
              });
            }

          }

        }




      }
    });
  }
  onStripsCheckBox(event,procedureIndex,componentIndex) {
    const procedure = <FormGroup>this.labForm.at(procedureIndex);
    const component = (<FormArray>procedure.controls['compListDetails']).at(componentIndex);
    if (event.checked) {
      //this.loadTests(this.testData);
      procedure.controls['compListDetails'].setValidators([Validators.required]);
      this.stripSelected=false;
    }
    else{
      this.stripSelected=true;
    }
    component.patchValue({
      inputValue: ''
    });
  }
}
/*Validation for file name duplication and special characters check in file name*/
//  let uploadFileFlag = false;
//  let regex = /^[A-Za-z0-9 ]+$/;
//  if (this.file && this.file.name) {
//       let isValid = regex.test(this.file.name);
//       if (!isValid) {
//         this.confirmationService.alert("Filename contains special characters");
//         uploadFileFlag = true;
//       } else {
//         uploadFileFlag = false;
//       }
//     }
//     if (this.fileObj && this.fileObj[index]) {
//       for (let i = 0; i < this.fileObj[index].length; i++) {
//         if (this.fileObj[index][i].fileName == this.file.name) {
//           this.confirmationService.alert("File already exists");
//           uploadFileFlag = true;
//           break;
//         }
//       }
//     }