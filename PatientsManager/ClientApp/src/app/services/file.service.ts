import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {ErrorHandlerService} from "./error-handler.service";

@Injectable()
export class FileService {
  private _baseUrlFile = 'file';

  constructor(private _http: HttpClient,
              @Inject('BASE_URL') private _baseUrl: string,
              private _errorHandlerService: ErrorHandlerService) {}

  uploadFile(formData: FormData): Observable<Object> {
    return this._http.post(`${this._baseUrl}${this._baseUrlFile}/upload-csv`, formData)
      .pipe(catchError(this._errorHandlerService.handleError<Object>));
  }
}
