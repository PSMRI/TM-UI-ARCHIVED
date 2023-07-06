import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";

@Component({
  selector: "image-to-canvas",
  templateUrl: "./image-to-canvas.component.html",
  styleUrls: ["./image-to-canvas.component.css"]
})
export class ImageToCanvasComponent implements OnInit {
  @Input("imgUrl")
  imgUrl: string;

  @Input("annotatedMarker")
  annotatedMarker: any;

  @ViewChild("canvas")
  canvas: ElementRef;

  blankRows = [1, 2, 3, 4, 5];
  current_language_set: any;

  constructor(public httpServiceService: HttpServiceService) {}

  ngOnInit() {
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
    // this.changeLanguage();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }

  ngOnChanges() {
    if (this.annotatedMarker && this.imgUrl) {
      if (this.annotatedMarker.markers)
        this.annotateImage(this.annotatedMarker.markers, this.imgUrl);
    } else if (this.imgUrl) {
      this.loadImageOnCanvas(this.imgUrl);
    }
  }
  language_file_path: any = "./assets/";
  language: any;

  changeLanguage() {
    this.language = sessionStorage.getItem("setLanguage");

    if (this.language != undefined) {
      this.httpServiceService
        .getLanguage(this.language_file_path + this.language + ".json")
        .subscribe(
          response => {
            if (response) {
              this.current_language_set = response[this.language];
            } else {
              console.log(
                this.current_language_set.alerts.info.comingUpWithThisLang +
                  " " +
                  this.language
              );
            }
          },
          error => {
            console.log(
              this.current_language_set.alerts.info.comingUpWithThisLang +
                " " +
                this.language
            );
          }
        );
    } else {
      this.httpServiceService.currentLangugae$.subscribe(
        response => (this.current_language_set = response)
      );
    }
  }

  loadImageOnCanvas(imgUrl) {
    let ctx = this.canvas.nativeElement;
    if (ctx.getContext) {
      ctx = ctx.getContext("2d");
      let img = new Image();
      img.onload = function() {
        ctx.drawImage(img, 0, 0, 250, 250);
      };
      img.src = imgUrl;
    }
  }

  annotateImage(markers, imgUrl) {
    let canvas = this.canvas.nativeElement;
    if (canvas.getContext) {
      let ctx = canvas.getContext("2d");
      ctx.font = "bold 20px serif";

      let img = new Image();
      img.onload = function() {
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          0,
          0,
          canvas.width,
          canvas.height
        );
        let score = 1;
        markers.forEach((mark, index) => {
          if (mark.xCord) mark.offsetX = mark.xCord;
          if (mark.yCord) mark.offsetY = mark.yCord;
          if (score <= 6) {
            ctx.strokeRect(mark.offsetX - 10, mark.offsetY - 10, 20, 20);
            ctx.fillText(score, mark.offsetX - 3, mark.offsetY + 6);
          }
          score++;
        });
      };
      img.src = imgUrl;
    }
  }
}
