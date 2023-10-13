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


import { Component, OnInit, Input, Inject } from '@angular/core';

import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import * as moment from 'moment';
// import moment = require('moment');

@Component({
  selector: 'app-previous-details',
  templateUrl: './previous-details.component.html',
  styleUrls: ['./previous-details.component.css']
})
export class PreviousDetailsComponent implements OnInit {

  dataList = [];
  filteredDataList = [];
  columnList = [];
  current_language_set: any;
  constructor(
    public dialogRef: MdDialogRef<PreviousDetailsComponent>,
    @Inject(MD_DIALOG_DATA) public input: any,
    public httpServiceService: HttpServiceService) { }

  ngOnInit() {
    this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
    if (this.input.dataList.data instanceof Array){
      this.dataList = this.input.dataList.data;
      this.filteredDataList = this.dataList.slice();
    }
    if (this.input.dataList.columns instanceof Array)
      this.columnList = this.input.dataList.columns;

    if(this.input.title=="MMU Referral Details")
      {
  
        let newArray=[];
        let additionalArray;
        if(this.input.dataList.data.refrredToAdditionalServiceList)
        {
        additionalArray=this.input.dataList.data.refrredToAdditionalServiceList;
        }
        else{
          additionalArray=[];
        }

        for(let i=0;i<additionalArray.length;i++)
        {
          newArray[i]=additionalArray[i].serviceName;
        }
        let serviceData= newArray.join(",");
     
      let dataResp:any={
        "referralReason":this.input.dataList.data.referralReason,
        "referredToInstituteName": this.input.dataList.data.referredToInstituteName,
        "refrredToAdditionalServiceList":serviceData,
        "revisitDate": moment(this.input.dataList.data.revisitDate).format('DD-MM-YYYY HH:mm A '),
        "createdDate": moment(this.input.dataList.data.createdDate).format('DD-MM-YYYY HH:mm A ')
       
      }
     
      this.dataList=[];
      this.filteredDataList=[];
      this.dataList[0] =dataResp;
      this.filteredDataList = this.dataList.slice();
      }

      

      if(this.input.title=="MMU Investigation Details")
      {
  
      
        let laboratoryArray;
        if(this.input.dataList.data.laboratoryList)
        {
          laboratoryArray=this.input.dataList.data.laboratoryList;
        }
        else{
          laboratoryArray=[];
        }
        this.dataList=[];
        for(let i=0;i<laboratoryArray.length;i++)
        {
          this.dataList[i]=laboratoryArray[i];
        }
       
    
     
      
      this.filteredDataList = this.dataList.slice();
      }

      if(this.input.title=="MMU Prescription Details")
      {
  
     this.dataList=[];
      this.filteredDataList=[];
      this.dataList =this.loadDataPrescriptionList(this.input.dataList.data);
      this.filteredDataList = this.dataList.slice();
      }
  }

  loadDataPrescriptionList(data) {
    data.forEach(element => {
      element.formName = element.formName;
      element.drugName = element.drugName;
      element.drugStrength = element.drugStrength;
      element.dose = element.dose;
      element.route = element.route;
      element.frequency = element.frequency;
      element.duration = element.duration;
      element.unit = element.unit;
      element.instructions = element.instructions;
      element.qtyPrescribed =element.qtyPrescribed;
     element.createdDate = moment(element.createdDate).format('DD-MM-YYYY HH:mm A ');
    
    });
    return data;
  }

  filterPreviousData(searchTerm) {
    console.log("searchTerm", searchTerm);
    if (!searchTerm)
      this.filteredDataList = this.dataList;
    else {
      this.filteredDataList = [];
      this.dataList.forEach((item) => {
        for (let key in item) {
          let value: string = '' + item[key];
          if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
            this.filteredDataList.push(item); break;
          }
        }
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
