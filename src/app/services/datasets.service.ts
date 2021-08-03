import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const httpOptions = {
  // headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
};

@Injectable({
  providedIn: 'root'
})
export class DatasetsService {

  host = 'http://api.datahub.dappbk.com/';

  // 获取分类列表
  get_categories(): Observable<any> {
    return this.http.get<any>(this.host + 'datasets/categories', {
      params: {
      }
    });
  }  constructor(private http: HttpClient) { }

  // 获取数据集列表
  get_datasets(query: any): Observable<any> {
    return this.http.get<any>(this.host + 'datasets/search', {
      params: {
        query: query || ''
      }
    });
  }

  // 获取数据集
  get_dataset(id: string): Observable<any> {
    return this.http.get<any>(this.host + 'datasets/dataset', {
      params: {
        id: id
      }
    });
  }

  // 查询 drill
  get_drill(query: string): Observable<any> {
    return this.http.get<any>(this.host + 'datasets/drill', {
      params: {
        query: query
      }
    });
  }

}
