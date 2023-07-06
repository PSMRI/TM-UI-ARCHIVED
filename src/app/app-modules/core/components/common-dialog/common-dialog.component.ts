import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-common-dialog',
  templateUrl: './common-dialog.component.html',
  styleUrls: ['./common-dialog.component.css'],
})
export class CommonDialogComponent implements OnInit {
  @Output() cancelEvent = new EventEmitter();

  public title: string;
  public message: string;
  public status: string;
  public btnOkText?: string;
  public btnCancelText?: string;
  public alert: boolean;
  public alertFetsenseMessage: boolean;
  public confirmAlert: boolean;
  public confirmcalibration: boolean;
  public confirmHealthID:boolean;
  public remarks: boolean;
  public capture: boolean;
  public editRemarks: boolean;
  public comments: string;
  public notify: boolean;
  public mandatories: any;

  // Choose from Radio Button
  public choice: boolean;
  public values: any;
  public selectedValue: any;
  // Choose from Radio Button Ends

  // selectable
  
  public choiceSelect:boolean;
  public options:any
  public selectedOption :any;
  public confirmCBAC:boolean;
  public cbacData:any=[];
  constructor(public dialogRef: MdDialogRef<CommonDialogComponent>) { }

  ngOnInit() {
  }

  Confirm() {
    this.cancelEvent.emit(null);
  }

  sessionTimeout: any;
  minutes: number;
  seconds: number;
  timer: number;

  intervalRef: any;

  updateTimer(timer) {
    this.timer = timer;

    if (timer && timer > 0) {
      this.intervalRef = setInterval(() => {
        if (timer == 0) {
          clearInterval(this.intervalRef);
          this.dialogRef.close({ action: 'timeout'});
        } else {
          this.minutes = timer / 60;
          this.seconds = timer % 60;
          timer--;
          this.timer = timer;
        }
      }, 1000);
    }
  }

  stopTimer() {
    clearInterval(this.intervalRef);
    this.dialogRef.close({action: 'cancel', remainingTime: this.timer});
  }

  continueSession() {
    clearInterval(this.intervalRef);
    this.dialogRef.close({action: 'continue'});
  }

}
