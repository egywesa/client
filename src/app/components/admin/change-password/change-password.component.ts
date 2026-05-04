import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CustomValidators} from "../../account/register/register.component";
import {AccountService} from "../../account/account.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;

  constructor(private accountService: AccountService, private router: Router,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute, private translate: TranslateService
    ) { }

  ngOnInit(): void {
    this.createChangePasswordForm();
  }

  onSubmit() {

    
    this.accountService.changePassword(this.changePasswordForm.value).subscribe(() => {
      this.changePasswordForm.reset();
      this.toastr.success(this.translate.instant('saveSucess'));
    });
  }

  get passwordMatchError() {
    return (
      this.changePasswordForm.getError('mismatch') &&
      this.changePasswordForm.get('confirmPassword')?.touched
    );
  }

  private createChangePasswordForm() {
    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl(null, [
        Validators.required, Validators.minLength(6), Validators.maxLength(50),
      ]),
      password: new FormControl(null, [
        Validators.required, Validators.minLength(6), Validators.maxLength(50),
      ]),
      confirmPassword: new FormControl(null, [
        Validators.required, Validators.minLength(6), Validators.maxLength(50)
      ]),
    }, [CustomValidators.MatchValidator('password', 'confirmPassword')])
  }

}
