import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {IUser} from "./entities/user";
import {finalize} from "rxjs/operators";

const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
  })
};

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  private baseURL: string = 'http://localhost:8080/api/user';
  public updating: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  constructor(private http: HttpClient) {
  }

  create(user: IUser): Observable<HttpResponse<IUser>> {
    return this.http.post(this.baseURL, user, {headers: httpOptions.headers, observe: 'response'})
      .pipe(finalize(() => this.updating.next(true)));
  }

  update(user: IUser): Observable<HttpResponse<IUser>> {
    return this.http.put(this.baseURL, user, {observe: 'response'})
      .pipe(finalize(() => this.updating.next(true)));
  }

  find(page: number, size: number): Observable<any> {
    return this.http.get(this.baseURL + '?page=' + page + '&size=' + size, {observe: 'response'});
  }

  applyFilter(selectedValue: string): Observable<HttpResponse<any>> {
    return this.http.get(this.baseURL + '/search?filter=' + selectedValue, {observe: 'response'});
  }

  delete(id: string): Observable<HttpResponse<any>> {
    return this.http.delete(this.baseURL + '/' + id, {observe: "response"})
      .pipe(finalize(() => this.updating.next(true)));
  }
}
