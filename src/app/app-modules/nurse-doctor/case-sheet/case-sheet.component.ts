import { Component, OnInit, Input, Inject, Injector } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MD_DIALOG_DATA } from "@angular/material";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";

@Component({
  selector: "app-case-sheet",
  templateUrl: "./case-sheet.component.html",
  styleUrls: ["./case-sheet.component.css"]
})
export class CaseSheetComponent implements OnInit {
  QC: boolean = false;
  General: boolean = false;
  NCDScreening: boolean = false;
  CancerScreening: boolean = false;

  preview: any;
  previous: any;
  serviceType: any;
  language: any;
  current_language_set: any;
  language_file_path: any = "./assets/";
  constructor(
    private route: ActivatedRoute,
    private injector: Injector,

    public httpServiceService: HttpServiceService
  ) {}

  ngOnInit() {
   
    this.caseSheetCategory();
    this.serviceType = this.route.snapshot.params["serviceType"];
    console.log("route1" + this.route.snapshot.params["serviceType"]);

    let input = this.injector.get(MD_DIALOG_DATA, null);
    if (input) {
      this.previous = input.previous;
      this.serviceType = input.serviceType;
    }
    
    this.assignSelectedLanguage();

    // this.language = sessionStorage.getItem('setLanguage');
    
    // if (this.language != undefined) {
    //   this.httpServiceService
    //     .getLanguage(this.language_file_path + this.language + ".json")
    //     .subscribe(
    //       response => {
    //         if (response) {
    //           this.current_language_set = response[this.language];             
              
    //         } else {
    //           console.log(
    //             this.current_language_set.alerts.info.comingUpWithThisLang +
    //               " " +
    //               this.language
    //           );
    //         }
    //       },
    //       error => {
    //         console.log(
    //           this.current_language_set.alerts.info.comingUpWithThisLang +
    //             " " +
    //             this.language
    //         );
    //       }
    //     );
    // }else{
    //   this.httpServiceService.currentLangugae$.subscribe(
    //     response => (this.current_language_set = response)
    //   );
    // }

    // console.log(this.current_language_set);
    
    
    // if(this.language == undefined ){
    //
    //   console.log(this.current_language_set);

    // }else{
    //   console.log("route2" + this.language);

    // }
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }
    
  ngOnDestroy() {
    // localStorage.removeItem('caseSheetVisitCategory');
    // localStorage.removeItem('previousCaseSheetVisitCategory')
  }

  caseSheetCategory() {
    let dataStore = this.route.snapshot.params["printablePage"] || "previous";

    let type;
    if (this.previous) {
      if (dataStore == "previous") {
        type = localStorage.getItem("previousCaseSheetVisitCategory");
      }
    } else {
      if (dataStore == "current") {
        type = localStorage.getItem("caseSheetVisitCategory");
      }
      if (dataStore == "previous") {
        type = localStorage.getItem("previousCaseSheetVisitCategory");
      }
    }

    if (type) {
      switch (type) {
        case "Cancer Screening":
          this.CancerScreening = true;
          break;

        case "General OPD (QC)":
        case "General OPD":
        case "NCD care":
        case "PNC":
        case "ANC":
        case "COVID-19 Screening":
        case 'NCD screening':  
          this.General = true;
          break;

        default:
          this.QC = false;
          // this.NCDScreening = false;
          this.CancerScreening = false;
          this.General = false;
          break;
      }
    }
  }
}
