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


import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MdDialogRef } from '@angular/material';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['./quick-search.component.css']
})
export class QuickSearchComponent implements OnInit {
  currentLanguageSet: any;
  @ViewChild('newSearchForm') form: any;
  searchIdForm: FormGroup;
  public selectedOption = 'National Health ID';
  idMaxValue: any;
  idMinValue: any;
  patternID: any;
  idErrorText: string;
  ids= [
    { idType:"AMRIT ID", value:"AMRIT ID"},
    { idType: "Health ID Number", value: "Health ID Number"},
    { idType: "Higher Health Facility ID", value: "Higher Health Facility ID"},
    { idType: "National Health ID", value: "National Health ID"},
    { idType: "Phone Number", value: "Phone Number"},
    { idType: "State", value: "State"},
    { idType: "Village", value: "Village"},
    { idType: "District", value: "District"}
  ];
  searchValue:any;
  abhaSuffix = environment.abhaExtension;
  
  constructor(public httpServiceService: HttpServiceService, 
    private formBuilder: FormBuilder,
    public mdDialogRef: MdDialogRef<QuickSearchComponent>) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.searchIdForm = this.createSearchIdForm();
    this.searchIdForm.controls['searchId'].setValue('National Health ID');
    this.validateID(this.selectedOption);
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }

  createSearchIdForm() {
    return this.formBuilder.group({
      searchId: null, 
      ID: null
    })
  }

  
  dataObj:any;
  getQuickSearchResult(formValues){
    this.dataObj = {};
    if(formValues.searchId === "National Health ID") {
      this.dataObj ={
        amritId: null,
        beneficiaryID: null,
        beneficiaryRegID: null,
        externalId: null,
        healthId: formValues.ID + this.abhaSuffix,
        healthIdNumber: null,
        phoneNo: null,
          state: null,
          district: null,
          village: null
      }
    } else if(formValues.searchId === "AMRIT ID") {
      this.dataObj ={
        amritId: formValues.ID,
        beneficiaryID: null,
        beneficiaryRegID: null,
        externalId: null,
        healthId: null,
        healthIdNumber: null,
        phoneNo: null,
          state: null,
          district: null,
          village: null
      }
    } else if(formValues.searchId === "Higher Health Facility ID") {
      this.dataObj ={
        amritId: null,
        beneficiaryID: null,
        beneficiaryRegID: null,
        externalId: formValues.ID,
        healthId: null,
        healthIdNumber: null,
        phoneNo: null,
          state: null,
          district: null,
          village: null
      }
    } else if(formValues.searchId === "Health ID Number") {
      this.dataObj ={
        amritId: null,
        beneficiaryID: null,
        beneficiaryRegID: null,
        externalId: null,
        healthId: null,
        healthIdNumber: formValues.ID,
        phoneNo: null,
          state: null,
          district: null,
          village: null
      }
    }
    else if(formValues.searchId === "Phone Number") {
      this.dataObj ={
        amritId: null,
        beneficiaryID: null,
        beneficiaryRegID: null,
        externalId: null,
        healthId: null,
        healthIdNumber: null,
        phoneNo:formValues.ID,
          state: null,
          district: null,
          village: null,
          pageNo: 0
      }
    }
      else if(formValues.searchId === "State") {
        this.dataObj ={
          amritId: null,
          beneficiaryID: null,
          beneficiaryRegID: null,
          externalId: null,
          healthId: null,
          healthIdNumber: null,
          phoneNo: null,
          state: formValues.ID,
          district: null,
          village: null
        }
    }
    else if(formValues.searchId === "District") {
      this.dataObj ={
        amritId: null,
        beneficiaryID: null,
        beneficiaryRegID: null,
        externalId: null,
        healthId: null,
        healthIdNumber: null,
        phoneNo: null,
        state: null,
        district: formValues.ID,
        village: null
      }
    }
      else if(formValues.searchId === "Village") {
        this.dataObj ={
          amritId: null,
          beneficiaryID: null,
          beneficiaryRegID: null,
          externalId: null,
          healthId: null,
          healthIdNumber: null,
          phoneNo: null,
          state: null,
          district: null,
          village: formValues.ID
        }
  }
    this.mdDialogRef.close(this.dataObj);
  }


  validateID(idType: any) {
   
    this.searchIdForm.controls['ID'].setValue(null);
    this.validateIDNumber(idType);
  }


  validateIDNumber(idType: any) {

    switch (idType) {
      case 'National Health ID': {
        this.idMinValue = "4";
        this.idMaxValue = "32";
        this.patternID = /^[A-Za-z0-9.]*$/;
        this.idErrorText = "Enter Valid Health ID";
        this.searchValue="Enter Health ID";
        break;
      }
      case 'Higher Health Facility ID': {
        this.idMinValue = "4";
        this.idMaxValue = "17";
        this.patternID = /^[A-Za-z0-9]*$/;
        this.searchValue="Enter ID";
        this.idErrorText = "Enter Valid Higher Health Facility ID"
        break;
      }
      case 'AMRIT ID': {
        this.idMinValue = "8";
        this.idMaxValue = "12";
        this.patternID = /^[0-9]*$/;
        this.idErrorText = "Enter Valid Amrit ID";
        this.searchValue="Enter AMRIT ID";
        break;
      }
      case 'Health ID Number': {
        this.idMinValue = "10";
        this.idMaxValue = "17";
        this.patternID = /^[0-9-]*$/;
        this.idErrorText = "Enter Valid Health ID Number";
        this.searchValue="Enter Health ID Number";
        break;
      }
      case 'Phone Number': {
        this.idMinValue = "10";
        this.idMaxValue = "12";
        this.patternID = /^[0-9]*$/;
        this.idErrorText = "Enter Valid Phone Number";
        this.searchValue="Enter phone no";
        break;
      }
      case 'State': {
        this.idMinValue = "1";
        this.idMaxValue = "120";
        this.patternID = /^[A-Za-z]*$/;
        this.idErrorText = "Enter Valid State";
        this.searchValue="Enter state";
        break;
      }
      case 'District': {
        this.idMinValue = "1";
        this.idMaxValue = "120";
        this.patternID = /^[A-Za-z]*$/;
        this.idErrorText = "Enter Valid District";
        this.searchValue="Enter district";
        break;
      }
      case 'Village': {
        this.idMinValue = "1";
        this.idMaxValue = "120";
        this.patternID = /^[A-Za-z]*$/;
        this.idErrorText = "Enter Valid Village";
        this.searchValue="Enter village";
        break;
      }
    //  default:
    //   this.idMinValue = "4";
    //     this.idMaxValue = "32";
    //     this.patternID = /^([A-Za-z]+[0-9]|[0-9]+[A-Za-z])[A-Za-z0-9]*$/;
    //     this.idErrorText = "Enter Valid ID Number";
    //     break;
    }
  }
}
