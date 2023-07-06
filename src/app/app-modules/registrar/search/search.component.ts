import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { MdDialogRef, MdDialog, MdDialogConfig } from "@angular/material";
import {
  Params,
  RouterModule,
  Routes,
  Router,
  ActivatedRoute,
} from "@angular/router";

import { SearchDialogComponent } from "../search-dialog/search-dialog.component";

import { ConfirmationService } from "../../core/services/confirmation.service";
import { CameraService } from "../../core/services/camera.service";
import { BeneficiaryDetailsService } from "../../core/services/beneficiary-details.service";
import { RegistrarService } from "../shared/services/registrar.service";
import * as moment from "moment";
import { log } from "util";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";
import { QuickSearchComponent } from "../quick-search/quick-search.component";
import { CommonService } from "app/app-modules/core/services/common-services.service";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { HealthIdDisplayModalComponent } from "app/app-modules/core/components/health-id-display-modal/health-id-display-modal.component";
import { environment } from "environments/environment";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"],
})
export class SearchComponent implements OnInit {
  rowsPerPage = 5;
  activePage = 1;
  pagedList = [];
  rotate = true;
  beneficiaryList = [];
  filteredBeneficiaryList = [];
  quicksearchTerm: string;
  advanceSearchTerm: any;
  blankTable = [1, 2, 3, 4, 5];
  currentLanguageSet: any;
  externalSearchTerm: any;
  externalBeneficiaryList = [];
  filteredExternalBeneficiaryList = [];
  externalPagedList = [];
  districtList: any;
  districtID: any;
  statesList: any;
  demographicsMaster: Location & {
    servicePointID: string;
    servicePointName: string;
  };
  masterDataSubscription: any;
  masterData: any;
  countryId = 1;
  stateID: any;
  genderID: any;
  pageNo: number=1;
  searchPattern: string;
  // searchType: string;
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MdDialog,
    private confirmationService: ConfirmationService,
    private registrarService: RegistrarService,
    private cameraService: CameraService,
    private router: Router,
    private route: ActivatedRoute,
    public httpServiceService: HttpServiceService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    // this.searchType = 'ID';
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.currentLanguageSet = response);
    this.searchPattern="/^[a-zA-Z0-9](.|@|-)*$/;"
    this.assignSelectedLanguage();
    this.stateMaster();
    this.registrarService.getRegistrationMaster(this.countryId);
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  AfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

/*JA354063 - QuickSearch on BenID, phone number, ABHA Address, ABHA Number */  
  searchBeneficiary(searchTerm?: string) {
    const searchObject = {
      beneficiaryRegID: null,
      beneficiaryID: null,
      phoneNo: null,
      HealthID: null,
      HealthIDNumber: null
    };
    if(this.validateSearchItem(searchTerm, searchObject)) {
        this.externalBeneficiaryList = [];
        this.externalPagedList = [];
        this.filteredExternalBeneficiaryList = [];
        this.registrarService.identityQuickSearch(searchObject).subscribe(
          (beneficiaryList) => {
            if (!beneficiaryList || beneficiaryList.length <= 0) {
              this.beneficiaryList = [];
              this.filteredBeneficiaryList = [];
              this.pagedList = [];
              this.confirmationService.alert(
                this.currentLanguageSet.alerts.info.beneNotFound,
                "info"
              );
            } else {
              this.beneficiaryList = this.searchRestruct(
                beneficiaryList,
                searchObject
              );
              this.filteredBeneficiaryList = this.beneficiaryList;
              this.pageChanged({
                page: this.activePage,
                itemsPerPage: this.rowsPerPage,
              });
            }
            console.log("hi", JSON.stringify(beneficiaryList, null, 4));
          },
          (error) => {
            this.confirmationService.alert(error, "error");
          }
        );
    }

  }
  validateSearchItem(searchTerm, searchObject) {
    if (
      searchTerm === undefined || searchTerm === null ||
      searchTerm.trim() == "" ||
      searchTerm.trim().length <= 0
    ) {
      this.resetWorklist();
      this.confirmationService.alert(
        "Please enter a valid input",
        "info"
      );
      return false;
    } else {
      if (searchTerm !== undefined && searchTerm !== null && searchTerm.trim().length >= 8 && searchTerm.trim().length <= 32) {
        if (searchTerm.trim().length === 10 || searchTerm.trim().length === 12) {
        return this.validatePhoneNumberOrBenID(searchTerm.trim(), searchObject);
        } else if (searchTerm.trim().length === 14 || searchTerm.trim().length === 17) {
         return this.checkValidHealthIDNumber(searchTerm, searchObject);
        } else {
         return this.validateHealthIDPattern(searchTerm.trim(), searchObject);
        }
        
      } else {
        this.resetWorklist();
          this.confirmationService.alert("Please enter a valid input", 'info');
        return false;
      }
    }
  }
  validatePhoneNumberOrBenID(searchTerm, searchObject) {
    const phoneNoPattern = /\d{10}$/;
    let verifyPhoneNoPattern = phoneNoPattern.test(searchTerm);
    if (verifyPhoneNoPattern) {
      searchObject["phoneNo"] = searchTerm.length === 10 ? searchTerm : searchObject["beneficiaryID"] = searchTerm;
      return true;
    } else {
      return this.validateHealthIDPattern(searchTerm, searchObject);
    }
  }
  checkValidHealthIDNumber(searchTerm, searchObject) {
    const healthidval = (searchTerm !== undefined && searchTerm !== null) ? searchTerm.trim() : searchTerm;
      if ( searchTerm !== undefined && searchTerm !== null && searchTerm.trim().length === 14) {
        const healthIDNumberPatternWithoutHypen = /\d{14}$/;
      return this.validateHealthIDNumberPattern(healthIDNumberPatternWithoutHypen, healthidval, searchObject);
      } else if (healthidval.length === 17) {
        const healthIDNumberPatternWithHypen =
          /^(\d{2})-(\d{4})-(\d{4})-(\d{4})*$/;
      return this.validateHealthIDNumberPattern(healthIDNumberPatternWithHypen, healthidval, searchObject);
      } else {
      return this.validateHealthIDPattern(searchTerm, searchObject);
      }
  }
  validateHealthIDNumberPattern(pattern, healthidval, searchObject) {
    let checkPattern = pattern.test(healthidval);
    if (checkPattern) {
     searchObject["HealthIDNumber"] = healthidval.length === 14 ? 
        healthidval.substring(0,2)+"-"+healthidval.substring(2,6)+"-"+healthidval.substring(6,10)+"-"+healthidval.substring(10, healthidval.length)
        : healthidval;
     return true;
    } else {
      return this.validateHealthIDPattern(healthidval, searchObject);
    }
  }
 
  validateHealthIDPattern(healthidval, searchObject) {
    let healthIDPattern;
     if(environment.abhaExtension === "@abdm")
     {
       healthIDPattern = /^([a-zA-Z0-9])+(\.[a-zA-Z0-9]+)?@([a-zA-Z]{4})$/;
     }
     else{
       healthIDPattern = /^([a-zA-Z0-9])+(\.[a-zA-Z0-9]+)?@([a-zA-Z]{3})$/;
     }
  
    let checkPattern = healthIDPattern.test(healthidval);
    if (checkPattern) {
     searchObject["HealthID"] = healthidval;
     return true;
    } else {
      this.resetWorklist();
      this.confirmationService.alert("Please enter a valid input", 'info');
      return false;
    }
  }
  resetWorklist() {
    this.beneficiaryList = [];
    this.filteredBeneficiaryList = [];
    this.pagedList = [];
  }
  /*Ends */
  /**
   * ReStruct the response object of Identity Search to be as per search table requirements
   */
  searchRestruct(benList, benObject) {
    const requiredBenData = [];
    benList.forEach((element, i) => {
      requiredBenData.push({
        beneficiaryID: element.beneficiaryID,
        beneficiaryRegID: element.beneficiaryRegID,
        benName: `${element.firstName} ${element.lastName || ""}`,
        genderName: `${element.m_gender.genderName || "Not Available"}`,
        fatherName: `${element.fatherName || "Not Available"}`,
        districtName: `${
          element.i_bendemographics.districtName || "Not Available"
        }`,
        villageName: `${
          element.i_bendemographics.districtBranchName || "Not Available"
        }`,
        phoneNo: this.getCorrectPhoneNo(element.benPhoneMaps, benObject),
        age:
          moment(element.dOB).fromNow(true) == "a few seconds"
            ? "Not Available"
            : moment(element.dOB).fromNow(true),
        registeredOn: moment(element.createdDate).format("DD-MM-YYYY"),
        benObject: element,
      });
    });
    console.log(JSON.stringify(requiredBenData, null, 4), "yoooo!");

    return requiredBenData;
  }
  getHealthIDDetails(data)
  {
    console.log("data",data);
    if(data.benObject !=undefined && data.benObject.abhaDetails !=undefined && data.benObject.abhaDetails !=null && 
      data.benObject.abhaDetails.length >0)
      {
        this.dialog.open(HealthIdDisplayModalComponent, {
          data: { 'dataList': data.benObject.abhaDetails ,'search':true}
        } );
      }
      else
      this.confirmationService.alert(
        this.currentLanguageSet.abhaDetailsNotAvailable,
        "info"
      );
   
  }
  pageChanged(event): void {
    console.log("called", event);
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedList = this.filteredBeneficiaryList.slice(startItem, endItem);
    console.log("list", this.pagedList);
  }

  getCorrectPhoneNo(phoneMaps, benObject) {
    let phone;
    if (benObject && !benObject && !benObject.phoneNo) {
      return phoneMaps[0].phoneNo;
    } else if (
      benObject &&
      !benObject &&
      !benObject.phoneNo &&
      !phoneMaps.length
    ) {
      return phoneMaps[0].phoneNo || "Not Available";
    } else if (benObject && benObject.phoneNo && phoneMaps.length > 0) {
      phoneMaps.forEach((elem) => {
        if (elem.phoneNo == benObject.phoneNo) {
          phone = elem.phoneNo;
        }
      });
      if (phone) {
        return phone;
      } else if (phoneMaps.length > 0) {
        return phoneMaps[0].phoneNo;
      } else {
        return "Not Available";
      }
    } else if (phoneMaps.length > 0) {
      return phoneMaps[0].phoneNo;
    } else {
      return "Not Available";
    }
    //     `${element.benPhoneMaps.length > 0 && element.benPhoneMaps[0].phoneNo || 'Not Available'}` ,
    // return 1
  }

  filterBeneficiaryList(searchTerm?: string) {
    if (!searchTerm) this.filteredBeneficiaryList = this.beneficiaryList;
    else {
      this.filteredBeneficiaryList = [];
      this.beneficiaryList.forEach((item) => {
        for (let key in item) {
          if (key != "benObject") {
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
      itemsPerPage: this.rowsPerPage,
    });
  }

  filterExternalBeneficiaryList(searchTerm?: string) {
    if (!searchTerm)
      this.filteredExternalBeneficiaryList = this.externalBeneficiaryList;
    else {
      this.filteredExternalBeneficiaryList = [];
      this.externalBeneficiaryList.forEach((item) => {
        for (let key in item) {
          let value: string = "" + item[key];
          if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
            this.filteredExternalBeneficiaryList.push(item);
            break;
          }
        }
      });
    }
    this.activePage = 1;
    this.pageChangedExternal({
      page: 1,
      itemsPerPage: this.rowsPerPage,
    });
  }

  // filterExternalBeneficiaryList(searchTerm?: string) {
  //   if (!searchTerm)
  //     this.filteredExternalBeneficiaryList = this.externalBeneficiaryList;
  //   else {
  //     this.filteredExternalBeneficiaryList = [];
  //     this.externalBeneficiaryList.forEach((item) => {
  //       for (let key in item) {
  //         if (key != 'benObject') {
  //           let value: string = '' + item[key];
  //           if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
  //             this.filteredExternalBeneficiaryList.push(item); break;
  //           }
  //         }
  //       }
  //     });
  //   }
  //   this.activePage = 1;
  //   this.pageChangedExternal({
  //     page: 1,
  //     itemsPerPage: this.rowsPerPage
  //   });
  // }

  patientRevisited(benObject: any) {
    if (
      benObject &&
      benObject.m_gender &&
      benObject.m_gender.genderName &&
      benObject.dOB
    ) {
      let action = false;
      console.log(JSON.stringify(benObject, null, 4), "benObject");
      let vanID = JSON.parse(localStorage.getItem("serviceLineDetails")).vanID;
      benObject["providerServiceMapId"] =
        localStorage.getItem("providerServiceID");
      benObject["vanID"] = vanID;
      this.confirmationService
        .confirm(
          `info`,
          this.currentLanguageSet.alerts.info.confirmSubmitBeneficiary
        )
        .subscribe((result) => {
          if (result) this.sendToNurseWindow(result, benObject);
        });
    } else if (!benObject.m_gender.genderName && !benObject.dOB) {
      this.confirmationService.alert(
        this.currentLanguageSet.alerts.info.genderAndAgeDetails,
        "info"
      );
    } else if (!benObject.m_gender.genderName) {
      this.confirmationService.alert(
        this.currentLanguageSet.alerts.info.noGenderDetails,
        "info"
      );
    } else if (!benObject.dOB) {
      this.confirmationService.alert(
        this.currentLanguageSet.alerts.info.noAgeDetailsAvail,
        "info"
      );
    }
  }

  editPatientInfo(beneficiary: any) {
    this.confirmationService
      .confirm(`info`, this.currentLanguageSet.alerts.info.editDetails)
      .subscribe((result) => {
        if (result) {
          this.registrarService.saveBeneficiaryEditDataASobservable(
            beneficiary.benObject
          );
          this.router.navigate([
            "/registrar/search/" + beneficiary.beneficiaryID,
          ]);
        }
      });
  }

  sendToNurseWindow(userResponse: boolean, benObject: any) {
    if (userResponse) {
      // let regIdObject = { beneficiaryRegID: "" };
      // regIdObject.beneficiaryRegID = benregID;
      this.registrarService.identityPatientRevisit(benObject).subscribe(
        (result) => {
          if (result.data)
            // this.confirmationService.alert(result.data.response, "success");
            this.confirmationService.alert(
              this.currentLanguageSet.common.beneficiaryMovedtoNurse,
              "success"
            );
          //this.confirmationService.alert(result.status, "warn");
          else
            this.confirmationService.alert(
              this.currentLanguageSet.common.beneAlreadyAdded,
              "warn"
            );
        },
        (error) => {
          this.confirmationService.alert(error, "error");
        }
      );
    }
  }

  patientImageView(benregID: any) {
    if (
      benregID &&
      benregID != null &&
      benregID != "" &&
      benregID != undefined
    ) {
      this.beneficiaryDetailsService
        .getBeneficiaryImage(benregID)
        .subscribe((data) => {
          if (data && data.benImage)
            this.cameraService.viewImage(data.benImage);
          else
            this.confirmationService.alert(
              this.currentLanguageSet.alerts.info.imageNotFound
            );
        });
    }
  }

  openSearchDialog() {
    let mdDialogRef: MdDialogRef<SearchDialogComponent> = this.dialog.open(
      SearchDialogComponent,
      {
        width: "60%",
        disableClose: false,
      }
    );

    mdDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.clearTableContents();
        console.log("something fishy happening here", result);
        this.advanceSearchTerm = result;
        this.registrarService
          .advanceSearchIdentity(this.advanceSearchTerm)
          .subscribe(
            (beneficiaryList) => {
              if (!beneficiaryList || beneficiaryList.length <= 0) {
                this.beneficiaryList = [];
                this.filteredBeneficiaryList = [];
                this.quicksearchTerm = null;
                this.confirmationService.alert(
                  this.currentLanguageSet.alerts.info.beneNotFound,
                  "info"
                );
              } else {
                this.beneficiaryList = this.searchRestruct(beneficiaryList, {});
                this.filteredBeneficiaryList = this.beneficiaryList;
                this.activePage = 1;
                this.pageChanged({
                  page: this.activePage,
                  itemsPerPage: this.rowsPerPage,
                });
              }
              console.log(JSON.stringify(beneficiaryList, null, 4));
            },
            (error) => {
              this.confirmationService.alert(error, "error");
            }
          );
      }
    });
  }
  /* Search external beneficiary details in mongo*/
  openQuickSearch() {
    let mdDialogRef: MdDialogRef<QuickSearchComponent> = this.dialog.open(
      QuickSearchComponent,
      {
        width: "60%",
        disableClose: true,
      }
    );
    mdDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.externalSearchTerm = result;
        this.clearTableContents();
        this.searchBeneficiaryInMongo(null);
      }
    });
  }
  searchBeneficiaryInMongo(pageNo) {
    if(this.externalSearchTerm.pageNo !=undefined && pageNo !=null)
    this.externalSearchTerm.pageNo=pageNo - 1;
    this.registrarService
      .externalSearchIdentity(this.externalSearchTerm)
      .subscribe(
        (externalBenList) => {
          if (
            externalBenList.response !== undefined &&
            externalBenList.response !== null &&
            externalBenList.response === "patient not found"
          ) {
            this.confirmationService.alert(
              this.currentLanguageSet.alerts.info.beneNotFound,
              "info"
            );
          } else {
            if (externalBenList && externalBenList.length > 0) {
              this.externalBeneficiaryList =
                this.searchExternalRestruct(externalBenList);
              this.filteredExternalBeneficiaryList =
                this.externalBeneficiaryList;
              this.activePage = 1;
              this.pageChangedExternal({
                page: this.activePage,
                itemsPerPage: this.rowsPerPage,
              });
            }
            else
            {
              this.externalBeneficiaryList =[];
              this.filteredExternalBeneficiaryList =[];
            }
          }
        },
        (error) => {
          this.externalBeneficiaryList =[];
              this.filteredExternalBeneficiaryList =[];
          this.confirmationService.alert(error, "error");
        }
      );
  }
  searchExternalRestruct(benList) {
    const requiredExternalBenData = [];
    benList.forEach((element, i) => {
      requiredExternalBenData.push({
        amritID: element.amritId,
        healthID: element.healthId,
        healthIdNumber: element.healthIdNumber,
        externalId: element.externalId,
        benName: element.profile.patient.name,
        gender:
          element.profile.patient.gender === "F"
            ? "Female"
            : element.profile.patient.gender === "M"
            ? "Male"
            : "Others",
        dob:
          element.profile.patient.yearOfBirth +
          "-" +
          element.profile.patient.monthOfBirth +
          "-" +
          element.profile.patient.dayOfBirth,
        state: element.profile.patient.address.state,
        district: element.profile.patient.address.district,
        village: element.profile.patient.address.village,
        benObject: element,
      });
    });

    return requiredExternalBenData;
  }
  clearTableContents() {
    this.externalBeneficiaryList = [];
    this.filteredExternalBeneficiaryList = [];
    this.externalPagedList = [];
    this.quicksearchTerm = null;
    this.beneficiaryList = [];
    this.filteredBeneficiaryList = [];
    this.pagedList = [];
    this.pageNo=1;
  }

  pageChangedExternal(event): void {
    console.log("called", event);
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.externalPagedList = this.filteredExternalBeneficiaryList.slice(
      startItem,
      endItem
    );
  }
  /* Ends - Search external beneficiary details in mongo*/

  /* Update external beneficiary details in AMRIT*/
  migrateBeneficiaryToAmrit(benDetails) {
    this.assignStateIDAndDistrictID(benDetails);
    this.confirmationService
      .confirm(`info`, "Please confirm to register in AMRIT")
      .subscribe((result) => {
        if (result) this.sendBenToAmrit(benDetails);
      });
  }
  stateMaster() {
    this.commonService.getStates(1).subscribe(
      (response) => {
        if (response !== undefined && response !== null) {
          this.statesList = response;
        }
      },
      (err) => {
        this.confirmationService.alert("Error in fetching states", "error");
      }
    );
  }
  assignStateIDAndDistrictID(benDetails) {
    if (this.statesList != null && this.statesList.length > 0) {
      this.statesList.forEach((element) => {
        if ((element.stateName).toLowerCase() == (benDetails.profile.patient.address.state).toLowerCase())
          this.stateID = element.stateID;
      });
      this.getDistrict(benDetails, this.stateID);
    }
    this.masterDataSubscription =
      this.registrarService.registrationMasterDetails$.subscribe((res) => {
        if (res !== null) {
          this.masterData = res;
        }
      });

    const genderMaster = this.masterData.genderMaster;
    benDetails.profile.patient.gender =
      benDetails.profile.patient.gender === "F"
        ? "Female"
        : benDetails.profile.patient.gender === "M"
        ? "Male"
        : "Transgender";
    genderMaster.forEach((element) => {
      if (element.genderName === benDetails.profile.patient.gender) {
        this.genderID = element.genderID;
      }
    });
  }
  sendBenToAmrit(benDetails) {
    const servicePointDetails = JSON.parse(
      localStorage.getItem("serviceLineDetails")
    );
    const date = new Date(
      benDetails.profile.patient.yearOfBirth +
        "-" +
        benDetails.profile.patient.monthOfBirth +
        "-" +
        benDetails.profile.patient.dayOfBirth
    );
    let req = {
      firstName: benDetails.profile.patient.firstName,
      lastName: benDetails.profile.patient.lastName,
      dOB: date.toISOString(),
      genderName: benDetails.profile.patient.gender,
      genderID: this.genderID,
      i_bendemographics: {
        stateName: benDetails.profile.patient.address.state,
        stateID: this.stateID,
        districtName: benDetails.profile.patient.address.district,
        districtID: this.districtID,
        servicePointID: localStorage.getItem("servicePointID"),
        servicePointName: localStorage.getItem("servicePointName"),
      },
      benPhoneMaps: [ {
        parentBenRegID: null,
        benRelationshipID: null,
        phoneNo: null,
        vanID: servicePointDetails.vanID,
        parkingPlaceID: servicePointDetails.parkingPlaceID,
        createdBy: localStorage.getItem("userName")
      }      
      ],
      providerServiceMapId: localStorage.getItem("providerServiceID"),
      vanID: servicePointDetails.vanID,
      parkingPlaceID: servicePointDetails.parkingPlaceID,
      createdBy: localStorage.getItem("userName"),
    };

    this.registrarService.submitBeneficiary(req).subscribe(
      (resp) => {
        if (resp && resp.statusCode === 200) {
          this.confirmationService.alert(resp.data.response, "success");
          this.updateAmritIDInMongo(benDetails, resp.data.response);
        } else {
          this.confirmationService.alert(resp.errorMessage, "error");
        }
      },
      (error) => {
        this.confirmationService.alert(error, "error");
      }
    );
  }
  getDistrict(benDetails, stateID) {
    this.registrarService
      .getDistrictList(stateID)

      .subscribe((res) => {
        if (res && res.statusCode === 200) {
          this.districtList = res.data;
          if (this.districtList != null && this.districtList.length > 0) {
            this.districtList.forEach((element) => {
              if (
                (element.districtName).toLowerCase() ==
                (benDetails.profile.patient.address.district).toLowerCase()
              )
                this.districtID = element.districtID;
            });
          }
        }
      });
  }
  /* Ends - Update external beneficiary details in AMRIT*/
  sendRegisteredBeneficiaryToNurse(benObject: any) {
    if(benObject.amritID !== null && benObject.amritID !== undefined && benObject.amritID !== '') {
      const vanID = JSON.parse(localStorage.getItem("serviceLineDetails")).vanID;
      benObject["providerServiceMapId"] =
        localStorage.getItem("providerServiceID");
      benObject["vanID"] = vanID;
      this.confirmationService
        .confirm(
          `info`,
          this.currentLanguageSet.alerts.info.confirmSubmitBeneficiary
        )
        .subscribe((result) => {
          if (result) this.sendToNurseWindow(result, benObject);
        });
    } else {
      this.confirmationService.alert('Please register the beneficiary in AMRIT', 'info');
    }
   
  }
  updateAmritIDInMongo(benDetails, amritId) {
    const benID = amritId.replace(/\D/g, "");
    const updateAmritID = {
      id: benDetails.id,
      externalId: benDetails.externalId,
      amritId: benID,
    };
    this.registrarService.updateBenDetailsInMongo(updateAmritID).subscribe(
      (updatedAmritID) => {
        if (updatedAmritID !== undefined && updatedAmritID !== null) {
          console.log(updatedAmritID.data.response, "success");
          this.searchBeneficiaryInMongo(null);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
nextPage()
{
  this.pageNo=this.pageNo + 1;
  if(this.externalSearchTerm.pageNo !=undefined && this.pageNo !=null)
  this.externalSearchTerm.pageNo=this.pageNo - 1;
 // this.searchBeneficiaryInMongo(this.pageNo);
 this.registrarService
      .externalSearchIdentity(this.externalSearchTerm)
      .subscribe(
        (externalBenList) => {
          if (
            externalBenList.response !== undefined &&
            externalBenList.response !== null &&
            externalBenList.response === "patient not found"
          ) {
            this.confirmationService.alert(
              this.currentLanguageSet.alerts.info.beneNotFound,
              "info"
            );
          } else {
            if (externalBenList && externalBenList.length > 0) {
              this.externalBeneficiaryList =
                this.searchExternalRestruct(externalBenList);
              this.filteredExternalBeneficiaryList =
                this.externalBeneficiaryList;
              // this.activePage = 1;
              // this.pageChangedExternal({
              //   page: this.activePage,
              //   itemsPerPage: this.rowsPerPage,
              // });
            }
            else
            {
              this.confirmationService.alert(
                "No further records to show",
                "info"
              );
              this.pageNo=this.pageNo - 1;
              // this.externalBeneficiaryList =[];
              // this.filteredExternalBeneficiaryList =[];
            }
          }
        },
        (error) => {
          this.pageNo=this.pageNo - 1;
          this.confirmationService.alert(error, "error");
        }
      );
}
prevPage()
{
  this.pageNo=this.pageNo - 1;
  this.searchBeneficiaryInMongo(this.pageNo);
}
  navigateTORegistrar() {
    let link = "/registrar/registration";
    let currentRoute = this.router.routerState.snapshot.url;
    console.log("currentRoute", currentRoute);
    if (currentRoute != link) {
      console.log("log in");
      if (this.beneficiaryList == undefined) {
        this.router.navigate([link]);
      } else if (this.beneficiaryList != undefined) {
        if (this.beneficiaryList.length == 0) {
          this.router.navigate([link]);
        } else {
          this.confirmationService
            .confirm(
              `info`,
              this.currentLanguageSet.alerts.info.navigateSearchedData,
              "Yes",
              "No"
            )
            .subscribe((result) => {
              if (result) {
                this.router.navigate([link]);
              }
            });
        }
      }
    }
  }

  // migrateBeneficiaryToAmrit(benDetails)
  // {
  //   this.confirmationService.confirm(`info`, "Please Confirm to Migrate Beneficiary Details to Amrit")
  //   .subscribe(result => {
  //     if (result) this.sendBenToAmrit(benDetails);
  //   });

  
  // }

  // sendBenToAmrit(benDetails)
  // {
  //   this.registrarService.migrateBenToAmrit(benDetails)
  //   .subscribe(resp => {
  //     if (resp && resp.statusCode === 200 && resp.response) {
  //     if (resp.response !== undefined && resp.response === "Patient Already Migrated") {
        
  //       this.confirmationService.alert("Patient Already Migrated to Amrit", 'info');
  //       this.transferMigratedBeneficiaryToNurse(benDetails);

  //     } else {

  //       if(resp.response !== undefined && resp.response === "Patient Successfully Migrated")
  //       {
  //         this.confirmationService.alert("Patient Already Migrated to Amrit", 'info');
  //         this.transferMigratedBeneficiaryToNurse(benDetails);
  //       }
  //     }
  //   }
  //   else{
  //     this.confirmationService.alert(resp.errorMessage, 'error')
  //   }
      
  //   }, error => {
  //     this.confirmationService.alert(error, 'error');
  //   });
  // }
 
  transferMigratedBeneficiaryToNurse(benObject: any) {

      
      let vanID = JSON.parse(localStorage.getItem('serviceLineDetails')).vanID;
      benObject['providerServiceMapId'] = localStorage.getItem('providerServiceID');
      benObject['vanID'] = vanID
      this.confirmationService.confirm(`info`, this.currentLanguageSet.alerts.info.confirmSubmitBeneficiary)
        .subscribe(result => {
          if (result) this.sendToNurseWindow(result, benObject);
        });
    
  }
}
