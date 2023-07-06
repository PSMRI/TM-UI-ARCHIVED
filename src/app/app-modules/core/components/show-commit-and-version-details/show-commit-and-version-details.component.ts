import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-show-commit-and-version-details',
  templateUrl: './show-commit-and-version-details.component.html',
  styleUrls: ['./show-commit-and-version-details.component.css']
})
export class ShowCommitAndVersionDetailsComponent implements OnInit {

  constructor(@Inject(MD_DIALOG_DATA) public input: any,
    public dialogRef: MdDialogRef<ShowCommitAndVersionDetailsComponent>,) { }

  ngOnInit() {
    console.log('input',this.input);
    
  }

}
