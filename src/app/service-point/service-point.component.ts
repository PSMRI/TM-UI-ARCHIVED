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


import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService } from '../app-modules/core/services/confirmation.service';
import { ServicePointService } from './service-point.service';
import { AppHeaderComponent } from '../app-modules/core/components/app-header/app-header.component'
import { HttpServiceService } from '../../app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

import { RegistrarService } from 'app/app-modules/registrar/shared/services/registrar.service';
@Component({
  selector: 'app-service-point',
  templateUrl: './service-point.component.html',
  styleUrls: ['./service-point.component.css']

})

export class ServicePointComponent implements OnInit {




  @ViewChild('f') form: any;

  current_language_set :any;

  designation: any;

  vanServicepointDetails: any;

  servicePointsList = [];

  vansList = [];




  showVan = false;




  userId: string;

  serviceProviderId: string;

 

  servicePointName: string;

  servicePointID: string;

  sessionID: string;

  vanID: string;

  isDisabled = true;

  stateID: any;

  statesList: any =[];

  districtID: any;

  blockID: any;

  districtBranchID: any;

  districtList: any=[];

  subDistrictList:any=[];

  villageList: any =[];

  stateName : string;




  constructor(

    private router: Router,

    private route: ActivatedRoute,

    private servicePointService: ServicePointService,

    private confirmationService: ConfirmationService,

    public httpServiceService: HttpServiceService,

    private registrarService: RegistrarService

    ) { }




  ngOnInit() {

    this.assignSelectedLanguage();

    this.serviceProviderId = localStorage.getItem('providerServiceID');

    this.userId = localStorage.getItem('userID');

    this.getServicePoint();

    // console.log( "language",this.appLanguage.appCurrentLanguge.value);

    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);

    console.log("here at three",this.current_language_set);

   

    //this.currentLanguage = this.language.appCurrentLanguge;




  }

  // @Input() currentLanguage: any;




  ngDoCheck() {

    this.assignSelectedLanguage();

  }

  assignSelectedLanguage() {

    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);

    getLanguageJson.setLanguage();

    this.current_language_set = getLanguageJson.currentLanguageObject;

    }

 

  ngOnChanges() {

   

    // console.log("Chnage works",this.appLanguage.appCurrentLanguge.value);

   

    // if(this.currentLanguage){

    //   this.currentLanguage = this.language.appCurrentLanguge;

    //   console.log("service point ", this.currentLanguage);

    // }else{

    //   console.log("error here at service point");

    // }

   

  }

  resetLocalStorage() {

    localStorage.removeItem('sessionID');

    localStorage.removeItem('serviceLineDetails');

    localStorage.removeItem('vanType');

    localStorage.removeItem('location');

    localStorage.removeItem('servicePointID');

    localStorage.removeItem('servicePointName');

    sessionStorage.removeItem('facilityID');

  }




  getServicePoint() {

    this.route.data.subscribe(res => {

      if (res.servicePoints.statusCode == 200 && res.servicePoints.data != null) {

        let data = res.servicePoints.data;

        if (data.UserVanSpDetails) {

          this.vanServicepointDetails = data.UserVanSpDetails;

          this.filterVanList(this.vanServicepointDetails)

        }

      } else if (res.servicePoints.statusCode == 5002) {

        this.confirmationService.alert(res.servicePoints.errorMessage, 'error');

      } else {

        this.confirmationService.alert(res.servicePoints.errorMessage, 'error');

        this.router.navigate(['/service']);

      }

    }, (err) => {

      this.confirmationService.alert(err, 'error');

    });

  }




  filterVanList(vanServicepointDetails) {

    console.log('vanServicepointDetails', vanServicepointDetails);

    this.vansList = vanServicepointDetails.filter((van) => {

      if (van.vanSession == 3) {

        return van;

      }

    })

    this.vansList = vanServicepointDetails.filter(

      (thing, i, arr) => arr.findIndex(t => t.vanID === thing.vanID) === i

      );  

  }

  getServiceLineDetails() {

    let serviceLineDetails = this.vansList.filter((van) => {

      return this.vanID == van.vanID

    })[0];

    localStorage.setItem('serviceLineDetails', JSON.stringify(serviceLineDetails));

    if (serviceLineDetails.facilityID)

      sessionStorage.setItem('facilityID', serviceLineDetails.facilityID);

    if (serviceLineDetails.servicePointID)

      localStorage.setItem('servicePointID', serviceLineDetails.servicePointID);

    if (serviceLineDetails.servicePointName)

      localStorage.setItem('servicePointName', serviceLineDetails.servicePointName);

    if (serviceLineDetails.vanSession)

      localStorage.setItem('sessionID', serviceLineDetails.vanSession);

      this.getDemographics();

  }




  routeToDesignation(designation) {

    switch (designation) {

      case "Registrar":

        this.router.navigate(['/registrar/registration']);

        break;

      case "Nurse":

        this.router.navigate(['/common/nurse-worklist']);

        break;

      case "Doctor":

        this.router.navigate(['/common/doctor-worklist']);

        break;

      case "Lab Technician":

        this.router.navigate(['/lab']);

        break;

      case "Pharmacist":

        this.router.navigate(['/pharmacist']);

        break;

      case "Radiologist":

        this.router.navigate(['/common/radiologist-worklist']);

        break;

      case "Oncologist":

        this.router.navigate(['/common/oncologist-worklist']);

        break;

      default:

    }

  }




  getDemographics() {

    this.servicePointService.getMMUDemographics()

      .subscribe((res) => {

        if (res && res.statusCode == 200) {

          this.saveDemographicsToStorage(res.data);

        } else {

          this.locationGathetingIssues();

        }

      });




  }




  saveDemographicsToStorage(data) {

    if (data) {

      if (data.stateMaster && data.stateMaster.length >= 1) {

        localStorage.setItem('location', JSON.stringify(data));

        // this.goToWorkList();

        this.statesList = data.stateMaster;

        this.stateID = data.otherLoc.stateID;

        this.fetchDistrictsOnStateSelection(this.stateID);

        this.districtID = null;

        this.blockID = null;

        this.districtBranchID = null;

      } else {

        this.locationGathetingIssues();

      }

    } else {

      this.locationGathetingIssues();

    }

  }

  fetchDistrictsOnStateSelection(stateID) {

    console.log("stateID", stateID); // Add this log statement    

    this.registrarService

      .getDistrictList(this.stateID)

      .subscribe((res) => {

        if (res && res.statusCode === 200) {

          this.districtList = res.data;

          this.blockID = null;

          this.districtBranchID = null;

        } else {

          this.confirmationService.alert(

            this.current_language_set.alerts.info.IssuesInFetchingDemographics,

            "error"

          );

        }

      });

  }

  fetchSubDistrictsOnDistrictSelection(districtID) {

    this.registrarService

    .getSubDistrictList(this.districtID.districtID)

    .subscribe((res) => {

      if (res && res.statusCode === 200) {

        this.subDistrictList = res.data;

        this.districtBranchID = null;

      } else {

        this.confirmationService.alert(

          this.current_language_set.alerts.info.IssuesInFetchingDemographics,

          "error"

        );

      }

    });

  }

  onSubDistrictChange(blockID) {

    this.registrarService

      .getVillageList(this.blockID.blockID)

      .subscribe((res) => {

        if (res && res.statusCode === 200) {

          this.villageList = res.data;

          this.districtBranchID = null;

        } else {

          this.confirmationService.alert(

            this.current_language_set.alerts.info

              .IssuesInFetchingLocationDetails,

            "error"

          );

        }

      });

  }

  saveLocationDataToStorage(){

    var locationData = {

      stateID: this.stateID,

      stateName : this.stateName,

      districtID: this.districtID.districtID,

      districtName: this.districtID.districtName,

      blockName: this.blockID.blockName,

      blockID: this.blockID.blockID,

      subDistrictID: this.districtBranchID.districtBranchID,

      villageName: this.districtBranchID.villageName

    };

   

    // Convert the object into a JSON string

    var locationDataJSON = JSON.stringify(locationData);

   

    // Store the JSON string in localStorage

    localStorage.setItem("locationData", locationDataJSON);

    this.goToWorkList();

   

      }

   

  goToWorkList() {

    this.designation = localStorage.getItem('designation');

    this.routeToDesignation(this.designation);

  }




  locationGathetingIssues() {

    this.confirmationService.alert(this.current_language_set.coreComponents.issuesInGettingLocationTryToReLogin, 'error');

  }




}


