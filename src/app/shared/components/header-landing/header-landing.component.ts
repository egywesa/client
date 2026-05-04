import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-header-landing',
  templateUrl: './header-landing.component.html',
  styleUrls: ['./header-landing.component.scss']
})
export class HeaderLandingComponent implements OnInit {

  constructor( private appService:AppService , public translate: TranslateService,public router: Router) { }
  lang:any;
  ngOnInit(): void {
    console.log(this.router.url)
    this.lang=localStorage.getItem('language');
    console.log(this.lang)
  }
  changeLanguage(lang:any) {
    console.log('lang change')
    this.lang=lang;
    this.appService.changeLanguage(lang);
    this.ngOnInit()
  }
 
}
