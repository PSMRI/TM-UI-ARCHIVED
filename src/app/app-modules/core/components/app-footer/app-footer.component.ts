import { Component, OnInit, DoCheck, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material';
import { SpecialistLoginComponent } from './../specialist-login/specialist-login.component';
import { SetLanguageComponent } from '../set-language.component';
import { HttpServiceService } from '../../services/http-service.service';
@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.css']
})
export class AppFooterComponent implements OnInit {

  status: boolean;
  isSpecialist: Boolean = false;
  currentLanguageSet: any;
  constructor(private activatedRoute: ActivatedRoute, private snackBar: MatSnackBar,
    public httpServiceService: HttpServiceService,) { }

  year:any;
  today:Date;
  ngOnInit() {
    this.assignSelectedLanguage();
    this.today = new Date();
    this.year = this.today.getFullYear();
    console.log('inside footer',this.year);
    setInterval(() => {
      this.status = navigator.onLine;
    }, 1000);
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }

  // ngDoCheck() {
  //   let currentUrl = this.activatedRoute.snapshot['_routerState'].url
  //   let urlCheck = '/common/attendant/tcspecialist/patient/' + localStorage.getItem('beneficiaryRegID')
  //   if (currentUrl == urlCheck) {
  //     this.isSpecialist = true;
  //   }else{
  //     this.isSpecialist = false
  //   }
  // }
  openSnackBar() {
    let snackBarRef: MatSnackBarRef<SpecialistLoginComponent> = this.snackBar.openFromComponent(SpecialistLoginComponent, {
      horizontalPosition: 'right',
      data : {
         message: 'string',action: 'Save'
      }
    }
    );
    snackBarRef.afterDismissed().subscribe(() => {
      console.log('locsl', JSON.parse(localStorage.getItem('swymedLogin')));
    })
  }

}
