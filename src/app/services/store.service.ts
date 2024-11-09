import { Injectable } from '@angular/core';
import {CommonService} from "../core/common-service";
import {Item} from "../models/Item";
import {Store} from "../models/store";
import {Observable, throwError} from "rxjs";
import {environment} from "../environments/environment";
import {ITEM, SEPARATOR, STORE} from "../component/Utils/constants/ApiConstants";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class StoreService implements CommonService<Store> {
  private STORE_API_URL = `${environment.apiUrl}${SEPARATOR}${STORE}`;

  constructor(
    private http: HttpClient
  ) {
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete(`${this.STORE_API_URL}/${id}`, { responseType: 'text' })
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
  }): Observable<Store[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.append(key, params[key]);
        }
      });
    }
    return this.http.get<Store[]>(this.STORE_API_URL,{params: httpParams});
  }

  getById(id: number): Observable<Store> {
    return this.http.get<Store>(`${this.STORE_API_URL}${SEPARATOR}${id}`);
  }

  save(model: Store): Observable<Store> {
    return this.http.post<Store>(this.STORE_API_URL, model);
  }

  update(id: number, model: Store): Observable<Store> {
    return this.http.put<Store>(`${this.STORE_API_URL}${SEPARATOR}${id}`, model);
  }
}
