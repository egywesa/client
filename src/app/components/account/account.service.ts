import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { map, of, ReplaySubject, catchError, throwError } from "rxjs";
import { Router } from "@angular/router";
import { IProfile, IUserResponse } from "../../shared/models/user";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.baseUrl;
  private currentUserSource = new ReplaySubject<IUserResponse>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  loadCurrentUser(token: string) {
    if (token === null) {
      this.currentUserSource.next(null);
      return of(null);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get(this.baseUrl + `api/auth/current-user`, { headers }).pipe(
      map((user: IUserResponse) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        } else {
          this.currentUserSource.next(null);
        }
      })
    );
  }

  login(values: any) {
    return this.http.post(this.baseUrl + 'api/auth/login', values).pipe(
      map((user: IUserResponse) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  registerUser(values: any) {
    return this.http.post(this.baseUrl + 'api/auth/register', values).pipe(
      map((user: IUserResponse) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  getProfile() {
    return this.http.get<IProfile>(this.baseUrl + "api/auth/profile").pipe(
      catchError(err => {
        console.error('getProfile error', err);
        return throwError(() => err);
      })
    );
  }

  setProfile(values: any) {
    const formData = new FormData();
    formData.append('companyNameAr', values.companyNameAr);
    formData.append('companyNameEn', values.companyNameEn);
    formData.append('companyAddressAr', values.companyAddressAr);
    formData.append('companyAddressEn', values.companyAddressEn);
    formData.append('activityId', values.activityId);
    formData.append('commercialRegNumber', values.commercialRegNumber);
    formData.append('tin', values.tin);
    formData.append('vat', values.vat);
    formData.append('activityId', values.activityId);
    formData.append('invoiceLast', values.invoiceLast);

    formData.append('phoneNumber', values.phoneNumber);
    formData.append('email', values.email);
    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);
    formData.append('cityId', values.cityId);
  
    formData.append('Country', values.country);
   
    formData.append('allowZatkaForm', values.allowZatkaForm);
   
    console.log(values.logo);

    // Append files only when actual File/Blob objects are provided
    if (values.logoSource && values.logoSource instanceof Blob) {
      formData.append('logo', values.logoSource, (values.logoSource as any).name || 'logo');
    }

    if (values.signatureSource && values.signatureSource instanceof Blob) {
      formData.append('signature', values.signatureSource, (values.signatureSource as any).name || 'signature');
    }

    // Do not set Content-Type header; browser will set the correct multipart boundary
    return this.http.post<IProfile>(this.baseUrl + "api/auth/profileReg", formData);
  }
  updateProfile(values: any) {
    const formData = new FormData();
    formData.append('companyNameAr', values.companyNameAr);
    formData.append('companyNameEn', values.companyNameEn);
    formData.append('companyAddressAr', values.companyAddressAr);
    formData.append('companyAddressEn', values.companyAddressEn);
    formData.append('activityId', values.activityId);
    formData.append('commercialRegNumber', values.commercialRegNumber);
    //formData.append('tin', values.tin);
    formData.append('vat', values.vat);

    formData.append('invoiceLast', values.invoiceLast);

    formData.append('phoneNumber', values.phoneNumber);
    formData.append('email', values.email);
    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);
    formData.append('cityId', values.cityId);
   
    formData.append('Country', values.Country);
 
    console.log(values.logo);

    if (values.logoSource && values.logoSource instanceof Blob) {
      formData.append('logo', values.logoSource, (values.logoSource as any).name || 'logo');
    }

    if (values.signatureSource && values.signatureSource instanceof Blob) {
      formData.append('signature', values.signatureSource, (values.signatureSource as any).name || 'signature');
    }

    return this.http.post<IProfile>(this.baseUrl + "api/auth/OutUpdateProfile", formData);
  }

  changePassword(values: any) {
    return this.http.post<IProfile>(this.baseUrl + "api/auth/change-password", values);
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/account/login');
  }
  sendMassege(values: any) {
    return this.http.post(this.baseUrl + 'api/Mailing/sendforget?language=' + localStorage.getItem('language'), values);
  }

Deletelogo(num:number) {
    return this.http.post<any>(this.baseUrl + "api/auth/UpdateDeletelogoSignature?n="+num,num);
  }

}
