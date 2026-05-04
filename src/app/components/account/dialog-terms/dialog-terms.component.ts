import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-terms',
  templateUrl: './dialog-terms.component.html',
  styleUrls: ['./dialog-terms.component.scss']
})
export class DialogTermsComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<DialogTermsComponent>) { }
lang:any;
  ngOnInit(): void {
    this.lang=localStorage.getItem('language');
  }

  close(){
    this.dialogRef.close(true);
  }

}
