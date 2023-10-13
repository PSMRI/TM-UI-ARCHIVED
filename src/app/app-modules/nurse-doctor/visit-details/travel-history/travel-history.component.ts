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


import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  DoCheck
} from "@angular/core";
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import {
  MasterdataService,
  NurseService,
  DoctorService
} from "../../shared/services";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";
//import { LocationService } from 'app/services/common/location.service';
//import { ConfirmationDialogsService } from 'app/services/dialog/confirmation.service';
//import { SearchService } from 'app/services/searchBeneficiaryService/search.service';

@Component({
  selector: "travel-history",
  templateUrl: "./travel-history.component.html",
  styleUrls: ["./travel-history.component.css"]
})
export class TravelHistoryComponent implements OnInit, DoCheck {
  @Input("patientCovidForm")
  patientCovidForm: FormGroup;
  @Input("mode")
  mode: String;
  //   travelTypes = [{
  //     name: 'Domestic',
  //     value: false
  // },{
  //   name: 'Intternational',
  //     value: false
  // }];
  arr = [];
  travelTypeList: string[] = ["Domestic", "International"];
  domestictype: any = [];
  internationaltype: any = [];
  disableTravelButton: boolean = true;
  travelSelected: boolean;
  question1: string;
  istravelStatus: boolean = false;
  istravelModeDomestic: boolean = false;
  istravelModeInternatinal: boolean = false;
  countries: any = [];
  citiesFromInter: any = [];
  citiesToInter: any = [];
  stateID: any;
  states: any = [];
  districtsFromDom: any = [];
  districtsToDom: any = [];
  subDistrictsFromDom: any = [];
  subDistrictsToDom: any = [];
  villages: any = [];
  village: any;
  suspectedstat: any;
  recommendationText: string;
  suspectedCovid: string;
  answer1: string;
  answer2: string;
  allSymp: string;
  travelReqiured: string;
  recommendationMaster: any;
  recommendationTemporarayList = [];
  recommendationStatus: any;
  recomArray: any;
  statesAPI: any;
  readTravel: any = false;
  domtravel: boolean=false;
  intertravel: boolean=false;
  readTravel1: boolean=false;
  currentLanguageSet: any;
  // constructor( private _locationService: LocationService,
  //     public alertMessage: ConfirmationDialogsService,
  //     public searchBenData: SearchService
  //     ){}
  constructor(
    private masterdataService: MasterdataService,
    public httpServiceService: HttpServiceService,
    private nurseService: NurseService,
    private doctorService: DoctorService,
    private fb: FormBuilder
  ) {
    this.masterdataService.listen().subscribe((m: any) => {
      console.log(m);
      this.onFilterClick(m);
    });
    this.httpServiceService.listen().subscribe((m: any) => {
      console.log(m);
      this.contactFilterClick(m);
    });
  }
  ngOnInit() {
    this.assignSelectedLanguage();
    this.getNurseMasterData();
    this.domestictype = ["Bus", "Flight", "Train", "Ship"];
    this.internationaltype = ["Flight", "Ship"];
    this.getStateNames();
    this.getCountryNames();
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
    if (this.mode == "view") {
      this.readTravel = true;
      let visitID = localStorage.getItem("visitID");
      let benRegID = localStorage.getItem("beneficiaryRegID");
      this.getHistoryDetails(benRegID, visitID);
    }
    if(parseInt(localStorage.getItem("specialistFlag")) == 100)
    {
      this.readTravel = true;
      this.readTravel1 = true;
       let visitID = localStorage.getItem('visitID');
      let benRegID = localStorage.getItem('beneficiaryRegID')
      this.getHistoryDetails(benRegID, visitID);
    }
  }
  ngOnDestroy() {
    if (this.covidHistory) this.covidHistory.unsubscribe();

    if (this.nurseMasterDataSubscription)
      this.nurseMasterDataSubscription.unsubscribe();
  }
  covidHistory: any;
  covidHistoryDetails: any;
  getHistoryDetails(beneficiaryRegID, visitID) {
    this.covidHistory = this.doctorService
      .getVisitComplaintDetails(beneficiaryRegID, visitID)
      .subscribe(value => {
        if (
          value != null &&
          value.statusCode == 200 &&
          value.data != null &&
          value.data.covidDetails != null
        ) {
          this.covidHistoryDetails = value.data.covidDetails;
          if (value.data.covidDetails.suspectedStatus) {
            this.patientCovidForm.patchValue({ suspectedStatusUI: "YES" });
          } else {
            this.patientCovidForm.patchValue({ suspectedStatusUI: "NO" });
          }
          this.recommendationStatus = value.data.covidDetails.recommendation;
          this.recomArray = this.recommendationStatus.shift();
          console.log("RecomA" + this.recomArray);
          let testtravelarr = this.recomArray.join("\n");
          this.recommendationText = testtravelarr;
          console.log("Recom" + this.recommendationText);
          console.log("TravelStatus" + this.covidHistoryDetails.travelStatus);
          if (this.covidHistoryDetails.travelStatus == true) {
            this.patientCovidForm.patchValue({ travelStatus: "true" });
          } else {
            this.patientCovidForm.patchValue({ travelStatus: "false" });
          }

          if(parseInt(localStorage.getItem("specialistFlag")) == 100){
          this.travelStatuschange(this.patientCovidForm.controls['travelStatus'].value);
          }

          if (value.data.covidDetails.travelList.length >= 0) {
            this.istravelStatus = true;
          }

          this.travelListStatus();
          if (
            value.data.covidDetails.travelList[0] == "Domestic" ||
            value.data.covidDetails.travelList[1] == "Domestic"
          ) {
             this.domtravel=true;
            this.patientCovidForm.patchValue({
              modeOfTravelDomestic: value.data.covidDetails.modeOfTravelDomestic
            });
            this.patientCovidForm.patchValue({
              fromStateDom: value.data.covidDetails.fromStateDom
            });

            this.GetDistrictsFromDom(value.data.covidDetails.fromStateDom);
            this.patientCovidForm.patchValue({
              fromDistrictDom: value.data.covidDetails.fromDistrictDom
            });
            this.GetSubDistrictFromDom(value.data.covidDetails.fromDistrictDom);
            this.patientCovidForm.patchValue({
              fromSubDistrictDom: value.data.covidDetails.fromSubDistrictDom
            });
            this.patientCovidForm.patchValue({
              toStateDom: value.data.covidDetails.toStateDom
            });
            this.GetDistrictsToDom(value.data.covidDetails.toStateDom);
            this.patientCovidForm.patchValue({
              toDistrictDom: value.data.covidDetails.toDistrictDom
            });
            this.getSubDistrictToDom(value.data.covidDetails.toDistrictDom);
            this.patientCovidForm.patchValue({
              toSubDistrictDom: value.data.covidDetails.toSubDistrictDom
            });
          }
          if (
            value.data.covidDetails.travelList[0] == "International" ||
            value.data.covidDetails.travelList[1] == "International"
          ) {
            this.intertravel=true;
            this.patientCovidForm.patchValue({
              modeOfTravelInter: value.data.covidDetails.modeOfTravelInter
            });
            this.patientCovidForm.patchValue({
              fromCountryInter: value.data.covidDetails.fromCountryInter
            });
            this.getCitiesFromInter(value.data.covidDetails.fromCountryInter);
            this.patientCovidForm.patchValue({
              fromCityInter: value.data.covidDetails.fromCityInter
            });
            this.patientCovidForm.patchValue({
              toCountryInter: value.data.covidDetails.toCountryInter
            });
            this.getCitiesToInter(value.data.covidDetails.toCountryInter);
            this.patientCovidForm.patchValue({
              toCityInter: value.data.covidDetails.toCityInter
            });
          }
        }
      });
  }


  formArray: any;
  travelListStatus() {
    this.formArray = this.patientCovidForm.controls["travelList"] as FormArray;
    if (this.covidHistoryDetails) {
      let temparray = this.covidHistoryDetails.travelList;
      for (let i = 0; i < temparray.length; i++) {
        this.onChange(temparray[i], true);
      }
    }
  }
  countryAPI: any;
  getCountryNames() {
    this.countryAPI = this.nurseService.getCountryName().subscribe(response => {
      if (response.statusCode == 200 && response.data != null) {
        console.log(response.data[123]);

        this.countries = response.data;
      }
    });
  }
  getStateNames() {
    this.statesAPI = this.nurseService.getStateName(1).subscribe(response => {
      if (response.statusCode == 200 && response.data != null) {
        console.log("stateResponse", response.data);
        this.states = response.data;
      }
    });
  }

  nurseMasterDataSubscription: any;
  getNurseMasterData() {
    this.nurseMasterDataSubscription = this.masterdataService.nurseMasterData$.subscribe(
      data => {
        if (data && data.covidRecommendationMaster) {
          this.recommendationMaster = data.covidRecommendationMaster.slice();
          this.recommendationTemporarayList[0] = this.recommendationMaster.slice();
        }
        console.log("recommendationMaster" + this.recommendationMaster);
        console.log(
          "recommendationTemporarayList" + this.recommendationTemporarayList
        );
      }
    );
  }

  onFilterClick(symp) {
    console.log("Symptom Travel" + symp);
    this.getrecommendedtext();
    /* let travelstat=localStorage.getItem("travelstat");
      this.travelStatuschange(travelstat) ;*/
  }
  contactFilterClick(cont) {
    console.log("Contact Travel" + cont);
    this.getrecommendedtext();
    /* let travelstat=localStorage.getItem("travelstat");
      this.travelStatuschange(travelstat) ;*/
  }
  travelStatuschange(boolean_flag) {
    if(parseInt(localStorage.getItem("specialistFlag")) == 100){
      this.domtravel=false;
      this.intertravel=false;
    }
    localStorage.setItem("travelstat", boolean_flag);
    this.patientCovidForm.patchValue({ travelStatus: boolean_flag });
    this.disableTravelButton = false;
    this.travelSelected = true;
    if (boolean_flag == "true") {
      this.question1 = "yes";
      this.istravelStatus = true;
      this.getrecommendedtext();
    } else {
      this.question1 = "no";
      this.istravelStatus = false;
      this.istravelModeInternatinal = false;
      this.istravelModeDomestic = false;
      const travelFormArray = <FormArray>(
        this.patientCovidForm.controls.travelList
      );
      let i = 0;
      while (i < travelFormArray.length) travelFormArray.removeAt(i);

      this.domesticReset();
      this.interReset();
      this.getrecommendedtext();
    }

    //this.populate();
  }
  getrecommendedtext() {
    this.arr = [];
    const recomFormArray = <FormArray>(
      this.patientCovidForm.controls.recommendation
    );
    this.allSymp = localStorage.getItem("allSymptom");
    if (this.allSymp == "true") {
      this.travelReqiured = "false";
    } else {
      this.travelReqiured = "true";
    }
    this.answer1 = localStorage.getItem("symptom");
    this.answer2 = localStorage.getItem("contact");

    console.log("answer1==",this.answer1);
    console.log("answer2==",this.answer2);
      console.log("answer3==",this.question1);

    if (
      (this.question1 == "yes" &&
        this.answer1 === "true" &&
        this.answer2 === "true") ||
      (this.question1 == "yes" &&
        this.answer1 === "true" &&
        this.answer2 === "false") ||
      (this.question1 == "no" &&
        this.answer1 === "true" &&
        this.answer2 === "true")
    ) {
      this.patientCovidForm.patchValue({ suspectedStatusUI: "YES" });

      this.arr = this.recommendationMaster.filter(item => {
        if (
          item.CovidrecommendationID == 1 ||
          item.CovidrecommendationID == 2 ||
          item.CovidrecommendationID == 3 ||
          item.CovidrecommendationID == 4 ||
          item.CovidrecommendationID == 5
        )
          return item.recommendation;
      });

      //console.log("Recommended Array"+this.arr[0].recommendation)

      //this.patientCovidForm.patchValue({ recommendation : "Hospital isolation"});
      //this.patientCovidForm.patchValue({ recommendation : arr[0].recommendation });
    } else if (
    /*else if(this.question1=="yes" && this.answer1==="true" && this.answer2==="false")
    {
    this.patientCovidForm.patchValue({ suspectedStatus :  "YES"});
   this.patientCovidForm.patchValue({ recommendation : "Hospital isolation"});
    }
    else if(this.question1=="no" && this.answer1==="true" && this.answer2==="true")
    {
      this.patientCovidForm.patchValue({ suspectedStatus :  "YES"});
     this.patientCovidForm.patchValue({ recommendation : "Hospital isolation"});
      }*/
      (this.question1 == "no" &&
        this.answer1 === "false" &&
        this.answer2 === "true") ||
      (this.question1 == "yes" &&
        this.answer1 === "false" &&
        this.answer2 === "true")
    ) {
      this.patientCovidForm.patchValue({ suspectedStatusUI: "YES" });

      this.arr = this.recommendationMaster.filter(item => {
        return (
          item.CovidrecommendationID == 6 ||
          item.CovidrecommendationID == 7 ||
          item.CovidrecommendationID == 8 ||
          item.CovidrecommendationID == 9 ||
          item.CovidrecommendationID == 10 ||
          item.CovidrecommendationID == 11
        );
      });
    } else if (
    /*else if(this.question1=="yes" && this.answer1==="false" && this.answer2==="true")
      {
        this.patientCovidForm.patchValue({ suspectedStatus :  "YES"});
       this.patientCovidForm.patchValue({ recommendation : "Facility quarrantine 24 hrs"});
        }*/
      this.question1 == "yes" &&
      this.answer1 === "false" &&
      this.answer2 === "false"
    ) {
      this.patientCovidForm.patchValue({ suspectedStatusUI: "YES" });

      this.arr = this.recommendationMaster.filter(item => {
        return (
          item.CovidrecommendationID == 11 ||
          item.CovidrecommendationID == 12 ||
          item.CovidrecommendationID == 13
        );
      });
    } else if (
      this.question1 == "no" &&
      this.answer1 === "true" &&
      this.answer2 === "false"
    ) {
      this.patientCovidForm.patchValue({ suspectedStatusUI: "NO" });

      this.arr = this.recommendationMaster.filter(item => {
        return (
          item.CovidrecommendationID == 14 || item.CovidrecommendationID == 5
        );
      });
    } else if (
      this.question1 == "no" &&
      this.answer1 === "false" &&
      this.answer2 === "false"
    ) {
      this.patientCovidForm.patchValue({ suspectedStatusUI: "NO" });
      this.arr = this.recommendationMaster.filter(item => {
        return (
          item.CovidrecommendationID == 15 || item.CovidrecommendationID == 11
        );
      });
    } else if (this.allSymp == "true") {
      this.patientCovidForm.patchValue({ suspectedStatusUI: "YES" });
      this.arr = this.recommendationMaster.filter(item => {
        return (
          item.CovidrecommendationID == 1 ||
          item.CovidrecommendationID == 2 ||
          item.CovidrecommendationID == 3 ||
          item.CovidrecommendationID == 4 ||
          item.CovidrecommendationID == 5
        );
      });
    } else {
      this.arr = [];
      this.patientCovidForm.patchValue({ suspectedStatusUI: null });
      //  this.patientCovidForm.patchValue({ recommendation : null});
      this.recommendationText = null;
      let i = 0;
      while (i < recomFormArray.length) recomFormArray.removeAt(i);
    }

    if (this.arr.length > 0) {
      let i = 0;
      while (i < recomFormArray.length) recomFormArray.removeAt(i);
      const selectedRecom = this.arr.map(
        ({ recommendation }) => recommendation
      );
      recomFormArray.push(new FormControl(selectedRecom));
      //  this.recommendationTemporarayList.push(selectedRecom);
      let travelarr = selectedRecom.join("\n");
      this.recommendationText = travelarr;
      //this.patientCovidForm.patchValue({ recommendation : travelarr});
    }

    //this.answer1=this.patientCovidForm.controls['symptom'].value;
    // console.log("ans="+this.answer1);
    // console.log("ans="+this.answer2);
    // console.log("ques="+this.answer1);
    /* if(this.answer1==true)
     {
       this.recommendationText="symptom is positive";
     }
     else if(this.answer1==false)
     {
       this.recommendationText="symptom is negative";
     }*/
  }
  traveldomesticStatuschange(modeOfTravelDomestic) {
    this.patientCovidForm.patchValue({
      modeOfTravelDomestic: modeOfTravelDomestic
    });
  }

  CitiesFromInter(fromCityInter) {
    this.patientCovidForm.patchValue({ fromCityInter: fromCityInter });
  }
  citiesAPI: any;
  getCitiesFromInter(countryID) {
    this.patientCovidForm.patchValue({ fromCountryInter: countryID });
    // this._locationService.getCity(countryID).subscribe(response => this.getAllCitySuccessHandelerFromInter(response),

    // 		(err) => {
    // 			this.alertMessage.alert("Error in fetching states", 'error');
    // 		});
    this.citiesAPI = this.nurseService
      .getCityName(countryID)
      .subscribe(response => {
        if (response.statusCode == 200 && response.data != null) {
          console.log("fromcities", response.data);

          this.citiesFromInter = response.data;
        }
      });
    // this.citiesFromInter = ["Delhi", "Mumbai", "Bangalore"];
  }
  getAllCitySuccessHandelerFromInter(response) {
    this.citiesFromInter = response;
  }
  citiesAPITo: any;
  getCitiesToInter(countryID) {
    this.patientCovidForm.patchValue({ toCountryInter: countryID });
    this.citiesAPITo = this.nurseService
      .getCityName(countryID)
      .subscribe(response => {
        if (response.statusCode == 200 && response.data != null) {
          console.log(response.data);

          this.citiesToInter = response.data;
        }
      });
    // this._locationService.getCity(countryID).subscribe(response => this.getAllCitySuccessHandelerToInter(response),

    // 		(err) => {
    // 			this.alertMessage.alert("Error in fetching states", 'error');
    // 		});
    // this.citiesToInter = ["Kochi", "Patna", "Pune"];
  }
  getAllCitySuccessHandelerToInter(response) {
    this.citiesToInter = response;
  }
  CitiesToInter(toCityInter) {
    this.patientCovidForm.patchValue({ toCityInter: toCityInter });
  }
  // initiallyState() {
  //   // this._locationService.getStates(1).subscribe(response => this.getAllStatesSuccessHandeler(response),
  //   // 	(err) => {
  //   // 		this.alertMessage.alert("Error in fetching states", 'error');
  //   // 	});
  //   this.states = ["Delhi", "Mumbai", "Bangalore"];
  // }
  getAllStatesSuccessHandeler(response) {
    this.states = response;
  }
  districtAPIFrom: any;
  GetDistrictsFromDom(stateID) {
    this.patientCovidForm.patchValue({ fromStateDom: stateID });
    this.districtAPIFrom = this.nurseService
      .getDistrictName(stateID)
      .subscribe(response => {
        if (response.statusCode == 200 && response.data != null) {
          console.log("districtdata", response.data);

          this.districtsFromDom = response.data;
        }
      });
    // if(this.mode == 'view'){
    //   if(this.districtsFromDom.some(value => value.))
    // }
    // this.districtsFromDom = ["Hyderabad", "Kochi"];
    //let res = this._locationService.getDistricts(value).subscribe(response => this.SetDistrictsFromDom(response));
  }
  districtAPITo: any;
  GetDistrictsToDom(stateID) {
    this.patientCovidForm.patchValue({ toStateDom: stateID });
    this.districtAPITo = this.nurseService
      .getDistrictName(stateID)
      .subscribe(response => {
        if (response.statusCode == 200 && response.data != null) {
          console.log("districtdata", response.data);

          this.districtsToDom = response.data;
        }
      });

    // this.districtsToDom = ["Hyderabad", "Kochi"];
    //let res = this._locationService.getDistricts(value).subscribe(response => this.SetDistrictsTomDom(response));
  }
  SetDistrictsFromDom(response: any) {
    this.districtsFromDom = response;
  }
  SetDistrictsTomDom(response: any) {
    this.districtsToDom = response;
  }
  subDistrictAPIFrom: any;
  GetSubDistrictFromDom(distID) {
    this.patientCovidForm.patchValue({ fromDistrictDom: distID });
    this.subDistrictAPIFrom = this.nurseService
      .getSubDistrictName(distID)
      .subscribe(response => {
        if (response.statusCode == 200 && response.data != null) {
          this.subDistrictsFromDom = response.data;
        }
      });
    // this.subDistrictsFromDom = ["Vanasthallipuram", "Nalagonda"];
    //this.village = undefined;
    //this.searchBenData.getSubDistricts(districtID).subscribe(response => this.getSubDistrictSuccessHandelerFromDom(response));
  }
  subDistrictAPITo: any;
  getSubDistrictToDom(districtID) {
    this.patientCovidForm.patchValue({ toDistrictDom: districtID });
    this.subDistrictAPITo = this.nurseService
      .getSubDistrictName(districtID)
      .subscribe(response => {
        if (response.statusCode == 200 && response.data != null) {
          this.subDistrictsToDom = response.data;
        }
      });
    // this.subDistrictsToDom = ["Vanasthallipuram", "Nalagonda"];
    ///this.village = undefined;
    //this.searchBenData.getSubDistricts(districtID).subscribe(response => this.getSubDistrictSuccessHandelerToDom(response));
  }

  getSubDistrictSuccessHandelerFromDom(response) {
    this.subDistrictsFromDom = response;
    //	console.log("********SUBDISTRICT", this.subDistricts);
  }
  getSubDistrictSuccessHandelerToDom(response) {
    this.subDistrictsToDom = response;
    //	console.log("********SUBDISTRICT", this.subDistricts);
  }

  getVillage(subDistrictID) {
    this.patientCovidForm.patchValue({ fromSubDistrictDom: subDistrictID });
    //this.searchBenData.getVillages(subDistrictID).subscribe(response => this.getVillageSuccessHandeler(response));
  }
  getVillageTosubDistrictDom(subDistrictID) {
    this.patientCovidForm.patchValue({ toSubDistrictDom: subDistrictID });
    //this.searchBenData.getVillages(subDistrictID).subscribe(response => this.getVillageSuccessHandeler(response));
  }
  travelinternationalStatuschange(modeOfTravelInter) {
    this.patientCovidForm.patchValue({ modeOfTravelInter: modeOfTravelInter });
  }
  getVillageSuccessHandeler(response) {
    this.villages = response;
    //	console.log("********VILLAGES", this.villages);
  }

  get travelStatus() {
    return this.patientCovidForm.controls["travelStatus"].value;
  }
  // get domestic() {
  //   return this.patientCovidForm.controls["domestic"].value;
  // }
  // get international() {
  //   return this.patientCovidForm.controls["international"].value;
  // }
  onChange(travel: string, isChecked: boolean) {
    const travelFormArray = <FormArray>(
      this.patientCovidForm.controls.travelList
    );

    if (isChecked) {
      travelFormArray.push(new FormControl(travel));
      if (travel == "Domestic") {
        this.istravelModeDomestic = true;
      } else {
        this.istravelModeInternatinal = true;
      }
    } else {
      let index = travelFormArray.controls.findIndex(x => x.value == travel);
      travelFormArray.removeAt(index);
      if (travel == "Domestic") {
        this.istravelModeDomestic = false;
        this.domesticReset();
      } else {
        this.istravelModeInternatinal = false;
        this.interReset();
      }
    }
  }
  domesticReset() {
    this.patientCovidForm.patchValue({ modeOfTravelDomestic: null });
    this.patientCovidForm.patchValue({ fromStateDom: null });
    this.patientCovidForm.patchValue({ fromDistrictDom: null });
    this.patientCovidForm.patchValue({ fromSubDistrictDom: null });
    this.patientCovidForm.patchValue({ toStateDom: null });
    this.patientCovidForm.patchValue({ toDistrictDom: null });
    this.patientCovidForm.patchValue({ toSubDistrictDom: null });
  }
  interReset() {
    this.patientCovidForm.patchValue({ modeOfTravelInter: null });
    this.patientCovidForm.patchValue({ fromCountryInter: null });
    this.patientCovidForm.patchValue({ fromCityInter: null });
    this.patientCovidForm.patchValue({ toCountryInter: null });
    this.patientCovidForm.patchValue({ toCityInter: null });
  }

  /* get domestic() {
    return this.patientCovidForm.controls['domestic'].value;
  }
  get international() {
    return this.patientCovidForm.controls['international'].value;
  }*/

  /*get travelType()
  {
    return this.patientCovidForm.controls['travelType'].value;
  }*/
  get modeOfTravelDomestic() {
    return this.patientCovidForm.controls["modeOfTravelDomestic"].value;
  }
  get fromStateDom() {
    return this.patientCovidForm.controls["fromStateDom"].value;
  }
  get toStateDom() {
    return this.patientCovidForm.controls["toStateDom"].value;
  }
  get fromDistrictDom() {
    return this.patientCovidForm.controls["fromDistrictDom"].value;
  }
  get fromSubDistrictDom() {
    return this.patientCovidForm.controls["fromSubDistrictDom"].value;
  }
  // get toStateDom() {
  //   return this.patientCovidForm.controls['toStateDom'].value;
  // }

  get toDistrictDom() {
    return this.patientCovidForm.controls["toDistrictDom"].value;
  }
  get toSubDistrictDom() {
    return this.patientCovidForm.controls["toSubDistrictDom"].value;
  }
  get modeOfTravelInter() {
    return this.patientCovidForm.controls["modeOfTravelInter"].value;
  }
  get fromCountryInter() {
    return this.patientCovidForm.controls["fromCountryInter"].value;
  }
  get fromCityInter() {
    return this.patientCovidForm.controls["fromCityInter"].value;
  }
  get toCountryInter() {
    return this.patientCovidForm.controls["toCountryInter"].value;
  }
  get toCityInter() {
    return this.patientCovidForm.controls["toCityInter"].value;
  }
  get suspectedStatusUI() {
    return this.patientCovidForm.controls["suspectedStatusUI"].value;
  }
  get recommendation() {
    return this.patientCovidForm.controls["recommendation"].value;
  }
  // get toCityInter() {
  //   return this.patientCovidForm.controls['toCityInter'].value;
  // }
}
