import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { CommonService } from '../../core/services/common-services.service';
import { environment } from 'environments/environment';
import { RegistrarService } from '../shared/services/registrar.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';


interface Beneficary {
  firstName: string;
  lastName: string;
  fatherName : string;
  dob : string,
  gender: string;
  genderName: string;
  govtIDtype: string;
  govtIDvalue: string;
  stateID: string;
  districtID: string;
}

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.css'] 
})
export class SearchDialogComponent implements OnInit {


  // for ID Manpulation
  masterData: any;
  masterDataSubscription: any;

  beneficiary: Beneficary;
  states:any;
  districts:any;
  stateID:any;
  districtID:any;
  govtIDs: any;
  countryId = environment.countryId;
@ViewChild('newSearchForm') form: any;
  currentLanguageSet: any;
  today: Date;

  constructor(private confirmationService: ConfirmationService,public httpServiceService: HttpServiceService,
    public mdDialogRef: MdDialogRef<SearchDialogComponent>, public commonService: CommonService,
  private registrarService: RegistrarService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.createBeneficiaryForm();
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.currentLanguageSet = response);
    // Call For MAster Data which will be loaded in Sub Components
    this.callMasterDataObservable();
    // this.getStates();
    this.getStatesData(); //to be called from masterobservable method layter
    this.today = new Date();
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



  createBeneficiaryForm() {
    this.beneficiary = {
      firstName : null,
      lastName : null,
      fatherName : null,
      dob : null,
      gender : null ,
      genderName: null,
      govtIDtype: null,
      govtIDvalue: null,
      stateID: null,
      districtID : null
    }
  }

  resetBeneficiaryForm() {
    this.form.reset();
    this.getStatesData()
  }

  /**
  *
  * Call Master Data Observable
  */
  callMasterDataObservable() {
    this.registrarService.getRegistrationMaster(this.countryId);
    this.loadMasterDataObservable();
  }

  /**
 *
 * Load Master Data of Id Cards as Observable
 */
  loadMasterDataObservable() {
    this.masterDataSubscription = this.registrarService.registrationMasterDetails$
      .subscribe(res => {
        console.log('Registrar master data', res);
        if (res != null) {
          this.masterData = Object.assign({}, res);
          console.log(this.masterData, 'masterDataall');
          this.getStatesData();
          this.govtIDData();
        } /* else {
          this.confirmationService.alert("Not able to get required Information, try again later.", 'warn');
          this.mdDialogRef.close(false);
        } */
      }
    )
  }


  /**
   * select gender Name from id
   */
  selectGender() {
     const genderMaster = this.masterData.genderMaster;
     genderMaster.forEach((element) => {
       if (element.genderID == this.beneficiary.gender) {
        this.beneficiary.genderName = element.genderName;
      }
    })
   console.log(this.beneficiary ,'csdvde');
  }


  /**
   * combining Govt ID lists
   */

   govtIDData() {
     console.log(this.masterData,'govtidddds');
     const govID = this.masterData.govIdEntityMaster;
     const otherGovID = this.masterData.otherGovIdEntityMaster;

     otherGovID.forEach((element) => {
       govID.push(element);
     })
     this.govtIDs = govID;
    //  this.govtIDs = Object.assign({}, this.masterData.govIdEntityMaster, this.masterData.otherGovIdEntityMaster);
  console.log(this.govtIDs, 'idsss');  
  }


  onIDCardSelected() {

  }

  /**
   * get states from localstorage and set default state 
   */
  getStatesData() {
     const location = JSON.parse(localStorage.getItem('location'));
     console.log(location, 'gotit')
    if (location) {
      this.states = location.stateMaster ;
      if (location.otherLoc) {
      this.beneficiary.stateID = location.otherLoc.stateID;
      this.beneficiary.districtID = location.otherLoc.districtID;
      this.onStateChange()
      }
    }
  }



  onStateChange() {
    if (this.beneficiary.stateID) {
      this.registrarService.getDistrictList(this.beneficiary.stateID)
        .subscribe((res) => {
          if (res && res.statusCode === 200) {
            this.districts = res.data;
          } else {
            this.confirmationService.alert(this.currentLanguageSet.alerts.info.issueFetching, 'error');
            this.mdDialogRef.close(false);

          }

        })
    } 
  }
  // getStates() {
  //   this.commonService.getStates(this.countryId).subscribe(res => {this.states = res});

  // }

  getDistricts(stateID){
    this.commonService.getDistricts(stateID).subscribe(res => {this.districts = res});
  }
  
  beneficiaryList:any = [];
  dataObj:any;
  getSearchResult(formValues){
// console.log(formValues,'formValues')
    this.dataObj = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      fatherName: formValues.fatherName,
      dob : formValues.dob,
      genderID: formValues.gender,
      i_bendemographics: {
        stateID: formValues.state,
        districtID: formValues.district
      }
    };
    // console.log(this.dataObj, 'daatObj')
/*     this.dataObj.beneficiaryID = formValues.beneficiaryID;
    this.dataObj.firstName = formValues.firstName;
    this.dataObj.lastName = formValues.lastName;
    this.dataObj.phoneNo = formValues.contactNo;
    this.dataObj.aadharNo = formValues.aadharNo;
    this.dataObj.govtIdentityNo = formValues.governmentID;
    this.dataObj.stateID = null;
  if(formValues.stateID!=undefined){
      this.dataObj.stateID = formValues.stateID;
    }
    this.dataObj.districtID = null;
    if(formValues.districtID!=undefined){
      this.dataObj.districtID = formValues.districtID;
    } */
    //Passing form data to component and closing the dialog
    this.mdDialogRef.close(this.dataObj);
  }  
}
