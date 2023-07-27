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


export class ConfirmationServiceStub {

  public confirm(title: string, message: string, btnOkText: string = 'OK', btnCancelText: string = 'Cancel') {
  }

  public alert(message: string, status: string = 'info', btnOkText: string = 'OK'): void {
  }

  public remarks(message: string, titleAlign: string = 'center', messageAlign: string = 'center', btnOkText: string = 'Submit', btnCancelText: string = "Cancel") {
  }

  public editRemarks(message: string, comments: string, titleAlign: string = 'center', messageAlign: string = 'center', btnOkText: string = 'Submit') {
  }

  public notify(message: string, mandatories, titleAlign: string = 'center', messageAlign: string = 'center', btnOkText: string = 'OK') {
  }

  public choice(message: string, values, titleAlign: string = 'center', messageAlign: string = 'center', btnOkText: string = 'Confirm', btnCancelText: string = 'Cancel') {
  }

}