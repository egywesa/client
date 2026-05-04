import { Component, OnInit } from '@angular/core';
import { AppService } from "../../../app.service";
import { TranslateService } from "@ngx-translate/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Toast, ToastrService } from "ngx-toastr";
import { AccountService } from "../account.service";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(public appService: AppService, public translate: TranslateService,private toastr:ToastrService,
    private accountService: AccountService, private router: Router,public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.createLoginForm();
  }

  onSubmit() {
    console.log(this.loginForm.valid)
    if (this.loginForm.valid) { 
      this.accountService.login(this.loginForm.value).subscribe(() => {
        this.router.navigateByUrl('/dashboard');
      });
    }else{
      this.toastr.error("must fill all input")
    }
   
  }



  private createLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }

  openDialogForgetPassword() {
    const dialogRef = this.dialog.open(ForgetPasswordComponent, { width: '530px',height:"300px"});
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result} `);

    });
  }
}
