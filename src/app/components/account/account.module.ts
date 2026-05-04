import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import {AccountRoutingModule} from "./account-routing.module";
import { RegisterComponent } from './register/register.component';
import {SharedModule} from "../../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import { ProfileComponent } from './profile/profile.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
 import { HeaderLandingComponent } from 'src/app/shared/components/header-landing/header-landing.component';
import { CompanyprofileComponent } from './companyprofile/companyprofile.component';
import { PackagePricesComponent } from './package-prices/package-prices.component';
import { DialogTermsComponent } from './dialog-terms/dialog-terms.component';
@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    ForgetPasswordComponent,
    HeaderLandingComponent,
    CompanyprofileComponent,
    PackagePricesComponent,
    DialogTermsComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
  ]
})
export class AccountModule { }
