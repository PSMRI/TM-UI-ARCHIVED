import { Component, Inject, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';

@Component({
  selector: 'app-view-health-id-card',
  templateUrl: './view-health-id-card.component.html',
  styleUrls: ['./view-health-id-card.component.css']
})
export class ViewHealthIdCardComponent implements OnInit {

  imgUrl: any;
  currentLanguageSet: any;
  constructor(public dialogSucRef: MdDialogRef<ViewHealthIdCardComponent>,@Inject(MD_DIALOG_DATA) public data:any,
  public sanitizer: DomSanitizer, public httpServiceService: HttpServiceService,) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    // this.convertIMGToPDF(this.data.imgBase64);

  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }


  transform(){
    
    let imgBaseUrl= 'data:image/png;base64, ' + this.data.imgBase64;
    return this.sanitizer.bypassSecurityTrustResourceUrl(imgBaseUrl);
}

  convertIMGToPDF(baseResponse) {
   
    if (baseResponse != undefined) {
      var byteCharacters = atob(baseResponse);
      var byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      const blob1 = new Blob([byteArray], { type: 'application/pdf;base64' });
      
      var fileURL = URL.createObjectURL(blob1);
      this.imgUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

      

  }
}

  closeDialog() {
    this.dialogSucRef.close();
  }

  downloadHealthIDCard() {
   
    let srcFilePath = this.data.imgBase64.replace('data:image/png;base64, ', '');
    const blobData = this.convertBase64ToBlobData(srcFilePath);

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      //IE
      window.navigator.msSaveOrOpenBlob(blobData, 'ABHACard');
    } else {
      // chrome
      const blob = new Blob([blobData], { type: 'image/png' });
      const url = window.URL.createObjectURL(blob);
      // window.open(url);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ABHACard';
      link.click();
    }
    
  }

  

  convertBase64ToBlobData(base64Data) {
    let contentType: string = 'image/png';
    let sliceSize = 512;
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  downloadPdf(base64String, fileName){
    if(window.navigator && window.navigator.msSaveOrOpenBlob){ 
      // download PDF in IE
      let byteChar = atob(base64String);
      let byteArray = new Array(byteChar.length);
      for(let i = 0; i < byteChar.length; i++){
        byteArray[i] = byteChar.charCodeAt(i);
      }
      let uIntArray = new Uint8Array(byteArray);
      let blob = new Blob([uIntArray], {type : 'application/pdf'});
      window.navigator.msSaveOrOpenBlob(blob, `${fileName}.pdf`);
    } else {
      // Download PDF in Chrome etc.
      const source = `data:application/pdf;base64,${base64String}`;
      const link = document.createElement("a");
      link.href = source;
      link.download = `${fileName}.pdf`
      link.click();
    }

  


}
}
