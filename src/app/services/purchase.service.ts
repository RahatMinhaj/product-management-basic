import { Injectable } from '@angular/core';
import {CommonService} from "../core/common-service";
import {Store} from "../models/store";
import {Purchase} from "../models/purchase";
import {environment} from "../environments/environment";
import {PURCHASE, SEPARATOR, STORE} from "../component/Utils/constants/ApiConstants";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PurchaseService implements CommonService<Purchase> {

  private PURCHASE_API_URL = `${environment.apiUrl}${SEPARATOR}${PURCHASE}`;

  constructor(
    private http: HttpClient
  ) {
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete(`${this.PURCHASE_API_URL}/${id}`, { responseType: 'text' })
      .pipe(
        map(response => {
          try {
            return JSON.parse(response);
          } catch {
            return { message: response };
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
  }): Observable<Purchase[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.append(key, params[key]);
        }
      });
    } return this.http.get<Purchase[]>(this.PURCHASE_API_URL,{params:httpParams});
  }

  getById(id: number): Observable<Purchase> {
    return this.http.get<Purchase>(`${this.PURCHASE_API_URL}${SEPARATOR}${id}`);
  }

  save(model: Store): Observable<Purchase> {
    return this.http.post<Purchase>(this.PURCHASE_API_URL, model);
  }

  update(id: number, model: Purchase): Observable<Purchase> {
    return this.http.put<Purchase>(`${this.PURCHASE_API_URL}${SEPARATOR}${id}`, model);
  }
}
