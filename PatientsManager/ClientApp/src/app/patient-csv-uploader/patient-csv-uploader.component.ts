import {Component, EventEmitter, Inject, Output, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {PatientDialogComponent} from "../patient-dialog/patient-dialog.component";
import {FileService} from "../services/file.service";

@Component({
  selector: 'app-patient-csv-uploader',
  templateUrl: './patient-csv-uploader.component.html',
  styleUrls: ['./patient-csv-uploader.component.css']
})
export class PatientCsvUploaderComponent {
  @ViewChild('fileInput') fileInput: any;
  @Output('upload') uploadEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(public _fileService: FileService, public _dialog: MatDialog) {}

  upload(files: FileList | null) {
    if (files === null || files.length === 0)
    {
      return;
    }

    const file = <File>files?.item(0);
    if (!this.validateFile(file))
    {
      this._dialog.open(PatientDialogComponent, {
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

    this._fileService
      .uploadFile(formData)
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
