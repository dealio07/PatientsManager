import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../models/dialogData";

@Component({
  selector: 'app-patient-dialog',
  templateUrl: './patient-dialog.component.html',
  styleUrls: ['./patient-dialog.component.css']
})
export class PatientDialogComponent {
  public _title: string = "";
  public _content: string = "";
  public _requiresResult: boolean;

  constructor(public _dialogRef: MatDialogRef<PatientDialogComponent>, @Inject(MAT_DIALOG_DATA) data: DialogData) {
    this._title = data.title;
    this._content = data.content;
    this._requiresResult = data.requiresResult;
  }

  onRejected() {
    this._dialogRef.close(false);
  }

  onAccepted() {
    this._dialogRef.close(true);
  }

  showMoreButtons(): boolean {
    return this._requiresResult;
  }
}
