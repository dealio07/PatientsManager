import {Patient} from "../models/patient";
import {catchError, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Inject, Injectable} from "@angular/core";
import {ErrorHandlerService} from "./error-handler.service";

@Injectable()
export class PatientService {
  private _baseUrlPatients = 'patients';

  constructor(private _http: HttpClient,
              @Inject('BASE_URL') private _baseUrl: string,
              private _errorHandlerService: ErrorHandlerService) {}

  getAll(): Observable<Patient[]> {
    return this._http.get<Patient[]>(`${this._baseUrl}${this._baseUrlPatients}`)
      .pipe(catchError(this._errorHandlerService.handleError<Patient[]>));
  }

  update(patient: Patient): Observable<Object> {
    return this._http.put(`${this._baseUrl}${this._baseUrlPatients}/update/${patient.id}`, patient)
      .pipe(catchError(this._errorHandlerService.handleError<Object>));
  }

  delete(patient: Patient): Observable<Object> {
    return this._http.delete(`${this._baseUrl}${this._baseUrlPatients}/delete/${patient.id}`)
      .pipe(catchError(this._errorHandlerService.handleError<Object>));
  }
}
