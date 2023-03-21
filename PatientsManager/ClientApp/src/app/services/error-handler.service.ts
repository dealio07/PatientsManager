import {Injectable} from "@angular/core";
import {Observable, ObservableInput} from "rxjs";
import {PatientDialogComponent} from "../patient-dialog/patient-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Injectable()
export class ErrorHandlerService {
  constructor(public _dialog: MatDialog) {}

  handleError = <T>(err: any, caught: Observable<T>): ObservableInput<T> => {
    this._dialog.open(PatientDialogComponent, {
      data: {
        title: 'Error',
        content: err.error
      }
    });
    return caught;
  };
}
