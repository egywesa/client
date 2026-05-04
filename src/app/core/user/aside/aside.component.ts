import { Component, OnInit ,Input} from '@angular/core';
import {AccountService} from "../../../components/account/account.service";

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss']
})
export class AsideComponent implements OnInit {
 
  constructor(public accountService: AccountService) { }
  allowZatca:any;
  ngOnInit(): void {
    this.getProfile();
  }



getProfile(){
  this.accountService.getProfile().subscribe(profile => {
     
      this.allowZatca=profile.allowZatacForm;
      console.log(profile.allowZatacForm);
  });
 }

}
