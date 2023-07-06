import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { ConfirmationService } from '../../core/services/confirmation.service';

@Component({
  selector: 'app-view-file',
  templateUrl: './view-file.component.html',
  styleUrls: ['./view-file.component.css']
})
export class ViewFileComponent implements OnInit {

  fileObj: any;
  currentLanguageSet: any;
  constructor(
    @Inject(MD_DIALOG_DATA) public input: any,
    private dialogRef: MdDialogRef<ViewFileComponent>,
    private confirmationService: ConfirmationService,
    private httpServiceService : HttpServiceService) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.assignSelectedLanguage();
    console.log("this.input", this.input.viewFileObj);
    let inputFileObj = this.input.viewFileObj;
    let procedureID = this.input.procedureID;
    this.assignObject(inputFileObj, procedureID);
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }

  assignObject(inputFileObj, procedureID) {
    this.fileObj = inputFileObj[procedureID];
  }
  remove(file) {
    this.confirmationService.confirm('info', this.currentLanguageSet.alerts.info.wantToRemoveFile).subscribe((res) => {
      if (res) {
        const index = this.input.viewFileObj[this.input.procedureID].indexOf(file);
        if (index >= 0) {
          this.input.viewFileObj[this.input.procedureID].splice(index, 1);
        }
        if (this.input.viewFileObj[this.input.procedureID].length == 0) {
          this.closeDialog();
        }

      }
    })
  }
  closeDialog() {
    let returnObj = this.input.viewFileObj;
    this.dialogRef.close(returnObj);
  }

}
