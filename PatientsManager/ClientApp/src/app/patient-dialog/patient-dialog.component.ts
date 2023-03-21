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

  constructor(public _dialogRef: MatDialogRef<PatientDialogComponent>, @Inject(MAT_DIALOG_DATA) data: DialogData) {
    this.title = data.title;
    this.content = data.content;
    this.actionRejected = data.actionRejected;
    this.actionAccepted = data.actionAccepted;
  }

  onRejected() {
    if (!!this.actionRejected) {
      this.actionRejected();
    }
    this._dialogRef.close();
  }

  onAccepted() {
    if (!!this.actionAccepted) {
      this.actionAccepted();
    }
    this._dialogRef.close();
  }

  showMoreButtons(): boolean {
    return !!this.actionAccepted || !!this.actionRejected;
  }
}
