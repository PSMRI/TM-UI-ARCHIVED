import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ConfirmationService } from './../../core/services/confirmation.service';
import { Router, Route } from '@angular/router';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'app-redir-fallback',
  templateUrl: './redir-fallback.component.html',
  styleUrls: ['./redir-fallback.component.css']
})
export class RedirFallbackComponent implements OnInit, AfterViewInit {
  current_language_set: any;

  constructor(private confirmationService: ConfirmationService, private router: Router, private cd: ChangeDetectorRef, public httpServiceService: HttpServiceService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }
  ngAfterViewInit() {
    Promise.resolve(null).then(() => {
      this.confirmationService.alert(this.current_language_set.alerts.info.IssuesinConnectingtoInventory, 'error');
      this.router.navigate(['/pharmacist/pharmacist-worklist'])
    }
    );
    // setTimeout(() => {
    //   this.confirmationService.alert('Issues in connecting to Inventory, try again later', 'error');
    //   this.router.navigate(['/pharmacist/pharmacist-worklist'])
    // }, 100);

  }

}
