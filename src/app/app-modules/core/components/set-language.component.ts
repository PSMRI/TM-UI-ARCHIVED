/*
 * JA354063 - Created on 21-07-21
 */
import { Component, DoCheck } from "@angular/core";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";

@Component({
  template: "",
})
export class SetLanguageComponent  {
  currentLanguageObject: any;
  constructor(private httpServices: HttpServiceService) {}

  // ngDoCheck() {
  //   this.setLanguage();
  // }

  setLanguage() {
    const languageSubscription = this.httpServices.currentLangugae$.subscribe(
      (languageResponse) => {
        this.currentLanguageObject = languageResponse;
      },
      (err) => {
        console.log(err);
      },
      () => {
        console.log("completed");
      }
    );
    languageSubscription.unsubscribe();
  }
}
