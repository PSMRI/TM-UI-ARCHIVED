import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { CameraService } from '../../../../core/services/camera.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'doctor-abdominal-examination',
  templateUrl: './abdominal-examination.component.html',
  styleUrls: ['./abdominal-examination.component.css']
})
export class AbdominalExaminationComponent implements OnInit {

  @Input('abdominalExaminationForm')
  abdominalExaminationForm: FormGroup;

  @ViewChild('abdominalImage')
  private abdominalImage: ElementRef;

  imagePoints: any;
  current_language_set: any;

  constructor(
    private fb: FormBuilder,
    private cameraService: CameraService,
    public httpServiceService: HttpServiceService) { }

  ngOnInit() {
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
    this.assignSelectedLanguage();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }

  checkWithLymphNodes() {
    this.abdominalExaminationForm.patchValue({ lymphNode_Inguinal_Left: null });
    this.abdominalExaminationForm.patchValue({ lymphNode_Inguinal_Right: null });
    this.abdominalExaminationForm.patchValue({ lymphNode_ExternalIliac_Left: null });
    this.abdominalExaminationForm.patchValue({ lymphNode_ExternalIliac_Right: null });
    this.abdominalExaminationForm.patchValue({ lymphNode_ParaAortic_Left: null });
    this.abdominalExaminationForm.patchValue({ lymphNode_ParaAortic_Right: null });
  }

  get lymphNodes_Enlarged() {
    return this.abdominalExaminationForm.get('lymphNodes_Enlarged');
  }

  get observation() {
    return this.abdominalExaminationForm.get('observation');
  }

  annotateImage() {
    this.cameraService.annotate(this.abdominalImage.nativeElement.attributes.src.nodeValue, this.abdominalExaminationForm.controls['image'].value)
      .subscribe(result => {
        if (result) {
          this.imagePoints = result;
          this.imagePoints.imageID = 1;
          this.abdominalExaminationForm.patchValue({ image: this.imagePoints });
          this.abdominalExaminationForm.markAsDirty();
        }
      })
  }

}
