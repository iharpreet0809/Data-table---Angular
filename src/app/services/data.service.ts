import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Row {
  id: number;
  first_name: string;
  email: string;
  nv: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://127.0.0.1:8000/api/rows/'; // Django API endpoint

  constructor(private http: HttpClient) { }

  getRows(): Observable<Row[]> {
    return this.http.get<Row[]>(this.apiUrl).pipe(
      catchError(this.handleError<Row[]>('getRows', []))
    );
  }

  exportToExcel(data: any): Observable<Blob> {
    return this.http.post('/api/export', data, {
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError<Blob>('exportToExcel', new Blob()))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
