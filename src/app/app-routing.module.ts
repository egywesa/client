import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { CityListComponent } from './components/admin/city/city-list/city-list.component';
import { AdminGuard } from './core/guards/admin.guard';
import { CityAddOrEditComponent } from './components/admin/city/city-add-or-edit/city-add-or-edit.component';
import { ActivityListComponent } from './components/admin/activity/activity-list/activity-list.component';
import { ActivityAddOrEditComponent } from './components/admin/activity/activity-add-or-edit/activity-add-or-edit.component';
import { TaxAddOrEditComponent } from './components/admin/tax/tax-add-or-edit/tax-add-or-edit.component';
import { TaxListComponent } from './components/admin/tax/tax-list/tax-list.component';
import { ProductListComponent } from './components/admin/product/product-list/product-list.component';
import { ProductAddOrEditComponent } from './components/admin/product/product-add-or-edit/product-add-or-edit.component';
import { PriceListComponent } from './components/admin/price/price-list/price-list.component';
import { PriceAddOrEditComponent } from './components/admin/price/price-add-or-edit/price-add-or-edit.component';
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
import { InvoiceAddOrEditComponent } from './components/admin/invoice/invoice-add-or-edit/invoice-add-or-edit.component';
import { TestimonialListComponent } from './components/admin/website/testimonial/testimonial-list/testimonial-list.component';
import { TestimonialAddOrEditComponent } from './components/admin/website/testimonial/testimonial-add-or-edit/testimonial-add-or-edit.component';
import { ProfileComponent } from './components/account/profile/profile.component';
import { AdditionalContactListComponent } from './components/admin/additional-contact/additional-contact-list/additional-contact-list.component';
import { AdditionalContactAddOrEditComponent } from './components/admin/additional-contact/additional-contact-add-or-edit/additional-contact-add-or-edit.component';
import { BankListComponent } from './components/admin/bank/bank-list/bank-list.component';
import { BankAddOrEditComponent } from './components/admin/bank/bank-add-or-edit/bank-add-or-edit.component';
import { InvoiceListComponent } from './components/admin/invoice/invoice-list/invoice-list.component';
import { InvoiceShowComponent } from './components/admin/invoice/invoice-show/invoice-show.component';
import { UserGuard } from './core/guards/user.guard';
import { InvoiceNotificationShowComponent } from './components/admin/invoice/invoice-notification-show/invoice-notification-show.component';
import { InvoiceNotificationAddComponent } from './components/admin/invoice/invoice-notification-add/invoice-notification-add.component';
import { AnotherSystemsComponent } from './components/admin/another-systems/another-systems.component';
import { AfterPaymentSuccessComponent } from './components/admin/after-payment-success/after-payment-success.component';
import { RenewPaymentComponent } from './components/admin/renew-payment/renew-payment.component';
import { PaymentListComponent } from './components/admin/payment/payment-list/payment-list.component';
import { ChangePasswordComponent } from './components/admin/change-password/change-password.component';
import { LandingpageComponent } from './components/landingpage/landingpage.component';
import { AboutListComponent } from './components/admin/website/about/about-list/about-list.component';
import { AboutAddOrEditComponent } from './components/admin/website/about/about-add-or-edit/about-add-or-edit.component';
import { SettingListComponent } from './components/admin/website/settings/setting-list/setting-list.component';
import { SettingAddOrEditComponent } from './components/admin/website/settings/setting-add-or-edit/setting-add-or-edit.component';
import { ContactListComponent } from './components/admin/website/contact info/contact-list/contact-list.component';
import { ContactAddOrEditComponent } from './components/admin/website/contact info/contact-add-or-edit/contact-add-or-edit.component';
import { TermsAndcondtionAddOrEditComponent } from './components/admin/website/Terms&condition/terms-andcondtion-add-or-edit/terms-andcondtion-add-or-edit.component';
import { TermsandconditionsListComponent } from './components/admin/website/Terms&condition/termsandconditions-list/termsandconditions-list.component';
import { PackagePricesComponent } from './components/account/package-prices/package-prices.component';
import { DesignesComponent } from './components/admin/designes/designes/designes.component';
import { InvoiceprintComponent } from './components/admin/invoice/invoice-show/invoiceprint/invoiceprint.component';
import { CompanyReportComponent } from './components/admin/company/company-report/company-report.component';
import { ShowdraftComponent } from './components/admin/invoice/invoice-show/showdraft/showdraft.component';
import { CompaniesReportsComponent } from './components/admin/companies-reports/companies-reports.component';
import { InvoiceDownloadComponent } from './components/admin/invoice/invoice-download/invoice-download.component';
import { InvoiceNotificationDownloadComponent } from './components/admin/invoice/invoice-notification-download/invoice-notification-download.component';
import { PrintdraftComponent } from './components/admin/invoice/invoice-show/printdraft/printdraft.component';
import { InvoiceNotificationEditComponent } from './components/admin/invoice/invoice-notification-edit/invoice-notification-edit.component';
import { ZatacSettingComponent } from './components/admin/Zatac/zatac-setting/zatac-setting.component';
import { ZatcaEnteryListComponent } from './components/admin/zatca-entery-list/zatca-entery-list/zatca-entery-list.component';
import { ChartOfAccountsComponent } from './components/accounts/chart-of-accounts/chart-of-accounts.component';
import { SuppliersComponent } from './components/accounts/suppliers/suppliers.component';
import { JournalEntryComponent } from './components/accounts/journal-entry/journal-entry.component';
import { PaymentVoucherComponent } from './components/accounts/payment-voucher/payment-voucher.component';
import { ReportsComponent } from './components/accounts/reports/reports.component';
import { ReceiptVoucherComponent } from './components/accounts/receipt-voucher/receipt-voucher.component';
import { ManualEntryComponent } from './components/accounts/manual-entry/manual-entry.component';
import { DocumentsComponent } from './components/accounts/documents/documents.component';
import { ContractTemplatesComponent } from './contract-templates/contract-templates.component';

const routes: Routes = [
  { path: '', component: LandingpageComponent },

  {
    path: 'dashboard',
    children: [
      {
        path: '',
        component: HomeComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      // Start Admin Routes
      {
        path: 'profile',
        component: ProfileComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },

      {
        path: 'cities',
        component: CityListComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },
      {
        path: 'cities/add-or-edit',
        component: CityAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },
      {
        path: 'cities/add-or-edit/:id',
        component: CityAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },

      {
        path: 'activities',
        component: ActivityListComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },
      {
        path: 'activities/add-or-edit',
        component: ActivityAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },
      {
        path: 'activities/add-or-edit/:id',
        component: ActivityAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },

      {
        path: 'taxes',
        component: TaxListComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },
      {
        path: 'taxes/add-or-edit',
        component: TaxAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },
      {
        path: 'taxes/add-or-edit/:id',
        component: TaxAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },

      {
        path: 'products',
        component: ProductListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'products/add-or-edit',
        component: ProductAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'products/add-or-edit/:id',
        component: ProductAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },

      {
        path: 'prices',
        component: PriceListComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },
      {
        path: 'prices/add-or-edit',
        component: PriceAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },
      {
        path: 'prices/add-or-edit/:id',
        component: PriceAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },

      {
        path: 'companies',
        component: CompanyListComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },
      {
        path: 'companies/add-or-edit',
        component: CompanyAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },
      {
        path: 'companies/add-or-edit/:id',
        component: CompanyAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },
      {
        path: 'company/report/:id',
        component: CompanyReportComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },
      {
        path: 'companiesreports',
        component: CompaniesReportsComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },

      {
        path: 'branches',
        component: BranchListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'branches/add-or-edit',
        component: BranchAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'branches/add-or-edit/:id',
        component: BranchAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },

      {
        path: 'zatac',
        component: ZatacSettingComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },

      {
        path: 'zatacenterylist',
        component: ZatcaEnteryListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },

      {
        path: 'clients',
        component: ClientListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'clients/add-or-edit',
        component: ClientAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'clients/add-or-edit/:id',
        component: ClientAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },

      {
        path: 'sliders',
        component: SliderListComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },
      {
        path: 'sliders/add-or-edit',
        component: SliderAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },
      {
        path: 'sliders/add-or-edit/:id',
        component: SliderAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },

      {
        path: 'faqs',
        component: FaqListComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },
      {
        path: 'faqs/add-or-edit',
        component: FaqAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },
      {
        path: 'faqs/add-or-edit/:id',
        component: FaqAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },

      {
        path: 'steps',
        component: StepListComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },
      {
        path: 'steps/add-or-edit',
        component: StepAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },
      {
        path: 'steps/add-or-edit/:id',
        component: StepAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },

      {
        path: 'testimonials',
        component: TestimonialListComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },
      {
        path: 'testimonials/add-or-edit',
        component: TestimonialAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },
      {
        path: 'testimonials/add-or-edit/:id',
        component: TestimonialAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },

      {
        path: 'whoweare',
        component: AboutListComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },
      {
        path: 'whoweare/add-or-edit',
        component: AboutAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },
      {
        path: 'whoweare/add-or-edit/:id',
        component: AboutAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },

      {
        path: 'setting',
        component: SettingListComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },
      {
        path: 'setting/add-or-edit',
        component: SettingAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },
      {
        path: 'setting/add-or-edit/:id',
        component: SettingAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },

      {
        path: 'contact',
        component: ContactListComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },
      {
        path: 'contact/add-or-edit',
        component: ContactAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },
      {
        path: 'contact/add-or-edit/:id',
        component: ContactAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AdminGuard],
      },

      {
        path: 'termsAndCondition',
        component: TermsandconditionsListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'termsAndCondition/add-or-edit',
        component: TermsAndcondtionAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'termsAndCondition/add-or-edit/:id',
        component: TermsAndcondtionAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },

      {
        path: 'additional-contacts',
        component: AdditionalContactListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'additional-contacts/add-or-edit',
        component: AdditionalContactAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'additional-contacts/add-or-edit/:id',
        component: AdditionalContactAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },

      {
        path: 'banks',
        component: BankListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'banks/add-or-edit',
        component: BankAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'banks/add-or-edit/:id',
        component: BankAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },

      {
        path: 'designs',
        component: DesignesComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },

      {
        path: 'invoices',
        component: InvoiceListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'invoices/add-or-edit',
        component: InvoiceAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'invoices/show/:id',
        component: InvoiceShowComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'invoices/showdraft/:id',
        component: ShowdraftComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'invoices/printdraft/:id',
        component: PrintdraftComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'invoices/print/:id',
        component: InvoiceprintComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'invoices/download/:id',
        component: InvoiceDownloadComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'invoices/add-or-edit/:id',
        component: InvoiceAddOrEditComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },

      {
        path: 'invoice-notifications/show/:id',
        component: InvoiceNotificationShowComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'invoice-notifications/download/:id',
        component: InvoiceNotificationDownloadComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'invoice-notifications/add/:id',
        component: InvoiceNotificationAddComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'invoice-notifications/edit/:id',
        component: InvoiceNotificationEditComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },

      {
        path: 'another-systems',
        component: AnotherSystemsComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },

      {
        path: 'renew-payment',
        component: RenewPaymentComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },

      {
        path: 'payments',
        component: PaymentListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },

      {
        path: 'after-payment-success',
        component: AfterPaymentSuccessComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },

      {
        path: 'change-password',
        component: ChangePasswordComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },

      // End Admin Routes

      // Start Accounts Routes
      {
        path: 'chart-of-accounts',
        component: ChartOfAccountsComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'suppliers',
        component: SuppliersComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'journal-entry',
        component: JournalEntryComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'manual-balance-entry',
        component: ManualEntryComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'payment-voucher',
        component: PaymentVoucherComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'receipt-voucher',
        component: ReceiptVoucherComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'reports',
        component: ReportsComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'documents',
        component: DocumentsComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
  path: 'contract-templates',
  component: ContractTemplatesComponent,
  pathMatch: 'full'
}
    ],
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./components/account/account.module').then(
        (mod) => mod.AccountModule
      ),
  },
  { path: 'landpage', component: LandingpageComponent },
  { path: 'PackagePrices', component: PackagePricesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
