import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
@Component({
  selector: 'app-beneficiary-mcts-call-history',
  templateUrl: './beneficiary-mcts-call-history.component.html',
  styleUrls: ['./beneficiary-mcts-call-history.component.css']
})
export class BeneficiaryMctsCallHistoryComponent implements OnInit {
  current_language_set: any;

  constructor(@Inject(MD_DIALOG_DATA) public data: any, public httpServiceService: HttpServiceService,
  public dialogRef: MdDialogRef<BeneficiaryMctsCallHistoryComponent>) { }

  callDetails = []
  filteredCallDetails = [];
  callDetailsRowsPerPage = 5;
  callDetailsActivePage = 1;
  ngOnInit() {
    this.callDetails = this.data;
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
    this.filteredCallDetails = this.data;
    this.callDetailsPageChanged({
      page: this.callDetailsActivePage,
      itemsPerPage: this.callDetailsRowsPerPage
    });

  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }

  filterCallHistory(searchTerm?: String) {
    if (!searchTerm) {
      this.filteredCallDetails = this.callDetails;
    }
    else {
      this.filteredCallDetails = [];
      this.callDetails.forEach((item) => {
        const value: string = '' + item.questionnaireDetail.question;
        if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
          this.filteredCallDetails.push(item);
        }
      });
    }

    this.callDetailsActivePage = 1;
    this.callDetailsPageChanged({
      page: 1,
      itemsPerPage: this.callDetailsRowsPerPage
    })
  }

  callDetailsPagedList = [];
  callDetailsPageChanged(event): void {
    console.log('called', event)
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.callDetailsPagedList = this.filteredCallDetails.slice(startItem, endItem);
    console.log('list', this.callDetailsPagedList)
  }

}
