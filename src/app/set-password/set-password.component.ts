import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../app-modules/core/services";
import { ConfirmationService } from "../app-modules/core/services/confirmation.service";
import * as CryptoJS from 'crypto-js';


@Component({
  selector: "app-set-password",
  templateUrl: "./set-password.component.html",
  styleUrls: ["./set-password.component.css"],
})
export class SetPasswordComponent {
  newpwd: any;
  confirmpwd: any;
  password: any;
  uname: any;
  dynamictype: any = "password";
  key: any;
  iv: any;
  SALT: string = "RandomInitVector";
  Key_IV: string = "Piramal12Piramal";
  encPassword: string;
  _keySize: any;
  _ivSize: any;
  _iterationCount: any;
  encryptedConfirmPwd : any;


  constructor(
    private router: Router,
    private authService: AuthService,
    private confirmationService: ConfirmationService
  ) {
            this._keySize = 256;
            this._ivSize = 128;
            this._iterationCount = 1989;
  }

  ngOnInit() {
    this.uname = localStorage.getItem("userName");
  }

  showPWD() {
    this.dynamictype = "text";
  }

  hidePWD() {
    this.dynamictype = "password";
  }

  get keySize() {
		return this._keySize;
	  }
	
	  set keySize(value) {
		this._keySize = value;
	  }
	
	
	
	  get iterationCount() {
		return this._iterationCount;
	  }
	
	
	
	  set iterationCount(value) {
		this._iterationCount = value;
	  }
	
	
	
	  generateKey(salt, passPhrase) {
		return CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), {
		  keySize: this.keySize / 32,
		  iterations: this._iterationCount
		})
	  }
	
	
	
	  encryptWithIvSalt(salt, iv, passPhrase, plainText) {
		let key = this.generateKey(salt, passPhrase);
		let encrypted = CryptoJS.AES.encrypt(plainText, key, {
		  iv: CryptoJS.enc.Hex.parse(iv)
		});
		return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
	  }
	
	  encrypt(passPhrase, plainText) {
		let iv = CryptoJS.lib.WordArray.random(this._ivSize / 8).toString(CryptoJS.enc.Hex);
		let salt = CryptoJS.lib.WordArray.random(this.keySize / 8).toString(CryptoJS.enc.Hex);
		let ciphertext = this.encryptWithIvSalt(salt, iv, passPhrase, plainText);
		return salt + iv + ciphertext;
	  }


  updatePassword(new_pwd) {
    const transactionId = this.authService.transactionId;
    this.password = this.encrypt(this.Key_IV, new_pwd)
		this.encryptedConfirmPwd=this.encrypt(this.Key_IV, this.confirmpwd)
    if (new_pwd === this.confirmpwd) {
      this.authService
        .setNewPassword(this.uname, this.password, transactionId)
        .subscribe(
          (response: any) => {
            if (response !== undefined && response !== null && 
              response.statusCode == 200) {
              this.successCallback(response);
            }
            else {
              this.confirmationService.alert(response.errorMessage, 'error');
              this.router.navigate(['/reset-password']);
            }
          },
          (error: any) => {
            this.errorCallback(error);
          },
          (this.authService.transactionId = null)
        );
    } else {
      this.confirmationService.alert("Password does not match", "error");
    }
  }

  successCallback(response) {
    this.confirmationService.alert("Password changed successfully", "success");
    this.logout();
  }
  logout() {
    this.authService.logout().subscribe((res) => {
      this.router.navigate(["/login"]).then((result) => {
        if (result) {
          localStorage.clear();
          sessionStorage.clear();
        }
      });
    });
  }

  errorCallback(response) {
    console.log(response);
	this.router.navigate(['/reset-password']);
  }
}
