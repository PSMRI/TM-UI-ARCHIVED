import { Component, OnInit } from '@angular/core';
import { NurseService, DoctorService, MasterdataService } from '../../../shared/services'
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'app-previous-significiant-findings',
  templateUrl: './previous-significiant-findings.component.html',
  styleUrls: ['./previous-significiant-findings.component.css']
})
export class PreviousSignificiantFindingsComponent implements OnInit {

  constructor(private doctorService: DoctorService,
    public httpServiceService: HttpServiceService) { }
  rowsPerPage = 5;
  activePage = 1;
  pagedList = [];
  rotate = true;
  current_language_set: any;
  ngOnInit() {
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(response => this.current_language_set = response);
    this.getPreviousSignificiantFindings();
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
    if (this.previousSignificantFindingsSubs)
      this.previousSignificantFindingsSubs.unsubscribe();
  }

  pageChanged(event): void {
    console.log('called', event)
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedList = this.filteredPreviousSignificiantFindingsList.slice(startItem, endItem);
    console.log('list', this.pagedList)

  }

  previousSignificiantFindingsList = [];
  filteredPreviousSignificiantFindingsList = [];
  previousSignificantFindingsSubs: any;
  getPreviousSignificiantFindings() {
    let benRegID = localStorage.getItem('beneficiaryRegID')
    this.previousSignificantFindingsSubs = this.doctorService.getPreviousSignificiantFindings({ 'beneficiaryRegID': benRegID }).subscribe((data) => {
      console.log('previousSignificantFindingsSubs',data);
      if(data.statusCode == 200){
        if (data.data != null && data.data != undefined && data.data.findings) {
          this.previousSignificiantFindingsList = data.data.findings
          this.filteredPreviousSignificiantFindingsList = this.previousSignificiantFindingsList;
        }
        this.pageChanged({
          page: this.activePage,
          itemsPerPage: this.rowsPerPage
        });
      }
    })
  }

  filterPreviousSignificiantFindingsList(searchTerm?: string) {
    if (!searchTerm)
      this.filteredPreviousSignificiantFindingsList = this.previousSignificiantFindingsList;
    else {
      this.filteredPreviousSignificiantFindingsList = [];
      this.previousSignificiantFindingsList.forEach((item) => {
        for (let key in item) {
          let value: string = '' + item[key];
          if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
            this.filteredPreviousSignificiantFindingsList.push(item); break;
          }
        }
      });
    }
    this.activePage = 1;
    this.pageChanged({
      page: 1,
      itemsPerPage: this.rowsPerPage
    });
  }

}
