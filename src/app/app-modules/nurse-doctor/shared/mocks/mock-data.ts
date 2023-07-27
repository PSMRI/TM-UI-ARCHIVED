/* 
* AMRIT � Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/


export const doctorWorklist = {
  "data": [
    {
      "beneficiaryRegID": 7469,
      "benName": "AMUL BABY",
      "genderID": 2,
      "genderName": "Female",
      "districtName": "BARPETA",
      "villageName": "3No.Alupati N.C.",
      "phoneNo": "2424234234",
      "age": "1 years - 2 months",
      "visitFlowStatusFlag": "N",
      "VisitCategory": "General OPD",
      "benVisitID": 844,
      "benVisitNo": 41,
      "visitDate": "15-02-2018",
      "statusMessage": "Pending For Consultation"
    }
  ],
  "statusCode": 200,
  "errorMessage": "Success",
  "status": "Success"
};

export const nurseWorklist = {
  "data": [
    {
      "beneficiaryRegID": 7484,
      "benName": "NEERAJ KUMAR SINGH",
      "genderID": 2,
      "genderName": "Female",
      "fatherName": "FATHER",
      "districtName": "BARPETA",
      "villageName": "Ali Gaon",
      "phoneNo": "8197511886",
      "age": "25 years - 0 months"
    }
  ],
  "statusCode": 200,
  "errorMessage": "Success",
  "status": "Success"
};

export const maleBeneficiary = {
  "beneficiaryRegID": 7416,
  "beneficiaryName": "Amit Kumar",
  "genderID": 1,
  "genderName": "Male",
  "age": "24 years - 0 months",
  "ageVal": 24,
  "createdDate": "Nov 21, 2017 10:39:43 AM",
  "villageName": "Agmandia",
  "districtName": "BARPETA"
}

export const femaleBeneficiary = {
  "beneficiaryRegID": 7506,
  "beneficiaryName": "Neha Sharma",
  "genderID": 2,
  "genderName": "Female",
  "age": "28 years - 0 months",
  "ageVal": 28,
  "createdDate": "Nov 27, 2017 4:57:49 PM",
  "villageName": "Agmandia",
  "districtName": "BARPETA"
}

export const generalOPDVitalData = {
  "data": {
    "benAnthropometryDetail": {
      "ID": 310,
      "beneficiaryRegID": 7866,
      "benVisitID": 886,
      "providerServiceMapID": 1320,
      "weight_Kg": 64.0,
      "height_cm": 166.0,
      "bMI": 23.2,
      "hipCircumference_cm": 87.0,
      "waistCircumference_cm": 56.0,
      "waistHipRatio": 0.64,
      "deleted": false,
      "processed": "N",
      "createdBy": "888",
      "createdDate": "Feb 22, 2018 5:51:31 PM",
      "lastModDate": "Feb 22, 2018 5:51:31 PM"
    },
    "benPhysicalVitalDetail": {
      "ID": 302,
      "beneficiaryRegID": 7866,
      "benVisitID": 886,
      "providerServiceMapID": 1320,
      "temperature": 98.0,
      "pulseRate": 72,
      "respiratoryRate": 14,
      "systolicBP_1stReading": 120,
      "diastolicBP_1stReading": 65,
      "averageSystolicBP": 120,
      "averageDiastolicBP": 65,
      "deleted": false,
      "processed": "N",
      "createdBy": "888",
      "createdDate": "Feb 22, 2018 5:51:31 PM",
      "lastModDate": "Feb 22, 2018 5:51:31 PM"
    }
  },
  "statusCode": 200,
  "errorMessage": "Success",
  "status": "Success"
}

export const visitReasonAndCategory = {
  "visitReasons": [
    {
      "visitReasonID": 1,
      "visitReason": "FollowUp"
    },
    {
      "visitReasonID": 3,
      "visitReason": "New Chief Complaint"
    },
    {
      "visitReasonID": 2,
      "visitReason": "Referral"
    },
    {
      "visitReasonID": 4,
      "visitReason": "Screening"
    }
  ],
  "visitCategories": [
    {
      "visitCategoryID": 4,
      "visitCategory": "ANC"
    },
    {
      "visitCategoryID": 1,
      "visitCategory": "Cancer Screening"
    },
    {
      "visitCategoryID": 6,
      "visitCategory": "General OPD"
    },
    {
      "visitCategoryID": 7,
      "visitCategory": "General OPD (QC)"
    },
    {
      "visitCategoryID": 3,
      "visitCategory": "NCD care"
    },
    {
      "visitCategoryID": 2,
      "visitCategory": "NCD screening"
    },
    {
      "visitCategoryID": 5,
      "visitCategory": "PNC"
    }
  ]
}

export const generalOPDVisitDetails = {
  "data": {
    "GOPDNurseVisitDetail": {
      "benVisitID": 863,
      "beneficiaryRegID": 7416,
      "providerServiceMapID": 1320,
      "visitNo": 54,
      "visitReason": "FollowUp",
      "visitCategory": "General OPD",
      "pregnancyStatus": null,
      "rCHID": null,
      "deleted": false,
      "processed": "N",
      "createdBy": "887",
      "createdDate": "Feb 20, 2018 12:10:08 PM",
      "lastModDate": "Feb 20, 2018 12:10:08 PM"
    },
    "BenChiefComplaints": [
      {
        "benChiefComplaintID": 445,
        "beneficiaryRegID": 7416,
        "benVisitID": 863,
        "providerServiceMapID": 1320,
        "chiefComplaintID": 1,
        "chiefComplaint": "Abdominal Bloating",
        "duration": 12,
        "unitOfDuration": "Hours",
        "description": "hghgjhgjh"
      },
      {
        "benChiefComplaintID": 446,
        "beneficiaryRegID": 7416,
        "benVisitID": 863,
        "providerServiceMapID": 1320,
        "chiefComplaintID": 4,
        "chiefComplaint": "Abdominal Rigidity",
        "duration": 13,
        "unitOfDuration": "Hours",
        "description": "guhgughfyt"
      }
    ]
  },
  "statusCode": 200,
  "errorMessage": "Success",
  "status": "Success"
};

export const generalOPDNurseMasterdata = {
  "data": {
    "postNatalComplications": [
      {
        "complicationID": 26,
        "complicationType": "Postnatal Complication",
        "complicationValue": "Anemia"
      },
      {
        "complicationID": 25,
        "complicationType": "Postnatal Complication",
        "complicationValue": "Nil"
      },
      {
        "complicationID": 29,
        "complicationType": "Postnatal Complication",
        "complicationValue": "Other"
      },
      {
        "complicationID": 27,
        "complicationType": "Postnatal Complication",
        "complicationValue": "Postpartum Hemorrhage"
      },
      {
        "complicationID": 28,
        "complicationType": "Postnatal Complication",
        "complicationValue": "Sepsis"
      }
    ],
    "pregOutcomes": [
      {
        "PregOutcomeID": 2,
        "PregOutcome": "Abortion"
      },
      {
        "PregOutcomeID": 1,
        "PregOutcome": "Live Birth"
      },
      {
        "PregOutcomeID": 3,
        "PregOutcome": "Stillbirth"
      }
    ],
    "fundalHeights": [
      {
        "fundalHeightID": 2,
        "fundalHeight": "12th Week"
      },
      {
        "fundalHeightID": 3,
        "fundalHeight": "16th Week"
      },
      {
        "fundalHeightID": 4,
        "fundalHeight": "20th Week"
      },
      {
        "fundalHeightID": 5,
        "fundalHeight": "24th Week"
      },
      {
        "fundalHeightID": 6,
        "fundalHeight": "28th Week"
      },
      {
        "fundalHeightID": 7,
        "fundalHeight": "28th Week"
      },
      {
        "fundalHeightID": 8,
        "fundalHeight": "32nd Week"
      },
      {
        "fundalHeightID": 9,
        "fundalHeight": "36th Week"
      },
      {
        "fundalHeightID": 10,
        "fundalHeight": "40th Week"
      },
      {
        "fundalHeightID": 1,
        "fundalHeight": "Not Palpable"
      }
    ],
    "bloodGroups": [
      {
        "bloodGroupID": 1,
        "bloodGroup": "A+",
        "bloodGroupDesc": "A RhD positive (A+)"
      },
      {
        "bloodGroupID": 2,
        "bloodGroup": "A-",
        "bloodGroupDesc": "A RhD negative (A-)"
      },
      {
        "bloodGroupID": 7,
        "bloodGroup": "AB+",
        "bloodGroupDesc": "AB RhD positive (AB+)"
      },
      {
        "bloodGroupID": 8,
        "bloodGroup": "AB-",
        "bloodGroupDesc": "AB RhD negative (AB-)"
      },
      {
        "bloodGroupID": 3,
        "bloodGroup": "B+",
        "bloodGroupDesc": "B RhD positive (B+)"
      },
      {
        "bloodGroupID": 4,
        "bloodGroup": "B-",
        "bloodGroupDesc": "B RhD negative (B-)"
      },
      {
        "bloodGroupID": 5,
        "bloodGroup": "O+",
        "bloodGroupDesc": "O RhD positive (O+)"
      },
      {
        "bloodGroupID": 6,
        "bloodGroup": "O-",
        "bloodGroupDesc": "O RhD negative (O-)"
      }
    ],
    "postpartumComplicationTypes": [
      {
        "complicationID": 21,
        "complicationType": "Postpartum Complication",
        "complicationValue": "Anemia"
      },
      {
        "complicationID": 20,
        "complicationType": "Postpartum Complication",
        "complicationValue": "Nil"
      },
      {
        "complicationID": 24,
        "complicationType": "Postpartum Complication",
        "complicationValue": "Other"
      },
      {
        "complicationID": 22,
        "complicationType": "Postpartum Complication",
        "complicationValue": "Postpartum Hemorrhage"
      },
      {
        "complicationID": 23,
        "complicationType": "Postpartum Complication",
        "complicationValue": "Sepsis"
      }
    ],
    "deliveryPlaces": [
      {
        "deliveryPlaceID": 5,
        "deliveryPlace": "CHC"
      },
      {
        "deliveryPlaceID": 6,
        "deliveryPlace": "DH"
      },
      {
        "deliveryPlaceID": 1,
        "deliveryPlace": "Home-Supervised"
      },
      {
        "deliveryPlaceID": 2,
        "deliveryPlace": "Home-Unsupervised"
      },
      {
        "deliveryPlaceID": 9,
        "deliveryPlace": "Other"
      },
      {
        "deliveryPlaceID": 4,
        "deliveryPlace": "PHC"
      },
      {
        "deliveryPlaceID": 8,
        "deliveryPlace": "Private Hospital"
      },
      {
        "deliveryPlaceID": 3,
        "deliveryPlace": "Subcentre"
      },
      {
        "deliveryPlaceID": 7,
        "deliveryPlace": "TH"
      }
    ],
    "alcoholUseStatus": [
      {
        "personalHabitTypeID": 15,
        "habitType": "Alcohol Intake Status",
        "habitValue": "Discontinued"
      },
      {
        "personalHabitTypeID": 14,
        "habitType": "Alcohol Intake Status",
        "habitValue": "No"
      },
      {
        "personalHabitTypeID": 13,
        "habitType": "Alcohol Intake Status",
        "habitValue": "Yes"
      }
    ],
    "quantityOfAlcoholIntake": [
      {
        "personalHabitTypeID": 33,
        "habitType": "Average Quantity of Alcohol consumption",
        "habitValue": "120-180 ml"
      },
      {
        "personalHabitTypeID": 37,
        "habitType": "Average Quantity of Alcohol consumption",
        "habitValue": "1300-2000 ml"
      },
      {
        "personalHabitTypeID": 34,
        "habitType": "Average Quantity of Alcohol consumption",
        "habitValue": "180-330 ml"
      },
      {
        "personalHabitTypeID": 35,
        "habitType": "Average Quantity of Alcohol consumption",
        "habitValue": "330-650 ml"
      },
      {
        "personalHabitTypeID": 31,
        "habitType": "Average Quantity of Alcohol consumption",
        "habitValue": "60-90 ml"
      },
      {
        "personalHabitTypeID": 36,
        "habitType": "Average Quantity of Alcohol consumption",
        "habitValue": "650-1300 ml"
      },
      {
        "personalHabitTypeID": 32,
        "habitType": "Average Quantity of Alcohol consumption",
        "habitValue": "90-120 ml"
      },
      {
        "personalHabitTypeID": 30,
        "habitType": "Average Quantity of Alcohol consumption",
        "habitValue": "\u003c 60 ml"
      },
      {
        "personalHabitTypeID": 38,
        "habitType": "Average Quantity of Alcohol consumption",
        "habitValue": "\u003e 2000 ml"
      }
    ],
    "compFeedServings": [
      {
        "feedID": 10,
        "type": "Comp Feed Serving ",
        "value": "1"
      },
      {
        "feedID": 11,
        "type": "Comp Feed Serving ",
        "value": "2"
      },
      {
        "feedID": 12,
        "type": "Comp Feed Serving ",
        "value": "3"
      },
      {
        "feedID": 13,
        "type": "Comp Feed Serving ",
        "value": "4"
      },
      {
        "feedID": 14,
        "type": "Comp Feed Serving ",
        "value": "\u003e4 "
      }
    ],
    "childVaccinations": [
      {
        "vaccinationID": 22,
        "vaccinationTime": "5 Years",
        "vaccineName": ""
      },
      {
        "vaccinationID": 1,
        "vaccinationTime": "At Birth",
        "vaccineName": "BCG"
      },
      {
        "vaccinationID": 19,
        "vaccinationTime": "16-24 Months",
        "vaccineName": "DPT-B 1"
      },
      {
        "vaccinationID": 3,
        "vaccinationTime": "At Birth",
        "vaccineName": "HBV-0"
      },
      {
        "vaccinationID": 7,
        "vaccinationTime": "6 Weeks",
        "vaccineName": "IPV-1"
      },
      {
        "vaccinationID": 11,
        "vaccinationTime": "10 Weeks",
        "vaccineName": "IPV-2"
      },
      {
        "vaccinationID": 15,
        "vaccinationTime": "14 Weeks",
        "vaccineName": "IPV-3 "
      },
      {
        "vaccinationID": 18,
        "vaccinationTime": "9 Months",
        "vaccineName": "JE Vaccine"
      },
      {
        "vaccinationID": 16,
        "vaccinationTime": "9 Months",
        "vaccineName": "Measles Vaccine/MR"
      },
      {
        "vaccinationID": 20,
        "vaccinationTime": "16-24 Months",
        "vaccineName": "Measles/MR Vaccine"
      },
      {
        "vaccinationID": 6,
        "vaccinationTime": "6 Weeks",
        "vaccineName": "OPV"
      },
      {
        "vaccinationID": 10,
        "vaccinationTime": "10 Weeks",
        "vaccineName": "OPV"
      },
      {
        "vaccinationID": 14,
        "vaccinationTime": "14 Weeks",
        "vaccineName": "OPV"
      },
      {
        "vaccinationID": 21,
        "vaccinationTime": "16-24 Months",
        "vaccineName": "OPV"
      },
      {
        "vaccinationID": 2,
        "vaccinationTime": "At Birth",
        "vaccineName": "OPV-0"
      },
      {
        "vaccinationID": 4,
        "vaccinationTime": "6 Weeks",
        "vaccineName": "Pentavalent-1"
      },
      {
        "vaccinationID": 8,
        "vaccinationTime": "10 Weeks",
        "vaccineName": "Pentavalent-2"
      },
      {
        "vaccinationID": 12,
        "vaccinationTime": "14 Weeks",
        "vaccineName": "Pentavalent-3"
      },
      {
        "vaccinationID": 5,
        "vaccinationTime": "6 Weeks",
        "vaccineName": "Rota Vaccine-1"
      },
      {
        "vaccinationID": 9,
        "vaccinationTime": "10 Weeks",
        "vaccineName": "Rota Vaccine-2"
      },
      {
        "vaccinationID": 13,
        "vaccinationTime": "14 Weeks",
        "vaccineName": "Rota Vaccine-3"
      },
      {
        "vaccinationID": 23,
        "vaccinationTime": "10 Years",
        "vaccineName": "TT"
      },
      {
        "vaccinationID": 24,
        "vaccinationTime": "16 Years",
        "vaccineName": "TT"
      },
      {
        "vaccinationID": 17,
        "vaccinationTime": "9 Months",
        "vaccineName": "Vitamin A"
      }
    ],
    "illnessTypes": [
      {
        "illnessID": 6,
        "illnessType": "Asthma"
      },
      {
        "illnessID": 8,
        "illnessType": "Cataract"
      },
      {
        "illnessID": 13,
        "illnessType": "Chickenpox"
      },
      {
        "illnessID": 15,
        "illnessType": "Dengue Fever"
      },
      {
        "illnessID": 3,
        "illnessType": "Diabetes Mellitus"
      },
      {
        "illnessID": 5,
        "illnessType": "Epilepsy (Convulsions)"
      },
      {
        "illnessID": 20,
        "illnessType": "Filariasis"
      },
      {
        "illnessID": 9,
        "illnessType": "Hearing Impairment"
      },
      {
        "illnessID": 7,
        "illnessType": "Hemiplegia/Stroke"
      },
      {
        "illnessID": 11,
        "illnessType": "Hepatitis (Jaundice)"
      },
      {
        "illnessID": 21,
        "illnessType": "HIV/AIDS"
      },
      {
        "illnessID": 2,
        "illnessType": "Hypertension"
      },
      {
        "illnessID": 4,
        "illnessType": "Ischemic Heart Disease"
      },
      {
        "illnessID": 12,
        "illnessType": "Malaria"
      },
      {
        "illnessID": 14,
        "illnessType": "Measles"
      },
      {
        "illnessID": 1,
        "illnessType": "Nil"
      },
      {
        "illnessID": 22,
        "illnessType": "Other"
      },
      {
        "illnessID": 17,
        "illnessType": "Pneumonia"
      },
      {
        "illnessID": 18,
        "illnessType": "STI/RTI"
      },
      {
        "illnessID": 19,
        "illnessType": "Tuberculosis"
      },
      {
        "illnessID": 16,
        "illnessType": "Typhoid Fever"
      },
      {
        "illnessID": 10,
        "illnessType": "Vision Impairment"
      }
    ],
    "labTests": [
      {
        "testID": 2,
        "testName": "Blood Glucose Measurement",
        "isRadiologyImaging": false
      },
      {
        "testID": 12,
        "testName": "Blood grouping and Rh typing ",
        "isRadiologyImaging": false
      },
      {
        "testID": 17,
        "testName": "BUN, Creatinine, Uric acid",
        "isRadiologyImaging": false
      },
      {
        "testID": 14,
        "testName": "Complete blood count",
        "isRadiologyImaging": false
      },
      {
        "testID": 29,
        "testName": "CT Brain",
        "isRadiologyImaging": true
      },
      {
        "testID": 30,
        "testName": "CT Whole Spine ",
        "isRadiologyImaging": true
      },
      {
        "testID": 33,
        "testName": "Flouroscopy- Urethrogram ",
        "isRadiologyImaging": true
      },
      {
        "testID": 32,
        "testName": "Fluoroscopy - Barium Swallow and Meal ",
        "isRadiologyImaging": true
      },
      {
        "testID": 15,
        "testName": "Haemogram",
        "isRadiologyImaging": false
      },
      {
        "testID": 13,
        "testName": "HbA1c ",
        "isRadiologyImaging": false
      },
      {
        "testID": 1,
        "testName": "Hemoglobin Estimation",
        "isRadiologyImaging": false
      },
      {
        "testID": 11,
        "testName": "Hepatitis B Surface Antigen ",
        "isRadiologyImaging": false
      },
      {
        "testID": 9,
        "testName": "HIV Screening ",
        "isRadiologyImaging": false
      },
      {
        "testID": 18,
        "testName": "Liver function tests",
        "isRadiologyImaging": false
      },
      {
        "testID": 8,
        "testName": "Malaria Screening  (RDT)",
        "isRadiologyImaging": false
      },
      {
        "testID": 31,
        "testName": "Mammography ",
        "isRadiologyImaging": true
      },
      {
        "testID": 3,
        "testName": "Microscopy - Blood; Sputum and Urine",
        "isRadiologyImaging": false
      },
      {
        "testID": 34,
        "testName": "MRI - Cervical \u0026 Lumbar",
        "isRadiologyImaging": true
      },
      {
        "testID": 35,
        "testName": "MRI- Brain and Orbit ",
        "isRadiologyImaging": true
      },
      {
        "testID": 36,
        "testName": "MRI- Contrast",
        "isRadiologyImaging": true
      },
      {
        "testID": 16,
        "testName": "RDT for sickeling",
        "isRadiologyImaging": false
      },
      {
        "testID": 20,
        "testName": "Serum ferritin",
        "isRadiologyImaging": false
      },
      {
        "testID": 19,
        "testName": "Serum proteins",
        "isRadiologyImaging": false
      },
      {
        "testID": 10,
        "testName": "Syphilis   / VDRL",
        "isRadiologyImaging": false
      },
      {
        "testID": 27,
        "testName": "Ultrasound- All Abdomen",
        "isRadiologyImaging": true
      },
      {
        "testID": 25,
        "testName": "Ultrasound- Echocardiography",
        "isRadiologyImaging": true
      },
      {
        "testID": 26,
        "testName": "Ultrasound- FNA Thyroid ",
        "isRadiologyImaging": true
      },
      {
        "testID": 28,
        "testName": "Ultrasound- Renal Doppler ",
        "isRadiologyImaging": true
      },
      {
        "testID": 6,
        "testName": "Urinalysis",
        "isRadiologyImaging": false
      },
      {
        "testID": 7,
        "testName": "Urine Pregnancy ",
        "isRadiologyImaging": false
      },
      {
        "testID": 5,
        "testName": "Urine Protein",
        "isRadiologyImaging": false
      },
      {
        "testID": 4,
        "testName": "Urine Sugar",
        "isRadiologyImaging": false
      },
      {
        "testID": 21,
        "testName": "X-Ray Chest ",
        "isRadiologyImaging": true
      },
      {
        "testID": 22,
        "testName": "X-Ray Femur",
        "isRadiologyImaging": true
      },
      {
        "testID": 24,
        "testName": "X-Ray Hip joint ",
        "isRadiologyImaging": true
      },
      {
        "testID": 23,
        "testName": "X-Ray Shoulder",
        "isRadiologyImaging": true
      }
    ],
    "menstrualProblem": [
      {
        "menstrualProblemID": 1,
        "name": "Heavy Menstrual Bleeding"
      },
      {
        "menstrualProblemID": 2,
        "name": "Irregular Menstrual Bleeding"
      },
      {
        "menstrualProblemID": 3,
        "name": "Painful Menstrual Periods"
      },
      {
        "menstrualProblemID": 4,
        "name": "Premenstrual Syndrome"
      }
    ],
    "musculoskeletalAbnormalityTypes": [
      {
        "ID": 6,
        "type": "Abnormality",
        "value": "Deformity"
      },
      {
        "ID": 7,
        "type": "Abnormality",
        "value": "Restriction"
      },
      {
        "ID": 4,
        "type": "Abnormality",
        "value": "Swelling"
      },
      {
        "ID": 5,
        "type": "Abnormality",
        "value": "Tenderness"
      }
    ],
    "musculoskeletalLateralityTypes": [
      {
        "ID": 3,
        "type": "Laterality",
        "value": "Bilateral"
      },
      {
        "ID": 1,
        "type": "Laterality",
        "value": "Left"
      },
      {
        "ID": 2,
        "type": "Laterality",
        "value": "Right"
      }
    ],
    "feedTypes": [
      {
        "feedID": 3,
        "type": "Feed Type",
        "value": "Both"
      },
      {
        "feedID": 1,
        "type": "Feed Type",
        "value": "Breast Feed"
      },
      {
        "feedID": 2,
        "type": "Feed Type",
        "value": "Top Feed"
      }
    ],
    "DiseaseTypes": [
      {
        "diseaseTypeID": 6,
        "diseaseType": "Asthma"
      },
      {
        "diseaseTypeID": 3,
        "diseaseType": "Diabetes Mellitus"
      },
      {
        "diseaseTypeID": 5,
        "diseaseType": "Epilepsy(Convulsions)"
      },
      {
        "diseaseTypeID": 7,
        "diseaseType": "Hemiplegia/Stroke"
      },
      {
        "diseaseTypeID": 2,
        "diseaseType": "Hypertension"
      },
      {
        "diseaseTypeID": 4,
        "diseaseType": "Ischemic Heart Disease"
      },
      {
        "diseaseTypeID": 1,
        "diseaseType": "Nil"
      },
      {
        "diseaseTypeID": 8,
        "diseaseType": "Other"
      }
    ],
    "developmentProblems": [
      {
        "ID": 4,
        "developmentProblem": "ADHD"
      },
      {
        "ID": 5,
        "developmentProblem": "Autism"
      },
      {
        "ID": 2,
        "developmentProblem": "Cerebral Palsy"
      },
      {
        "ID": 7,
        "developmentProblem": "Hearing Impairment"
      },
      {
        "ID": 6,
        "developmentProblem": "Learning Disorders"
      },
      {
        "ID": 3,
        "developmentProblem": "Mental Retardation"
      },
      {
        "ID": 1,
        "developmentProblem": "Nil"
      },
      {
        "ID": 9,
        "developmentProblem": "Other"
      },
      {
        "ID": 8,
        "developmentProblem": "Vision Impairment"
      }
    ],
    "birthComplications": [
      {
        "complicationID": 32,
        "complicationType": "Birth Complication",
        "complicationValue": "Birth Asphyxia"
      },
      {
        "complicationID": 31,
        "complicationType": "Birth Complication",
        "complicationValue": "Delayed Cry"
      },
      {
        "complicationID": 33,
        "complicationType": "Birth Complication",
        "complicationValue": "Meconium Aspiration"
      },
      {
        "complicationID": 30,
        "complicationType": "Birth Complication",
        "complicationValue": "Nil"
      },
      {
        "complicationID": 34,
        "complicationType": "Birth Complication",
        "complicationValue": "Other"
      }
    ],
    "gestation": [
      {
        "gestationID": 4,
        "name": "Don\u0027t Know"
      },
      {
        "gestationID": 2,
        "name": "Full Term"
      },
      {
        "gestationID": 3,
        "name": "Post Term"
      },
      {
        "gestationID": 1,
        "name": "Preterm"
      }
    ],
    "familyMemberTypes": [
      {
        "benRelationshipID": 13,
        "benRelationshipType": "Aunt",
        "gender": "unisex"
      },
      {
        "benRelationshipID": 6,
        "benRelationshipType": "Brother",
        "gender": "male"
      },
      {
        "benRelationshipID": 9,
        "benRelationshipType": "Daughter",
        "gender": "female"
      },
      {
        "benRelationshipID": 4,
        "benRelationshipType": "Father",
        "gender": "male"
      },
      {
        "benRelationshipID": 14,
        "benRelationshipType": "Grand Father",
        "gender": "unisex"
      },
      {
        "benRelationshipID": 15,
        "benRelationshipType": "Grand Mother",
        "gender": "unisex"
      },
      {
        "benRelationshipID": 5,
        "benRelationshipType": "Mother",
        "gender": "female"
      },
      {
        "benRelationshipID": 11,
        "benRelationshipType": "Other",
        "gender": "unisex"
      },
      {
        "benRelationshipID": 7,
        "benRelationshipType": "Sister",
        "gender": "female"
      },
      {
        "benRelationshipID": 8,
        "benRelationshipType": "Son",
        "gender": "male"
      },
      {
        "benRelationshipID": 10,
        "benRelationshipType": "Spouse",
        "gender": "unisex"
      },
      {
        "benRelationshipID": 12,
        "benRelationshipType": "Uncle",
        "gender": "unisex"
      }
    ],
    "pregComplicationTypes": [
      {
        "complicationID": 11,
        "complicationType": "Pregnancy Complication",
        "complicationValue": "ABO incompatibility"
      },
      {
        "complicationID": 6,
        "complicationType": "Pregnancy Complication",
        "complicationValue": "Abortion"
      },
      {
        "complicationID": 2,
        "complicationType": "Pregnancy Complication",
        "complicationValue": "Anemia"
      },
      {
        "complicationID": 3,
        "complicationType": "Pregnancy Complication",
        "complicationValue": "Antepartum Hemorrhage"
      },
      {
        "complicationID": 9,
        "complicationType": "Pregnancy Complication",
        "complicationValue": "Blood Transfusion"
      },
      {
        "complicationID": 4,
        "complicationType": "Pregnancy Complication",
        "complicationValue": "Convulsions"
      },
      {
        "complicationID": 10,
        "complicationType": "Pregnancy Complication",
        "complicationValue": "Gestational Diabetes"
      },
      {
        "complicationID": 1,
        "complicationType": "Pregnancy Complication",
        "complicationValue": "Nil"
      },
      {
        "complicationID": 12,
        "complicationType": "Pregnancy Complication",
        "complicationValue": "Other"
      },
      {
        "complicationID": 5,
        "complicationType": "Pregnancy Complication",
        "complicationValue": "Pregnancy Induced Hypertension (PIH)"
      },
      {
        "complicationID": 7,
        "complicationType": "Pregnancy Complication",
        "complicationValue": "Stillbirth"
      },
      {
        "complicationID": 8,
        "complicationType": "Pregnancy Complication",
        "complicationValue": "Twins"
      }
    ],
    "menstrualCycleStatus": [
      {
        "menstrualCycleStatusID": 3,
        "name": "Active"
      },
      {
        "menstrualCycleStatusID": 4,
        "name": "Amenorrhea"
      },
      {
        "menstrualCycleStatusID": 5,
        "name": "Attained Menopause"
      },
      {
        "menstrualCycleStatusID": 1,
        "name": "Not Applicable"
      },
      {
        "menstrualCycleStatusID": 2,
        "name": "Not attained Menarche"
      }
    ],
    "newBornComplications": [
      {
        "complicationID": 32,
        "complicationType": "Birth Complication",
        "complicationValue": "Birth Asphyxia"
      },
      {
        "complicationID": 31,
        "complicationType": "Birth Complication",
        "complicationValue": "Delayed Cry"
      },
      {
        "complicationID": 33,
        "complicationType": "Birth Complication",
        "complicationValue": "Meconium Aspiration"
      },
      {
        "complicationID": 30,
        "complicationType": "Birth Complication",
        "complicationValue": "Nil"
      },
      {
        "complicationID": 34,
        "complicationType": "Birth Complication",
        "complicationValue": "Other"
      }
    ],
    "jointTypes": [
      {
        "jointID": 7,
        "jointType": "Ankle"
      },
      {
        "jointID": 3,
        "jointType": "Elbow"
      },
      {
        "jointID": 5,
        "jointType": "Hip"
      },
      {
        "jointID": 6,
        "jointType": "Knee"
      },
      {
        "jointID": 2,
        "jointType": "Shoulder"
      },
      {
        "jointID": 8,
        "jointType": "Small Joints"
      },
      {
        "jointID": 1,
        "jointType": "Temperomandibular"
      },
      {
        "jointID": 4,
        "jointType": "Wrist"
      }
    ],
    "pregDuration": [
      {
        "pregDurationID": 4,
        "durationType": "Don\u0027t Know"
      },
      {
        "pregDurationID": 2,
        "durationType": "Full Term"
      },
      {
        "pregDurationID": 3,
        "durationType": "Post Term"
      },
      {
        "pregDurationID": 1,
        "durationType": "Preterm"
      }
    ],
    "tobaccoUseStatus": [
      {
        "personalHabitTypeID": 7,
        "habitType": "Tobacco Use Status",
        "habitValue": "Discontinued"
      },
      {
        "personalHabitTypeID": 6,
        "habitType": "Tobacco Use Status",
        "habitValue": "No"
      },
      {
        "personalHabitTypeID": 5,
        "habitType": "Tobacco Use Status",
        "habitValue": "Yes"
      }
    ],
    "menstrualCycleLengths": [
      {
        "menstrualRangeID": 2,
        "rangeType": "Cycle Length",
        "menstrualCycleRange": "24-28 days"
      },
      {
        "menstrualRangeID": 1,
        "rangeType": "Cycle Length",
        "menstrualCycleRange": "\u003c 23 days"
      },
      {
        "menstrualRangeID": 3,
        "rangeType": "Cycle Length",
        "menstrualCycleRange": "\u003e 29 days"
      }
    ],
    "chiefComplaintMaster": [
      {
        "chiefComplaintID": 1,
        "chiefComplaint": "Abdominal Bloating"
      },
      {
        "chiefComplaintID": 5,
        "chiefComplaint": "Abdominal Distention"
      },
      {
        "chiefComplaintID": 2,
        "chiefComplaint": "Abdominal Mass "
      },
      {
        "chiefComplaintID": 3,
        "chiefComplaint": "Abdominal Pain"
      },
      {
        "chiefComplaintID": 4,
        "chiefComplaint": "Abdominal Rigidity"
      },
      {
        "chiefComplaintID": 6,
        "chiefComplaint": "Abdominal Swelling"
      },
      {
        "chiefComplaintID": 7,
        "chiefComplaint": "Abnormally Colored Urine"
      },
      {
        "chiefComplaintID": 8,
        "chiefComplaint": "Abrasions"
      },
      {
        "chiefComplaintID": 9,
        "chiefComplaint": "Absence of Speech"
      },
      {
        "chiefComplaintID": 10,
        "chiefComplaint": "Absent Fetal Movements"
      },
      {
        "chiefComplaintID": 11,
        "chiefComplaint": "Acne"
      },
      {
        "chiefComplaintID": 12,
        "chiefComplaint": "Aggressive Behavior"
      },
      {
        "chiefComplaintID": 13,
        "chiefComplaint": "Agitation"
      },
      {
        "chiefComplaintID": 14,
        "chiefComplaint": "Aimless Movement"
      },
      {
        "chiefComplaintID": 16,
        "chiefComplaint": "Altered Mental Status"
      },
      {
        "chiefComplaintID": 15,
        "chiefComplaint": "Altered or Abnormal Behavior"
      },
      {
        "chiefComplaintID": 17,
        "chiefComplaint": "Altered Taste Sensation"
      },
      {
        "chiefComplaintID": 18,
        "chiefComplaint": "Amenorrhea"
      },
      {
        "chiefComplaintID": 19,
        "chiefComplaint": "Anal Itching"
      },
      {
        "chiefComplaintID": 20,
        "chiefComplaint": "Anemia"
      },
      {
        "chiefComplaintID": 21,
        "chiefComplaint": "Animal Bite"
      },
      {
        "chiefComplaintID": 22,
        "chiefComplaint": "Animal Scratch"
      },
      {
        "chiefComplaintID": 23,
        "chiefComplaint": "Ankle Pain"
      },
      {
        "chiefComplaintID": 24,
        "chiefComplaint": "Ankle Swelling"
      },
      {
        "chiefComplaintID": 25,
        "chiefComplaint": "Anosmia"
      },
      {
        "chiefComplaintID": 26,
        "chiefComplaint": "Anxiety"
      },
      {
        "chiefComplaintID": 27,
        "chiefComplaint": "Arm Pain"
      },
      {
        "chiefComplaintID": 28,
        "chiefComplaint": "Aversion to food or drink"
      },
      {
        "chiefComplaintID": 29,
        "chiefComplaint": "Back Pain"
      },
      {
        "chiefComplaintID": 30,
        "chiefComplaint": "Bad Breath (Halitosis)"
      },
      {
        "chiefComplaintID": 31,
        "chiefComplaint": "Bad Taste in Mouth"
      },
      {
        "chiefComplaintID": 32,
        "chiefComplaint": "Bedwetting"
      },
      {
        "chiefComplaintID": 33,
        "chiefComplaint": "Belching"
      },
      {
        "chiefComplaintID": 34,
        "chiefComplaint": "Binge Eating"
      },
      {
        "chiefComplaintID": 35,
        "chiefComplaint": "Black Eye"
      },
      {
        "chiefComplaintID": 36,
        "chiefComplaint": "Black or Tarry Stools"
      },
      {
        "chiefComplaintID": 37,
        "chiefComplaint": "Blackheads"
      },
      {
        "chiefComplaintID": 38,
        "chiefComplaint": "Blanching of Skin"
      },
      {
        "chiefComplaintID": 39,
        "chiefComplaint": "Bleeding"
      },
      {
        "chiefComplaintID": 42,
        "chiefComplaint": "Bleeding from Nostrils"
      },
      {
        "chiefComplaintID": 40,
        "chiefComplaint": "Bleeding Gums"
      },
      {
        "chiefComplaintID": 41,
        "chiefComplaint": "Bleeding into the Skin"
      },
      {
        "chiefComplaintID": 43,
        "chiefComplaint": "Blisters"
      },
      {
        "chiefComplaintID": 48,
        "chiefComplaint": "Blood and Mucus in Stools"
      },
      {
        "chiefComplaintID": 45,
        "chiefComplaint": "Blood in the Semen"
      },
      {
        "chiefComplaintID": 46,
        "chiefComplaint": "Blood in Urine"
      },
      {
        "chiefComplaintID": 44,
        "chiefComplaint": "Blood tinged Sputum"
      },
      {
        "chiefComplaintID": 47,
        "chiefComplaint": "Bloody in Stools"
      },
      {
        "chiefComplaintID": 49,
        "chiefComplaint": "Blue Fingernails"
      },
      {
        "chiefComplaintID": 50,
        "chiefComplaint": "Blue Lips"
      },
      {
        "chiefComplaintID": 51,
        "chiefComplaint": "Bluish Skin Discoloration"
      },
      {
        "chiefComplaintID": 52,
        "chiefComplaint": "Blurred Vision"
      },
      {
        "chiefComplaintID": 54,
        "chiefComplaint": "Body Pains"
      },
      {
        "chiefComplaintID": 53,
        "chiefComplaint": "Boils"
      },
      {
        "chiefComplaintID": 55,
        "chiefComplaint": "Bone Pain"
      },
      {
        "chiefComplaintID": 56,
        "chiefComplaint": "Bowel Incontinence"
      },
      {
        "chiefComplaintID": 57,
        "chiefComplaint": "Breast Enlargement"
      },
      {
        "chiefComplaintID": 58,
        "chiefComplaint": "Breast Lump"
      },
      {
        "chiefComplaintID": 59,
        "chiefComplaint": "Breast Pain"
      },
      {
        "chiefComplaintID": 60,
        "chiefComplaint": "Breathing Difficulty"
      },
      {
        "chiefComplaintID": 61,
        "chiefComplaint": "Breathlessness at Rest"
      },
      {
        "chiefComplaintID": 62,
        "chiefComplaint": "Bruises"
      },
      {
        "chiefComplaintID": 63,
        "chiefComplaint": "Bruising Easily"
      },
      {
        "chiefComplaintID": 64,
        "chiefComplaint": "Bulging Eyes"
      },
      {
        "chiefComplaintID": 65,
        "chiefComplaint": "Bulging Fontanelles"
      },
      {
        "chiefComplaintID": 67,
        "chiefComplaint": "Burning Micturition"
      },
      {
        "chiefComplaintID": 66,
        "chiefComplaint": "Burning Sensation"
      },
      {
        "chiefComplaintID": 68,
        "chiefComplaint": "Change in bowel habits"
      },
      {
        "chiefComplaintID": 69,
        "chiefComplaint": "Chapped Lips"
      },
      {
        "chiefComplaintID": 71,
        "chiefComplaint": "Chest Pain"
      },
      {
        "chiefComplaintID": 72,
        "chiefComplaint": "Choking"
      },
      {
        "chiefComplaintID": 73,
        "chiefComplaint": "Chorea"
      },
      {
        "chiefComplaintID": 77,
        "chiefComplaint": "Claw Foot"
      },
      {
        "chiefComplaintID": 78,
        "chiefComplaint": "Claw Hand"
      },
      {
        "chiefComplaintID": 76,
        "chiefComplaint": "Clay-Colored Stools"
      },
      {
        "chiefComplaintID": 79,
        "chiefComplaint": "Cloudy Urine"
      },
      {
        "chiefComplaintID": 80,
        "chiefComplaint": "Clumsiness"
      },
      {
        "chiefComplaintID": 81,
        "chiefComplaint": "Coffee ground vomitus"
      },
      {
        "chiefComplaintID": 74,
        "chiefComplaint": "Cold"
      },
      {
        "chiefComplaintID": 75,
        "chiefComplaint": "Cold and Clammy Skin"
      },
      {
        "chiefComplaintID": 82,
        "chiefComplaint": "Cold Feet and Hands"
      },
      {
        "chiefComplaintID": 83,
        "chiefComplaint": "Cold Intolerance"
      },
      {
        "chiefComplaintID": 84,
        "chiefComplaint": "Cold Sores"
      },
      {
        "chiefComplaintID": 85,
        "chiefComplaint": "Colic and Crying"
      },
      {
        "chiefComplaintID": 86,
        "chiefComplaint": "Color Blindness"
      },
      {
        "chiefComplaintID": 87,
        "chiefComplaint": "Concussion"
      },
      {
        "chiefComplaintID": 88,
        "chiefComplaint": "Confusion"
      },
      {
        "chiefComplaintID": 90,
        "chiefComplaint": "Consciousness Decreased"
      },
      {
        "chiefComplaintID": 91,
        "chiefComplaint": "Constipation"
      },
      {
        "chiefComplaintID": 89,
        "chiefComplaint": "Convulsions"
      },
      {
        "chiefComplaintID": 92,
        "chiefComplaint": "Cough"
      },
      {
        "chiefComplaintID": 93,
        "chiefComplaint": "Coughing Up Blood"
      },
      {
        "chiefComplaintID": 70,
        "chiefComplaint": "Cracked Lips"
      },
      {
        "chiefComplaintID": 94,
        "chiefComplaint": "Cracked/Fissured Nipples"
      },
      {
        "chiefComplaintID": 95,
        "chiefComplaint": "Cuts and Puncture Wounds"
      },
      {
        "chiefComplaintID": 96,
        "chiefComplaint": "Cyst"
      },
      {
        "chiefComplaintID": 97,
        "chiefComplaint": "Dark circles under Eyes"
      },
      {
        "chiefComplaintID": 99,
        "chiefComplaint": "Dark colored stools"
      },
      {
        "chiefComplaintID": 98,
        "chiefComplaint": "Dark Urine"
      },
      {
        "chiefComplaintID": 100,
        "chiefComplaint": "Decreased Appetite"
      },
      {
        "chiefComplaintID": 101,
        "chiefComplaint": "Decreased Feeding"
      },
      {
        "chiefComplaintID": 102,
        "chiefComplaint": "Decreased Fetal Movements"
      },
      {
        "chiefComplaintID": 103,
        "chiefComplaint": "Decreased Libido"
      },
      {
        "chiefComplaintID": 104,
        "chiefComplaint": "Decreased Urine Output"
      },
      {
        "chiefComplaintID": 106,
        "chiefComplaint": "Deformity"
      },
      {
        "chiefComplaintID": 105,
        "chiefComplaint": "Deformity of Spine"
      },
      {
        "chiefComplaintID": 107,
        "chiefComplaint": "Dehydration"
      },
      {
        "chiefComplaintID": 186,
        "chiefComplaint": "Delayed Growth"
      },
      {
        "chiefComplaintID": 108,
        "chiefComplaint": "Delirium"
      },
      {
        "chiefComplaintID": 109,
        "chiefComplaint": "Delusions"
      },
      {
        "chiefComplaintID": 110,
        "chiefComplaint": "Dementia"
      },
      {
        "chiefComplaintID": 112,
        "chiefComplaint": "Depigmentation of Skin"
      },
      {
        "chiefComplaintID": 111,
        "chiefComplaint": "Depression"
      },
      {
        "chiefComplaintID": 113,
        "chiefComplaint": "Developmental Delay"
      },
      {
        "chiefComplaintID": 114,
        "chiefComplaint": "Deviation of Mouth"
      },
      {
        "chiefComplaintID": 115,
        "chiefComplaint": "Diaper Rash"
      },
      {
        "chiefComplaintID": 116,
        "chiefComplaint": "Diarrhea"
      },
      {
        "chiefComplaintID": 117,
        "chiefComplaint": "Difficulty in Breathing"
      },
      {
        "chiefComplaintID": 119,
        "chiefComplaint": "Difficulty in Concentration"
      },
      {
        "chiefComplaintID": 121,
        "chiefComplaint": "Difficulty in Swallowing"
      },
      {
        "chiefComplaintID": 120,
        "chiefComplaint": "Difficulty with Speech"
      },
      {
        "chiefComplaintID": 118,
        "chiefComplaint": "Difficulty with Urination Flow"
      },
      {
        "chiefComplaintID": 122,
        "chiefComplaint": "Discharge from Penis"
      },
      {
        "chiefComplaintID": 123,
        "chiefComplaint": "Disorientation"
      },
      {
        "chiefComplaintID": 124,
        "chiefComplaint": "Dizziness"
      },
      {
        "chiefComplaintID": 125,
        "chiefComplaint": "Dog Bite"
      },
      {
        "chiefComplaintID": 126,
        "chiefComplaint": "Double Vision"
      },
      {
        "chiefComplaintID": 127,
        "chiefComplaint": "Dribbling of Urine"
      },
      {
        "chiefComplaintID": 128,
        "chiefComplaint": "Drooling of Saliva"
      },
      {
        "chiefComplaintID": 129,
        "chiefComplaint": "Drooping of Eyelids"
      },
      {
        "chiefComplaintID": 130,
        "chiefComplaint": "Drowsiness"
      },
      {
        "chiefComplaintID": 131,
        "chiefComplaint": "Dry Eyes"
      },
      {
        "chiefComplaintID": 132,
        "chiefComplaint": "Dry Hair"
      },
      {
        "chiefComplaintID": 133,
        "chiefComplaint": "Dry Mouth"
      },
      {
        "chiefComplaintID": 134,
        "chiefComplaint": "Dry Skin"
      },
      {
        "chiefComplaintID": 135,
        "chiefComplaint": "Ear Discharge"
      },
      {
        "chiefComplaintID": 136,
        "chiefComplaint": "Ear Pain"
      },
      {
        "chiefComplaintID": 137,
        "chiefComplaint": "Easy Bruising"
      },
      {
        "chiefComplaintID": 138,
        "chiefComplaint": "Easy Fatigability"
      },
      {
        "chiefComplaintID": 139,
        "chiefComplaint": "Edema"
      },
      {
        "chiefComplaintID": 140,
        "chiefComplaint": "Elbow Pain"
      },
      {
        "chiefComplaintID": 141,
        "chiefComplaint": "Epigastric Pain"
      },
      {
        "chiefComplaintID": 142,
        "chiefComplaint": "Epistaxis"
      },
      {
        "chiefComplaintID": 149,
        "chiefComplaint": "Excess Weight Gain"
      },
      {
        "chiefComplaintID": 143,
        "chiefComplaint": "Excessive Hair"
      },
      {
        "chiefComplaintID": 144,
        "chiefComplaint": "Excessive Sweating"
      },
      {
        "chiefComplaintID": 145,
        "chiefComplaint": "Excessive Thirst"
      },
      {
        "chiefComplaintID": 148,
        "chiefComplaint": "Excessive Thirst"
      },
      {
        "chiefComplaintID": 146,
        "chiefComplaint": "Excessive Urination"
      },
      {
        "chiefComplaintID": 147,
        "chiefComplaint": "Excessive Urination at Night"
      },
      {
        "chiefComplaintID": 150,
        "chiefComplaint": "Excessive Yawning"
      },
      {
        "chiefComplaintID": 151,
        "chiefComplaint": "External Eyelid Stye (Hordeolum Externum)"
      },
      {
        "chiefComplaintID": 152,
        "chiefComplaint": "Eye Burning"
      },
      {
        "chiefComplaintID": 153,
        "chiefComplaint": "Eye Discharge"
      },
      {
        "chiefComplaintID": 154,
        "chiefComplaint": "Eye Floaters"
      },
      {
        "chiefComplaintID": 155,
        "chiefComplaint": "Eye Pain"
      },
      {
        "chiefComplaintID": 156,
        "chiefComplaint": "Eye Redness"
      },
      {
        "chiefComplaintID": 157,
        "chiefComplaint": "Eyelid Twitch"
      },
      {
        "chiefComplaintID": 158,
        "chiefComplaint": "Face Pain"
      },
      {
        "chiefComplaintID": 159,
        "chiefComplaint": "Facial Swelling"
      },
      {
        "chiefComplaintID": 160,
        "chiefComplaint": "Failure to Thrive"
      },
      {
        "chiefComplaintID": 161,
        "chiefComplaint": "Fainting"
      },
      {
        "chiefComplaintID": 162,
        "chiefComplaint": "Fast heart rate"
      },
      {
        "chiefComplaintID": 163,
        "chiefComplaint": "Fatigue"
      },
      {
        "chiefComplaintID": 164,
        "chiefComplaint": "Fecal Incontinence"
      },
      {
        "chiefComplaintID": 165,
        "chiefComplaint": "Feeding Difficulty"
      },
      {
        "chiefComplaintID": 166,
        "chiefComplaint": "Feels Hot to Touch"
      },
      {
        "chiefComplaintID": 167,
        "chiefComplaint": "Fever"
      },
      {
        "chiefComplaintID": 168,
        "chiefComplaint": "Finger Pain"
      },
      {
        "chiefComplaintID": 169,
        "chiefComplaint": "Flaky Scalp"
      },
      {
        "chiefComplaintID": 170,
        "chiefComplaint": "Flank Pain"
      },
      {
        "chiefComplaintID": 171,
        "chiefComplaint": "Flatulence"
      },
      {
        "chiefComplaintID": 172,
        "chiefComplaint": "Floating Stools"
      },
      {
        "chiefComplaintID": 173,
        "chiefComplaint": "Fluctuating Mood"
      },
      {
        "chiefComplaintID": 174,
        "chiefComplaint": "Foot Pain"
      },
      {
        "chiefComplaintID": 175,
        "chiefComplaint": "Foot Swelling"
      },
      {
        "chiefComplaintID": 176,
        "chiefComplaint": "Foreign Object in the Eye"
      },
      {
        "chiefComplaintID": 177,
        "chiefComplaint": "Foul Smelling Lochia"
      },
      {
        "chiefComplaintID": 178,
        "chiefComplaint": "Foul Smelling Stools"
      },
      {
        "chiefComplaintID": 179,
        "chiefComplaint": "Fracture"
      },
      {
        "chiefComplaintID": 180,
        "chiefComplaint": "Frequency of Urination"
      },
      {
        "chiefComplaintID": 181,
        "chiefComplaint": "Frontal Bossing"
      },
      {
        "chiefComplaintID": 182,
        "chiefComplaint": "Gases"
      },
      {
        "chiefComplaintID": 183,
        "chiefComplaint": "Giddiness"
      },
      {
        "chiefComplaintID": 184,
        "chiefComplaint": "Groin Pain"
      },
      {
        "chiefComplaintID": 185,
        "chiefComplaint": "Gums Swelling"
      },
      {
        "chiefComplaintID": 187,
        "chiefComplaint": "Hair Fall"
      },
      {
        "chiefComplaintID": 188,
        "chiefComplaint": "Hair Loss"
      },
      {
        "chiefComplaintID": 189,
        "chiefComplaint": "Hallucinations"
      },
      {
        "chiefComplaintID": 190,
        "chiefComplaint": "Hand Numbness"
      },
      {
        "chiefComplaintID": 191,
        "chiefComplaint": "Hand Pain"
      },
      {
        "chiefComplaintID": 192,
        "chiefComplaint": "Hard Stools"
      },
      {
        "chiefComplaintID": 193,
        "chiefComplaint": "Hazy Vision"
      },
      {
        "chiefComplaintID": 194,
        "chiefComplaint": "Headache"
      },
      {
        "chiefComplaintID": 195,
        "chiefComplaint": "Hearing Loss"
      },
      {
        "chiefComplaintID": 196,
        "chiefComplaint": "Hearing loss on one side"
      },
      {
        "chiefComplaintID": 197,
        "chiefComplaint": "Heartburn"
      },
      {
        "chiefComplaintID": 198,
        "chiefComplaint": "Heat Intolerance"
      },
      {
        "chiefComplaintID": 199,
        "chiefComplaint": "Heavy Menstrual Bleeding"
      },
      {
        "chiefComplaintID": 200,
        "chiefComplaint": "Heel Pain"
      },
      {
        "chiefComplaintID": 201,
        "chiefComplaint": "Hiccups"
      },
      {
        "chiefComplaintID": 202,
        "chiefComplaint": "Hip Pain"
      },
      {
        "chiefComplaintID": 203,
        "chiefComplaint": "Hip Stiffness"
      },
      {
        "chiefComplaintID": 204,
        "chiefComplaint": "Hives"
      },
      {
        "chiefComplaintID": 205,
        "chiefComplaint": "Hoarseness of Voice"
      },
      {
        "chiefComplaintID": 206,
        "chiefComplaint": "Hot Flashes"
      },
      {
        "chiefComplaintID": 207,
        "chiefComplaint": "Hump Behind the Shoulders"
      },
      {
        "chiefComplaintID": 209,
        "chiefComplaint": "Hyper elastic Skin"
      },
      {
        "chiefComplaintID": 208,
        "chiefComplaint": "Hyperactivity"
      },
      {
        "chiefComplaintID": 210,
        "chiefComplaint": "Hypermobile Joints"
      },
      {
        "chiefComplaintID": 211,
        "chiefComplaint": "Impaired Sensation"
      },
      {
        "chiefComplaintID": 212,
        "chiefComplaint": "Impaired Smell"
      },
      {
        "chiefComplaintID": 213,
        "chiefComplaint": "Impaired Taste"
      },
      {
        "chiefComplaintID": 214,
        "chiefComplaint": "Impulsivity"
      },
      {
        "chiefComplaintID": 215,
        "chiefComplaint": "Inattention"
      },
      {
        "chiefComplaintID": 216,
        "chiefComplaint": "Increased Appetite"
      },
      {
        "chiefComplaintID": 217,
        "chiefComplaint": "Indifferent Mood"
      },
      {
        "chiefComplaintID": 218,
        "chiefComplaint": "Indigestion"
      },
      {
        "chiefComplaintID": 219,
        "chiefComplaint": "Infertility"
      },
      {
        "chiefComplaintID": 220,
        "chiefComplaint": "Insomnia"
      },
      {
        "chiefComplaintID": 221,
        "chiefComplaint": "Intercostal Retractions"
      },
      {
        "chiefComplaintID": 222,
        "chiefComplaint": "Inverted Nipple"
      },
      {
        "chiefComplaintID": 223,
        "chiefComplaint": "Irregular Menstrual Periods"
      },
      {
        "chiefComplaintID": 224,
        "chiefComplaint": "Irritability"
      },
      {
        "chiefComplaintID": 225,
        "chiefComplaint": "Itching"
      },
      {
        "chiefComplaintID": 226,
        "chiefComplaint": "Itching in Groin"
      },
      {
        "chiefComplaintID": 227,
        "chiefComplaint": "Jaundice"
      },
      {
        "chiefComplaintID": 228,
        "chiefComplaint": "Jaw Pain"
      },
      {
        "chiefComplaintID": 229,
        "chiefComplaint": "Joint Cracking"
      },
      {
        "chiefComplaintID": 230,
        "chiefComplaint": "Joint Deformity"
      },
      {
        "chiefComplaintID": 231,
        "chiefComplaint": "Joint Pain"
      },
      {
        "chiefComplaintID": 232,
        "chiefComplaint": "Joint Redness"
      },
      {
        "chiefComplaintID": 233,
        "chiefComplaint": "Joint Stiffness"
      },
      {
        "chiefComplaintID": 234,
        "chiefComplaint": "Joint Swelling"
      },
      {
        "chiefComplaintID": 235,
        "chiefComplaint": "Knee Pain"
      },
      {
        "chiefComplaintID": 236,
        "chiefComplaint": "Labored Breathing"
      },
      {
        "chiefComplaintID": 237,
        "chiefComplaint": "Lazy Eye"
      },
      {
        "chiefComplaintID": 238,
        "chiefComplaint": "Learning Difficulty"
      },
      {
        "chiefComplaintID": 239,
        "chiefComplaint": "Leg Pain"
      },
      {
        "chiefComplaintID": 241,
        "chiefComplaint": "Leg Swelling"
      },
      {
        "chiefComplaintID": 240,
        "chiefComplaint": "Leg Ulcers"
      },
      {
        "chiefComplaintID": 242,
        "chiefComplaint": "Lethargy"
      },
      {
        "chiefComplaintID": 243,
        "chiefComplaint": "Lightheadedness"
      },
      {
        "chiefComplaintID": 244,
        "chiefComplaint": "Limited Range of Motion"
      },
      {
        "chiefComplaintID": 245,
        "chiefComplaint": "Limping"
      },
      {
        "chiefComplaintID": 246,
        "chiefComplaint": "Loose Watery Stools"
      },
      {
        "chiefComplaintID": 247,
        "chiefComplaint": "Loss of Appetite"
      },
      {
        "chiefComplaintID": 248,
        "chiefComplaint": "Loss of Speech"
      },
      {
        "chiefComplaintID": 249,
        "chiefComplaint": "Loss of Taste Sensation"
      },
      {
        "chiefComplaintID": 250,
        "chiefComplaint": "Loss of Vision"
      },
      {
        "chiefComplaintID": 251,
        "chiefComplaint": "Lump"
      },
      {
        "chiefComplaintID": 252,
        "chiefComplaint": "Lump in Breast"
      },
      {
        "chiefComplaintID": 253,
        "chiefComplaint": "Lump in Groin region"
      },
      {
        "chiefComplaintID": 254,
        "chiefComplaint": "Macule"
      },
      {
        "chiefComplaintID": 255,
        "chiefComplaint": "Malaise"
      },
      {
        "chiefComplaintID": 256,
        "chiefComplaint": "Memory Loss"
      },
      {
        "chiefComplaintID": 257,
        "chiefComplaint": "Menstrual Cramps"
      },
      {
        "chiefComplaintID": 258,
        "chiefComplaint": "Missed Menstrual Period"
      },
      {
        "chiefComplaintID": 259,
        "chiefComplaint": "Moist Skin"
      },
      {
        "chiefComplaintID": 260,
        "chiefComplaint": "Mood Swings"
      },
      {
        "chiefComplaintID": 261,
        "chiefComplaint": "Morning Sickness"
      },
      {
        "chiefComplaintID": 262,
        "chiefComplaint": "Mouth Sores"
      },
      {
        "chiefComplaintID": 263,
        "chiefComplaint": "Mouth Ulcers"
      },
      {
        "chiefComplaintID": 264,
        "chiefComplaint": "Muscle Cramps"
      },
      {
        "chiefComplaintID": 265,
        "chiefComplaint": "Muscle Pain"
      },
      {
        "chiefComplaintID": 270,
        "chiefComplaint": "Muscle Rigidity"
      },
      {
        "chiefComplaintID": 266,
        "chiefComplaint": "Muscle Sprain"
      },
      {
        "chiefComplaintID": 267,
        "chiefComplaint": "Muscle Stiffness"
      },
      {
        "chiefComplaintID": 268,
        "chiefComplaint": "Muscle Twitching"
      },
      {
        "chiefComplaintID": 269,
        "chiefComplaint": "Muscle Weakness"
      },
      {
        "chiefComplaintID": 271,
        "chiefComplaint": "Nail Clubbing"
      },
      {
        "chiefComplaintID": 272,
        "chiefComplaint": "Nail Discoloration"
      },
      {
        "chiefComplaintID": 274,
        "chiefComplaint": "Nail Pitting"
      },
      {
        "chiefComplaintID": 273,
        "chiefComplaint": "Nail Separation"
      },
      {
        "chiefComplaintID": 275,
        "chiefComplaint": "Nasal Congestion"
      },
      {
        "chiefComplaintID": 276,
        "chiefComplaint": "Nasal Discharge"
      },
      {
        "chiefComplaintID": 277,
        "chiefComplaint": "Nasal Flaring"
      },
      {
        "chiefComplaintID": 278,
        "chiefComplaint": "Nausea"
      },
      {
        "chiefComplaintID": 279,
        "chiefComplaint": "Neck Lump"
      },
      {
        "chiefComplaintID": 280,
        "chiefComplaint": "Neck Pain"
      },
      {
        "chiefComplaintID": 281,
        "chiefComplaint": "Night Blindness"
      },
      {
        "chiefComplaintID": 283,
        "chiefComplaint": "Night Sweats"
      },
      {
        "chiefComplaintID": 282,
        "chiefComplaint": "Nightmares"
      },
      {
        "chiefComplaintID": 284,
        "chiefComplaint": "Nipple Inversion"
      },
      {
        "chiefComplaintID": 285,
        "chiefComplaint": "Nipple Retraction"
      },
      {
        "chiefComplaintID": 286,
        "chiefComplaint": "No Menstruation (Absent Menstruation)"
      },
      {
        "chiefComplaintID": 287,
        "chiefComplaint": "Nose Injury"
      },
      {
        "chiefComplaintID": 288,
        "chiefComplaint": "Numbness and Tingling"
      },
      {
        "chiefComplaintID": 290,
        "chiefComplaint": "Numbness of Fingers"
      },
      {
        "chiefComplaintID": 289,
        "chiefComplaint": "Numbness of Foot"
      },
      {
        "chiefComplaintID": 291,
        "chiefComplaint": "Numbness of Hands"
      },
      {
        "chiefComplaintID": 292,
        "chiefComplaint": "Numbness of Limbs"
      },
      {
        "chiefComplaintID": 293,
        "chiefComplaint": "Numbness of Toes"
      },
      {
        "chiefComplaintID": 294,
        "chiefComplaint": "Nystagmus"
      },
      {
        "chiefComplaintID": 295,
        "chiefComplaint": "Pain"
      },
      {
        "chiefComplaintID": 299,
        "chiefComplaint": "Pain in Penis"
      },
      {
        "chiefComplaintID": 298,
        "chiefComplaint": "Pain in the Legs"
      },
      {
        "chiefComplaintID": 300,
        "chiefComplaint": "Pain in Urethra"
      },
      {
        "chiefComplaintID": 296,
        "chiefComplaint": "Painful Gums"
      },
      {
        "chiefComplaintID": 297,
        "chiefComplaint": "Painful Intercourse"
      },
      {
        "chiefComplaintID": 301,
        "chiefComplaint": "Painful Menstrual Periods"
      },
      {
        "chiefComplaintID": 302,
        "chiefComplaint": "Painful Urination"
      },
      {
        "chiefComplaintID": 305,
        "chiefComplaint": "Pale Skin"
      },
      {
        "chiefComplaintID": 303,
        "chiefComplaint": "Pale Stools"
      },
      {
        "chiefComplaintID": 304,
        "chiefComplaint": "Paleness"
      },
      {
        "chiefComplaintID": 306,
        "chiefComplaint": "Palpitations"
      },
      {
        "chiefComplaintID": 307,
        "chiefComplaint": "Papule"
      },
      {
        "chiefComplaintID": 308,
        "chiefComplaint": "Paralysis"
      },
      {
        "chiefComplaintID": 309,
        "chiefComplaint": "Patchy Skin Color"
      },
      {
        "chiefComplaintID": 310,
        "chiefComplaint": "Peeling of Skin"
      },
      {
        "chiefComplaintID": 311,
        "chiefComplaint": "Pelvic Pain"
      },
      {
        "chiefComplaintID": 312,
        "chiefComplaint": "Penile Discharge"
      },
      {
        "chiefComplaintID": 313,
        "chiefComplaint": "Photophobia"
      },
      {
        "chiefComplaintID": 314,
        "chiefComplaint": "Photosensitivity"
      },
      {
        "chiefComplaintID": 315,
        "chiefComplaint": "Pica"
      },
      {
        "chiefComplaintID": 316,
        "chiefComplaint": "Pigmentation of Skin"
      },
      {
        "chiefComplaintID": 317,
        "chiefComplaint": "Pink Eye"
      },
      {
        "chiefComplaintID": 318,
        "chiefComplaint": "Pleurisy"
      },
      {
        "chiefComplaintID": 319,
        "chiefComplaint": "Poor Balance"
      },
      {
        "chiefComplaintID": 320,
        "chiefComplaint": "Poor Feeding in Infants"
      },
      {
        "chiefComplaintID": 321,
        "chiefComplaint": "Postnasal Drip"
      },
      {
        "chiefComplaintID": 322,
        "chiefComplaint": "Prolonged Menstrual Bleeding"
      },
      {
        "chiefComplaintID": 324,
        "chiefComplaint": "Puffiness of Face"
      },
      {
        "chiefComplaintID": 323,
        "chiefComplaint": "Pustules"
      },
      {
        "chiefComplaintID": 325,
        "chiefComplaint": "Rapid Breathing"
      },
      {
        "chiefComplaintID": 326,
        "chiefComplaint": "Rapid Shallow Breathing"
      },
      {
        "chiefComplaintID": 327,
        "chiefComplaint": "Rashes"
      },
      {
        "chiefComplaintID": 328,
        "chiefComplaint": "Rectal Bleeding"
      },
      {
        "chiefComplaintID": 329,
        "chiefComplaint": "Rectal Pain"
      },
      {
        "chiefComplaintID": 330,
        "chiefComplaint": "Red Eyes"
      },
      {
        "chiefComplaintID": 331,
        "chiefComplaint": "Red Spots on the Skin"
      },
      {
        "chiefComplaintID": 332,
        "chiefComplaint": "Red Streaks on the Skin"
      },
      {
        "chiefComplaintID": 333,
        "chiefComplaint": "Refusal of Feeds"
      },
      {
        "chiefComplaintID": 334,
        "chiefComplaint": "Restlessness"
      },
      {
        "chiefComplaintID": 335,
        "chiefComplaint": "Rib Cage Pain"
      },
      {
        "chiefComplaintID": 336,
        "chiefComplaint": "Ringing in Ears"
      },
      {
        "chiefComplaintID": 337,
        "chiefComplaint": "Running Nose"
      },
      {
        "chiefComplaintID": 338,
        "chiefComplaint": "Scaling of Skin"
      },
      {
        "chiefComplaintID": 340,
        "chiefComplaint": "Scratch by Dog"
      },
      {
        "chiefComplaintID": 339,
        "chiefComplaint": "Scrotal Pain"
      },
      {
        "chiefComplaintID": 341,
        "chiefComplaint": "Scrotal Swelling"
      },
      {
        "chiefComplaintID": 342,
        "chiefComplaint": "Seizures"
      },
      {
        "chiefComplaintID": 343,
        "chiefComplaint": "Self-Neglect"
      },
      {
        "chiefComplaintID": 344,
        "chiefComplaint": "Separation Anxiety"
      },
      {
        "chiefComplaintID": 347,
        "chiefComplaint": "Shaking of Fingers"
      },
      {
        "chiefComplaintID": 345,
        "chiefComplaint": "Shaking of Hands"
      },
      {
        "chiefComplaintID": 346,
        "chiefComplaint": "Shaking of Legs"
      },
      {
        "chiefComplaintID": 348,
        "chiefComplaint": "Short Stature"
      },
      {
        "chiefComplaintID": 349,
        "chiefComplaint": "Shortness of Breath"
      },
      {
        "chiefComplaintID": 350,
        "chiefComplaint": "Shortness of Breath on Exertion"
      },
      {
        "chiefComplaintID": 351,
        "chiefComplaint": "Shoulder Pain"
      },
      {
        "chiefComplaintID": 353,
        "chiefComplaint": "Skin Abscess"
      },
      {
        "chiefComplaintID": 354,
        "chiefComplaint": "Skin Blushing/Flushing"
      },
      {
        "chiefComplaintID": 355,
        "chiefComplaint": "Skin Redness"
      },
      {
        "chiefComplaintID": 352,
        "chiefComplaint": "Sleep Apnea"
      },
      {
        "chiefComplaintID": 356,
        "chiefComplaint": "Sleeping Difficulty"
      },
      {
        "chiefComplaintID": 357,
        "chiefComplaint": "Sleeplessness"
      },
      {
        "chiefComplaintID": 358,
        "chiefComplaint": "Sleepwalking"
      },
      {
        "chiefComplaintID": 359,
        "chiefComplaint": "Sneezing"
      },
      {
        "chiefComplaintID": 360,
        "chiefComplaint": "Snoring"
      },
      {
        "chiefComplaintID": 361,
        "chiefComplaint": "Sore Throat"
      },
      {
        "chiefComplaintID": 362,
        "chiefComplaint": "Sore Tongue"
      },
      {
        "chiefComplaintID": 363,
        "chiefComplaint": "Spasticity"
      },
      {
        "chiefComplaintID": 364,
        "chiefComplaint": "Spoon shaped Fingernails"
      },
      {
        "chiefComplaintID": 365,
        "chiefComplaint": "Sprains \u0026 Strains"
      },
      {
        "chiefComplaintID": 366,
        "chiefComplaint": "Stiffness of Neck"
      },
      {
        "chiefComplaintID": 367,
        "chiefComplaint": "Stomach Cramps"
      },
      {
        "chiefComplaintID": 368,
        "chiefComplaint": "Stomach Pain"
      },
      {
        "chiefComplaintID": 369,
        "chiefComplaint": "Stress"
      },
      {
        "chiefComplaintID": 370,
        "chiefComplaint": "Stress incontinence"
      },
      {
        "chiefComplaintID": 371,
        "chiefComplaint": "Stridor"
      },
      {
        "chiefComplaintID": 372,
        "chiefComplaint": "Swallowing Difficulty"
      },
      {
        "chiefComplaintID": 373,
        "chiefComplaint": "Swelling"
      },
      {
        "chiefComplaintID": 386,
        "chiefComplaint": "Swelling in Neck"
      },
      {
        "chiefComplaintID": 377,
        "chiefComplaint": "Swelling of Body"
      },
      {
        "chiefComplaintID": 383,
        "chiefComplaint": "Swelling of Legs"
      },
      {
        "chiefComplaintID": 384,
        "chiefComplaint": "Swelling of Lips"
      },
      {
        "chiefComplaintID": 387,
        "chiefComplaint": "Swelling of Penis"
      },
      {
        "chiefComplaintID": 374,
        "chiefComplaint": "Swelling on Eyelids"
      },
      {
        "chiefComplaintID": 375,
        "chiefComplaint": "Swollen Abdomen"
      },
      {
        "chiefComplaintID": 376,
        "chiefComplaint": "Swollen Ankles"
      },
      {
        "chiefComplaintID": 378,
        "chiefComplaint": "Swollen Eyes"
      },
      {
        "chiefComplaintID": 380,
        "chiefComplaint": "Swollen Feet"
      },
      {
        "chiefComplaintID": 379,
        "chiefComplaint": "Swollen Gums"
      },
      {
        "chiefComplaintID": 381,
        "chiefComplaint": "Swollen Knee Joints"
      },
      {
        "chiefComplaintID": 385,
        "chiefComplaint": "Swollen Lymph Nodes"
      },
      {
        "chiefComplaintID": 382,
        "chiefComplaint": "Swollen Tongue"
      },
      {
        "chiefComplaintID": 388,
        "chiefComplaint": "Teeth Grinding"
      },
      {
        "chiefComplaintID": 389,
        "chiefComplaint": "Temper Tantrums"
      },
      {
        "chiefComplaintID": 390,
        "chiefComplaint": "Tenesmus"
      },
      {
        "chiefComplaintID": 391,
        "chiefComplaint": "Testicle Lump"
      },
      {
        "chiefComplaintID": 392,
        "chiefComplaint": "Testicle Pain"
      },
      {
        "chiefComplaintID": 393,
        "chiefComplaint": "Testicular Swelling"
      },
      {
        "chiefComplaintID": 394,
        "chiefComplaint": "Thrush"
      },
      {
        "chiefComplaintID": 395,
        "chiefComplaint": "Tingling of Hands and Feet"
      },
      {
        "chiefComplaintID": 396,
        "chiefComplaint": "Tinnitus"
      },
      {
        "chiefComplaintID": 397,
        "chiefComplaint": "Tiredness"
      },
      {
        "chiefComplaintID": 398,
        "chiefComplaint": "Tooth Decay"
      },
      {
        "chiefComplaintID": 399,
        "chiefComplaint": "Toothache"
      },
      {
        "chiefComplaintID": 400,
        "chiefComplaint": "Tremor"
      },
      {
        "chiefComplaintID": 401,
        "chiefComplaint": "Trismus"
      },
      {
        "chiefComplaintID": 403,
        "chiefComplaint": "Ulcers of Skin"
      },
      {
        "chiefComplaintID": 402,
        "chiefComplaint": "Ulcers on Penis"
      },
      {
        "chiefComplaintID": 404,
        "chiefComplaint": "Unable to Concentrate"
      },
      {
        "chiefComplaintID": 405,
        "chiefComplaint": "Unable to Control Emotions"
      },
      {
        "chiefComplaintID": 406,
        "chiefComplaint": "Uncontrollable or Involuntary Movements"
      },
      {
        "chiefComplaintID": 407,
        "chiefComplaint": "Uncoordinated Movement"
      },
      {
        "chiefComplaintID": 408,
        "chiefComplaint": "Undescended Testicle"
      },
      {
        "chiefComplaintID": 409,
        "chiefComplaint": "Unintentional Weight Gain"
      },
      {
        "chiefComplaintID": 410,
        "chiefComplaint": "Unsteady Gait"
      },
      {
        "chiefComplaintID": 411,
        "chiefComplaint": "Unusual Sensation"
      },
      {
        "chiefComplaintID": 416,
        "chiefComplaint": "Urge Incontinence"
      },
      {
        "chiefComplaintID": 412,
        "chiefComplaint": "Urgency of Urination"
      },
      {
        "chiefComplaintID": 413,
        "chiefComplaint": "Urinary Incontinence"
      },
      {
        "chiefComplaintID": 414,
        "chiefComplaint": "Urinary Retention"
      },
      {
        "chiefComplaintID": 415,
        "chiefComplaint": "Urine Odor"
      },
      {
        "chiefComplaintID": 417,
        "chiefComplaint": "Vaginal Bleeding"
      },
      {
        "chiefComplaintID": 418,
        "chiefComplaint": "Vaginal Bleeding Between Periods"
      },
      {
        "chiefComplaintID": 419,
        "chiefComplaint": "Vaginal Discharge"
      },
      {
        "chiefComplaintID": 420,
        "chiefComplaint": "Vaginal Dryness"
      },
      {
        "chiefComplaintID": 421,
        "chiefComplaint": "Vaginal Itching"
      },
      {
        "chiefComplaintID": 422,
        "chiefComplaint": "Vaginal Odor"
      },
      {
        "chiefComplaintID": 423,
        "chiefComplaint": "Vaginal Pain"
      },
      {
        "chiefComplaintID": 424,
        "chiefComplaint": "Vertigo"
      },
      {
        "chiefComplaintID": 425,
        "chiefComplaint": "Vesicles"
      },
      {
        "chiefComplaintID": 426,
        "chiefComplaint": "Vision Loss"
      },
      {
        "chiefComplaintID": 427,
        "chiefComplaint": "Visual Impairment"
      },
      {
        "chiefComplaintID": 428,
        "chiefComplaint": "Vomiting"
      },
      {
        "chiefComplaintID": 429,
        "chiefComplaint": "Vomiting of Blood"
      },
      {
        "chiefComplaintID": 430,
        "chiefComplaint": "Warts"
      },
      {
        "chiefComplaintID": 431,
        "chiefComplaint": "Watery Eyes"
      },
      {
        "chiefComplaintID": 432,
        "chiefComplaint": "Weakness"
      },
      {
        "chiefComplaintID": 433,
        "chiefComplaint": "Weight Loss"
      },
      {
        "chiefComplaintID": 434,
        "chiefComplaint": "Wheals"
      },
      {
        "chiefComplaintID": 435,
        "chiefComplaint": "Wheezing"
      },
      {
        "chiefComplaintID": 436,
        "chiefComplaint": "White Patches of Skin"
      },
      {
        "chiefComplaintID": 437,
        "chiefComplaint": "Wrist Pain"
      },
      {
        "chiefComplaintID": 438,
        "chiefComplaint": "Yellow Eyes"
      },
      {
        "chiefComplaintID": 439,
        "chiefComplaint": "Yellow Skin"
      }
    ],
    "typeOfAlcoholProducts": [
      {
        "personalHabitTypeID": 16,
        "habitType": "Type of Alcohol",
        "habitValue": "Beer"
      },
      {
        "personalHabitTypeID": 22,
        "habitType": "Type of Alcohol",
        "habitValue": "Country Liquor"
      },
      {
        "personalHabitTypeID": 19,
        "habitType": "Type of Alcohol",
        "habitValue": "Rum"
      },
      {
        "personalHabitTypeID": 21,
        "habitType": "Type of Alcohol",
        "habitValue": "Scotch"
      },
      {
        "personalHabitTypeID": 17,
        "habitType": "Type of Alcohol",
        "habitValue": "Whiskey"
      },
      {
        "personalHabitTypeID": 18,
        "habitType": "Type of Alcohol",
        "habitValue": "Wine"
      },
      {
        "personalHabitTypeID": 20,
        "habitType": "Type of Alcohol",
        "habitValue": "Zin"
      }
    ],
    "frequencyOfAlcoholIntake": [
      {
        "personalHabitTypeID": 25,
        "habitType": "Frequency of Alcohol Intake",
        "habitValue": "2-3 times a month"
      },
      {
        "personalHabitTypeID": 23,
        "habitType": "Frequency of Alcohol Intake",
        "habitValue": "\u003c Once a month"
      },
      {
        "personalHabitTypeID": 28,
        "habitType": "Frequency of Alcohol Intake",
        "habitValue": "Daily"
      },
      {
        "personalHabitTypeID": 24,
        "habitType": "Frequency of Alcohol Intake",
        "habitValue": "Once a month"
      },
      {
        "personalHabitTypeID": 26,
        "habitType": "Frequency of Alcohol Intake",
        "habitValue": "Once a week"
      },
      {
        "personalHabitTypeID": 29,
        "habitType": "Frequency of Alcohol Intake",
        "habitValue": "Several times a day"
      },
      {
        "personalHabitTypeID": 27,
        "habitType": "Frequency of Alcohol Intake",
        "habitValue": "Several times a week but not daily"
      }
    ],
    "compFeedAges": [
      {
        "feedID": 5,
        "type": "Comp Feed Age",
        "value": "4 months"
      },
      {
        "feedID": 6,
        "type": "Comp Feed Age",
        "value": "5 months"
      },
      {
        "feedID": 7,
        "type": "Comp Feed Age",
        "value": "6 months"
      },
      {
        "feedID": 8,
        "type": "Comp Feed Age",
        "value": "7 months"
      },
      {
        "feedID": 4,
        "type": "Comp Feed Age",
        "value": "\u003c4 months"
      },
      {
        "feedID": 9,
        "type": "Comp Feed Age",
        "value": "\u003e7 months"
      }
    ],
    "menstrualCycleBloodFlowDuration": [
      {
        "menstrualRangeID": 5,
        "rangeType": " Blood Flow Duration",
        "menstrualCycleRange": "2 days"
      },
      {
        "menstrualRangeID": 6,
        "rangeType": " Blood Flow Duration",
        "menstrualCycleRange": "3 days"
      },
      {
        "menstrualRangeID": 7,
        "rangeType": " Blood Flow Duration",
        "menstrualCycleRange": "4 days"
      },
      {
        "menstrualRangeID": 8,
        "rangeType": " Blood Flow Duration",
        "menstrualCycleRange": "5 days"
      },
      {
        "menstrualRangeID": 9,
        "rangeType": " Blood Flow Duration",
        "menstrualCycleRange": "6 days"
      },
      {
        "menstrualRangeID": 10,
        "rangeType": " Blood Flow Duration",
        "menstrualCycleRange": "7 days"
      },
      {
        "menstrualRangeID": 4,
        "rangeType": " Blood Flow Duration",
        "menstrualCycleRange": "\u003c 2 days"
      },
      {
        "menstrualRangeID": 11,
        "rangeType": " Blood Flow Duration",
        "menstrualCycleRange": "\u003e 7 days"
      }
    ],
    "comorbidConditions": [
      {
        "comorbidConditionID": 6,
        "comorbidCondition": "Asthma"
      },
      {
        "comorbidConditionID": 2,
        "comorbidCondition": "Diabetes Mellitus"
      },
      {
        "comorbidConditionID": 5,
        "comorbidCondition": "Epilepsy(Convulsions)"
      },
      {
        "comorbidConditionID": 7,
        "comorbidCondition": "Hemiplegia/Stroke"
      },
      {
        "comorbidConditionID": 1,
        "comorbidCondition": "Hypertension"
      },
      {
        "comorbidConditionID": 3,
        "comorbidCondition": "Ischemic Heart Disease"
      },
      {
        "comorbidConditionID": 8,
        "comorbidCondition": "Other"
      },
      {
        "comorbidConditionID": 4,
        "comorbidCondition": "Thyroid problem"
      }
    ],
    "typeOfTobaccoProducts": [
      {
        "personalHabitTypeID": 8,
        "habitType": "Type of Tobacco Use",
        "habitValue": "Beedi"
      },
      {
        "personalHabitTypeID": 9,
        "habitType": "Type of Tobacco Use",
        "habitValue": "Filter Cigarette"
      },
      {
        "personalHabitTypeID": 11,
        "habitType": "Type of Tobacco Use",
        "habitValue": "Gutkha Chewing"
      },
      {
        "personalHabitTypeID": 10,
        "habitType": "Type of Tobacco Use",
        "habitValue": "Non-Filter Cigarette"
      },
      {
        "personalHabitTypeID": 12,
        "habitType": "Type of Tobacco Use",
        "habitValue": "Tobacco Chewing"
      }
    ],
    "deliveryComplicationTypes": [
      {
        "complicationID": 14,
        "complicationType": "Delivery Complication",
        "complicationValue": "Bleeding"
      },
      {
        "complicationID": 13,
        "complicationType": "Delivery Complication",
        "complicationValue": "Nil"
      },
      {
        "complicationID": 15,
        "complicationType": "Delivery Complication",
        "complicationValue": "Obstructed Delivery"
      },
      {
        "complicationID": 19,
        "complicationType": "Delivery Complication",
        "complicationValue": "Other"
      },
      {
        "complicationID": 18,
        "complicationType": "Delivery Complication",
        "complicationValue": "Prolapse Cord"
      },
      {
        "complicationID": 16,
        "complicationType": "Delivery Complication",
        "complicationValue": "Prolonged Labor"
      },
      {
        "complicationID": 17,
        "complicationType": "Delivery Complication",
        "complicationValue": "Retained Placenta"
      }
    ],
    "surgeryTypes": [
      {
        "surgeryID": 3,
        "surgeryType": "Appendicectomy"
      },
      {
        "surgeryID": 4,
        "surgeryType": "Cesarean Section/LSCS"
      },
      {
        "surgeryID": 1,
        "surgeryType": "Nil"
      },
      {
        "surgeryID": 6,
        "surgeryType": "Other"
      },
      {
        "surgeryID": 2,
        "surgeryType": "Tonsillectomy"
      },
      {
        "surgeryID": 5,
        "surgeryType": "Uterine Surgery"
      }
    ],
    "AllergicReactionTypes": [
      {
        "allergicReactionTypeID": 9,
        "name": "Abdominal Cramps"
      },
      {
        "allergicReactionTypeID": 1,
        "name": "Anaphylaxis"
      },
      {
        "allergicReactionTypeID": 3,
        "name": "Angioedema"
      },
      {
        "allergicReactionTypeID": 10,
        "name": "Diarrhea"
      },
      {
        "allergicReactionTypeID": 5,
        "name": "Hoarseness of Voice"
      },
      {
        "allergicReactionTypeID": 6,
        "name": "Itching"
      },
      {
        "allergicReactionTypeID": 11,
        "name": "Other."
      },
      {
        "allergicReactionTypeID": 2,
        "name": "Rash (Urticaria)"
      },
      {
        "allergicReactionTypeID": 4,
        "name": "Running Nose"
      },
      {
        "allergicReactionTypeID": 8,
        "name": "Vomitings"
      },
      {
        "allergicReactionTypeID": 7,
        "name": "Wheezing"
      }
    ],
    "grossMotorMilestones": [
      {
        "gMMilestoneID": 1,
        "gMMilestone": "Neck Holding"
      },
      {
        "gMMilestoneID": 2,
        "gMMilestone": "Rolling Over"
      },
      {
        "gMMilestoneID": 3,
        "gMMilestone": "Sitting with Support"
      },
      {
        "gMMilestoneID": 4,
        "gMMilestone": "Sitting Without Support"
      },
      {
        "gMMilestoneID": 5,
        "gMMilestone": "Standing with Support"
      },
      {
        "gMMilestoneID": 6,
        "gMMilestone": "Standing without Support"
      },
      {
        "gMMilestoneID": 7,
        "gMMilestone": "Walking with Support"
      },
      {
        "gMMilestoneID": 8,
        "gMMilestone": "Walking without Support"
      }
    ],
    "deliveryTypes": [
      {
        "deliveryTypeID": 2,
        "deliveryType": "Assisted Delivery"
      },
      {
        "deliveryTypeID": 3,
        "deliveryType": "Cesarean Section (LSCS)"
      },
      {
        "deliveryTypeID": 1,
        "deliveryType": "Normal Delivery"
      }
    ]
  },
  "statusCode": 200,
  "errorMessage": "Success",
  "status": "Success"
};

export const femaleChildBeneficiary_2 = {
  "beneficiaryRegID": 7516,
  "beneficiaryName": "Neha Chutti BABY",
  "genderID": 2,
  "genderName": "Female",
  "age": "1 years - 9 months",
  "ageVal": 1,
  "createdDate": "Nov 27, 2017 4:57:49 PM",
  "villageName": "Agmandia",
  "districtName": "BARPETA"
}

export const femaleChildBeneficiaryage_6 = {
  "beneficiaryRegID": 7526,
  "beneficiaryName": "Neha BABY",
  "genderID": 2,
  "genderName": "Female",
  "age": "5 years - 6 months",
  "ageVal": 5,
  "createdDate": "Nov 27, 2017 4:57:49 PM",
  "villageName": "Agmandia",
  "districtName": "BARPETA"
}

export const femaleChildBeneficiaryage_12 = {
  "beneficiaryRegID": 7536,
  "beneficiaryName": "Neha BABY Kutti",
  "genderID": 2,
  "genderName": "Female",
  "age": "11 years - 9 months",
  "ageVal": 11,
  "createdDate": "Nov 27, 2017 4:57:49 PM",
  "villageName": "Agmandia",
  "districtName": "BARPETA"
}

export const femaleChildBeneficiaryage_16 = {
  "beneficiaryRegID": 7546,
  "beneficiaryName": "Neha BABY Ma",
  "genderID": 2,
  "genderName": "Female",
  "age": "15 years - 9 months",
  "ageVal": 15,
  "createdDate": "Nov 27, 2017 4:57:49 PM",
  "villageName": "Agmandia",
  "districtName": "BARPETA"
}

export const femaleChildBeneficiaryage16_130 = {
  "beneficiaryRegID": 7556,
  "beneficiaryName": "Neha",
  "genderID": 2,
  "genderName": "Female",
  "age": "45 years - 9 months",
  "ageVal": 45,
  "createdDate": "Nov 27, 2017 4:57:49 PM",
  "villageName": "Agmandia",
  "districtName": "BARPETA"
}

export const examinationGOPData = {
  "data": {
    "gastrointestinalExamination": {
      "ID": 176,
      "beneficiaryRegID": 7397,
      "benVisitID": 932,
      "providerServiceMapID": 1320,
      "inspection": "Gastro Inspected",
      "palpation_AbdomenTexture": "Soft",
      "palpation_Liver": "Just Palpable",
      "palpation_Spleen": "Just Palpable",
      "palpation_Tenderness": "Present",
      "palpation_LocationOfTenderness": "Located tenderness",
      "percussion": "Percussion detected",
      "auscultation": "Auscultation",
      "analRegion": "Anal Region",
      "deleted": false,
      "processed": "N",
      "createdBy": "891",
      "createdDate": "Mar 2, 2018 11:54:14 AM",
      "lastModDate": "Mar 2, 2018 11:54:14 AM"
    },
    "generalExamination": {
      "ID": 205,
      "beneficiaryRegID": 7397,
      "benVisitID": 932,
      "providerServiceMapID": 1320,
      "consciousness": "Conscious",
      "coherence": "Coherent",
      "cooperation": "Cooperative",
      "comfortness": "Comfortable",
      "builtAndAppearance": "Thin Built",
      "gait": "Limping",
      "dangerSigns": "Yes",
      "typeOfDangerSign": "1,2,",
      "typeOfDangerSigns": [
        "1",
        "2"
      ],
      "pallor": "Present",
      "foetalMovements": "Present",
      "quickening": "Present",
      "jaundice": "Present",
      "cyanosis": "Present",
      "clubbing": "Present",
      "lymphadenopathy": "Present",
      "lymphnodesInvolved": "Cervical LN",
      "typeOfLymphadenopathy": "Soft",
      "edema": "Present",
      "extentOfEdema": "Foot",
      "edemaType": "Pitting",
      "deleted": false,
      "processed": "N",
      "createdBy": "891",
      "createdDate": "Mar 2, 2018 11:54:14 AM",
      "lastModDate": "Mar 2, 2018 11:54:14 AM"
    },
    "headToToeExamination": {
      "ID": 197,
      "beneficiaryRegID": 7397,
      "benVisitID": 932,
      "providerServiceMapID": 1320,
      "headtoToeExam": "Abnormal",
      "head": "Head",
      "eyes": "Eyes",
      "ears": "Ears",
      "nose": "Nose",
      "oralCavity": "Oral Cavity",
      "throat": "Throat",
      "breastAndNipples": "Breast",
      "trunk": "Trunk",
      "upperLimbs": "Upper Limbs",
      "lowerLimbs": "Lower Limbs",
      "skin": "Skin",
      "hair": "Hairs",
      "nails": "Nails",
      "deleted": false,
      "processed": "N",
      "createdBy": "891",
      "createdDate": "Mar 2, 2018 11:54:14 AM",
      "lastModDate": "Mar 2, 2018 11:54:14 AM"
    },
    "cardiovascularExamination": {
      "ID": 194,
      "beneficiaryRegID": 7397,
      "benVisitID": 932,
      "providerServiceMapID": 1320,
      "jugularVenousPulse_JVP": "Elevated",
      "apexbeatLocation": "Apex Beat Located",
      "apexbeatType": "Apex Beat Type detected",
      "firstHeartSound_S1": "1st Heart sound",
      "secondHeartSound_S2": "2nd Heart sound",
      "additionalHeartSounds": "OT Heart sound",
      "murmurs": "Present",
      "pericardialRub": "Present",
      "deleted": false,
      "processed": "N",
      "createdBy": "891",
      "createdDate": "Mar 2, 2018 11:54:14 AM",
      "lastModDate": "Mar 2, 2018 11:54:14 AM"
    },
    "centralNervousExamination": {
      "ID": 190,
      "beneficiaryRegID": 7397,
      "benVisitID": 932,
      "providerServiceMapID": 1320,
      "handedness": "Right Handed",
      "cranialNervesExamination": "Cranial Nervous",
      "motorSystem": "Motor",
      "sensorySystem": "Sensory",
      "autonomicSystem": "Automic",
      "cerebellarSigns": "cerebellar",
      "signsOfMeningealIrritation": "Present",
      "skull": "Skull",
      "deleted": false,
      "processed": "N",
      "createdBy": "891",
      "createdDate": "Mar 2, 2018 11:54:15 AM",
      "lastModDate": "Mar 2, 2018 11:54:15 AM"
    },
    "respiratoryExamination": {
      "ID": 191,
      "beneficiaryRegID": 7397,
      "benVisitID": 932,
      "providerServiceMapID": 1320,
      "trachea": "Central",
      "inspection": "Respiratory Inspected",
      "signsOfRespiratoryDistress": "Present",
      "palpation": "Palpation detected",
      "auscultation_Stridor": "Present",
      "auscultation_BreathSounds": "Abnormal Breath Sounds",
      "auscultation_Crepitations": "Absent",
      "auscultation_Wheezing": "Present",
      "auscultation_PleuralRub": "Present",
      "auscultation_ConductedSounds": "Present",
      "percussion": "Resonant",
      "deleted": false,
      "processed": "N",
      "createdBy": "891",
      "createdDate": "Mar 2, 2018 11:54:15 AM",
      "lastModDate": "Mar 2, 2018 11:54:15 AM"
    },
    "musculoskeletalExamination": {
      "ID": 190,
      "beneficiaryRegID": 7397,
      "benVisitID": 932,
      "providerServiceMapID": 1320,
      "joint_TypeOfJoint": "Ankle",
      "joint_Laterality": "Right",
      "joint_Abnormality": "Tenderness",
      "upperLimb_Laterality": "Right",
      "upperLimb_Abnormality": "Tenderness",
      "lowerLimb_Laterality": "Right",
      "lowerLimb_Abnormality": "Deformity",
      "chestWall": "Chest wall",
      "spine": "Spine",
      "deleted": false,
      "processed": "N",
      "createdBy": "891",
      "createdDate": "Mar 2, 2018 11:54:15 AM",
      "lastModDate": "Mar 2, 2018 11:54:15 AM"
    },
    "genitourinaryExamination": {
      "ID": 190,
      "beneficiaryRegID": 7397,
      "benVisitID": 932,
      "providerServiceMapID": 1320,
      "renalAngle": "Renal Angle",
      "suprapubicRegion": "Supra Public Region",
      "externalGenitalia": "External genitalia",
      "deleted": false,
      "processed": "N",
      "createdBy": "891",
      "createdDate": "Mar 2, 2018 11:54:15 AM",
      "lastModDate": "Mar 2, 2018 11:54:15 AM"
    }
  },
  "statusCode": 200,
  "errorMessage": "Success",
  "status": "Success"
}

export const examinationANCData = {
  "data": {
    "obstetricExamination": {
      "ID": 136,
      "beneficiaryRegID": 7476,
      "benVisitID": 951,
      "providerServiceMapID": 1320,
      "fundalHeight": "Not Palpable",
      "fHAndPOA_Status": "FH=POA",
      "fHAndPOA_Interpretation": "Corresponding",
      "fetalMovements": "Present",
      "sfh": 28.0,
      "fetalHeartSounds": "Audible",
      "fetalHeartRate_BeatsPerMinute": "120-160",
      "fetalPositionOrLie": "Oblique",
      "fetalPresentation": "Breech",
      "abdominalScars": "LSCS Scar",
      "deleted": false,
      "processed": "N",
      "createdBy": "891",
      "createdDate": "Mar 2, 2018 1:57:45 PM",
      "lastModDate": "Mar 2, 2018 1:57:45 PM"
    },

    "generalExamination": {
      "ID": 205,
      "beneficiaryRegID": 7397,
      "benVisitID": 932,
      "providerServiceMapID": 1320,
      "consciousness": "Conscious",
      "coherence": "Coherent",
      "cooperation": "Cooperative",
      "comfortness": "Comfortable",
      "builtAndAppearance": "Thin Built",
      "gait": "Limping",
      "dangerSigns": "Yes",
      "typeOfDangerSign": "1,2,",
      "typeOfDangerSigns": [
        "1",
        "2"
      ],
      "pallor": "Present",
      "foetalMovements": "Present",
      "quickening": "Present",
      "jaundice": "Present",
      "cyanosis": "Present",
      "clubbing": "Present",
      "lymphadenopathy": "Present",
      "lymphnodesInvolved": "Cervical LN",
      "typeOfLymphadenopathy": "Soft",
      "edema": "Present",
      "extentOfEdema": "Foot",
      "edemaType": "Pitting",
      "deleted": false,
      "processed": "N",
      "createdBy": "891",
      "createdDate": "Mar 2, 2018 11:54:14 AM",
      "lastModDate": "Mar 2, 2018 11:54:14 AM"
    },
    "headToToeExamination": {
      "ID": 197,
      "beneficiaryRegID": 7397,
      "benVisitID": 932,
      "providerServiceMapID": 1320,
      "headtoToeExam": "Abnormal",
      "head": "Head",
      "eyes": "Eyes",
      "ears": "Ears",
      "nose": "Nose",
      "oralCavity": "Oral Cavity",
      "throat": "Throat",
      "breastAndNipples": "Breast",
      "trunk": "Trunk",
      "upperLimbs": "Upper Limbs",
      "lowerLimbs": "Lower Limbs",
      "skin": "Skin",
      "hair": "Hairs",
      "nails": "Nails",
      "deleted": false,
      "processed": "N",
      "createdBy": "891",
      "createdDate": "Mar 2, 2018 11:54:14 AM",
      "lastModDate": "Mar 2, 2018 11:54:14 AM"
    },
    "cardiovascularExamination": {
      "ID": 194,
      "beneficiaryRegID": 7397,
      "benVisitID": 932,
      "providerServiceMapID": 1320,
      "jugularVenousPulse_JVP": "Elevated",
      "apexbeatLocation": "Apex Beat Located",
      "apexbeatType": "Apex Beat Type detected",
      "firstHeartSound_S1": "1st Heart sound",
      "secondHeartSound_S2": "2nd Heart sound",
      "additionalHeartSounds": "OT Heart sound",
      "murmurs": "Present",
      "pericardialRub": "Present",
      "deleted": false,
      "processed": "N",
      "createdBy": "891",
      "createdDate": "Mar 2, 2018 11:54:14 AM",
      "lastModDate": "Mar 2, 2018 11:54:14 AM"
    },
    "centralNervousExamination": {
      "ID": 190,
      "beneficiaryRegID": 7397,
      "benVisitID": 932,
      "providerServiceMapID": 1320,
      "handedness": "Right Handed",
      "cranialNervesExamination": "Cranial Nervous",
      "motorSystem": "Motor",
      "sensorySystem": "Sensory",
      "autonomicSystem": "Automic",
      "cerebellarSigns": "cerebellar",
      "signsOfMeningealIrritation": "Present",
      "skull": "Skull",
      "deleted": false,
      "processed": "N",
      "createdBy": "891",
      "createdDate": "Mar 2, 2018 11:54:15 AM",
      "lastModDate": "Mar 2, 2018 11:54:15 AM"
    },
    "respiratoryExamination": {
      "ID": 191,
      "beneficiaryRegID": 7397,
      "benVisitID": 932,
      "providerServiceMapID": 1320,
      "trachea": "Central",
      "inspection": "Respiratory Inspected",
      "signsOfRespiratoryDistress": "Present",
      "palpation": "Palpation detected",
      "auscultation_Stridor": "Present",
      "auscultation_BreathSounds": "Abnormal Breath Sounds",
      "auscultation_Crepitations": "Absent",
      "auscultation_Wheezing": "Present",
      "auscultation_PleuralRub": "Present",
      "auscultation_ConductedSounds": "Present",
      "percussion": "Resonant",
      "deleted": false,
      "processed": "N",
      "createdBy": "891",
      "createdDate": "Mar 2, 2018 11:54:15 AM",
      "lastModDate": "Mar 2, 2018 11:54:15 AM"
    },
    "musculoskeletalExamination": {
      "ID": 190,
      "beneficiaryRegID": 7397,
      "benVisitID": 932,
      "providerServiceMapID": 1320,
      "joint_TypeOfJoint": "Ankle",
      "joint_Laterality": "Right",
      "joint_Abnormality": "Tenderness",
      "upperLimb_Laterality": "Right",
      "upperLimb_Abnormality": "Tenderness",
      "lowerLimb_Laterality": "Right",
      "lowerLimb_Abnormality": "Deformity",
      "chestWall": "Chest wall",
      "spine": "Spine",
      "deleted": false,
      "processed": "N",
      "createdBy": "891",
      "createdDate": "Mar 2, 2018 11:54:15 AM",
      "lastModDate": "Mar 2, 2018 11:54:15 AM"
    },
    "genitourinaryExamination": {
      "ID": 190,
      "beneficiaryRegID": 7397,
      "benVisitID": 932,
      "providerServiceMapID": 1320,
      "renalAngle": "Renal Angle",
      "suprapubicRegion": "Supra Public Region",
      "externalGenitalia": "External genitalia",
      "deleted": false,
      "processed": "N",
      "createdBy": "891",
      "createdDate": "Mar 2, 2018 11:54:15 AM",
      "lastModDate": "Mar 2, 2018 11:54:15 AM"
    }
  },
  "statusCode": 200,
  "errorMessage": "Success",
  "status": "Success"
}

export const examinationData = {
  "data": {
    "generalExamination": {
      "ID": 206,
      "beneficiaryRegID": 7476,
      "benVisitID": 951,
      "providerServiceMapID": 1320,
      "consciousness": "Conscious",
      "coherence": "Coherent",
      "cooperation": "Cooperative",
      "comfortness": "Uncomfortable",
      "builtAndAppearance": "Thin Built",
      "gait": "Normal",
      "dangerSigns": "No",
      "typeOfDangerSigns": [],
      "pallor": "Absent",
      "foetalMovements": "Absent",
      "quickening": "Present",
      "jaundice": "Absent",
      "cyanosis": "Present",
      "clubbing": "Present",
      "lymphadenopathy": "Absent",
      "edema": "Present",
      "extentOfEdema": "Foot",
      "edemaType": "Pitting",
      "deleted": false,
      "processed": "N",
      "createdBy": "891",
      "createdDate": "Mar 2, 2018 1:57:44 PM",
      "lastModDate": "Mar 2, 2018 1:57:44 PM"
    },
    "headToToeExamination": {
      "ID": 198,
      "beneficiaryRegID": 7476,
      "benVisitID": 951,
      "providerServiceMapID": 1320,
      "headtoToeExam": "Normal",
      "deleted": false,
      "processed": "N",
      "createdBy": "891",
      "createdDate": "Mar 2, 2018 1:57:44 PM",
      "lastModDate": "Mar 2, 2018 1:57:44 PM"
    },
    "cardiovascularExamination": {
      "ID": 195,
      "beneficiaryRegID": 7476,
      "benVisitID": 951,
      "providerServiceMapID": 1320,
      "jugularVenousPulse_JVP": "Normal",
      "murmurs": "Present",
      "pericardialRub": "Present",
      "deleted": false,
      "processed": "N",
      "createdBy": "891",
      "createdDate": "Mar 2, 2018 1:57:44 PM",
      "lastModDate": "Mar 2, 2018 1:57:44 PM"
    },
    "centralNervousExamination": {
      "ID": 191,
      "beneficiaryRegID": 7476,
      "benVisitID": 951,
      "providerServiceMapID": 1320,
      "deleted": false,
      "processed": "N",
      "createdBy": "891",
      "createdDate": "Mar 2, 2018 1:57:44 PM",
      "lastModDate": "Mar 2, 2018 1:57:44 PM"
    },
    "obstetricExamination": {
      "ID": 136,
      "beneficiaryRegID": 7476,
      "benVisitID": 951,
      "providerServiceMapID": 1320,
      "fundalHeight": "Not Palpable",
      "fHAndPOA_Status": "FH=POA",
      "fHAndPOA_Interpretation": "Corresponding",
      "fetalMovements": "Present",
      "sfh": 28.0,
      "fetalHeartSounds": "Audible",
      "fetalHeartRate_BeatsPerMinute": "120-160",
      "fetalPositionOrLie": "Oblique",
      "fetalPresentation": "Breech",
      "abdominalScars": "LSCS Scar",
      "deleted": false,
      "processed": "N",
      "createdBy": "891",
      "createdDate": "Mar 2, 2018 1:57:45 PM",
      "lastModDate": "Mar 2, 2018 1:57:45 PM"
    },
    "respiratoryExamination": {
      "ID": 192,
      "beneficiaryRegID": 7476,
      "benVisitID": 951,
      "providerServiceMapID": 1320,
      "signsOfRespiratoryDistress": "Present",
      "auscultation_Stridor": "Absent",
      "auscultation_BreathSounds": "Normal",
      "auscultation_Crepitations": "Absent",
      "auscultation_Wheezing": "Absent",
      "auscultation_PleuralRub": "Present",
      "auscultation_ConductedSounds": "Present",
      "percussion": "Stony Dull",
      "deleted": false,
      "processed": "N",
      "createdBy": "891",
      "createdDate": "Mar 2, 2018 1:57:44 PM",
      "lastModDate": "Mar 2, 2018 1:57:44 PM"
    },
    "musculoskeletalExamination": {
      "ID": 191,
      "beneficiaryRegID": 7476,
      "benVisitID": 951,
      "providerServiceMapID": 1320,
      "deleted": false,
      "processed": "N",
      "createdBy": "891",
      "createdDate": "Mar 2, 2018 1:57:44 PM",
      "lastModDate": "Mar 2, 2018 1:57:44 PM"
    },
    "genitourinaryExamination": {
      "ID": 191,
      "beneficiaryRegID": 7476,
      "benVisitID": 951,
      "providerServiceMapID": 1320,
      "deleted": false,
      "processed": "N",
      "createdBy": "891",
      "createdDate": "Mar 2, 2018 1:57:45 PM",
      "lastModDate": "Mar 2, 2018 1:57:45 PM"
    }
  },
  "statusCode": 200,
  "errorMessage": "Success",
  "status": "Success"
}

export const cancerHistoryDetails = {  
  "data":{  
     "benPersonalDietHistory":{  
        "ID":340,
        "beneficiaryRegID":7506,
        "benVisitID":993,
        "providerServiceMapID":1320,
        "dietType":"Eggetarian",
        "fruitConsumptionDays":2,
        "fruitQuantityPerDay":2,
        "vegetableConsumptionDays":2,
        "vegetableQuantityPerDay":2,
        "intakeOfOutsidePreparedMeal":2,
        "typeOfOilConsumed":"Coconut Oil,Corn Oil,",
        "physicalActivityType":"Light Activity",
        "ssRadiationExposure":false,
        "isThyroidDisorder":false,
        "deleted":false,
        "processed":"N",
        "createdBy":"888",
        "CreatedDate":"Mar 7, 2018 12:07:28 PM",
        "lastModDate":"Mar 7, 2018 12:07:28 PM",
        "typeOfOilConsumedList":[  
           "Coconut Oil",
           "Corn Oil"
        ]
     },
     "benObstetricHistory":{  
        "ID":339,
        "beneficiaryRegID":7506,
        "benVisitID":993,
        "providerServiceMapID":1320,
        "pregnancyStatus":"Yes",
        "pregnant_No":"1",
        "noOfLivingChild":1,
        "isAbortion":false,
        "isOralContraceptiveUsed":false,
        "isHormoneReplacementTherapy":false,
        "menarche_Age":12,
        "isMenstrualCycleRegular":true,
        "menstrualCycleLength":28,
        "menstrualFlowDuration":3,
        "menstrualFlowType":"Little",
        "isDysmenorrhea":false,
        "isInterMenstrualBleeding":false,
        "deleted":false,
        "processed":"N",
        "createdBy":"888",
        "createdDate":"Mar 7, 2018 12:07:29 PM",
        "lastModDate":"Mar 7, 2018 12:07:29 PM"
     },
     "benFamilyHistory":[  
        {  
           "ID":638,
           "beneficiaryRegID":7506,
           "benVisitID":993,
           "providerServiceMapID":1320,
           "cancerDiseaseType":"Breast Cancer",
           "familyMember":"Aunt",
           "deleted":false,
           "processed":"N",
           "createdBy":"888",
           "createdDate":"Mar 7, 2018 12:07:28 PM",
           "lastModDate":"Mar 7, 2018 12:07:28 PM",
           "familyMemberList":[  
              "Aunt"
           ]
        }
     ],
     "benPersonalHistory":{  
        "ID":341,
        "beneficiaryRegID":7506,
        "benVisitID":993,
        "providerServiceMapID":1320,
        "tobaccoUse":"Currently Using",
        "startAge_year":23,
        "typeOfTobaccoProduct":"Beedi,Chewing,Cigarettes,",
        "quantityPerDay":2,
        "isFilteredCigaerette":true,
        "isCigaretteExposure":false,
        "isBetelNutChewing":false,
        "alcoholUse":"Currently Using",
        "ssAlcoholUsed":false,
        "deleted":false,
        "processed":"N",
        "createdBy":"888",
        "createdDate":"Mar 7, 2018 12:07:28 PM",
        "lastModDate":"Mar 7, 2018 12:07:28 PM",
        "typeOfTobaccoProductList":[  
           "Beedi",
           "Chewing",
           "Cigarettes"
        ]
     }
  },
  "statusCode":200,
  "errorMessage":"Success",
  "status":"Success"
};

export const cancerExaminationDetails = {  
  "data":{  
     "signsAndSymptoms":{  
        "ID":130,
        "beneficiaryRegID":7506,
        "benVisitID":993,
        "providerServiceMapID":1320,
        "shortnessOfBreath":true,
        "breastEnlargement":true,
        "deleted":false,
        "processed":"N",
        "createdBy":"888",
        "createdDate":"Mar 7, 2018 12:07:29 PM",
        "lastModDate":"Mar 7, 2018 12:07:29 PM"
     },
     "BenCancerLymphNodeDetails":[  

     ],
     "breastExamination":{  
        "ID":79,
        "beneficiaryRegID":7506,
        "benVisitID":993,
        "providerServiceMapID":1320,
        "everBreastFed":true,
        "breastsAppear_Normal":true,
        "deleted":false,
        "processed":"N",
        "createdBy":"888",
        "createdDate":"Mar 7, 2018 12:07:29 PM",
        "lastModDate":"Mar 7, 2018 12:07:29 PM"
     },
     "imageCoordinates":[  
        {  
           "beneficiaryRegID":7506,
           "visitID":993,
           "providerServiceMapID":1320,
           "imageID":4,
           "markers":[  
              {  
                 "description":"one ",
                 "xCord":146,
                 "yCord":142,
                 "point":1
              }
           ],
           "createdBy":"888"
        }
     ],
     "gynecologicalExamination":{  
        "ID":60,
        "beneficiaryRegID":7506,
        "benVisitID":993,
        "providerServiceMapID":1320,
        "typeOfLesion":"",
        "vaginalInvolvement":true,
        "uterus_Normal":false,
        "deleted":false,
        "processed":"N",
        "createdBy":"888",
        "createdDate":"Mar 7, 2018 12:07:29 PM",
        "lastModDate":"Mar 7, 2018 12:07:29 PM"
     },
     "abdominalExamination":{  
        "ID":83,
        "beneficiaryRegID":7506,
        "benVisitID":993,
        "providerServiceMapID":1320,
        "abdominalInspection_Normal":true,
        "anyOtherMass_Present":true,
        "deleted":false,
        "processed":"N",
        "createdBy":"888",
        "createdDate":"Mar 7, 2018 12:07:29 PM",
        "lastModDate":"Mar 7, 2018 12:07:29 PM"
     },
     "oralExamination":{  
        "ID":91,
        "beneficiaryRegID":7506,
        "benVisitID":993,
        "providerServiceMapID":1320,
        "premalignantLesions":false,
        "preMalignantLesionType":"",
        "deleted":false,
        "processed":"N",
        "createdBy":"888",
        "createdDate":"Mar 7, 2018 12:07:29 PM",
        "lastModDate":"Mar 7, 2018 12:07:29 PM"
     }
  },
  "statusCode":200,
  "errorMessage":"Success",
  "status":"Success"
}

export const updateCancerExaminationSuccessResponse = {  
  "data":{  
     "response":"Beneficiary Examination Details updated Successfully"
  },
  "statusCode":200,
  "errorMessage":"Success",
  "status":"Success"
}
