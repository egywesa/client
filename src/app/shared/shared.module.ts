import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TextInputComponent} from "./components/text-input/text-input.component";
import {TranslateModule} from "@ngx-translate/core";
import {NgxSpinnerModule} from "ngx-spinner";
import {TextAreaComponent} from "./components/text-area/text-area.component";
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
  declarations: [TextInputComponent, TextAreaComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    NgxSpinnerModule,
  ],
  exports: [
    TextInputComponent,
    TextAreaComponent,
    NgxSpinnerModule,
    TranslateModule,
    MatMenuModule,
    MatIconModule
  ]
})
export class SharedModule { }
