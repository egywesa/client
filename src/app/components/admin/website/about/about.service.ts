import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AboutService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getabouts() {
    return this.http.get<any[]>(this.baseUrl + 'api/Abouts?language='+localStorage.getItem('language'));
  }

  getabout(id: number) {
    return this.http.get<any>(this.baseUrl + 'api/Abouts/'+id);
  }

  addNew(values: any) {
    const formData = new FormData();

    formData.append('titleAr', values.titleAr);
    formData.append('title', values.titleEn);

    formData.append('paragraph1Ar', values.paragraph1Ar);
    formData.append('paragraph1', values.paragraph1En);
    formData.append('paragraph2Ar', values.paragraph2Ar);
    formData.append('paragraph2', values.paragraph2En);
    formData.append('paragraph3Ar', values.paragraph3Ar);
    formData.append('paragraph3', values.paragraph3En);
    formData.append('paragraph4Ar', values.paragraph4Ar);
    formData.append('paragraph4', values.paragraph4En);

    formData.append("image", values.imageSource, values.imageSource.name);

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT')

    return this.http.post(this.baseUrl + 'api/Abouts', formData, {headers: headers});
  }

  edit(id: number, values: any) {
    const formData = new FormData();
    formData.append('titleAr', values.titleAr);
    formData.append('title', values.titleEn);

    formData.append('paragraph1Ar', values.paragraph1Ar);
    formData.append('paragraph1', values.paragraph1En);
    formData.append('paragraph2Ar', values.paragraph2Ar);
    formData.append('paragraph2', values.paragraph2En);
    formData.append('paragraph3Ar', values.paragraph3Ar);
    formData.append('paragraph3', values.paragraph3En);
    formData.append('paragraph4Ar', values.paragraph4Ar);
    formData.append('paragraph4', values.paragraph4En);

    if (values.imageSource) {
      formData.append("image", values.imageSource, values.imageSource.name);
    }

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');

    return this.http.put(this.baseUrl + 'api/Abouts/'+id, formData, {headers: headers});
  }

  remove(id: number) {
    return this.http.delete(this.baseUrl + 'api/Abouts/'+id);
  }
}
