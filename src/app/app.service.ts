import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private translate: TranslateService) {
  }

  setCurrentLanguage() {
    this.translate.setDefaultLang('ar');
    this.translate.use(localStorage.getItem("language"));

    this.addLanguageClassToBody(localStorage.getItem("language"));
  }

  changeLanguage(lang: string) {
    localStorage.setItem("language", lang);
    this.translate.use(lang);

    this.addLanguageClassToBody(lang);
  }

  private addLanguageClassToBody(lang: string) {
    lang == 'ar' ? document.body.className = 'rtl' : document.body.className = 'ltr';
  }

}
