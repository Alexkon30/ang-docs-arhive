// documents.service.ts
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { DocumentType, IDocument, Nullable, Organization } from '../types/index';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  apiUrl = 'http://localhost:3000';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  private documentsSource = new BehaviorSubject<IDocument[]>([]);
  documents = this.documentsSource.asObservable();

  constructor(private http: HttpClient) {}

  loadAllDocuments() {
    this.http
      .get<Array<IDocument>>(`${this.apiUrl}/documents`)
      .pipe(catchError(this.handleError))
      .subscribe((response) => {
        this.documentsSource.next(response);
      });
  }

  get docsValue() {
    return this.documentsSource.getValue();
  }

  getDocumentTypes() {
    return this.http
      .get<Array<DocumentType>>(`${this.apiUrl}/documentTypes`)
      .pipe(catchError(this.handleError));
  }

  getOrganizations() {
    return this.http
      .get<Array<Organization>>(`${this.apiUrl}/organizations`)
      .pipe(catchError(this.handleError));
  }

  createDocument(data: Nullable<Omit<IDocument, 'id'>>) {
    this.http
      .post<IDocument>(`${this.apiUrl}/documents`, data)
      .pipe(catchError(this.handleError))
      .subscribe((response) => {
        this.documentsSource.next([...this.docsValue, response]);
      });
  }

  updateDocumentById(id: number, data: Nullable<Omit<IDocument, 'id'>>) {
    this.http
      .put<IDocument>(`${this.apiUrl}/documents/${id}`, data, {
        headers: this.headers,
      })
      .pipe(catchError(this.handleError))
      .subscribe((response) => {
        let documents = [...this.docsValue];
        let index = documents.findIndex((elem) => elem.id === id);

        if (index !== -1) {
          documents.splice(index, 1, response);
          this.documentsSource.next(documents);
        }
      });
  }

  deleteDocumentById(id: number) {
    this.http
      .delete(`${this.apiUrl}/documents/${id}`)
      .pipe(catchError(this.handleError))
      .subscribe(() => {
        this.documentsSource.next([
          ...this.docsValue.filter((item) => item.id !== id),
        ]);
      });
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
