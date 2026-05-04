import { Component, OnInit } from '@angular/core';
import {AccountService} from '../../components/account/account.service';
import {AppService} from "../../app.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public accountService: AccountService, public appService: AppService,
    public translate: TranslateService) { }
lang:any;
  ngOnInit(): void {
    this.lang=localStorage.getItem('language');
  }

  changeLanguage() {
    this.appService.changeLanguage(this.translate.currentLang == 'ar' ? 'en' : 'ar');

    window.location.reload();
  }

  showNavbar() {
    let isNavbarShow = $("body").hasClass("offcanvas-active");
    if (isNavbarShow == true) {
      $("body").removeClass("offcanvas-active");
    } else {
      $("body").addClass("offcanvas-active");
    }
  }

}
