import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { MasterdataService, DoctorService, NurseService } from '../../shared/services';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { DatePipe } from '@angular/common'
import { IdrsscoreService } from '../../shared/services/idrsscore.service';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ConfirmationService } from 'app/app-modules/core/services';
import { PreviousDetailsComponent } from 'app/app-modules/core/components/previous-details/previous-details.component';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
//import {DatePipe} from '@angular/common';
@Component({
  selector: 'app-general-refer',
  templateUrl: './general-refer.component.html',
  styleUrls: ['./general-refer.component.css'],
  providers: [DatePipe]
})
export class GeneralReferComponent implements OnInit, DoCheck {
  @Input('referForm')
  referForm: FormGroup;

  @Input('referMode')
  referMode: String;

  revisitDate: any;
  tomorrow: any;
  maxSchedulerDate: any;
  today: any;
  higherHealthcareCenter: any;
  additionalServices: any;
  beneficiaryRegID: any;
  visitID: any;
  visitCategory: any;
  date: any;
  previousServiceList: any;
  currentLanguageSet: any;
  referralReason: any;

  selectValue: any;
  selectValueService: any;
  showMsg: any = 0;
  healthCareReferred: boolean = false;
  referralReferred: boolean = false;
  instituteFlag: boolean = false;
  referralSuggested: any = 0;
  referredVisitcode: any;
  designation: string;

  constructor(
    //   private datepipe: DatePipe,
    private fb: FormBuilder,
    private doctorService: DoctorService,
    public httpServiceService: HttpServiceService,
    public datepipe: DatePipe,
    private masterdataService: MasterdataService,
    private idrsScoreService: IdrsscoreService,
    private nurseService: NurseService,
    private dialog: MdDialog,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.visitCategory = localStorage.getItem('visitCategory');
    if (localStorage.getItem("referredVisitCode")) {
      this.referredVisitcode = localStorage.getItem("referredVisitCode");
    }
    else {
      this.referredVisitcode = "undefined";
    }
    this.getDoctorMasterData();
    this.idrsScoreService.clearSuspectedArrayFlag();
    this.idrsScoreService.clearReferralSuggested();
    
    this.idrsScoreService.IDRSSuspectedFlag$.subscribe(response => {
      this.showMsg = response;
      if (this.showMsg > 0)
        sessionStorage.setItem('suspectFlag', "true");
      else
        sessionStorage.setItem('suspectFlag', "false");
    });
    this.idrsScoreService.referralSuggestedFlag$.subscribe(response => {
      this.showMsg = response;
      if (this.showMsg > 0)
        sessionStorage.setItem('suspectFlag', "true");
      else
        sessionStorage.setItem('suspectFlag', "false");
    });
    this.today = new Date();
    let d = new Date();
    let checkdate = new Date();
    d.setDate(d.getDate() + 1)
    checkdate.setMonth(this.today.getMonth() + 3)
    this.maxSchedulerDate = checkdate;
    this.tomorrow = d;

    //designation to show the TMC suggestion.  
    this.designation = localStorage.getItem("designation");
  }
  // getTomorrow() {
  //   let d = new Date();
  //   d.setDate(d.getDate() + 1);
  //   return this.datepipe.transform(d, 'yyyy-MM-dd');
  // }

  ngOnChanges() {

  }

  ngOnDestroy() {
    if (this.doctorMasterDataSubscription)
      this.doctorMasterDataSubscription.unsubscribe();
    if (this.referSubscription)
      this.referSubscription.unsubscribe();
  }

  doctorMasterDataSubscription: any;
  getDoctorMasterData() {
    this.doctorMasterDataSubscription = this.masterdataService.doctorMasterData$.subscribe(masterData => {
      if (masterData) {
        console.log("masterData=", masterData);
        this.higherHealthcareCenter = masterData.higherHealthCare;
        if (this.higherHealthcareCenter.length == 0) {
          this.instituteFlag = false;
          sessionStorage.setItem('instFlag', "false");
        }
        else {
          this.instituteFlag = true;
          sessionStorage.setItem('instFlag', "true");
        }
        this.additionalServices = masterData.additionalServices;
        //to add correct name by checking it from masterdata
        console.log(masterData.revisitDate);
        console.log("hi");
        this.revisitDate = masterData.revisitDate;


        if (this.referMode == 'view') {
          this.beneficiaryRegID = localStorage.getItem('beneficiaryRegID');
          this.visitID = localStorage.getItem('visitID');
          this.visitCategory = localStorage.getItem('visitCategory');
          this.getReferDetails(this.beneficiaryRegID, this.visitID, this.visitCategory);
        }
      }
    });
  }

  referSubscription: any;
  getReferDetails(beneficiaryRegID, visitID, visitCategory) {
    this.referSubscription = this.doctorService.getCaseRecordAndReferDetails(beneficiaryRegID, visitID, visitCategory)
      .subscribe(res => {
        if (res && res.statusCode == 200 && res.data && res.data.Refer) {
          this.patchReferDetails(res.data.Refer);
        }
      })
  }

  patchReferDetails(referDetails) {
    // this.date=new Date();

    this.revisitDate = referDetails.revisitDate;
    this.referralReason = referDetails.referralReason;
    this.revisitDate = this.datepipe.transform(this.revisitDate, 'yyyy-MM-dd')
    let temp = [];
    if (referDetails.refrredToAdditionalServiceList) {
      this.previousServiceList = referDetails.refrredToAdditionalServiceList;
      referDetails.refrredToAdditionalServiceList.map(item => {
        let arr = this.additionalServices.filter(element => {
          return element.serviceName == item.serviceName;
        });
        if (arr.length > 0)
          temp.push(arr[0]);
      });
    }
    console.log('line96' + temp.slice())
    referDetails.refrredToAdditionalServiceList = temp.slice();
    console.log('referDetails', referDetails);
    let referedToInstitute = this.higherHealthcareCenter.filter(item => {
      return item.institutionID == referDetails.referredToInstituteID;
    });
    if (referedToInstitute.length > 0) {
      referDetails.referredToInstituteName = referedToInstitute[0];
    }
    if (referDetails.referralReason != null) {

    }
    console.log("referredDet=" + referDetails);
    console.log("revisitDate" + this.revisitDate);
    referDetails.revisitDate = this.revisitDate;
    referDetails.referralReason = this.referralReason;
    this.referForm.patchValue({ 'referralReason': referDetails.referralReason })
    this.referForm.patchValue(referDetails);
    //check whether health care referred or not 
    // if(referDetails.referredToInstituteName != null){
    //   this.healthCareReferred = true;
    // }
    // if(referDetails.referralReason !=null)
    // {
    //   this.referralReferred = true;
    // }
  }
  get RevisitDate() {
    return this.referForm.get('revisitDate');
  }
  get ReferralReason() {
    return this.referForm.get('referralReason');
  }
  checkdate(revisitDate) {
    this.today = new Date();
    let d = new Date();
    let checkdate = new Date();
    d.setDate(d.getDate() + 1)
    checkdate.setMonth(this.today.getMonth() + 3)
    this.maxSchedulerDate = checkdate;
    this.tomorrow = d;

  }

  canDisable(service) {

    if (this.previousServiceList) {
      let temp = this.previousServiceList.filter(item => {
        return item.serviceID == service.serviceID;
      })

      if (temp.length > 0)
        service.disabled = true;
      else
        service.disabled = false;

      return temp.length > 0;
    }
  }

  public additionalservices(selected: any): void {
    if (selected != null && selected.length > 0) {
      this.selectValueService = selected.length;
      console.log(this.selectValue);
    }


    // should display the selected option.
  }

  public higherhealthcarecenter(selected: any): void {

    if (selected != null && selected.institutionName) {
      this.selectValue = 1;
      this.healthCareReferred = true;
    } // should display the selected option.

    console.log(this.selectValue);
  }


  getPreviousReferralHistory() {
    let benRegID = localStorage.getItem('beneficiaryRegID');
    this.nurseService.getPreviousReferredHistory(benRegID, this.visitCategory)
      .subscribe(res => {
        if (res.statusCode == 200 && res.data != null) {
          if (res.data.data.length > 0) {
            this.viewPreviousData(res.data);
          } else {
            this.confirmationService.alert(this.currentLanguageSet.Referdetails.previousReferralhistorynotAvailable);
          }
        } else {
          this.confirmationService.alert(this.currentLanguageSet.Referdetails.errorInFetchingPreviousHistory, 'error');
        }
      }, err => {
        this.confirmationService.alert(this.currentLanguageSet.Referdetails.errorInFetchingPreviousHistory, 'error');
      })
  }

  viewPreviousData(data) {
    this.dialog.open(PreviousDetailsComponent, {
      data: { 'dataList': data, title: this.currentLanguageSet.previousReferralHistoryDetails }
    });
  }

  loadMMUReferDeatils() {
    let reqObj = {
      "benRegID": localStorage.getItem('beneficiaryRegID'),
      "visitCode": localStorage.getItem("referredVisitCode"),
      "benVisitID": localStorage.getItem("referredVisitID"),
      "fetchMMUDataFor": "Referral"
    }
    if (localStorage.getItem("referredVisitCode") !== "undefined" && localStorage.getItem("referredVisitID") !== "undefined") {
      this.doctorService.getMMUData(reqObj)
        .subscribe(res => {
          if (res.statusCode == 200 && res.data != null) {
            if (res.data.data.refrredToAdditionalServiceList.length > 0) {
              this.viewMMUReferData(res.data);
            } else {
              this.confirmationService.alert(this.currentLanguageSet.Referdetails.mMUReferraldetailsnotAvailable);
            }
          } else {
            this.confirmationService.alert(this.currentLanguageSet.Referdetails.errorInFetchingMMUReferraldetails, 'error');
          }
        }, err => {
          this.confirmationService.alert(this.currentLanguageSet.Referdetails.errorInFetchingMMUReferraldetails, 'error');
        })
    }
  }

  viewMMUReferData(data) {
    this.dialog.open(PreviousDetailsComponent, {
      data: { 'dataList': data, title: this.currentLanguageSet.Referdetails.mMUReferralDetails }
    });
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
}
