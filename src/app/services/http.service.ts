import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITEMS_URL } from '../constants/app-constants';
import { DataItem } from '../model/data-item.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  getItems(): Observable<DataItem[]> {
    return this.http.get<DataItem[]>(ITEMS_URL);
  }
}
