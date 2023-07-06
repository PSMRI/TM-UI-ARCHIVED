import { Component, Inject, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { ConfirmationService } from 'app/app-modules/core/services';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';

@Component({
  selector: 'app-set-password-for-abha',
  templateUrl: './set-password-for-abha.component.html',
  styleUrls: ['./set-password-for-abha.component.css']
})
export class SetPasswordForAbhaComponent implements OnInit {
  confirmpwd: any;
  dynamictype: any = "password";
  dynamictypeConfirm: any = "password";
  newpwd: any;
  currentLanguageSet: any;

  constructor(
    public dialogSucRef: MdDialogRef<SetPasswordForAbhaComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private confirmationService: ConfirmationService,
    private httpServiceService: HttpServiceService
  ) 
  {
    dialogSucRef.disableClose = true;
  }

  ngOnInit() {
    this.assignSelectedLanguage();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }
    
  showPWD() {
    this.dynamictype = "text";
  }

  showPWDConfirm() {
    this.dynamictypeConfirm = "text";
  }

  hidePWD() {
    this.dynamictype = "password";
  }

  
  hidePWDConfirm() {
    this.dynamictypeConfirm = "password";
  }


  updatePass() {
    if((this.newpwd === null || this.newpwd === undefined || this.newpwd === "") && 
    (this.confirmpwd === null || this.confirmpwd === undefined || this.confirmpwd === "") ){
      this.confirmationService.confirm("info", this.currentLanguageSet.proceedWithOutPassword, 'Yes', 'No').subscribe(res => {
        if(res)
          this.dialogSucRef.close(null);
      })
    }
    else {
      if (this.newpwd != this.confirmpwd) {
        this.confirmationService.alert(this.currentLanguageSet.passwordDoesNotMatch, "error");
      } else if(!this.testPassword(this.newpwd)) {
        this.confirmationService.alert(this.currentLanguageSet.passwordNotContainSequence, "error");
      }
      else if(!this.passwordValidator(this.newpwd)) {
        this.confirmationService.alert(this.currentLanguageSet.mustContainForSetPassword, "error");
      }
      else{
        this.dialogSucRef.close(this.newpwd);
      }
    }
  }


   testPassword(s) {
    // Check for sequential numerical characters
    for(var i in s){
      if (+s[+i+1] == +s[i]+1 ) return false;
      if (+s[+i+1]+1 == +s[i] ) return false;
    }
    return true;
  }

  closeDialog() {
    this.dialogSucRef.close();
  }


  passwordValidator(password: any) {
    
    if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
      return true;
      // if (password.length >= 8) {
      //   return true;
      // } else {
      //   return false;
      // }
    } else {
      return false;
    }
  }
}
