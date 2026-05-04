import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { AppService } from '../../../app.service';
import { TranslateService } from "@ngx-translate/core";
import { AccountService } from "../account.service";
import { Router } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { DialogTermsComponent } from '../dialog-terms/dialog-terms.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(public appService: AppService, private accountService: AccountService,public dialog: MatDialog,
    public translate: TranslateService, public router: Router) { }

  ngOnInit(): void {
    this.createRegisterForm();
  }

  onSubmit() {
    this.accountService.registerUser(this.registerForm.value).subscribe(() => {
      this.router.navigateByUrl('account/companyProfile');
    });
  }

  changeLanguage() {
    this.appService.changeLanguage(this.translate.currentLang == 'ar' ? 'en' : 'ar');
  }

  get passwordMatchError() {
    return (
      this.registerForm.getError('mismatch') &&
      this.registerForm.get('confirmPassword')?.touched
    );
  }

  private createRegisterForm() {
    this.registerForm = new FormGroup({
      firstName: new FormControl(null, [
        Validators.required, Validators.minLength(2), Validators.maxLength(20)
      ]),
      lastName: new FormControl(null, [
        Validators.required, Validators.minLength(2), Validators.maxLength(20)
      ]),
      PhoneNumber: new FormControl(null, [
        Validators.required, Validators.minLength(8), Validators.maxLength(25)
      ]),
      email: new FormControl(null, [
        Validators.required, Validators.minLength(6), Validators.maxLength(40),
        Validators.pattern('^[\\w-\\.]+@([\\w-]+\.)+[\\w-]{2,4}$')
      ]),

      tin: new FormControl(null, [Validators.required ,Validators.minLength(10), Validators.maxLength(10)]),

      terms: new FormControl(false, [Validators.requiredTrue]),
      password: new FormControl(null, [
        Validators.required, Validators.minLength(8), Validators.maxLength(50),
      ]),

    
     

      confirmPassword: new FormControl(null, [
        Validators.required, Validators.minLength(8), Validators.maxLength(50)
      ]),
    }, [CustomValidators.MatchValidator('password', 'confirmPassword')])
  }

  termsDailog(){
    const dialogRef = this.dialog.open( DialogTermsComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result} `);

    });
  }

  openTerms(event: MouseEvent) {
    event.preventDefault();
    const dialogRef = this.dialog.open(DialogTermsComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.registerForm.get('terms')?.setValue(true);
      } else {
        this.registerForm.get('terms')?.setValue(false);
      }
    });
  }
}

export class CustomValidators {

  static MatchValidator(source: string, target: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const sourceCtrl = control.get(source);
      const targetCtrl = control.get(target);

      return sourceCtrl && targetCtrl && sourceCtrl.value !== targetCtrl.value
        ? { mismatch: true }
        : null;
    };
  }

}
