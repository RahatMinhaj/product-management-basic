import {Observable} from "rxjs";

export interface CommonService<T> {

  save(model: T): Observable<T>;

  getById(id: number): Observable<T>;

  getAll(params?: {
    [key: string]: any;
    page?: number;
    size?: number;
    sort?: string;
  }): Observable<T[]>;

  update(id: number, model: T): Observable<T>;

  deleteById(id: number): Observable<void>;
}
