/* 
* AMRIT – Accessible Medical Records via Integrated Technology 
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


import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

export class LabUtils {

  constructor(private fb: FormBuilder) { }



  /**
   * Master Form for Lab
   */

   createLabMasterForm(): FormGroup {
       return this.fb.group({
           labForm: this.fb.array([]),
           radiologyForm: this.fb.array([]),
           externalForm: this.fb.array([])
       })
   }

  /**
   * Create Procedure for lab
   */

    createLabProcedureForm(): FormGroup {
      return this.fb.group({
          procedureType: null,
          prescriptionID: null,
          procedureName: null,
          procedureID: null,
          procedureDesc: null,
          procedureStartAPI:null,
          procedureCode:null,
          isMandatory:null,
          calibrationStartAPI:null,
          calibrationStatusAPI:null,
          calibrationEndAPI:null,
        //   isMandatory:null,
        //   gender: null,
          compListDetails: this.fb.array([])
      })

    }

   /**
    * Create Component of Fields
    */

   createLabComponentOfFields() {
       return this.fb.group({
           inputType: null,
           measurementUnit: null,
           range_max: null,
           range_min: null,
           isDecimal: null,
           allowText: null,
           range_normal_max: null,
           range_normal_min: null,
           abnormal: null,
           inputValue: null,
           testComponentDesc: null,
           testComponentID: null,
           testComponentName: null,
           remarks: null,
           componentCode:null,
           stripsNotavailable:null
       })
   }

    /**
     * Create Component of DropDowns or RadioButtons
     */

    createLabComponentOfRadioDropDowns() {
        return this.fb.group({
            inputType: null,
            compOpt: this.fb.array([]),
            compOptSelected: null,
            testComponentDesc: null,
            testComponentID: null,
            testComponentName: null,
           remarks: null,
           componentCode:null
        })
    }

    /**
     * Create DropDown or Radio Button Value/ Names list
     */

    createComponentRadioDropDownList() {
        return this.fb.group({
            name: null
        })
    }



  /**
   * Create Procedure for Radiology
   */

    createRadiologyProcedureForm(): FormGroup {
      return this.fb.group({
          procedureType: null,
          procedureName: null,
          procedureID: null,
          prescriptionID: null,
          procedureDesc: null,
          gender: null,
          compDetails: this.createRadiologyComponent()
      })

    }

    /**
  * Create Component for Radiology
  */

    createRadiologyComponent() {
        return this.fb.group({
            inputType: null,
            inputValue: null,
            testComponentDesc: null,
            testComponentID: null,
           remarks: null,
            testComponentName: null,
        })
    }

    /**
 * Create Form for Extern Tests
 */

    createExternalTestForm() {
        return this.fb.group({
            tests: null,
        })
    }
}
