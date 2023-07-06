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