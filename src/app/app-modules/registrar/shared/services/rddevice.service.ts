import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class RddeviceService {
  private apiUrl = 'https://127.0.0.1:';

  rdURL='';
  MethodInfo='/rd/info';
  MethodCapture = '/rd/capture';
  httpStaus: boolean = false;
  capturePID: any;
  pidDetail: any= null ;
  pidDetailData = new BehaviorSubject<any>(this.pidDetail);
  pidDetailDetails$ = this.pidDetailData.asObservable();
  pidResponseData: any;

  constructor(private http: HttpClient) { }
  
  discoverAvdm(): Observable<any> {
    const primaryUrl = window.location.protocol === 'https:' ? 'https://127.0.0.1:' : 'http://127.0.0.1:';
    const discoveryRange = Array.from({ length: 21 }, (_, i) => i + 11101);
    return new Observable((observer) => {
      this.discoverRecursive(observer, primaryUrl, discoveryRange, 0);
    });
  }

  private discoverRecursive(observer, primaryUrl, discoveryRange, index) {
    if (index >= discoveryRange.length) {
      observer.error('Connection failed. Please try again.');
      observer.complete();
      return;
    }

    const port = discoveryRange[index];
    const url = `${primaryUrl}${port}`;
    this.rdURL=`${primaryUrl}${port}`;

    $.ajax({

      type: "RDSERVICE",
      async: false,
      crossDomain: true,
      url: primaryUrl + "11101",
      contentType: "text/xml; charset=utf-8",
      processData: false,
      cache: false,

      success: function (data) {

        this.httpStaus = true;
        var res = { httpStaus: this.httpStaus, data: data };
        var finalUrl = primaryUrl + "11101";
        var $doc = $.parseXML(data);
        var CmbData1 =  $($doc).find('RDService').attr('status');
        var CmbData2 =  $($doc).find('RDService').attr('info');
        if(RegExp('\\b'+ 'Mantra' +'\\b').test(CmbData2)==true)
        {
          $("#txtDeviceInfo").val(data);

          if($($doc).find('Interface').eq(0).attr('path')=="/rd/capture")
          {
            this.MethodCapture=$($doc).find('Interface').eq(0).attr('path');
            console.log(this.MethodCapture);
          }
          if($($doc).find('Interface').eq(1).attr('path')=="/rd/capture")
          {
            // this.MethodCapture=$($doc).find('Interface').eq(1).attr('path');
          }
          if($($doc).find('Interface').eq(0).attr('path')=="/rd/info")
          {
            this.MethodInfo=$($doc).find('Interface').eq(0).attr('path');
            console.log(this.MethodInfo);
          }
          if($($doc).find('Interface').eq(1).attr('path')=="/rd/info")
          {
            //this.MethodInfo=$($doc).find('Interface').eq(1).attr('path');
          }

          $("#ddlAVDM").append('<option value='+ "11101"+'>(' + CmbData1 +')'+CmbData2+'</option>')
          var SuccessFlag=1;
          // alert("RDSERVICE Discover Successfully");
          // this.confirmationService.alert("RDSERVICE Discover Successfully", 'success');
          return;
        }
        alert(CmbData1);
        alert(CmbData2);

      },
      error: function (jqXHR, ajaxOptions, thrownError) {
      },
    });
  }

  getDeviceInfo(): Observable<any> {
    const finalUrl = this.rdURL;
    const methodInfo = 'DEVICEINFO';
    var res:any;
      $.ajax({

        type: "DEVICEINFO",
        async: false,
        crossDomain: true,
        url: finalUrl+ this.MethodInfo,
        contentType: "text/xml; charset=utf-8",
        processData: false,
        success: function (data) {
          this.httpStaus = true;
          res = { httpStaus: this.httpStaus, data: data };
          console.log(res);
          $('#txtDeviceInfo').val(data);
        },
        error: function (jqXHR, ajaxOptions, thrownError) {
        alert(thrownError);
          res = { httpStaus: this.httpStaus, err: null };
        },
      });
      return res;
  }

  captureAvdm(): Observable<any> {
    const finalUrl = this.rdURL;
    const methodCapture = 'CAPTURE';
 
    let res: any;
    let encodedPIDRes: any;
    const requestData = '<PidOptions ver="1.0">\r\n<Opts env="P" fCount="1" fType="2" format="0" iType="" pCount="0" pidVer="2.0" posh="UNKNOWN" timeout="20000" wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc="/></PidOptions>';
 
    $.ajax({
        type: "CAPTURE",
        async: false,
        crossDomain: true,
        url: finalUrl + this.MethodCapture,
        data: requestData,
        contentType: "text/xml; charset=utf-8",
        processData: false,
        success: (data) => {
            console.log(data, "PIDDATA");
            this.httpStaus = true;
            res = { httpStaus: this.httpStaus, data: data };
 
            encodedPIDRes = btoa(data);
            console.log(encodedPIDRes);
 
            $('#txtPidData').val(encodedPIDRes);
            $('#txtPidOptions').val(encodedPIDRes);
        },
        error: (jqXHR, ajaxOptions, thrownError) => {
            alert(thrownError);
            encodedPIDRes = { httpStaus: this.httpStaus, err: null };
        },
    });
    this.getpidDetail(encodedPIDRes);
    return encodedPIDRes;
}
getpidDetail(pidDetailDetails){ 
  this.pidDetail = pidDetailDetails;
  this.pidDetailData.next(this.pidDetail);
}

}
