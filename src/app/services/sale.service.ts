import {Injectable} from '@angular/core';
import {CommonService} from "../core/common-service";
import {Sale} from "../models/sale";
import {environment} from "../environments/environment";
import {SALE, SEPARATOR} from "../component/Utils/constants/ApiConstants";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {Store} from "../models/store";

@Injectable({
  providedIn: 'root'
})
export class SaleService implements CommonService<Sale> {

  private SALE_API_URL = `${environment.apiUrl}${SEPARATOR}${SALE}`;

  constructor(
    private http: HttpClient
  ) {
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete(`${this.SALE_API_URL}/${id}`, {responseType: 'text'})
      .pipe(
        map(response => {
          try {
            return JSON.parse(response);
          } catch {
            return {message: response};
          }
        }),
        catchError(error => {
          console.error('Delete error:', error);
          return throwError(() => error);
        })
      );
  }

  getAll(params?: {
    [filter: string]: any;
    page?: number;
    size?: number;
    sort?: string
  }): Observable<Sale[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.append(key, params[key]);
        }
      });
    }
    return this.http.get<Sale[]>(this.SALE_API_URL,{params:httpParams});
  }

  getById(id: number): Observable<Sale> {
    return this.http.get<Sale>(`${this.SALE_API_URL}${SEPARATOR}${id}`);
  }

  save(model: Sale): Observable<Sale> {
    return this.http.post<Sale>(this.SALE_API_URL, model);
  }

  update(id: number, model: Sale): Observable<Sale> {
    return this.http.put<Sale>(`${this.SALE_API_URL}${SEPARATOR}${id}`, model);
  }
}
