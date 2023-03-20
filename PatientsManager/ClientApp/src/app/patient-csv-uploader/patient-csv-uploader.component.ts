import {Component, EventEmitter, Inject, Output, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatDialog} from "@angular/material/dialog";
import {PatientDialogComponent} from "../patient-dialog/patient-dialog.component";
import {catchError, throwError} from "rxjs";

@Component({
  selector: 'app-patient-csv-uploader',
  templateUrl: './patient-csv-uploader.component.html',
  styleUrls: ['./patient-csv-uploader.component.css']
})
export class PatientCsvUploaderComponent {
  private baseUrlPatients = 'patients';

  @ViewChild('fileInput') fileInput: any;
  @Output('upload') uploadEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private dialog: MatDialog) {}

  upload(files: FileList | null) {
    if (files === null || files.length === 0)
    {
      return;
    }

    const file = <File>files?.item(0);
    if (!this.validateFile(file))
    {
      this.dialog.open(PatientDialogComponent, {
        data: {
          title: 'No File',
          content: 'Please select a valid CSV file with patients.'
        }
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('columns', 'First Name,Last Name,Birthday,Gender');

    this.http.post(`${this.baseUrl}${this.baseUrlPatients}/upload-csv`, formData)
      .pipe(
        catchError((err, caught) => {
          this.dialog.open(PatientDialogComponent, {
            data: {
              title: 'Error',
              content: err.error
            }
          });
          return caught;
        })
      )
      .subscribe(() => {
        this.fileInput.nativeElement.value = '';
        this.uploadEvent.emit();
      });
  }

  validateFile(file: File) {
    if (!file || !file.name || file.size === 0) {
      return false;
    }

    return file.type === 'text/csv';
  }
}
