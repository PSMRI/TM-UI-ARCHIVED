import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

export class RegistrationUtils {

  constructor(private fb: FormBuilder) { }

  /**  
  *  Registration Form Below
  **/
  createRegistrationDetailsForm() {
    return this.fb.group({
      personalDetailsForm: this.createPersonalDetailsForm(),
      demographicDetailsForm: this.createDemographicDetailsForm(),
      otherDetailsForm: this.createOtherDetailsForm()
    })
  }

  /**
  *  Personal Details Form Below ** Part of Registration Form
  **/
  createPersonalDetailsForm() {
    return this.fb.group({
      benAccountID: null,
      beneficiaryID: null,
      beneficiaryRegID: null,
      parentRegID: null,
      parentRelation: null,
      benRelationshipType: null,
      benPhMapID: null,
      imageChangeFlag: null,
      firstName: null,
      lastName: null,
      fullName: null,
      gender: null,
      genderName: null,
      dob: null,
      maritalStatus: null,
      maritalStatusName: null,
      image: null,
      spouseName: null,
      aadharNo: null,
      income: null,
      incomeName: null,
      literacyStatus: null,
      educationQualification: null,
      educationQualificationName: null,
      occupation: null,
      occupationOther: null,
      checked: null,
      phoneNo: null,
      age: null,
      ageUnit: null,
      ageAtMarriage: null,
      fingerprint: null,
    })
  }

  /**
  * Demographic Details Form ** Part of Registration Form
  **/
  createDemographicDetailsForm() {
    return this.fb.group({
      checked: null,
      habitation: null,
      villageID: null,
      villageName: null,
      servicePoint:  null,
      servicePointName: null,
      parkingPlace: null,
      parkingPlaceName: null,
      blockID: null,
      blockName: null,
      districtID: null,
      districtName: null,
      zoneID: null,
      zoneName: null,
      stateID: [null, Validators.required],
      stateName: null,
      stateCode: null,
      countryID: 1,
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      pincode: null
    })
  }

  /**
  * Other Details Form ** Part of Registration Form
  */
  createOtherDetailsForm() {
    return this.fb.group({
      fatherName: null,
      motherName: null,
      emailID: null,
      bankName: null,
      branchName: null,
      ifscCode: null,
      accountNo: null,
      community: null,
      communityName: null,
      religion: null,
      religionOther: null,
      checked: null,
      checked1: null,
      checked2: null,
      healthId: null,
      healthIdNumber: null,
      healthIdMode:null,
      govID: this.fb.array([
        this.initGovID()
      ]),
      otherGovID: this.fb.array([
        this.initGovID()
      ]),
    })
  }

  /**
  *
  * Initiating Form Array For Govt. ID & Other Govt. ID
  */
  initGovID(): FormGroup {
    return this.fb.group({
      type: null,
      pattern: null,
      error: null,
      allow: null,
      benIdentityId: null,
      deleted: null,
      minLength: null,
      maxLength: null,
      idValue: null,
      createdBy: null
    })
  }

  
}
