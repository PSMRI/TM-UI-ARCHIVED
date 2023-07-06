import { Component, OnInit, Input } from "@angular/core";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";

@Component({
  selector: "app-anc-case-sheet",
  templateUrl: "./anc-case-sheet.component.html",
  styleUrls: ["./anc-case-sheet.component.css"]
})
export class AncCaseSheetComponent implements OnInit {
  @Input("data")
  caseSheetData: any;
  @Input("previous")
  previous: any;
  aNCDetailsAndFormula: any;
  aNCImmunization: any;
  current_language_set: any;

  constructor(public httpServiceService: HttpServiceService) {}

  ngOnInit() {
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
    // this.changeLanguage();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }

  ngOnChanges() {
    if (
      this.caseSheetData &&
      this.caseSheetData.nurseData &&
      this.caseSheetData.nurseData.anc
    ) {
      this.aNCDetailsAndFormula = this.caseSheetData.nurseData.anc.ANCCareDetail;
      this.aNCImmunization = this.caseSheetData.nurseData.anc.ANCWomenVaccineDetails;
    }
  }
  language_file_path: any = "./assets/";
  language: any;

  changeLanguage() {
    this.language = sessionStorage.getItem("setLanguage");

    if (this.language != undefined) {
      this.httpServiceService
        .getLanguage(this.language_file_path + this.language + ".json")
        .subscribe(
          response => {
            if (response) {
              this.current_language_set = response[this.language];
            } else {
              console.log(
                this.current_language_set.alerts.info.comingUpWithThisLang +
                  " " +
                  this.language
              );
            }
          },
          error => {
            console.log(
              this.current_language_set.alerts.info.comingUpWithThisLang +
                " " +
                this.language
            );
          }
        );
    } else {
      this.httpServiceService.currentLangugae$.subscribe(
        response => (this.current_language_set = response)
      );
    }
  }
}
