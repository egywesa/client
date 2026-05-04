import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from "./header/header.component";
import {AsideComponent} from "./user/aside/aside.component";
import {AsideComponent as AdminAsideComponent} from "./admin/admin-aside/admin-aside.component";
import {RouterModule} from "@angular/router";
import {ToastrModule} from "ngx-toastr";
import {SharedModule} from "../shared/shared.module";
import {NgxNavbarModule} from "ngx-bootstrap-navbar";


@NgModule({
  declarations: [
    HeaderComponent,
    AsideComponent,
    AdminAsideComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-left',
      preventDuplicates: true
    }),
    NgxNavbarModule
  ],
  exports: [HeaderComponent, AsideComponent, AdminAsideComponent]
})
export class CoreModule { }
