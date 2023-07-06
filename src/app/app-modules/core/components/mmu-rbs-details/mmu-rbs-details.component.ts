import { Component, Inject, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { HttpServiceService } from '../../services/http-service.service';

@Component({
  selector: 'app-mmu-rbs-details',
  templateUrl: './mmu-rbs-details.component.html',
  styleUrls: ['./mmu-rbs-details.component.css']
})
export class MmuRbsDetailsComponent implements OnInit {
  current_language_set: any;

  constructor(public dialogRef: MdDialogRef<MmuRbsDetailsComponent>,
    @Inject(MD_DIALOG_DATA) public input: any,
    public httpServiceService: HttpServiceService) { }

  ngOnInit() {
    console.log("input",this.input)
    this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
