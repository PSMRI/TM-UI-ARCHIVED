import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from "@angular/core";
import {FormBuilder, FormGroup } from "@angular/forms";
import { MasterdataService, DoctorService } from "../../shared/services";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";

@Component({
  selector: "contact-history",
  templateUrl: "./contact-history.component.html",
  styleUrls: ["./contact-history.component.css"]
})
export class ContactHistoryComponent implements OnInit {
  @Input("patientCovidForm")
  patientCovidForm: FormGroup;

  @Input('mode')
  mode: string;
  @Output() onFilter: EventEmitter<any> = new EventEmitter<any>();
  question3: string;
  TravelPlaces_flag: boolean;
  feverCoughBreath_flag: boolean;
  confirmedCaseCOVID_flag: boolean;
  contactArray: any;
  // contactData = ["Is a confirmed case of COVID-19 2020","Is having symptoms of Fever, Cough or breathing difficulty","Has a history of travel to places reporting local transmission","None of the above"]
  // contactList = ["Is a confirmed case of COVID-19 2020","Is having symptoms of Fever, Cough or breathing difficulty","Has a history of travel to places reporting local transmission","None of the above"]
  contactList : any;
  contactData : any;
  cont: string;
  allSymp: string;
  contactReqiured: string;
  contactResponseList : any;
  contactFlag : boolean = false;
  currentLanguageSet: any;
  constructor( public httpServiceService: HttpServiceService,
    private doctorService: DoctorService,
    private masterdataService: MasterdataService)
  {
    this.masterdataService.listen().subscribe((m:any) => {
      console.log(m);
      this.onSymptomFilterClick(m);
  });
  }
  ngOnInit() {
    this.assignSelectedLanguage();
    localStorage.setItem('contact',null);
    console.log("contactvalue" + this.patientCovidForm.value);
    this.getContactHistoryMasterData();
    // this.getContactDetails(benRegID, visitID);
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  ngOnChanges() {
    if (this.mode == 'view') {
      let visitID = localStorage.getItem('visitID');
      let benRegID = localStorage.getItem('beneficiaryRegID')
      this.getContactDetails(benRegID, visitID);
    }
   
  } 
  ngOnDestroy(){
    if (this.contactHistoryMasterData)
      this.contactHistoryMasterData.unsubscribe();

    if (this.covidContactHistory)
      this.covidContactHistory.unsubscribe();
  }
  covidContactHistory : any;
  getContactDetails(beneficiaryRegID, visitID){
    this.covidContactHistory = this.doctorService.getVisitComplaintDetails(beneficiaryRegID, visitID)
      .subscribe(value => {
        if (value != null && value.statusCode == 200 && value.data != null && value.data.covidDetails != null){
        console.log("contactStatus", value.data.covidDetails.contactStatus);        
          this.patientCovidForm.patchValue({'contactStatus' : value.data.covidDetails.contactStatus});
          this.contactResponseList = value.data.covidDetails.contactStatus;
          this.contactFlag = true;
        }
      });
  }

  getMMUContactDetails(beneficiaryRegID, visitID){
    this.covidContactHistory = this.doctorService.getVisitComplaintDetails(beneficiaryRegID, visitID)
      .subscribe(value => {
        if (value != null && value.statusCode == 200 && value.data != null && value.data.covidDetails != null){      
          this.contactResponseList = value.data.covidDetails.contactStatus;
          this.patientCovidForm.patchValue({'contactStatus' : this.contactResponseList});
          this.contactSelected();
        }
      });
  }

 
contactHistoryMasterData : any;
  getContactHistoryMasterData(){
    this.contactHistoryMasterData = this.masterdataService.nurseMasterData$.subscribe( response => {
     if(response != null){
        console.log("contactmaster",response.covidContactHistoryMaster);    
        //this.contactData = response.covidContactHistoryMaster;
        this.contactArray = response.covidContactHistoryMaster;
        const selectedContact = this.contactArray.map(({ contactHistory }) => contactHistory);
      this.contactData=selectedContact;
      this.contactList=selectedContact;

      if(parseInt(localStorage.getItem("specialistFlag")) == 100)
      {
         let visitID = localStorage.getItem('visitID');
        let benRegID = localStorage.getItem('beneficiaryRegID')
        this.getMMUContactDetails(benRegID, visitID);
      }
      }
    })
  }

  contactSelected() {
   console.log("ConsoleStaus"+this.contactStatus.length)
   if (this.contactStatus.length != 0) {
     if (this.contactStatus.indexOf("None of the above") > -1){
      localStorage.setItem('contact',"false");
      
       this.contactData = this.contactList.filter(item => {
         
         return item == "None of the above"
       })
       //this.answer1=true;
      
     }
     else{
      localStorage.setItem('contact',"true");
       this.contactData = this.contactList.filter(item => {
         return item != "None of the above"
       })
      
   }
   this.cont=localStorage.getItem("contact");
    //this.outputToParent.emit( this.answer1);
    this.httpServiceService.filter( this.cont);
  
 }
   else
  {
    this.contactData = this.contactList;
     localStorage.setItem('contact',"null");
     this.cont=localStorage.getItem("contact");
     //this.outputToParent.emit( this.answer1);
     this.httpServiceService.filter(this.cont);
  } 
 }

  onSymptomFilterClick(symp)
  {
    console.log("Symptom Travel"+symp)
    this.allSymp=localStorage.getItem("allSymptom");
    if(this.allSymp == "true")
    {
    this.contactReqiured="false";
    }
    else{
      this.contactReqiured="true";
    }
    
  }
  /*contactStatuschange(contactStatus) {
    this.confirmedCaseCOVID_flag = false;
    this.feverCoughBreath_flag = false;
    this.TravelPlaces_flag = false;
console.log("contactStatus value " + contactStatus);

    this.patientCovidForm.patchValue({ contactStatus : contactStatus});


    if (contactStatus.length > 0) {
      localStorage.setItem('contact',"true");//change
      //this.covidFill_flag=true;
      this.question3 = "yes";
      this.contactArray = contactStatus;
      for (let a = 0; a < contactStatus.length; a++) {
       

        if (contactStatus[a] == "Is a confirmed case of COVID-19") {
          this.confirmedCaseCOVID_flag = true;
        }

        if (
          contactStatus[a] ==
          "Is having symptoms of Fever, Cough or breathing difficulty"
        ) {
          this.feverCoughBreath_flag = true;
        }

        if (
          contactStatus[a] ==
          "Has a history of travel to places reporting local transmission"
        ) {
          this.TravelPlaces_flag = true;
        }

        //this.contactArray.push(obj)
      }
    } else {
      localStorage.setItem('contact',"false");//change
      this.question3 = "no";
    }
    this.cont=localStorage.getItem("contact");
    //this.outputToParent.emit( this.answer1);
    this.httpServiceService.filter( this.cont);
    //this.populate();
    //this.changeSuspectedCovid();
  }*/
  get contactStatus() {
    return this.patientCovidForm.controls['contactStatus'].value;
  }

}
