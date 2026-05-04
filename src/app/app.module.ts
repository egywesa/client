import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { CoreModule } from './core/core.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { QRCodeModule } from 'angularx-qrcode';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { SharedModule } from './shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CityListComponent } from './components/admin/city/city-list/city-list.component';
import { CityAddOrEditComponent } from './components/admin/city/city-add-or-edit/city-add-or-edit.component';
import { PriceListComponent } from './components/admin/price/price-list/price-list.component';
import { PriceAddOrEditComponent } from './components/admin/price/price-add-or-edit/price-add-or-edit.component';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivityAddOrEditComponent } from './components/admin/activity/activity-add-or-edit/activity-add-or-edit.component';
import { ActivityListComponent } from './components/admin/activity/activity-list/activity-list.component';
import { TaxListComponent } from './components/admin/tax/tax-list/tax-list.component';
import { TaxAddOrEditComponent } from './components/admin/tax/tax-add-or-edit/tax-add-or-edit.component';
import { ProductListComponent } from './components/admin/product/product-list/product-list.component';
import { ProductAddOrEditComponent } from './components/admin/product/product-add-or-edit/product-add-or-edit.component';
import { CompanyListComponent } from './components/admin/company/company-list/company-list.component';
import { CompanyAddOrEditComponent } from './components/admin/company/company-add-or-edit/company-add-or-edit.component';
import { BranchListComponent } from './components/admin/branch/branch-list/branch-list.component';
import { BranchAddOrEditComponent } from './components/admin/branch/branch-add-or-edit/branch-add-or-edit.component';
import { ClientListComponent } from './components/admin/client/client-list/client-list.component';
import { ClientAddOrEditComponent } from './components/admin/client/client-add-or-edit/client-add-or-edit.component';
import { SliderListComponent } from './components/admin/website/slider/slider-list/slider-list.component';
import { SliderAddOrEditComponent } from './components/admin/website/slider/slider-add-or-edit/slider-add-or-edit.component';
import { FaqListComponent } from './components/admin/website/faq/faq-list/faq-list.component';
import { FaqAddOrEditComponent } from './components/admin/website/faq/faq-add-or-edit/faq-add-or-edit.component';
import { StepListComponent } from './components/admin/website/step/step-list/step-list.component';
import { StepAddOrEditComponent } from './components/admin/website/step/step-add-or-edit/step-add-or-edit.component';
import { TestimonialListComponent } from './components/admin/website/testimonial/testimonial-list/testimonial-list.component';
import { TestimonialAddOrEditComponent } from './components/admin/website/testimonial/testimonial-add-or-edit/testimonial-add-or-edit.component';
import { InvoiceAddOrEditComponent } from './components/admin/invoice/invoice-add-or-edit/invoice-add-or-edit.component';
import { AdditionalContactAddOrEditComponent } from './components/admin/additional-contact/additional-contact-add-or-edit/additional-contact-add-or-edit.component';
import { AdditionalContactListComponent } from './components/admin/additional-contact/additional-contact-list/additional-contact-list.component';
import { BankListComponent } from './components/admin/bank/bank-list/bank-list.component';
import { BankAddOrEditComponent } from './components/admin/bank/bank-add-or-edit/bank-add-or-edit.component';
import { InvoiceListComponent } from './components/admin/invoice/invoice-list/invoice-list.component';
import { InvoiceShowComponent } from './components/admin/invoice/invoice-show/invoice-show.component';
import { FirstDesignComponent } from './components/admin/invoice/invoice-show/first-design/first-design.component';
import { SecondDesignComponent } from './components/admin/invoice/invoice-show/second-design/second-design.component';
import { ThirdDesignComponent } from './components/admin/invoice/invoice-show/third-design/third-design.component';
import { InvoiceNotificationShowComponent } from './components/admin/invoice/invoice-notification-show/invoice-notification-show.component';
import { InvoiceNotificationAddComponent } from './components/admin/invoice/invoice-notification-add/invoice-notification-add.component';
import { AnotherSystemsComponent } from './components/admin/another-systems/another-systems.component';
import { AfterPaymentSuccessComponent } from './components/admin/after-payment-success/after-payment-success.component';
import { RenewPaymentComponent } from './components/admin/renew-payment/renew-payment.component';
import { PaymentListComponent } from './components/admin/payment/payment-list/payment-list.component';
import { SampleDesignComponent } from './components/admin/invoice/invoice-show/sample-design/sample-design.component';
import { ChangePasswordComponent } from './components/admin/change-password/change-password.component';
import { LandingpageComponent } from './components/landingpage/landingpage.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AboutListComponent } from './components/admin/website/about/about-list/about-list.component';
import { AboutAddOrEditComponent } from './components/admin/website/about/about-add-or-edit/about-add-or-edit.component';
import { SettingListComponent } from './components/admin/website/settings/setting-list/setting-list.component';
import { SettingAddOrEditComponent } from './components/admin/website/settings/setting-add-or-edit/setting-add-or-edit.component';
import { ContactListComponent } from './components/admin/website/contact info/contact-list/contact-list.component';
import { ContactAddOrEditComponent } from './components/admin/website/contact info/contact-add-or-edit/contact-add-or-edit.component';
import { TermsandconditionsListComponent } from './components/admin/website/Terms&condition/termsandconditions-list/termsandconditions-list.component';
import { TermsAndcondtionAddOrEditComponent } from './components/admin/website/Terms&condition/terms-andcondtion-add-or-edit/terms-andcondtion-add-or-edit.component';
import { NgxEditorModule } from 'ngx-editor';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogNotificationlistComponent } from './components/admin/invoice/dialog-notificationlist/dialog-notificationlist.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { DesignesComponent } from './components/admin/designes/designes/designes.component';
import { InvoiceprintComponent } from './components/admin/invoice/invoice-show/invoiceprint/invoiceprint.component';
import { GridModule, PDFModule } from '@progress/kendo-angular-grid';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CompanyReportComponent } from './components/admin/company/company-report/company-report.component';
import { ShowdraftComponent } from './components/admin/invoice/invoice-show/showdraft/showdraft.component';
import { PrintdraftComponent } from './components/admin/invoice/invoice-show/printdraft/printdraft.component';
import { CompaniesReportsComponent } from './components/admin/companies-reports/companies-reports.component';
import { InvoiceDownloadComponent } from './components/admin/invoice/invoice-download/invoice-download.component';
import { InvoiceNotificationDownloadComponent } from './components/admin/invoice/invoice-notification-download/invoice-notification-download.component';
import { InvoiceNotificationEditComponent } from './components/admin/invoice/invoice-notification-edit/invoice-notification-edit.component';
import { ZatacSettingComponent } from './components/admin/Zatac/zatac-setting/zatac-setting.component';
import { ZatcaEnteryListComponent } from './components/admin/zatca-entery-list/zatca-entery-list/zatca-entery-list.component';
import { ChartOfAccountsComponent } from './components/accounts/chart-of-accounts/chart-of-accounts.component';
import { SuppliersComponent } from './components/accounts/suppliers/suppliers.component';
import { AddSupplierComponent } from './components/accounts/suppliers/add-supplier/add-supplier.component';
import { SupplierListComponent } from './components/accounts/suppliers/supplier-list/supplier-list.component';
import { MatTableModule } from '@angular/material/table';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { CustomMatPaginatorIntl } from './core/i18n/custom-mat-paginator-intl';
import { JournalEntryComponent } from './components/accounts/journal-entry/journal-entry.component';
import { AddJournalComponent } from './components/accounts/journal-entry/add-journal/add-journal.component';
import { JournalListComponent } from './components/accounts/journal-entry/journal-list/journal-list.component';
import { PaymentVoucherComponent } from './components/accounts/payment-voucher/payment-voucher.component';
import { AddVoucherComponent } from './components/accounts/payment-voucher/add-voucher/add-voucher.component';
import { VoucherListComponent } from './components/accounts/payment-voucher/voucher-list/voucher-list.component';
import { ReportsComponent } from './components/accounts/reports/reports.component';
import { ProfitAndLossComponent } from './components/accounts/reports/profit-and-loss/profit-and-loss.component';
import { BalanceSheetComponent } from './components/accounts/reports/balance-sheet/balance-sheet.component';
import { AccountStatementComponent } from './components/accounts/reports/account-statement/account-statement.component';
import { ReceiptVoucherComponent } from './components/accounts/receipt-voucher/receipt-voucher.component';
import { AddReceiptVoucherComponent } from './components/accounts/receipt-voucher/add-voucher/add-voucher.component';
import { ReceiptVoucherListComponent } from './components/accounts/receipt-voucher/voucher-list/voucher-list.component';
import { ManualEntryComponent } from './components/accounts/manual-entry/manual-entry.component';
import { AddEntryComponent } from './components/accounts/manual-entry/add-entry/add-entry.component';
import { EntryListComponent } from './components/accounts/manual-entry/entry-list/entry-list.component';
import { DocumentsComponent } from './components/accounts/documents/documents.component';
import { AddDocumentComponent } from './components/accounts/documents/add-document/add-document.component';
import { DocumentListComponent } from './components/accounts/documents/document-list/document-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,

    CityListComponent,
    CityAddOrEditComponent,

    ActivityListComponent,
    ActivityAddOrEditComponent,

    TaxListComponent,
    TaxAddOrEditComponent,

    PriceListComponent,
    PriceAddOrEditComponent,

    ProductListComponent,
    ProductAddOrEditComponent,

    CompanyListComponent,
    CompanyAddOrEditComponent,

    BranchListComponent,
    BranchAddOrEditComponent,

    ZatcaEnteryListComponent,

    ClientListComponent,
    ClientAddOrEditComponent,

    SliderListComponent,
    SliderAddOrEditComponent,

    FaqListComponent,
    FaqAddOrEditComponent,

    StepListComponent,
    StepAddOrEditComponent,

    TestimonialListComponent,
    TestimonialAddOrEditComponent,

    AdditionalContactListComponent,
    AdditionalContactAddOrEditComponent,

    BankListComponent,
    BankAddOrEditComponent,

    InvoiceListComponent,
    InvoiceAddOrEditComponent,
    InvoiceShowComponent,

    InvoiceNotificationAddComponent,
    InvoiceNotificationShowComponent,

    FirstDesignComponent,
    SecondDesignComponent,
    ThirdDesignComponent,
    SampleDesignComponent,

    AnotherSystemsComponent,

    PaymentListComponent,

    RenewPaymentComponent,

    AfterPaymentSuccessComponent,

    ChangePasswordComponent,
    LandingpageComponent,
    AboutListComponent,
    AboutAddOrEditComponent,
    SettingListComponent,
    SettingAddOrEditComponent,
    ContactListComponent,
    ContactAddOrEditComponent,
    TermsandconditionsListComponent,
    TermsAndcondtionAddOrEditComponent,
    DialogNotificationlistComponent,
    DesignesComponent,
    InvoiceprintComponent,
    CompanyReportComponent,
    ShowdraftComponent,
    PrintdraftComponent,
    CompaniesReportsComponent,
    InvoiceDownloadComponent,
    InvoiceNotificationDownloadComponent,
    InvoiceNotificationEditComponent,
    ZatacSettingComponent,
    ZatcaEnteryListComponent,
    ChartOfAccountsComponent,
    SuppliersComponent,
    AddSupplierComponent,
    SupplierListComponent,
    JournalEntryComponent,
    AddJournalComponent,
    JournalListComponent,
    PaymentVoucherComponent,
    AddVoucherComponent,
    VoucherListComponent,
    ReportsComponent,
    ProfitAndLossComponent,
    BalanceSheetComponent,
    AccountStatementComponent,
    AddReceiptVoucherComponent,
    ReceiptVoucherListComponent,
    ReceiptVoucherComponent,
    ManualEntryComponent,
    AddEntryComponent,
    EntryListComponent,
    DocumentsComponent,
    AddDocumentComponent,
    DocumentListComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    CarouselModule,
    MatMenuModule,
    MatIconModule,
    NgxEditorModule,
    MatDialogModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    SharedModule,
    DataTablesModule,
    NgSelectModule,
    FormsModule,
    GridModule,
    PDFModule,
    DateInputsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    QRCodeModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatExpansionModule,
    MatTabsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginatorIntl,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
