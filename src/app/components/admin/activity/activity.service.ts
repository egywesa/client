import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {IActivity, IActivityEditOrCreate} from "../../../shared/models/activity";

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getActivities() {
    return this.http.get<IActivity[]>(this.baseUrl + 'api/Activities?language='+localStorage.getItem('language'));
  }

  getActivity(id: number) {
    return this.http.get<IActivityEditOrCreate>(this.baseUrl + 'api/Activities/'+id);
  }

  addNew(values: any) {
    return this.http.post(this.baseUrl + 'api/Activities', values);
  }

  edit(id: number, values: any) {
    return this.http.put(this.baseUrl + 'api/Activities/'+id, values);
  }

  remove(id: number) {
    return this.http.delete(this.baseUrl + 'api/Activities/'+id);
  }

}
