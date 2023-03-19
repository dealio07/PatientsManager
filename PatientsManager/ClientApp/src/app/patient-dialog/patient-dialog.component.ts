import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../models/dialogData";

@Component({
  selector: 'app-patient-dialog',
  templateUrl: './patient-dialog.component.html',
  styleUrls: ['./patient-dialog.component.css']
})
export class PatientDialogComponent {
  public title: string = "";
  public content: string = "";
  public actionRejected: any;
  public actionAccepted: any;
  constructor(public dialogRef: MatDialogRef<PatientDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.title = data.title;
    this.content = data.content;
    this.actionRejected = data.actionRejected;
    this.actionAccepted = data.actionAccepted;
  }

  onRejected() {
    if (!!this.actionRejected) {
      this.actionRejected();
    }
    this.dialogRef.close();
  }

  onAccepted() {
    if (!!this.actionAccepted) {
      this.actionAccepted();
    }
    this.dialogRef.close();
  }
}
