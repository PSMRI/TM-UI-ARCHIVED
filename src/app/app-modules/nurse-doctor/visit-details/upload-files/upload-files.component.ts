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


import { Component, OnInit, EventEmitter, Input, OnChanges, Output, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { NurseService } from '../../shared/services/nurse.service';
import { BeneficiaryDetailsService } from '../../../core/services/beneficiary-details.service';
import { LabService } from '../../../lab/shared/services';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { ViewRadiologyUploadedFilesComponent } from "../../../lab/view-radiology-uploaded-files/view-radiology-uploaded-files.component";
import { DoctorService } from '../../shared/services';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'patient-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css']
})
export class UploadFilesComponent implements OnInit, DoCheck {
  fileList: FileList;
  file: any;
  fileContent: any;
  valid_file_extensions = ['msg', 'pdf', 'png', 'jpeg', 'jpg', 'doc', 'docx', 'xlsx', 'xls', 'csv', 'txt'];
  // invalid_file_extensions_flag: boolean = false;
  disableFileSelection: Boolean = false;
  enableForNCDScreening: Boolean = false;
  maxFileSize = 5;

  @Input('patientFileUploadDetailsForm')
  patientFileUploadDetailsForm: FormGroup

  @Input('mode')
  mode: String;

  @Input('enableFileSelection')
  enableFileSelection: Boolean;
  currentLanguageSet: any;

  constructor(
    private nurseService: NurseService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private labService: LabService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private dialog: MdDialog,
    public httpServiceService: HttpServiceService,
    private doctorService: DoctorService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  ngOnChanges() {
    if (this.mode == "view" && !this.enableFileSelection) {
      this.disableFileSelection = true;
    } else if (this.mode == "view" && this.enableFileSelection) {
      this.enableForNCDScreening = true;
    }
   else if(parseInt(localStorage.getItem("specialistFlag")) == 100)
    {
      this.enableForNCDScreening = true;
    }
    else {
      this.disableFileSelection = false;
    }
  }
  uploadFile(event) {
    this.fileList = event.target.files;
    if(this.fileList.length > 0) {
    this.file = event.target.files[0];

    let fileNameExtension = this.file.name.split(".");
    let fileName = fileNameExtension[0];

  if(fileName !== undefined && fileName !== null && fileName !== "")
   {
    var validFormat = this.checkExtension(this.file);
    if (!validFormat) {
      // this.invalid_file_extensions_flag = true;
      this.confirmationService.alert(this.currentLanguageSet.invalidFileExtensionSupportedFileFormats, 'error');
    }
    else {
      if ((this.fileList[0].size / 1000 / 1000) > this.maxFileSize) {
        console.log("File Size" + this.fileList[0].size / 1000 / 1000);
        this.confirmationService.alert(this.currentLanguageSet.fileSizeShouldNotExceed +" "+ this.maxFileSize + " " + this.currentLanguageSet.mb, 'error');
      }
      else if (this.file) {
        console.log("File Size" + this.fileList[0].size / 1000 / 1000);
      const myReader: FileReader = new FileReader();
      myReader.onloadend = this.onLoadFileCallback.bind(this)
      myReader.readAsDataURL(this.file);
    }

    // if (this.fileList.length == 0) {
    //   this.confirmationService.alert("Please choose a file to upload", 'info');
    // }
    // else if (this.fileList.length > 0 && this.fileList[0].size / 1000 / 1000 <= this.maxFileSize) {
    //   console.log(this.fileList[0].size / 1000 / 1000);
    //   this.confirmationService.alert("File size should not exceed" + this.maxFileSize + "MB", 'error');
    // }
    // else if (this.fileList.length > 0 && this.fileList[0].size / 1000 / 1000 > this.maxFileSize) {
    //   console.log(this.fileList[0].size / 1000 / 1000);
    //   this.confirmationService.alert("File size should not exceed" + this.maxFileSize + "MB", 'error');
    // }
  }

  }
  else
  this.confirmationService.alert(this.currentLanguageSet.invalidFileName, 'error');
  }
  }
  onLoadFileCallback = (event) => {
    console.log(event, "myReaderevent");

    let fileContent = event.currentTarget.result;
    this.assignFileObject(fileContent);

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
  fileObj = [];
  assignFileObject(fileContent) {
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
    this.fileObj.push(kmFileManager);
    this.nurseService.fileData = this.fileObj;
    console.log("kmFileManager", this.fileObj);

  }
  /*
*  Remove file 
*/
  remove(file) {
    const index = this.fileObj.indexOf(file);

    if (index >= 0) {
      this.fileObj.splice(index, 1);
    }
    console.log(this.fileObj);
    this.nurseService.fileData = null;
  }
  savedFileData = [];
  fileIDs = [];
  get uploadFiles() {
    return this.patientFileUploadDetailsForm.controls['fileIDs'].value;
  }
  saveUploadDetails(fileObj) {
    this.labService.saveFile(fileObj).subscribe((res) => {
      if (res.statusCode == 200) {
        res.data.forEach((file) => {
          this.savedFileData.push(file);
          this.fileIDs.push(file.kmFileManagerID);
        })
        this.fileObj.map((file) => {
          file.isUploaded = true;
        })
        this.savedFileData.map((file) => {
          file.isUploaded = true;
        })
      }
    }, (err) => {
      this.confirmationService.alert(err.errorMessage, 'err');
    })
    console.log("fileIDs", this.fileIDs);
    this.patientFileUploadDetailsForm.patchValue({
      fileIDs: this.fileIDs
    })
    this.nurseService.fileData = null;
  }
  checkForDuplicateUpload() {
    if (this.fileObj != undefined) {
      if (this.savedFileData != undefined) {
        if (this.fileObj.length > this.savedFileData.length) {
          let result = this.fileObj.filter((uniqueFileName) => {
            let arrNames = this.savedFileData.filter((savedFileName) => {
              if (uniqueFileName.isUploaded == savedFileName.isUploaded) {
                return true;
              } else {
                return false;
              }
            })
            if (arrNames.length == 0) {
              return true;
            } else {
              return false;
            }
          })
          console.log("result", result);
          if (result && result.length > 0) {
            this.saveUploadDetails(result);
          } else {
            this.confirmationService.alert(this.currentLanguageSet.alerts.info.selectNewFile, "info");
          }
        } else {
          this.confirmationService.alert(this.currentLanguageSet.alerts.info.selectNewFile, 'info');
        }
      } else {
        this.saveUploadDetails(this.fileObj);
      }

    } else {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.selectNewFile, "info");
    }
  }
  viewNurseSelectedFiles() {
    console.log('this.doc', this.doctorService.fileIDs)
    let file_Ids = this.doctorService.fileIDs;
    let ViewTestReport = this.dialog.open(ViewRadiologyUploadedFilesComponent,
      {
        width: "40%",
        data: {
          filesDetails: file_Ids,
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
  triggerLog(event)
  {
    console.log(event.clientX);
    //this.key=event.clientX;
    if(event.clientX!=0)
    {
      var x=document.getElementById('fileUpload');
      x.click();
    }
  }

}
/*Validation to check special characters in file name*/
// let uploadFileFlag = false;
// let regex = /^[A-Za-z0-9 ]+$/;
// if (this.file && this.file.name) {
//   let isValid = regex.test(this.file.name);
//   if (!isValid) {
//     this.confirmationService.alert("Filename contains special characters");
//     uploadFileFlag = true;
//   } else {
//     uploadFileFlag = false;
//   }
// }