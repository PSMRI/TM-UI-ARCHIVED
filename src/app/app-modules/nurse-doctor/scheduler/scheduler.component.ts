import { Component, OnInit, Input, Inject, DoCheck } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';

import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { DoctorService } from '../shared/services/doctor.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { NurseService } from '../shared/services';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit, DoCheck {

  schedulerForm: FormGroup
  currentLanguageSet: any;
  ansComorbid: string;
  constructor(private doctorService: DoctorService,  private nurseService: NurseService,
    public httpServiceService: HttpServiceService, private confirmationService: ConfirmationService, @Inject(MD_DIALOG_DATA) public dialogData: any, private fb: FormBuilder, public mdDialogRef: MdDialogRef<SchedulerComponent>) { }
  today: Date;
  schedulerDate: Date
  scheduledData: any
  ngOnInit() {
    this.assignSelectedLanguage();
    if (this.dialogData) {
      this.scheduledData = this.dialogData
      console.log('this.dialogData', this.dialogData);
    } else {
      this.today = new Date();
      this.schedulerDate = new Date();
      this.schedulerForm = this.createSchedulerForm();
    }

  }
  clearScheduledSlot() {
    let modalClear = {
      clear : true
    }
    
    localStorage.setItem('setComorbid',"false");
    this.ansComorbid=localStorage.getItem("setComorbid");
    //this.outputToParent.emit( this.answer1);
    this.nurseService.filter(this.ansComorbid);
    this.mdDialogRef.close(modalClear);
  }

  closeModal() {
    this.mdDialogRef.close(false);
  }

  createSchedulerForm() {
    return this.fb.group({
      allocation: null,
      allocationDate: null,
      specialization: null,
      specialistDetails: null,
    })
  }

  checkAllocation(allocation) {
    this.availableSlotList = null;
    this.masterSpecialization = [];
    this.masterSpecialistDetails = [];
    let today = new Date();
    let checkdate = new Date();
    if (allocation == true) {
      this.schedulerForm.patchValue({
        allocationDate: today,
        specialization: null,
        specialistDetails: null,
      })
      this.schedulerDate = today;
      this.today = today;
      this.getMasterSpecialization();
    }
    if (allocation == false) {
      this.masterSpecialization = [];
      checkdate.setMonth(today.getMonth() + 2)
      today.setDate(today.getDate() + 1)
      this.schedulerForm.patchValue({
        allocationDate: null,
        specialization: null,
        specialistDetails: null,
      })
      this.schedulerDate = checkdate;
      this.today = today;
    }

  }

  get allocation() {
    return this.schedulerForm.controls['allocation'].value;
  }

  get allocationDate() {
    return this.schedulerForm.controls['allocationDate'].value;
  }

  get specialistDetails() {
    return this.schedulerForm.controls['specialistDetails'].value;
  }

  get specialization() {
    return this.schedulerForm.controls['specialization'].value;
  }

  masterSpecialization: any = [];
  getMasterSpecialization() {
    this.availableSlotList = null;
    this.masterSpecialization = [];
    this.masterSpecialistDetails = [];
    let today = new Date();
    this.allocationDate.setMinutes(today.getMinutes() + 330)
    this.schedulerForm.patchValue({
      specialization: null,
      specialistDetails: null,
    })
    this.doctorService.getMasterSpecialization().subscribe((response) => {
      if (response && response.statusCode == 200) {
        this.masterSpecialization = response.data
      } else {
        this.confirmationService.alert(response.errorMessage, 'error');
      }
    }, err => {
      this.confirmationService.alert(err, 'error');
    });
  }

  masterSpecialistDetails: any = [];
  getSpecialist() {
    this.availableSlotList = null;
    this.masterSpecialistDetails = [];
    this.schedulerForm.patchValue({
      specialistDetails: null,
    })
    let specialistReqObj = {
      "providerServiceMapID": localStorage.getItem('providerServiceID'),
      "specializationID": this.specialization.specializationID,
      "userID": localStorage.getItem('userID')
    }

    this.doctorService.getSpecialist(specialistReqObj).subscribe((response) => {
      if (response && response.statusCode == 200) {
        this.masterSpecialistDetails = response.data;
      } else {
        this.confirmationService.alert(response.errorMessage, 'error');
      }
    }, err => {
      this.confirmationService.alert(err, 'error');
    });
  }

  availableSlotList: any;
  getAvailableSlot(specialistDetails) {
    this.availableSlotList = null;
    let slotDate = new Date();
    let today = new Date();
    slotDate = this.allocationDate;


    let availableSlotReqObj = {
      "userID": this.specialistDetails.userID,
      "date": slotDate
    }

    this.doctorService.getAvailableSlot(availableSlotReqObj).subscribe((response) => {
      if (response && response.statusCode == 200) {
        this.availableSlotList = response.data.slots
      } else {
        this.confirmationService.alert(response.errorMessage, 'error');
      }
    }, err => {
      this.confirmationService.alert(err, 'error');
    });
  }

  selectedSlot: any;
  selectAvailableSlot(slot) {
    if (slot.status.toLowerCase() == "available")
      this.selectedSlot = slot;
  }

  saveScheduledSlot() {
    if (this.selectedSlot && this.specialistDetails) {
      let tmSlot = {
        "walkIn": this.allocation,
        "specializationID": this.specialization.specializationID,
        "allocationDate": this.allocationDate,
        "userID": this.specialistDetails.userID,
        "fromTime": this.selectedSlot.fromTime,
        "toTime": this.selectedSlot.toTime,
      }
      let modalData = Object.assign({
        "schedulerForm": this.schedulerForm.value,
        "tmSlot": tmSlot
      })
      console.log('modalData', modalData);

      localStorage.setItem('setComorbid',"true");
    this.ansComorbid=localStorage.getItem("setComorbid");
    //this.outputToParent.emit( this.answer1);
    this.nurseService.filter(this.ansComorbid);

      this.mdDialogRef.close(modalData);
    } else {
      this.mdDialogRef.close(null);
    }
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
