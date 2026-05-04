import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup ,Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AccountService } from '../account.service';
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  baseUrl = environment.baseUrl;
  constructor( public translate: TranslateService,
    private readonly router: Router, private readonly route: ActivatedRoute,private toastr:ToastrService,
    private accountService: AccountService,) { }
  form: FormGroup;
ngOnInit(): void {
  this.form = new FormGroup({
    Email: new FormControl(null, Validators.required),
  });
  
}

onSubmit(): void {
  if (this.form.valid) { 
    console.log(this.form.value);
  this.accountService.sendMassege(this.form.value).subscribe((res) => {
    console.log(res);
    this.toastr.success('Submmited Done !');
    this.router.navigateByUrl('/account/login');
  },
  (err) => {
    this.toastr.error('Email uncorrect please write valid mail');
 });

}
 
}

}
