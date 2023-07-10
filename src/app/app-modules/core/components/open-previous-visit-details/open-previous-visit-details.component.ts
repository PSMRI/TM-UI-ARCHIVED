import { Component, OnInit } from "@angular/core";
import { ConfirmationService } from "app/app-modules/core/services";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { DoctorService } from "app/app-modules/nurse-doctor/shared/services";
import { SetLanguageComponent } from "../set-language.component";

@Component({
    selector: 'app-open-previous-visit-details',
    templateUrl: './open-previous-visit-details.component.html',
    styleUrls: ['./open-previous-visit-details.component.css']
  })
  export class OpenPreviousVisitDetailsComponent implements OnInit {
    currentLanguageSet: any;
    previousVisitData: any = [];
    previousHistoryRowsPerPage = 2;
    previousHistoryActivePage = 1;
    filteredHistory: any = [];
    
    constructor(
        public httpServiceService: HttpServiceService,
        private doctorService: DoctorService,
        private confirmationService: ConfirmationService
      ) { }
    ngOnInit(): void {
        this.assignSelectedLanguage();
        this.loadPreviousVisitDetails();
    }

    assignSelectedLanguage() {
        const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
        getLanguageJson.setLanguage();
        this.currentLanguageSet = getLanguageJson.currentLanguageObject;
      }

      loadPreviousVisitDetails() {
        this.doctorService.getTMHistory().subscribe((data) => {
          console.log('data', data);
          if (data.statusCode == 200) {
            this.previousVisitData = data.data;
            this.getEachVisitData();
          }
          else {
            this.confirmationService.alert(this.currentLanguageSet.unableToLoadData, "error")
          }
        }, err => {
          this.confirmationService.alert(this.currentLanguageSet.unableToLoadData, 'error');
        });
      }

      getEachVisitData(){
        this.previousVisitData.forEach((item, i) => {
          if(item.visitCode){
            let reqObj = {
              'VisitCategory': item.VisitCategory,
              'benFlowID': item.benFlowID,
              'beneficiaryRegID': item.beneficiaryRegID,
              'visitCode': item.visitCode
            }
            this.doctorService.getTMCasesheetData(reqObj).subscribe(res => {
              if(res.statusCode == 200 && res.data !== null){
                this.previousVisitData[i]['benPreviousData'] = res.data;
                //this.previousVisitData.push({ 'benPreviousData': res.data});
                this.filteredHistory = res.data;
                // this.previousHistoryPageChanged({
                //   page: this.previousHistoryActivePage,
                //   itemsPerPage: this.previousHistoryRowsPerPage
                // });
              }
            });
          }
        });
        this.previousHistoryPageChanged({
            page: this.previousHistoryActivePage,
             itemsPerPage: this.previousHistoryRowsPerPage
           });
        console.log("previous data", this.previousVisitData);
      }

      previousHistoryPagedList = [];
      previousHistoryPageChanged(event): void {
        console.log('called', event)
        const startItem = (event.page - 1) * event.itemsPerPage;
        const endItem = event.page * event.itemsPerPage;
        this.previousHistoryPagedList.push(this.previousVisitData[0]);
        // this.previousHistoryPagedList = this.previousVisitData.slice(startItem, endItem);
        console.log('list', this.previousHistoryPagedList)
      }

      filterHistory(searchTerm?: String) {
        if (!searchTerm) {
          this.filteredHistory = this.previousVisitData;
        }
        else {
          this.filteredHistory = [];
          this.previousVisitData.forEach((item) => {
            const value: string = '' + item.VisitCategory;
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredHistory.push(item);
            }
          });
        }
        this.previousHistoryActivePage = 1;
        this.previousHistoryPageChanged({
          page: 1,
          itemsPerPage: this.previousHistoryRowsPerPage
        })
      }
    
    
  }