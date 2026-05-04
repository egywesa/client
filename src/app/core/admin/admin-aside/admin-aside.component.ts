import { Component, OnInit } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {AccountService} from '../../../components/account/account.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';

@Component({
  selector: 'app-admin-aside',
  templateUrl: './admin-aside.component.html',
  styleUrls: ['./admin-aside.component.scss']
})
export class AsideComponent implements OnInit {

  constructor(public translate: TranslateService, public accountService: AccountService ) { }
  email:any;
  logo:any;
  baseUrl = environment.baseUrl;
  ngOnInit(): void {
    this.getProfile();
    
  }

 getProfile(){
  this.accountService.getProfile().subscribe(profile => {
      console.log(profile);
      this.email=profile.email;
      this.logo=profile.logoLink;
  });
 }

}
