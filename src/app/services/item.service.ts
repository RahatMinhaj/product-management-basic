import { Injectable } from '@angular/core';
import {environment} from "../environments/environment";
import {ITEM, SEPARATOR} from "../component/Utils/constants/ApiConstants";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CommonService} from "../core/common-service";
import {Item} from "../models/Item";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ItemService implements CommonService<Item>{
  private ITEM_API_URL = `${environment.apiUrl}${SEPARATOR}${ITEM}`;

  constructor(
    private http: HttpClient
  ) {
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete(`${this.ITEM_API_URL}/${id}`, { responseType: 'text' })
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
  }): Observable<Item[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.append(key, params[key]);
        }
      });
    }
    return this.http.get<Item[]>(this.ITEM_API_URL, {params: httpParams});
  }

  getById(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.ITEM_API_URL}${SEPARATOR}${id}`);
  }

  save(model: Item): Observable<Item> {
    return this.http.post<Item>(this.ITEM_API_URL, model);
  }

  update(id: number, model: Item): Observable<Item> {
    return this.http.put<Item>(`${this.ITEM_API_URL}${SEPARATOR}${id}`, model);
  }

}
