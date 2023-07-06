var express = require("express");
var app = express();
var fs = require("fs");
var cors = require('cors')
app.use(cors())

var hubstatus={
  "status":"SUCCESS",
  message:"string",
  "code":"string",
  "type":"HUB_CONN_STATUS",
  deviceConnected:true
}

app.post("/api/v1/bluetooth/hub/disconnect", function(req, res) {
  res.status(200);
  res.send(hubstatus);
});

var devicestatus={
  "status": "SUCCESS",
  "message": "string",
  "code": "string",
  "type": "MML_RESPONSE",
  "firmwareVersionId": "string",
  "urtTestScriptVersion": "string",
  "bluetoothAddress": "string",
  "serialNumber": "string",
  "diagnosticIntrospectionData": "string",
  "bpModuleId": "string",
  "cholesterolUaModuleId": "string",
  "hemoglobinModuleId": "string",
  "pulseOxyModuleId": "string",
  "glucoseModuleId": "string",
  "somModuleId": "string",
  "ecgModuleId": "string",
  "appVersionId": "string",
  "rdtLookupFile": "string",
  "urineLookupFile": "string",
  "pythonSuccessUpdateTime": "2019-06-12T06:13:25.998Z",
  "firmwareSuccessUpdateTime": "2019-06-12T06:13:25.998Z",
  "bloodPressureIntro": true,
  "cholUaIntro": true,
  "glucometerIntro": true,
  "ecgIntro": true,
  "hbIntro": false,
  "pulseOxIntro": true,
  "urtCam1Intro": true,
  "bgbenecheck": true,
  "cam1ModuleId": "string",
  "deviceConnected": false
  }

  var devcnt=0
app.get("/api/v1/bluetooth/hub/connection_status", function(req, res) {
    res.status(200);
    devcnt--;
  res.send(devicestatus);
});

app.post("/api/v1/physical_tests/temperature/pair", function(req, res) {
  let i;
  for(i=0;i<10000;i=i+1){
    console.log(i);
      }
  res.status(200);
  res.send({});
});

app.post("/api/v1/physical_tests/weight/pair", function(req, res) {
  let i;
  for(i=0;i<10000;i=i+1){
    console.log(i);
      }
  res.status(200);
  res.send({});
});

app.get("/api/v1/bluetooth/service_discovery", function(req, res) {
  for(i=0;i<10000;i=i+1){
console.log(i);
  }
  res.status(200);
  res.send(["ezdx-djkbs-xjbj","h2","h3","h2","h3","h2","h3","h2","h3","h2","h3"]);
});

app.post("/api/v1/bluetooth/hub_connection/:id", function(req, res) {
  for(i=0;i<10000;i=i+1){
    console.log(i);
      }
  res.status(200);
  res.send(devicestatus);
});


var start = "/api/v1/physical_tests";
var success = {
  status: "SUCCESS",
  message: "string",
  code: "string",
  type: "TEST_INIT"
};
var cnt=0;
app.post(start + "/weight", function(req, res) {
  res.status(202);
  res.send(success);
});

app.put(start + "/weight", function(req, res) {
  res.status(202);
  res.send(success);
});

app.get(start + "/weight/status", function(req, res) {
  if(cnt===2){
    cnt=0;
    res.status(200);
    var out=success;
    out['result']=Math.random()*100;
    out['unit']="kg";
    res.send(out);
  }else{
    res.status(206);
    res.send(success);
    cnt=cnt+1;
  }
});

var startTemp = "/api/v1/physical_tests";
var success = {
  status: "SUCCESS",
  message: "string",
  code: "string",
  type: "TEST_INIT"
};
var cnt=0;
app.post(startTemp + "/temperature", function(req, res) {
  res.status(202);
  res.send(success);
});

app.put(startTemp + "/temperature", function(req, res) {
  res.status(202);
  res.send(success);
});

app.get(startTemp + "/temperature/status", function(req, res) {
  if(cnt===2){
    cnt=0;
    res.status(200);
    var out=success;
    out['temperature']=98;
    out['unit']="F";
    res.send(out);
  }else{
    res.status(206);
    res.send(success);
    cnt=cnt+1;
  }
});

var startPusle = "/api/v1/physical_tests";
var success = {
  status: "SUCCESS",
  message: "string",
  code: "string",
  type: "TEST_INIT"
};
var cnt=0;
app.post(startPusle + "/pulse_oxymetry", function(req, res) {
  res.status(202);
  res.send(success);
});

app.put(startPusle + "/pulse_oxymetry", function(req, res) {
  res.status(202);
  res.send(success);
});

app.get(startPusle + "/pulse_oxymetry/status", function(req, res) {
  if(cnt===5){
    cnt=0;
    res.status(200);
    var out=success;
    out['pulseRate']=90;
    out['message']="hello"+cnt
    out['unit']="per min";
    res.send(out);
  }else{
    res.status(206);
    success.message="hello"+cnt
    res.send(success);
    cnt=cnt+1;
  }
});

var startBP = "/api/v1/physical_tests";
var success = {
  status: "SUCCESS",
  message: "string",
  code: "string",
  type: "TEST_INIT"
};
var cnt=0;
app.post(startBP + "/blood_pressure", function(req, res) {
  res.status(202);
  res.send(success);
});

app.put(startBP + "/blood_pressure", function(req, res) {
  res.status(202);
  res.send(success);
});

app.get(startBP + "/blood_pressure/status", function(req, res) {
  if(cnt===2){
    cnt=0;
    res.status(200);
    var out=success;
    out['sys']=120;
    out['dia']=110;
    out['unit']="mmHG";
    res.send(out);
  }else{
    res.status(206);
    res.send(success);
    cnt=cnt+1;
  }
});

var startPregnancy = "/api/v1/urine_poct_test";
var success = {
  status: "SUCCESS",
  message: "string",
  code: "string",
  type: "TEST_INIT"
};
var cnt=0;
app.post(startPregnancy + "/pregnancy", function(req, res) {
  res.status(202);
  res.send(success);
});

app.put(startPregnancy + "/pregnancy", function(req, res) {
  res.status(202);
  res.send(success);
});

app.get(startPregnancy + "/pregnancy/status", function(req, res) {
  if(cnt===2){
    cnt=0;
    res.status(200);
    var out=success;
    out['rdtResult']="Negative";
    res.send(out);
  }else{
    res.status(206);
    res.send(success);
    cnt=cnt+1;
  }
});
var startMalaria = "/api/v1/wbrdt_tests";
var success = {
  status: "SUCCESS",
  message: "string",
  code: "string",
  type: "TEST_INIT"
};
var cnt=0;
app.post(startMalaria + "/malaria", function(req, res) {
  res.status(202);
  res.send(success);
});

app.put(startMalaria + "/malaria", function(req, res) {
  res.status(202);
  res.send(success);
});

app.get(startMalaria + "/malaria/status", function(req, res) {
  if(cnt===2){
    cnt=0;
    res.status(200);
    var out=success;
    out['rdtResult']="Positive1";
    res.send(out);
  }else{
    res.status(206);
    res.send(success);
    cnt=cnt+1;
  }
});

var startTroponin = "/api/v1/urine_rdt_tests";
var success = {
  status: "SUCCESS",
  message: "string",
  code: "string",
  type: "TEST_INIT"
};
var cnt=0;
app.post(startTroponin + "/troponin", function(req, res) {
  res.status(202);
  res.send(success);
});

app.put(startTroponin + "/troponin", function(req, res) {
  res.status(202);
  res.send(success);
});

app.get(startTroponin + "/troponin/status", function(req, res) {
  if(cnt===2){
    cnt=0;
    res.status(200);
    var out=success;
    out['rdtResult']="Positive";
    res.send(out);
  }else{
    res.status(206);
    res.send(success);
    cnt=cnt+1;
  }
});

var startUricAcid = "/api/v1/wbpoct_tests";
var success = {
  status: "SUCCESS",
  message: "string",
  code: "string",
  type: "TEST_INIT"
};
var cnt=0;
app.post(startUricAcid + "/uric_acid", function(req, res) {
  res.status(202);
  res.send(success);
});

app.put(startUricAcid + "/uric_acid", function(req, res) {
  res.status(202);
  res.send(success);
});

app.get(startUricAcid + "/uric_acid/status", function(req, res) {
  if(cnt===2){
    cnt=0;
    res.status(200);
    var out=success;
    out['result']=2000;
    res.send(out);
  }else{
    res.status(206);
    res.send(success);
    cnt=cnt+1;
  }
});
var startBloodglucose = "/api/v1/wbpoct_tests";
var success = {
  status: "SUCCESS",
  message: "string",
  code: "string",
  type: "TEST_INIT"
};
var cnt=0;
app.post(startBloodglucose + "/blood_glucose", function(req, res) {
  res.status(202);
  res.send(success);
});

app.put(startBloodglucose + "/blood_glucose", function(req, res) {
  res.status(202);
  res.send(success);
});

app.get(startBloodglucose + "/blood_glucose/status", function(req, res) {
  if(cnt===2){
    cnt=0;
    res.status(200);
    var out=success;
    out['result']=2000;
    res.send(out);
  }else{
    res.status(206);
    res.send(success);
    cnt=cnt+1;
  }
});
var startHemoglobin = "/api/v1/wbpoct_tests";
var success = {
  status: "SUCCESS",
  message: "string",
  code: "string",
  type: "TEST_INIT"
};
var cnt=0;
app.post(startHemoglobin + "/hemoglobin", function(req, res) {
  res.status(202);
  res.send(success);
});

app.put(startHemoglobin + "/hemoglobin", function(req, res) {
  res.status(202);
  res.send(success);
});

app.get(startHemoglobin + "/hemoglobin/status", function(req, res) {
  if(cnt===2){
    cnt=0;
    res.status(200);
    var out=success;
    out['result']=2000;
    res.send(out);
  }else{
    res.status(206);
    res.send(success);
    cnt=cnt+1;
  }
});
var startCholesterol = "/api/v1/wbpoct_tests";
var success = {
  status: "SUCCESS",
  message: "string",
  code: "string",
  type: "TEST_INIT"
};
var cnt=0;
app.post(startCholesterol + "/cholesterol", function(req, res) {
  res.status(202);
  res.send(success);
});

app.put(startCholesterol + "/cholesterol", function(req, res) {
  res.status(202);
  res.send(success);
});

app.get(startCholesterol + "/cholesterol/status", function(req, res) {
  if(cnt===2){
    cnt=0;
    res.status(200);
    var out=success;
    out['result']=2000;
    res.send(out);
  }else{
    res.status(206);
    res.send(success);
    cnt=cnt+1;
  }
});
var startChikungunya = "/api/v1/wbrdt_tests";
var success = {
  status: "SUCCESS",
  message: "string",
  code: "string",
  type: "TEST_INIT"
};
var cnt=0;
app.post(startChikungunya + "/chikungunya", function(req, res) {
  res.status(202);
  res.send(success);
});

app.put(startChikungunya + "/chikungunya", function(req, res) {
  res.status(202);
  res.send(success);
});

app.get(startChikungunya + "/chikungunya/status", function(req, res) {
  if(cnt===2){
    cnt=0;
    res.status(200);
    var out=success;
    out['rdtResult']='Positive';
    res.send(out);
  }else{
    res.status(206);
    res.send(success);
    cnt=cnt+1;
  }
});
var startDengue = "/api/v1/wbrdt_tests";
var success = {
  status: "SUCCESS",
  message: "string",
  code: "string",
  type: "TEST_INIT"
};
var cnt=0;
app.post(startDengue + "/dengue", function(req, res) {
  res.status(202);
  res.send(success);
});

app.put(startDengue + "/dengue", function(req, res) {
  res.status(202);
  res.send(success);
});

app.get(startDengue + "/dengue/status", function(req, res) {
  if(cnt===2){
    cnt=0;
    res.status(200);
    var out=success;
    out['rdtResult']='Positive';
    res.send(out);
  }else{
    res.status(206);
    res.send(success);
    cnt=cnt+1;
  }
});
var startHepC = "/api/v1/wbrdt_tests";
var success = {
  status: "SUCCESS",
  message: "string",
  code: "string",
  type: "TEST_INIT"
};
var cnt=0;
app.post(startHepC + "/hep_c", function(req, res) {
  res.status(202);
  res.send(success);
});

app.put(startHepC + "/hep_c", function(req, res) {
  res.status(202);
  res.send(success);
});

app.get(startHepC + "/hep_c/status", function(req, res) {
  if(cnt===2){
    cnt=0;
    res.status(200);
    var out=success;
    out['rdtResult']='Positive';
    res.send(out);
  }else{
    res.status(206);
    res.send(success);
    cnt=cnt+1;
  }
});
var startHIV = "/api/v1/wbrdt_tests";
var success = {
  status: "SUCCESS",
  message: "string",
  code: "string",
  type: "TEST_INIT"
};
var cnt=0;
app.post(startHIV + "/hiv", function(req, res) {
  res.status(202);
  res.send(success);
});

app.put(startHIV + "/hiv", function(req, res) {
  res.status(202);
  res.send(success);
});

app.get(startHIV + "/hiv/status", function(req, res) {
  if(cnt===2){
    cnt=0;
    res.status(200);
    var out=success;
    out['rdtResult']='Positive1';
    res.send(out);
  }else{
    res.status(206);
    res.send(success);
    cnt=cnt+1;
  }
});
var startSyphilis = "/api/v1/wbrdt_tests";
var success = {
  status: "SUCCESS",
  message: "string",
  code: "string",
  type: "TEST_INIT"
};
var cnt=0;
app.post(startSyphilis + "/syphilis", function(req, res) {
  res.status(202);
  res.send(success);
});

app.put(startSyphilis + "/syphilis", function(req, res) {
  res.status(202);
  res.send(success);
});

app.get(startSyphilis + "/syphilis/status", function(req, res) {
  if(cnt===2){
    cnt=0;
    res.status(200);
    var out=success;
    out['rdtResult']='Positive';
    res.send(out);
  }else{
    res.status(206);
    res.send(success);
    cnt=cnt+1;
  }
});
var startTyphoid = "/api/v1/wbrdt_tests";
var successTyphoid = {
  status: "SUCCESS",
  message: "Internal Error By IOT Device",
  code: "string",
  type: "TEST_INIT"
};
var cnt=0;
app.post(startTyphoid + "/typhoid", function(req, res) {
  res.status(202);
  res.send(successTyphoid);
});

app.put(startTyphoid + "/typhoid", function(req, res) {
  res.status(202);
  res.send(successTyphoid);
});

app.get(startTyphoid + "/typhoid/status", function(req, res) {
  if(cnt===2){
    cnt=0;
    res.status(200);
    var out=successTyphoid;
    out['rdtResult']='Positive1';
    res.send(out);
  }else{
    res.status(206);
    res.send(success);
    cnt=cnt+1;
  }
});
var startLeptospira = "/api/v1/wbrdt_tests";
var success = {
  status: "SUCCESS",
  message: "string",
  code: "string",
  type: "TEST_INIT"
};
var cnt=0;
app.post(startLeptospira + "/leptospira", function(req, res) {
  res.status(202);
  res.send(success);
});

app.put(startLeptospira + "/leptospira", function(req, res) {
  res.status(202);
  res.send(success);
});

app.get(startLeptospira + "/leptospira/status", function(req, res) {
  if(cnt===2){
    cnt=0;
    res.status(200);
    var out=success;
    out['rdtResult']='Positive';
    res.send(out);
  }else{
    res.status(206);
    res.send(success);
    cnt=cnt+1;
  }
});

var startHepB = "/api/v1/wbrdt_tests";
var success = {
  status: "SUCCESS",
  message: "string",
  code: "string",
  type: "TEST_INIT"
};
var cnt=0;
app.post(startHepB + "/hep_b", function(req, res) {
  res.status(202);
  res.send(success);
});

app.put(startHepB + "/hep_b", function(req, res) {
  res.status(202);
  res.send(success);
});

app.get(startHepB + "/hep_b/status", function(req, res) {
  if(cnt===2){
    cnt=0;
    res.status(200);
    var out=success;
    out['rdtResult']='Positive';
    res.send(out);
  }else{
    res.status(206);
    res.send(success);
    cnt=cnt+1;
  }
});
var startCRP = "/api/v1/wbrdt_tests";
var successCRP = {
  status: "SUCCESS",
  message: "string",
  code: "string",
  type: "TEST_INIT"
};
var cnt=0;
app.post(startCRP + "/crp", function(req, res) {
  res.status(202);
  res.send(successCRP);
});

app.put(startCRP + "/crp", function(req, res) {
  res.status(202);
  res.send(successCRP);
});

app.get(startCRP + "/crp/status", function(req, res) {
  if(cnt===2){
    cnt=0;
    res.status(200);
    var out=successCRP;
    out['rdtResult']='Positive';
    res.send(out);
  }else{
    res.status(206);
    res.send(successCRP);
    cnt=cnt+1;
  }
});
var startDDimer = "/api/v1/wbrdt_tests";
var successDimer = {
  status: "SUCCESS",
  message: "string",
  code: "string",
  type: "TEST_INIT"
};
var cnt=0;
app.post(startDDimer + "/ddimer", function(req, res) {
  res.status(202);
  res.send(successDimer);
});

app.put(startDDimer + "/ddimer", function(req, res) {
  res.status(202);
  res.send(successDimer);
});

app.get(startDDimer + "/ddimer/status", function(req, res) {
  if(cnt===5){
    cnt=0;
    res.status(200);
    var out=successDimer;
    out['rdtResult']='Positive';
    res.send(out);
  }else{
    res.status(206);
    res.send(successDimer);
    cnt=cnt+1;
  }
});
var startProcalcitonin = "/api/v1/wbrdt_tests";
var successProcalcitonin = {
  status: "SUCCESS",
  message: "string",
  code: "string",
  type: "TEST_INIT"
};
var cnt=0;
app.post(startProcalcitonin + "/procalcitonin", function(req, res) {
  res.status(202);
  res.send(successProcalcitonin);
});

app.put(startProcalcitonin + "/procalcitonin", function(req, res) {
  res.status(202);
  res.send(successProcalcitonin);
});

app.get(startProcalcitonin + "/procalcitonin/status", function(req, res) {
  if(cnt===2){
    cnt=0;
    res.status(200);
    var out=successProcalcitonin;
    out['userRdtResult']='Positive';
    res.send(out);
  }else{
    res.status(206);
    res.send(successProcalcitonin);
    cnt=cnt+1;
  }
});
var startHemocue = "/api/v1/wbpoct_tests";
var successhemocue = {
  status: "SUCCESS",
  message: "string",
  code: "string",
  type: "TEST_INIT"
};
var cnt=0;
app.post(startHemocue + "/hemocue", function(req, res) {
  res.status(202);
  res.send(successhemocue);
});

app.put(startHemocue + "/hemocue", function(req, res) {
  res.status(202);
  res.send(successhemocue);
});

app.get(startHemocue + "/hemocue/status", function(req, res) {
  if(cnt===2){
    cnt=0;
    res.status(200);
    var out=successhemocue;
    out['result']=2000;
    res.send(out);
  }else{
    res.status(206);
    res.send(successhemocue);
    cnt=cnt+1;
  }
});
var startWBCDiff = "/api/v1/hematology_tests";
var successwbc = {
  status: "SUCCESS",
  message: "string",
  code: "string",
  type: "TEST_INIT"
};
var cnt=0;
app.post(startWBCDiff + "/wbc_diff", function(req, res) {
  res.status(202);
  res.send(successwbc);
});

app.put(startWBCDiff + "/wbc_diff", function(req, res) {
  res.status(202);
  res.send(successwbc);
});

app.get(startWBCDiff + "/wbc_diff/status", function(req, res) {
  if(cnt===2){
    cnt=0;
    res.status(200);
    var out=successwbc;
    out['neutrophils']=2000;
    out['lymphocytes']=2000;
    out['monocytes']=2000;
    out['eosinophills']=2000;
    out['besophills']=2000;
    out['notes']=2000;
    out['leukocytes']=2000;
    res.send(out);
  }else{
    res.status(206);
    res.send(successwbc);
    cnt=cnt+1;
  }
});
var server = app.listen(7001, function() {
  var host = "localhost";
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
