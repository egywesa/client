import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingService {


  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getSettings() {
    return this.http.get<any[]>(this.baseUrl + 'api/Settings?language='+localStorage.getItem('language'));
  }

  getSetting(id: number) {
    return this.http.get<any>(this.baseUrl + 'api/Settings/'+id);
  }

  addNew(values: any) {
    const formData = new FormData();

    formData.append('Title', values.titleAr);
    formData.append('TitleAr', values.titleEn);

    formData.append('Keyword', values.Keyword);
    formData.append('Description', values.Description);

    formData.append('Paragraph', values.paragraph);
    formData.append('ParagraphAr', values.paragraphAr);

    formData.append("image", values.imageSource, values.imageSource.name);

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post(this.baseUrl + 'api/Settings', formData, {headers: headers});
  }

  edit(id: number, values: any) {
    const formData = new FormData();

    formData.append('Title', values.titleAr);
    formData.append('TitleAr', values.titleEn);

    formData.append('Keyword', values.Keyword);
    formData.append('Description', values.Description);

    formData.append('Paragraph', values.paragraph);
    formData.append('ParagraphAr', values.paragraphAr);

    if (values.imageSource) {
      formData.append("image", values.imageSource, values.imageSource.name);
    }

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');

    return this.http.put(this.baseUrl + 'api/Settings/'+id, formData, {headers: headers});
  }

  remove(id: number) {
    return this.http.delete(this.baseUrl + 'api/Settings/'+id);
  }
}
