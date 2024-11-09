import {Observable} from "rxjs";
import {Component, ViewChild} from "@angular/core";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";


export interface BaseListComponent<T> {
  displayedColumns: string[];
  dataSource: T[];
  pageable: any;
  filters: { [key: string]: string };
  sortColumn: string;
  sortDirection: string;

  getData(params: any): Observable<any>;
}

@Component({
  template: ''
})

export abstract class BaseListComponentImpl<T> implements BaseListComponent<T> {
  displayedColumns: string[] = [];
  dataSource: T[] = [];
  pageable: any;
  filters: { [key: string]: string } = {};
  sortColumn: string = 'createdAt';
  sortDirection: string = 'desc';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  abstract getData(params: any): Observable<any>;

  ngOnInit(): void {
    this.getDataFromService();
  }

  getDataFromService(): void {
    const params = {
      pageNo: this.paginator ? this.paginator.pageIndex + 1 : 1,
      pageSize: this.paginator ? this.paginator.pageSize : 5,
      sortBy: `${encodeURIComponent(this.sortColumn)}:${this.sortDirection}`,
      ...this.filters
    };

    this.getData(params).subscribe({
      next: response => {
        console.log('API Response:', response);
        this.dataSource = response.content;
        console.log('DataSource:', this.dataSource);
        this.pageable = response.pageable || {};
        this.paginator.length = response.totalElements;
        this.paginator.pageIndex = this.pageable.pageNumber || 0;
        this.paginator.pageSize = this.pageable.pageSize || 10;
      },
      error: error => {
        console.error('Error fetching data:', error);
      }
    });
  }



  pageChange(event: any): void {
    this.paginator.pageIndex = event.pageIndex;
    this.paginator.pageSize = event.pageSize;
    this.getDataFromService();
  }

  applyDynamicFilter(filterKey: string, event: any): void {
    const input = event.target as HTMLInputElement;
    this.filters[filterKey] = input.value;
    this.paginator.pageIndex = 0;
    this.getDataFromService();
  }

  sortData(sort: Sort): void {
    this.sortColumn = sort.active;
    this.sortDirection = sort.direction === '' ? 'asc' : sort.direction;
    this.getDataFromService();
  }
}
