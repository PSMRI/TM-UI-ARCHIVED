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


import { Observable } from "rxjs/Observable";
import { ConfirmationService } from "./../../../core/services/confirmation.service";
import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { RegistrarService } from "../../shared/services/registrar.service";
import {
  FormGroup,
  FormControl,
  FormArray,
  FormBuilder,
  Validators,
} from "@angular/forms";
import {
  Params,
  RouterModule,
  Routes,
  Router,
  ActivatedRoute,
} from "@angular/router";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";
import { Subscription } from "rxjs";
import { event } from 'jquery';

@Component({
  selector: "register-demographic-details",
  templateUrl: "./register-demographic-details.component.html",
  styleUrls: ["./register-demographic-details.component.css"],
})
export class RegisterDemographicDetailsComponent implements OnInit, OnDestroy {
  [x: string]: any;
  masterData: any;
  masterDataSubscription: any;

  revisitData: any;
  revisitDataSubscription: any;

  @Input("demographicDetailsForm")
  demographicDetailsForm: FormGroup;

  @Input("patientRevisit")
  patientRevisit: Boolean;

  demographicsEditEnabled: Boolean = false;
  demographicsEditText: String;

  demographicsMaster: any;
  statesList: any;
  districtList: any;
  subDistrictList: any;
  villageList: any;
  zonesList: any;
  parkingPlaceList: any;
  servicePointList: any;

  disableState: Boolean = true;
  disableDistrict: Boolean = true;
  disableSubDistrict: Boolean = false;
  current_language_set: any;
  personalDataOnHealthIDSubscription: Subscription;
  abhaSearchResponse: any;
  constructor(
    private registrarService: RegistrarService,
    private confirmationService: ConfirmationService,
    public httpServiceService: HttpServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.locationData = JSON.parse(localStorage.getItem('locationData'));
    this.abhaSearchResponse = null;
    this.assignSelectedLanguage();
    this.loadMasterDataObservable();

    if (this.patientRevisit) {
      this.configMasterForDemographics();
    } else if (!this.patientRevisit) {
      this.loadLocationFromStorage();
    }
    this.personalDataOnHealthIDSubscription =
      this.registrarService.dialogResult$.subscribe((abhaResponse) => {
        if (abhaResponse != null && abhaResponse != undefined) {
          this.abhaSearchResponse = abhaResponse;
          this.setPersonalDetailsFromABHA(abhaResponse);
        }
      });
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    if (
      this.current_language_set !== undefined &&
      this.current_language_set !== null
    ) {
      this.demographicsEditText =
        this.current_language_set.bendetails.editLocation;
    }
  }

  ngOnDestroy() {
    if (this.masterDataSubscription) {
      this.masterDataSubscription.unsubscribe();
    }
    if (this.patientRevisit && this.revisitDataSubscription) {
      this.revisitDataSubscription.unsubscribe();
    }
    if (this.personalDataOnHealthIDSubscription) {
      this.personalDataOnHealthIDSubscription.unsubscribe();
    }
  }

  /**
   * Load Basic Master Data Observable
   */
  loadMasterDataObservable() {
    this.masterDataSubscription =
      this.registrarService.registrationMasterDetails$.subscribe((res) => {
        if (res != null) {
          this.masterData = res;
        }
      });
  }

  /**
   * If Benefeciary Demographic data is supposed to be set default
   */
  setDemographicDefaults() {
    if (this.patientRevisit) {
      this.disableState = true;
      this.disableDistrict = true;
      this.disableSubDistrict = true;
      this.loadEditDefaults();
    } else if (!this.patientRevisit) {
      this.disableState = true;
      this.disableDistrict = true;
      this.loadLocationFromStorage();
    }
  }

  loadEditDefaults() {
    this.configState();
    this.configDistrict();
    this.configSubDistrict();
    this.configVillage();
    this.configZone();
    this.configParkingPlace();
    this.configServicePoint();
  }

  /***********************************LOAD BEN EDIT DEMOGRAPHICS STARTS********************************/

  /**
   * Load Master and Current Demographic Details for an Old Beneficiary
   * FOR BENEFICIARY EDIT FROM BENEFICIARY DATA
   */
  configMasterForDemographics() {
    this.revisitDataSubscription =
      this.registrarService.beneficiaryEditDetails$.subscribe((res) => {
        if (res && res.beneficiaryID) {
          this.revisitData = Object.assign({}, res);
          if (this.patientRevisit) {
            this.setDemographicDefaults();
            this.loadBenEditDetails();
          }
        }
      });
  }

  /**
   * LoadBenEditDetails
   */
  loadBenEditDetails() {
    this.demographicDetailsForm.patchValue({
      habitation:
        (this.revisitData.i_bendemographics &&
          this.revisitData.i_bendemographics.habitation) ||
        null,
      addressLine1:
        (this.revisitData.i_bendemographics &&
          this.revisitData.i_bendemographics.addressLine1) ||
        null,
      addressLine2:
        (this.revisitData.i_bendemographics &&
          this.revisitData.i_bendemographics.addressLine2) ||
        null,
      addressLine3:
        (this.revisitData.i_bendemographics &&
          this.revisitData.i_bendemographics.addressLine3) ||
        null,
      pincode:
        (this.revisitData.i_bendemographics &&
          this.revisitData.i_bendemographics.pinCode) ||
        null,
    });
  }

  /**
   * Config States  for Ben Edit
   */
  configState() {
    this.demographicsMaster = Object.assign(
      {},
      JSON.parse(localStorage.getItem("location")),
      { servicePointID: localStorage.getItem("servicePointID") },
      { servicePointName: localStorage.getItem("servicePointName") }
    );
    if (
      this.demographicsMaster.stateMaster &&
      this.demographicsMaster.stateMaster.length >= 1
    ) {
      this.statesList = this.demographicsMaster.stateMaster;
    }
    this.demographicDetailsForm.patchValue({
      stateID:
        (this.revisitData.i_bendemographics &&
          this.revisitData.i_bendemographics.m_state &&
          this.revisitData.i_bendemographics.m_state.stateID) ||
        null,
      stateName:
        (this.revisitData.i_bendemographics &&
          this.revisitData.i_bendemographics.m_state &&
          this.revisitData.i_bendemographics.m_state.stateName) ||
        null,
      stateCode:
        (this.revisitData.i_bendemographics &&
          this.revisitData.i_bendemographics.m_state &&
          this.revisitData.i_bendemographics.m_state.stateCode) ||
        null,
    });
  }
  /**
   * Config Districts  for Ben Edit
   */
  configDistrict() {
    this.districtList = [
      {
        districtID:
          (this.revisitData.i_bendemographics &&
            this.revisitData.i_bendemographics.m_district &&
            this.revisitData.i_bendemographics.m_district.districtID) ||
          null,
        districtName:
          (this.revisitData.i_bendemographics &&
            this.revisitData.i_bendemographics.m_district &&
            this.revisitData.i_bendemographics.m_district.districtName) ||
          null,
      },
    ];
    this.demographicDetailsForm.patchValue({
      districtID:
        (this.revisitData.i_bendemographics &&
          this.revisitData.i_bendemographics.m_district &&
          this.revisitData.i_bendemographics.m_district.districtID) ||
        null,
      districtName:
        (this.revisitData.i_bendemographics &&
          this.revisitData.i_bendemographics.m_district &&
          this.revisitData.i_bendemographics.m_district.districtName) ||
        null,
    });
  }
  /**
   * Config Sub Districts  for Ben Edit
   */
  configSubDistrict() {
    this.subDistrictList = [
      {
        blockID:
          (this.revisitData.i_bendemographics &&
            this.revisitData.i_bendemographics.m_districtblock &&
            this.revisitData.i_bendemographics.m_districtblock.blockID) ||
          null ||
          null,
        blockName:
          (this.revisitData.i_bendemographics &&
            this.revisitData.i_bendemographics.m_districtblock &&
            this.revisitData.i_bendemographics.m_districtblock.blockName) ||
          null,
      },
    ];
    this.demographicDetailsForm.patchValue({
      blockID:
        (this.revisitData.i_bendemographics &&
          this.revisitData.i_bendemographics.m_districtblock &&
          this.revisitData.i_bendemographics.m_districtblock.blockID) ||
        null,
      blockName:
        (this.revisitData.i_bendemographics &&
          this.revisitData.i_bendemographics.m_districtblock &&
          this.revisitData.i_bendemographics.m_districtblock.blockName) ||
        null,
    });
  }
  /**
   * Config Villages for Ben Edit
   */
  configVillage() {
    this.villageList = [
      {
        districtBranchID:
          (this.revisitData.i_bendemographics &&
            this.revisitData.i_bendemographics.m_districtbranchmapping &&
            this.revisitData.i_bendemographics.m_districtbranchmapping
              .districtBranchID) ||
          null,
        villageName:
          (this.revisitData.i_bendemographics &&
            this.revisitData.i_bendemographics.m_districtbranchmapping &&
            this.revisitData.i_bendemographics.m_districtbranchmapping
              .villageName) ||
          null,
      },
    ];
    this.demographicDetailsForm.patchValue({
      villageID:
        (this.revisitData.i_bendemographics &&
          this.revisitData.i_bendemographics.m_districtbranchmapping &&
          this.revisitData.i_bendemographics.m_districtbranchmapping
            .districtBranchID) ||
        null,
      villageName:
        (this.revisitData.i_bendemographics &&
          this.revisitData.i_bendemographics.m_districtbranchmapping &&
          this.revisitData.i_bendemographics.m_districtbranchmapping
            .villageName) ||
        null,
    });
  }
  /**
   * Config Zones  for Ben Edit
   */
  configZone() {
    this.zonesList = [
      {
        zoneID:
          (this.revisitData.i_bendemographics &&
            this.revisitData.i_bendemographics.zoneID) ||
          null,
        zoneName:
          (this.revisitData.i_bendemographics &&
            this.revisitData.i_bendemographics.zoneName) ||
          null,
      },
    ];
    console.log(this.demographicsMaster.otherLoc, "zoneLocs------mm-------");
    this.demographicDetailsForm.patchValue({
      zoneID:
        (this.revisitData.i_bendemographics &&
          this.revisitData.i_bendemographics.zoneID) ||
        null,
      zoneName:
        (this.revisitData.i_bendemographics &&
          this.revisitData.i_bendemographics.zoneName) ||
        null,
    });
  }
  /**
   * Config Parking Place  for Ben Edit
   */
  configParkingPlace() {
    this.parkingPlaceList = [
      {
        parkingPlaceID:
          (this.revisitData.i_bendemographics &&
            this.revisitData.i_bendemographics.parkingPlaceID) ||
          null,
        parkingPlaceName:
          (this.revisitData.i_bendemographics &&
            this.revisitData.i_bendemographics.parkingPlaceName) ||
          null,
      },
    ];
    this.demographicDetailsForm.patchValue({
      parkingPlace:
        (this.revisitData.i_bendemographics &&
          this.revisitData.i_bendemographics.parkingPlaceID) ||
        null,
      parkingPlaceName:
        (this.revisitData.i_bendemographics &&
          this.revisitData.i_bendemographics.parkingPlaceName) ||
        null,
    });
  }
  /**
   * Config Service Point  for Ben Edit
   */
  configServicePoint() {
    this.servicePointList = [
      {
        servicePointID:
          (this.revisitData.i_bendemographics &&
            this.revisitData.i_bendemographics.servicePointID) ||
          null,
        servicePointName:
          (this.revisitData.i_bendemographics &&
            this.revisitData.i_bendemographics.servicePointName) ||
          null,
      },
    ];
    this.demographicDetailsForm.patchValue({
      servicePoint:
        (this.revisitData.i_bendemographics &&
          this.revisitData.i_bendemographics.servicePointID) ||
        null,
      servicePointName:
        (this.revisitData.i_bendemographics &&
          this.revisitData.i_bendemographics.servicePointName) ||
        null,
    });
  }
  /***********************************LOAD BEN EDIT DEMOGRAPHICS ENDS********************************/

  /***********************************LOAD NEW BEN DEMOGRAPHICS STARTS********************************/
  /**
   * Load Master and Current Demographic Details for an NEW Beneficiary
   * FOR BENEFICIARY NEW FROM LOCAL STORAGE
   */

  /**
   * Check and save location Data from Storage
   */
  loadLocationFromStorage() {
    let location = JSON.parse(localStorage.getItem("location"));
    this.demographicsMaster = Object.assign({}, location, {
      servicePointID: localStorage.getItem("servicePointID"),
      servicePointName: localStorage.getItem("servicePointName"),
    });

    console.log(this.demographicsMaster, "demographics master");

    if (
      this.demographicsMaster.otherLoc &&
      this.demographicsMaster.stateMaster &&
      this.demographicsMaster.stateMaster.length >= 1 &&
      this.demographicsMaster.servicePointID &&
      this.demographicsMaster.servicePointName
    ) {
      this.loadLocalMasterForDemographic();
      this.districtList = this.demographicsMaster.otherLoc.districtList;
      // this.districtList = [];
      this.subDistrictList = [];
      this.villageList = [];
      this.emptyDistrict();
      this.emptyVillage();
      this.emptySubDistrict();
      // this.onDistrictChange();
      this.stateChangeOnLoad();
      this.disableDistrict = false;
    } else if (
      this.demographicsMaster.stateMaster &&
      this.demographicsMaster.stateMaster.length >= 1
    ) {
      this.statesList = this.demographicsMaster.stateMaster;
      this.loadServicePoint();
      this.districtList = [];
      this.subDistrictList = [];
      this.villageList = [];

      this.emptyVillage();
      this.emptySubDistrict();
      this.emptyDistrict();
      this.emptyState();
    }
  }

  // Calling all data masters separately
  loadLocalMasterForDemographic() {
    if (!this.patientRevisit) {
      this.loadState();
      this.loadDistrict();
      this.loadSubDistrict();
      this.loadVillage();
      this.loadZone();
      this.loadParkingPlace();
      this.loadServicePoint();
    }
  }

  /**
   * Load States  for New Patient
   */
  loadState() {
    this.statesList = this.demographicsMaster.stateMaster;
    this.demographicDetailsForm.patchValue({
      stateID: this.locationData.stateID,
     stateName: this.locationData.stateName
    });
  }

  /**
   * Load Districts  for New Patient
   */
  loadDistrict() {
    this.districtList = [
      {
        districtID: this.demographicsMaster.otherLoc.districtList[0].districtID,
        districtName:
          this.demographicsMaster.otherLoc.districtList[0].districtName,
      },
    ];
    this.demographicDetailsForm.patchValue({
      districtID: this.demographicsMaster.otherLoc.districtList[0].districtID,
      districtName:
        this.demographicsMaster.otherLoc.districtList[0].districtName,
    });
  }


  /**
   * Load Sub Districts  for New Patient
   */
  loadSubDistrict() {
    this.subDistrictList = [
      {
        blockID: this.demographicsMaster.otherLoc.blockID,
        blockName: this.demographicsMaster.otherLoc.blockName,
      },
    ];

  }


  /**
   * Load Village  for New Patient
   */
  loadVillage() {
    this.villageList = this.demographicsMaster.villageMaster;
    this.demographicDetailsForm.patchValue({
      villageID: null,
      villageName: null,
    });
  }
  /**
   * Load Zones  for New Patient
   */
  loadZone() {
    this.zonesList = [
      {
        zoneID: this.demographicsMaster.otherLoc.zoneID,
        zoneName: this.demographicsMaster.otherLoc.zoneName,
      },
    ];
    console.log(this.demographicsMaster.otherLoc, "zoneLocs------mm-------");
    this.demographicDetailsForm.patchValue({
      zoneID: this.demographicsMaster.otherLoc.zoneID,
      zoneName: this.demographicsMaster.otherLoc.zoneName,
    });
  }
  /**
   * Load Parking Place  for New Patient
   */
  loadParkingPlace() {
    this.parkingPlaceList = [
      {
        parkingPlaceID: this.demographicsMaster.otherLoc.parkingPlaceID,
        parkingPlaceName: this.demographicsMaster.otherLoc.parkingPlaceName,
      },
    ];
    this.demographicDetailsForm.patchValue({
      parkingPlace: this.demographicsMaster.otherLoc.parkingPlaceID,
      parkingPlaceName: this.demographicsMaster.otherLoc.parkingPlaceName,
    });
  }
  /**
   * Load Service  for New Patient
   */
  loadServicePoint() {
    this.servicePointList = [
      {
        servicePointID: this.demographicsMaster.servicePointID,
        servicePointName: this.demographicsMaster.servicePointName,
      },
    ];
    this.demographicDetailsForm.patchValue({
      servicePoint: this.demographicsMaster.servicePointID,
      servicePointName: this.demographicsMaster.servicePointName,
    });
  }

  /***********************************LOAD NEW BEN DEMOGRAPHICS ENDS********************************/

  /**
   * If there is any issue in loading location data for demographics then call this
   */

  locationErrors() {
    this.confirmationService.alert(
      this.current_language_set.alerts.info.IssuesinfetchingLocation,
      "error"
    );
    this.router.navigate(["/registrar/search/"]);
  }

  chooseLocations() {
    return [{ id: 3, name: this.current_language_set.ro.locInfo.state }];
  }

  /**
   * Confirm User whether they want to edit the demographics
   */
  confirmEditDemographics(event: any) {
    const locationChoice = this.chooseLocations();

    if (event.checked === true) {
      this.demographicsEditEnabled = true;
      // this.demographicsEditText = 'Restore Default';
      this.confirmationService
        .choice(
          this.current_language_set.bendetails.editLocation,
          locationChoice
        )
        .subscribe((res) => {
          if (res) {
            this.demographicsEditText =
              this.current_language_set.common.RestoreDefault;
            this.editReConfig(res);
          } else {
            this.demographicsEditText =
              this.current_language_set.bendetails.editLocation;
            this.demographicsEditEnabled = false;
          }
        });
    } else if (event.checked === false) {
      this.demographicsEditEnabled = false;
      this.confirmationService
        .confirm(
          `info`,
          this.current_language_set.alerts.info.RemoveTheChanges,
          "Yes",
          "No"
        )
        .subscribe((res) => {
          if (res) {
            this.demographicsEditText =
              this.current_language_set.bendetails.editLocation;
            this.setDemographicDefaults();
          } else {
            this.demographicsEditText =
              this.current_language_set.common.RestoreDefault;
            this.demographicsEditEnabled = true;
          }
        });
    }
  }

  /**
   * ReConfig What to Enable for editing
   */
  editReConfig(request) {
    switch (request) {
      case 1:
        this.enableUptoTaluk();
        break;
      case 2:
        this.enableUptoDistrict();
        break;
      case 3:
        this.enableUptoState();
        break;
      default:
        break;
    }
  }

  /*************************** Enable/ Disable State/ District or SubDistrict ********/
  enableUptoTaluk() {
    this.emptyVillage();

    this.villageList = [];

    this.disableSubDistrict = false;

    this.onDistrictChange();
  }
  enableUptoDistrict() {
    this.emptyVillage();
    this.emptySubDistrict();

    this.villageList = [];
    this.subDistrictList = [];

    this.disableSubDistrict = false;
    this.disableDistrict = false;

    this.onStateChange();
  }

  enableUptoState() {
    this.emptyVillage();
    this.emptySubDistrict();
    this.emptyDistrict();
    this.emptyState();

    this.villageList = [];
    this.subDistrictList = [];
    this.districtList = [];

    this.disableSubDistrict = false;
    this.disableDistrict = false;
    this.disableState = false;
  }
  /*****--ENDS--************** Enable/ Disable State/ District or SubDistrict ********/

  /************ On Change of State, District, SubDistrict & Vilage */

  onVillageChange() {
    this.updateVillageName();
  }

  
  onSubDistrictOnLoad(){
    this.updateSubDistrictName();
    this.registrarService
      .getVillageList(this.demographicDetailsForm.value.blockID)
      .subscribe((res) => {
        if (res && res.statusCode === 200) {
          this.villageList = res.data;
          this.emptyVillage();
          this.demographicDetailsForm.patchValue({
            villageID: this.locationData.subDistrictID,
            villageName: this.locationData.villageName,
          });
          // this.onVillageChangeOnLoad();
        } else {
          this.confirmationService.alert(
            this.currentLanguageSet.alerts.info
              .IssuesInFetchingLocationDetails,
            "error"
          );
        }
      });
   }



  
   
  onSubDistrictChange() {
    this.updateSubDistrictName();

    this.registrarService
      .getVillageList(this.demographicDetailsForm.value.blockID)
      .subscribe((res) => {
        if (res && res.statusCode === 200) {
          this.villageList = res.data;
          this.emptyVillage();
        } else {
          this.confirmationService.alert(
            this.current_language_set.alerts.info
              .IssuesInFetchingLocationDetails,
            "error"
          );
        }
      });
  }

  onStateChange() {
    this.updateStateName(this.demographicDetailsForm.value.stateID);
    this.fetchDistrictsOnStateSelection();
  }
 
  fetchDistrictsOnStateSelection() {
    this.registrarService
      .getDistrictList(this.demographicDetailsForm.value.stateID)
      .subscribe((res) => {
        if (res && res.statusCode === 200) {
          this.districtList = res.data;
          this.emptyDistrict();
          this.emptySubDistrict();
          this.emptyVillage();
          if (
            this.abhaSearchResponse !== undefined &&
            this.abhaSearchResponse !== null
          ) {
          this.updateDistrictName(this.abhaSearchResponse.address.District);
          }

        } else {
          this.confirmationService.alert(
            this.current_language_set.alerts.info.IssuesInFetchingDemographics,
            "error"
          );
        }
      });
  }
   
  onDistrictChange() {
    
    this.abhaSearchResponse = null;
    this.updateDistrictName(this.demographicDetailsForm.value.districtID);
    this.fetchSubDistrictsOnDistrictSelection();
  }


  onDistrictChangeOnLoad(){
    this.updateDistrictName(this.demographicDetailsForm.value.districtID);
    this.registrarService
    .getSubDistrictList(this.demographicDetailsForm.value.districtID)
    .subscribe((res) => {
      if (res && res.statusCode === 200) {
        this.subDistrictList = res.data;
        this.emptySubDistrict();
        this.emptyVillage();
        this.demographicDetailsForm.patchValue({
          blockID: this.locationData.blockID,
          blockName: this.locationData.blockName,
        });
        this.onSubDistrictOnLoad();
      } else {
        this.confirmationService.alert(
          this.currentLanguageSet.alerts.info.IssuesInFetchingDemographics,
          "error"
        );
      }
    });
  }





  stateChangeOnLoad(){
    this.updateStateName(this.demographicDetailsForm.value.stateID);
    this.registrarService
    .getDistrictList(this.demographicDetailsForm.value.stateID)
    .subscribe((res) => {
      if (res && res.statusCode === 200) {
        this.districtList = res.data;
        this.emptyDistrict();
        this.emptySubDistrict();
        this.emptyVillage();
        this.demographicDetailsForm.patchValue({
          districtID: this.locationData.districtID,
          districtName:
            this.locationData.districtName,
        });
        this.onDistrictChangeOnLoad();
      } else {
        this.confirmationService.alert(
          this.currentLanguageSet.alerts.info.IssuesInFetchingDemographics,
          "error"
        );
      }
    });
  }


  


  fetchSubDistrictsOnDistrictSelection() {
    this.registrarService
    .getSubDistrictList(this.demographicDetailsForm.value.districtID)
    .subscribe((res) => {
      if (res && res.statusCode === 200) {
        this.subDistrictList = res.data;
        this.emptySubDistrict();
        this.emptyVillage();
      } else {
        this.confirmationService.alert(
          this.current_language_set.alerts.info.IssuesInFetchingDemographics,
          "error"
        );
      }
    });
  }
  /******--ENDS--****** On Change of State, District, SubDistrict */

  /** Remove Data from DropDowns */

  emptyVillage() {
    this.demographicDetailsForm.patchValue({
      villageID: null,
      villageName: null,
    });
  }

  emptySubDistrict() {
    this.demographicDetailsForm.patchValue({
      blockID: null,
      blockName: null,
    });
  }

  emptyDistrict() {
    this.demographicDetailsForm.patchValue({
      districtID: null,
      districtName: null,
    });
  }

  emptyState() {
    this.demographicDetailsForm.patchValue({
      stateID: null,
      stateName: null,
    });
  }

  /** --ENDS-- **Remove Data from DropDowns */

  /*****
   * Update State, District, SubDistrict and Village Name
   */
  updateVillageName() {
    this.villageList.find((village) => {
      if (
        village.districtBranchID === this.demographicDetailsForm.value.villageID
      ) {
        this.demographicDetailsForm.patchValue({
          villageName: village.villageName,
        });
      }
    });
  }

  updateSubDistrictName() {
    this.subDistrictList.find((subDistrict) => {
      if (subDistrict.blockID === this.demographicDetailsForm.value.blockID) {
        this.demographicDetailsForm.patchValue({
          blockName: subDistrict.blockName,
        });
      }
    });
  }

  updateDistrictName(patchDistrict) {
    if (patchDistrict !== undefined && patchDistrict !== null) {
      this.districtList.find((district) => {
        if (
          this.abhaSearchResponse !== undefined &&
          this.abhaSearchResponse !== null
        ) {
          if (
            district.districtName.toLowerCase() === patchDistrict.toLowerCase()
          ) {
            this.demographicDetailsForm.patchValue({
              districtID: district.districtID,
              districtName: district.districtName
            });
            this.fetchSubDistrictsOnDistrictSelection();
          }
        }
         else {
          if (district.districtID === patchDistrict) {
            this.demographicDetailsForm.patchValue({
              districtID: district.districtID,
              districtName: district.districtName
            });
          }
        }
      });
    }
  }






  updateStateName(patchState) {
    if (patchState !== undefined && patchState !== null) {
      this.statesList.find((state) => {
        if (
          this.abhaSearchResponse !== undefined &&
          this.abhaSearchResponse !== null
        ) {
          if (state.stateName.toLowerCase() === patchState.toLowerCase()) {
            this.demographicDetailsForm.patchValue({
              stateID: state.stateID,
              stateName: state.stateName
            });
            this.fetchDistrictsOnStateSelection();
          }
        } else {
          if (state.stateID === patchState) {
            this.demographicDetailsForm.patchValue({
              stateID: state.stateID,
              stateName: state.stateName
            });
            // this.registrarService.stateIdFamily = state.stateID;
          }
        }
      });

    }
  }

  
  /*****
   * // ENDS - Update State, District, SubDistrict and Village Name
   */

  /* Patch state, district and pincode based on ABHA result - JA354063 on 2/3/2022 */
  setPersonalDetailsFromABHA(abhaResponse) {
    console.log("On abha search result", abhaResponse);
      this.updateStateName(abhaResponse.address.State);
      this.demographicDetailsForm.patchValue({
        pincode: abhaResponse.address.PinCode,
      });
  }
}
