import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AppService } from "./app.service";
import { AccountService } from "./components/account/account.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'client';

  constructor(public router: Router, private appService: AppService,
    public translate: TranslateService, public accountService: AccountService) { }

  ngOnInit() {
    console.log(this.router.url)
    this.accountService.currentUser$.subscribe(user => {

    })
    this.accountService.loadCurrentUser(localStorage.getItem('token')).subscribe(() => {
      console.log('user init Now');
    }, err => {  
      this.router.navigateByUrl('/landpage');
    });
    this.initializeLanguage();
    this.appService.setCurrentLanguage();
  }

  private initializeLanguage() {
    if (localStorage.getItem('language') == null) {
      localStorage.setItem('language', 'ar');
    }
  }
}
