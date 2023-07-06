import {
  Component,
  OnInit,
  Input,
  Output,
  Optional,
  EventEmitter, Inject
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { ConfirmationService } from "../../services/confirmation.service";
import { TelemedicineService } from "../../services/telemedicine.service";
import { environment } from "environments/environment";
import { HttpServiceService } from '../../services/http-service.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ShowCommitAndVersionDetailsComponent } from './../show-commit-and-version-details/show-commit-and-version-details.component';
import { IotBluetoothComponent } from '../iot-bluetooth/iot-bluetooth.component';
import { IotService } from "../../services/iot.service";
// import {LanguageServiceService} from '../../services/language-service.service';


@Component({
  selector: "app-header",
  templateUrl: "./app-header.component.html",
  styleUrls: ["./app-header.component.css"]
})
export class AppHeaderComponent implements OnInit {

  language_file_path: any = "./assets/";
  app_language: any = "English";
  currentLanguageSet: any;
  languageArray: any;
  status: any;
  navigation: any;
  isConnected:Boolean=true;
  /*navigation = [
    {
      role: "Registrar",
      work: [
        { link: "/registrar/registration", label: "Registration" },
        { link: "/registrar/search", label: "Search" }
      ]
    },
    { role: "Nurse", link: "/common/nurse-worklist", label: "Nurse" },
    { role: "Doctor", link: "/common/doctor-worklist", label: "Doctor" },
    { role: "Lab Technician", link: "/lab/worklist", label: "Lab Technician" },
    {
      role: "Pharmacist",
      link: "/pharmacist/pharmacist-worklist",
      label: "Pharmacist"
    },
    {
      role: "Radiologist",
      link: "/common/radiologist-worklist",
      label: "Radiologist"
    },
    {
      role: "Oncologist",
      link: "/common/oncologist-worklist",
      label: "Oncologist"
    },
    {
      role: "TC Specialist",
      work: [
        { link: "/common/tcspecialist-worklist", label: "Worklist" },
        {
          // link: this.telemedicineService.routeToTeleMedecine(),
          label: "Timesheet"
        }
      ]
    },
    { role: "DataSync", link: "/datasync", label: "Data Sync" }
  ];*/
  // @Input('isDarkTheme')
  // isDarkTheme: Boolean;

  @Input("showRoles")
  showRoles: boolean;

  // @Output()
  // dark: EventEmitter <Boolean> = new EventEmitter<Boolean>();

  servicePoint: string;
  userName: string;
  isAuthenticated: boolean;
  roles: any;

  filteredNavigation: any;
  license: any;


  constructor(
    private router: Router,
    private auth: AuthService,
    private telemedicineService: TelemedicineService,
    private http_service: HttpServiceService,
    private confirmationService: ConfirmationService,
    private dialog: MdDialog,public service: IotService
  ) {}

  ngOnInit() {
    this.service.disconnectValue$.subscribe((response) => {
      response === undefined
        ? (this.isConnected = false)
        : (this.isConnected = response);
    });
    this.http_service.currentLangugae$.subscribe(response => {
      this.currentLanguageSet = response;
    });

    this.getUIVersionAndCommitDetails()
    this.servicePoint = localStorage.getItem("servicePointName");
    this.userName = localStorage.getItem("userName");
    this.isAuthenticated =
      sessionStorage.getItem("isAuthenticated") == "true" ? true : false;
    this.license = environment.licenseUrl;
    if (this.isAuthenticated) {
    this.fetchLanguageSet();
    }
    this.status = localStorage.getItem('providerServiceID');
  }
  fetchLanguageSet() {
    this.http_service.fetchLanguageSet().subscribe(languageRes => {
      if (languageRes !== undefined && languageRes !== null) {
      this.languageArray = languageRes;
      this.getLanguage();
      }
    })
    console.log("language array" + this.languageArray);

  }
  changeLanguage(language) {
    
    this.http_service.getLanguage(this.language_file_path+language+".json").subscribe(response => {
      if(response !== undefined && response !== null){
        this.languageSuccessHandler(response,language)
      }else{
        alert(this.currentLanguageSet.alerts.info.langNotDefinesd)
      }      
    },error => {
      alert(this.currentLanguageSet.alerts.info.comingUpWithThisLang + " " + language);
      
    }
    );
  }
  getLanguage() {
    if (sessionStorage.getItem('setLanguage') != null) {
      this.changeLanguage(sessionStorage.getItem('setLanguage'));
    } else {
      this.changeLanguage(this.app_language);
    }
  }

  
  languageSuccessHandler(response, language) {
    console.log("language is ", response);
    if (response == undefined) {
      alert(this.currentLanguageSet.alerts.info.langNotDefinesd)
    }

    if (response[language] != undefined) {
      this.currentLanguageSet = response[language];
      sessionStorage.setItem('setLanguage', language);
      if (this.currentLanguageSet) {
        this.languageArray.forEach(item => {
          if (item.languageName == language) {
            this.app_language = language;
          
          }

        });
      } else {
        this.app_language = language;
      }
     
      this.http_service.getCurrentLanguage(response[language]);
      this.rolenavigation();
    } else {
      alert(this.currentLanguageSet.alerts.info.comingUpWithThisLang + " " + language);
    }
  }
  rolenavigation() {
    this.navigation = [
      {
        role: "Registrar",
        label: this.currentLanguageSet.role_selection.Registrar,

        work: [
          { link: "/registrar/registration", label: this.currentLanguageSet.ro.registration },
          { link: "/registrar/search", label: this.currentLanguageSet.common.search },

        ]

      },
      { role: "Nurse", link: "/common/nurse-worklist", label: this.currentLanguageSet.role_selection.Nurse },
      { role: "Doctor", link: "/common/doctor-worklist", label: this.currentLanguageSet.role_selection.Doctor },
      { role: "Lab Technician", link: "/lab/worklist", label: this.currentLanguageSet.role_selection.LabTechnician },
      {
        role: "Pharmacist",
        link: "/pharmacist/pharmacist-worklist",
        label: this.currentLanguageSet.role_selection.Pharmacist
      },
      {
        role: "Radiologist",
        link: "/common/radiologist-worklist",
        label: this.currentLanguageSet.role_selection.Radiologist
      },
      {
        role: "Oncologist",
        link: "/common/oncologist-worklist",
        label: this.currentLanguageSet.role_selection.Oncologist
      },
      {
        role: "TC Specialist",
        label: this.currentLanguageSet.common.TCSpecialist,
        work: [
          { link: "/common/tcspecialist-worklist", label: 'Worklist', labelName: this.currentLanguageSet.common.Worklist},
          {
            label: "Timesheet",
            // link: this.telemedicineService.routeToTeleMedecine(),
            labelName: this.currentLanguageSet.common.timeSheet 
          }
        ]
      },
      { role: "DataSync", link: "/datasync", label: this.currentLanguageSet.common.dataSync}
    ];
    if (this.showRoles) {
      this.roles = JSON.parse(localStorage.getItem("role"));
      this.filteredNavigation = this.navigation.filter(item => {
        return this.roles.includes(item.role);
      });
    }
  }
  DataSync() {
    this.router.navigate(["/datasync"]);
  }

  logout() {
    this.auth.logout().subscribe(res => {
      this.router.navigate(["/login"]).then(result => {
        if (result) {
          localStorage.clear();
          sessionStorage.clear();
        }
      });
    });
  }
  getSwymedLogout() {
    this.auth.getSwymedLogout().subscribe((res) => {
      window.location.href = res.data.response;
      this.logout();
    })
  }
  navigateToTeleMedicine() {
    this.telemedicineService.routeToTeleMedecine();
  }

  commitDetailsUI: any;
  versionUI: any
  getUIVersionAndCommitDetails() {
    let commitDetailsPath: any = "assets/git-version.json";
    this.auth.getUIVersionAndCommitDetails(commitDetailsPath).subscribe((res) => {
      console.log('res', res);
      this.commitDetailsUI = res
      this.versionUI = this.commitDetailsUI['version']
    }, err => {
      console.log('err', err);

    })
  }
  showVersionAndCommitDetails() {
    this.auth.getAPIVersionAndCommitDetails().subscribe((res) => {
      if (res.statusCode == 200) {
        this.constructAPIAndUIDetails(res.data);
      } else {
      }
    }, err => {
    })
  }
  constructAPIAndUIDetails(apiVersionAndCommitDetails) {
    let data = {
      commitDetailsUI: {
        version: this.commitDetailsUI['version'],
        commit: this.commitDetailsUI['commit']
      },
      commitDetailsAPI: {
        version: apiVersionAndCommitDetails['git.build.version'] || 'NA',
        commit: apiVersionAndCommitDetails['git.commit.id'] || 'NA'
      }
    }
    if (data) {
      this.showData(data)
    }
  }
  showData(versionData) {
    let dialogRef = this.dialog.open(ShowCommitAndVersionDetailsComponent, {
      data: versionData
    });

  }

  openIOT() {
    let dialogRef = this.dialog.open(IotBluetoothComponent, {
      width: "600px"
    });
  }
}
