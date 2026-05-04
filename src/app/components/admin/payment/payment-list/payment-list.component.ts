import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { IPayment, IPaymentWithUser } from "../../../../shared/models/payment";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { PaymentService } from "../../after-payment-success/payment.service";
import { CalculateService } from '../../invoice/calculate.service';
import { IInvoice } from 'src/app/shared/models/invoice';
import { AccountService } from 'src/app/components/account/account.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit {
  payments: IPaymentWithUser[] = [];
  paymentInvoices: IInvoice[] = [];
  dtOptions = {};
  dtOptions2 = {};
  printid: any;
  admin: any;


  constructor(private accountService: AccountService,private calculateService:CalculateService,private paymentService: PaymentService, private toastr: ToastrService,
    private translate: TranslateService, private router: Router,
    private renderer: Renderer2) { }

  ngOnInit(): void {
    let admin = this.checkadmin().subscribe((res) => {
      console.log(res);
      this.admin = res;
    });
    this.initializePayments();
    this.initializeInvoices();
  }

  initializePayments() {
    if (this.translate.currentLang == 'ar') {
      var langUrl = " '//cdn.datatables.net/plug-ins/1.13.3/i18n/ar.json'";
    } else {
      var langUrl = " '//cdn.datatables.net/plug-ins/1.13.3/i18n/en-GB.json'";

    }
    let lastPage = 0;
    let lastSearchText = "";
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      displayStart: lastPage, // Last Selected Page
      search: { search: lastSearchText }, // Last Searched Text
      language: {
        url: langUrl,
      },
      processing: true,
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        lastPage = dataTablesParameters.start;  // Note :  dataTablesParameters.start = page count * table length
        lastSearchText = dataTablesParameters.search.value;
        this.paymentService.getPayments(dataTablesParameters).then((resp) => {
          this.payments = resp.data;
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsTotal,
            data: resp.data
          });
        });
      },
      order: [1, 'asc'],
      autoWidth: false,
      ordering: true,
      scrollX: true,
      lengthMenu: ['5', '10', '20'],
      columns: [
        { data: 'id' },
        {
          data: 'amount', render: (data) => {
            return `${data.toLocaleString()} ${this.translate.instant('riyal')}`
          }
        },
        {
          data: 'startAt', render: (data) => {
            return new Date(data).toLocaleDateString()
          }
        },
        {
          data: 'endAt', render: (data) => {
            return new Date(data).toLocaleDateString()
          }
        },
        {
          data: 'invoicesLimit', render: (data) => {
            return `${data.toLocaleString()}`
          }
        },
        { data: 'currentInvoicesLimit' },
        {
          data: 'user', render: data => {
            let fullName = data.firstName + " " + data.lastName;
            return fullName.length > 20 ? fullName.slice(0, 20)+'...' : fullName;
          }
        }
      ],
    };
  }

  initializeInvoices(){
    this.dtOptions2=this.setTableOptions();
  }

  checkadmin() {
    return this.accountService.currentUser$.pipe(
      map(admin => {
        if (admin) {
          console.log("in admin")
          if (admin.roles.includes("Admin")) return true;
        } else {
        }
        return false;
      })
    );
  }

  private setTableOptions() {
    if (this.translate.currentLang == 'ar') {
      var langUrl = " '//cdn.datatables.net/plug-ins/1.13.3/i18n/ar.json'";
    } else {
      var langUrl = " '//cdn.datatables.net/plug-ins/1.13.3/i18n/en-GB.json'";
    }
    let lastPage = 0;
    let lastSearchText = "";
    return {
      pagingType: 'full_numbers',
      pageLength: 10,
      displayStart: lastPage, // Last Selected Page
      search: { search: lastSearchText }, // Last Searched Text
      language: {
        url: langUrl,
      },
      processing: true,
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        lastPage = dataTablesParameters.start;  // Note :  dataTablesParameters.start = page count * table length
        lastSearchText = dataTablesParameters.search.value;
        // dataTablesParameters.searchId = this.searchId;
        // if(this.searchedDate1!=null &&this.searchedDate2!=null ){
        //   dataTablesParameters.searchedDate1=this.searchedDate1
        //   dataTablesParameters.searchedDate2=this.searchedDate2
        // }
        // dataTablesParameters.searchClientId = this.searchClientId;
        // dataTablesParameters.searchInvoiceType = this.searchInvoiceType;

        // dataTablesParameters.searchTotal = this.searchTotal;
        // dataTablesParameters.searchInvoiceFatora = this.searchInvoiceFatora;

        console.log("dataTablesParameters")
        console.log(dataTablesParameters)

        this.paymentService.getPaymentInvoices(dataTablesParameters).then((resp: any) => {
          this.paymentInvoices = resp.data;
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsTotal,
            data: resp.data,
          });
        });
      },
      // order: [1, 'asc'],
      autoWidth: false,
      ordering: true,
      lengthMenu: ['5', '10', '20'],
      columns: [
        { data: 'id' },
        {
          data: 'invoiceNum',  render: (data) => {

              return data;

          }
        },
        {
          data: 'date',  render: function (data) {
            return new Date(data).toLocaleDateString()
          }
        },
        {
          data: 'client',  render: (data) => {
              return data != null ? data.nameAr.length > 20 ? data.nameAr.slice(0, 20)+'...' : data.nameAr : this.translate.instant('not-found')
            }

        },
        {
          data: 'invoiceType', render: (data) => {
            if (data == 1)
              return this.translate.instant('Invoice Tax');
            else if (data == 2)
              return this.translate.instant('Simple Invoice');
            else if (data == 3)
              return this.translate.instant('CreditNote');
            else if (data == 4)
              return this.translate.instant('DebitNote');
            else
              return '';
          }
        },

        {
          data: 'total',render: (data) => {
            return data;
          }
        },

        // {
        //   data: 'notifications', orderable: false, render: (data, row, type) => {
        //     let zatcaBtn = ``;
        //     this.printid=type.id;

        //     let buttons = zatcaBtn +
        //        `<a class="btn btn-sm btn-default" notification-invoice="${type.id}">
        //         <i class="fa fa-eye" title="${this.translateService.instant('view notification')}" notification-invoice="${type.id}"></i></a>`;
        //         buttons += `<a class="btn btn-sm btn-default"  href="/dashboard/invoice-notifications/add/${type.id}">
        //         <i class="icon-plus" aria-hidden="true" title="${this.translateService.instant('add notification')}"></i></a>`;

        //     return buttons;
        //   }
        // },
        {
          data: 'operations', orderable: false, render: (data, row, type) => {
            console.log("type")
            console.log(type)
            let zatcaBtn = ``;
            this.printid = type.id;

            let buttons = zatcaBtn

                buttons += `<a class="btn btn-sm btn-default" target="_blank" href="/dashboard/invoices/show/${type.id}">
              <i class="fa fa-eye" aria-hidden="true"></i></a>`;



              buttons += `<a class="btn btn-sm btn-default" target="_blank"  href="/dashboard/invoices/print/${type.id}">
                <i class="icon-printer"></i></a>`;
              buttons += `<a class="btn btn-sm btn-default" target="_blank"  href="/dashboard/invoices/download/${type.id}">
              <i class="fa fa-download"></i></a>`;


            return buttons;
          }
        }
      ],
    };
  }

  // setTableOptions() {
  //   if (this.translate.currentLang == 'ar') {
  //     var langUrl = " '//cdn.datatables.net/plug-ins/1.13.3/i18n/ar.json'";
  //   } else {
  //     var langUrl = " '//cdn.datatables.net/plug-ins/1.13.3/i18n/en-GB.json'";

  //   }

  //   let lastPage = 0;
  //   let lastSearchText = "";

  //   return {
  //     pagingType: 'full_numbers',
  //     pageLength: 10,
  //     displayStart: lastPage, // Last Selected Page
  //     search: { search: lastSearchText }, // Last Searched Text
  //     language: {
  //       url: langUrl,
  //     },
  //     processing: true,
  //     serverSide: true,
  //     ajax: (dataTablesParameters: any, callback) => {
  //       lastPage = dataTablesParameters.start;  // Note :  dataTablesParameters.start = page count * table length
  //       lastSearchText = dataTablesParameters.search.value;
  //       // dataTablesParameters.searchId = this.searchId;
  //       // dataTablesParameters.searchDate = this.searchDate;
  //       // dataTablesParameters.searchClientId = this.searchClientId;
  //       // dataTablesParameters.searchInvoiceType = this.searchInvoiceType;
  //       // dataTablesParameters.searchShortOrLong = this.searchShortOrLong;
  //       // dataTablesParameters.searchTotal = this.searchTotal;
  //       // dataTablesParameters.searchInvoiceFatora = this.searchInvoiceFatora;
  //       // if (this.searchedDate1 != null && this.searchedDate2 != null) {
  //       //   dataTablesParameters.searchedDate1 = this.searchedDate1
  //       //   dataTablesParameters.searchedDate2 = this.searchedDate2
  //       // }
  //       this.paymentService.getPaymentInvoices(dataTablesParameters).then((resp) => {
  //         this.paymentInvoices = resp.data;
  //         callback({
  //           recordsTotal: resp.recordsTotal,
  //           recordsFiltered: resp.recordsTotal,
  //           data: resp.data
  //         });
  //       });
  //     },
  //     // order: [1, 'asc'],
  //     autoWidth: false,
  //     ordering: true,
  //     scrollX: true,
  //     lengthMenu: ['5', '10', '20'],
  //     columns: [
  //       {
  //         data: 'id', orderable: false, render: (data, row, type) => {
  //           return `<input type="checkbox" data-box="${data}" class="invoiceCheckbox" />`;
  //         }
  //       },
  //       {
  //         data: 'invoiceNum', orderable: false, render: (data, row, type) => {
  //           if (type.isDraft) {
  //             return `<div class="drafttr">${data}</div>`;
  //           } else if (type.hasInvoiceNotifications) {
  //             return `<div class="notificationtr">${data}</div>`;
  //           }
  //           else {
  //             return data;
  //           }
  //         }
  //       },
  //       {
  //         data: 'date', orderable: false, render: function (data) {
  //           return new Date(data).toLocaleDateString()
  //         }
  //       },
  //       {
  //         data: 'client', orderable: false, render: (data) => {
  //           return data != null ? data.nameAr.length > 20 ? data.nameAr.slice(0, 20) + '...' : data.nameAr : this.translate.instant('not-found')
  //         }
  //       },
  //       {
  //         data: 'invoiceType', orderable: false, render: (data) => {
  //           if (data == 1)
  //             return this.translate.instant('Invoice Tax');
  //           else if (data == 2)
  //             return this.translate.instant('Simple Invoice');
  //           else
  //             return '';
  //         }
  //       },
  //       {
  //         data: 'total', orderable: false, render: (data, row, type) => {
  //           return this.calculateService.getTotalPriceAfterTax(type).toLocaleString();
  //         },
  //       },
  //       {
  //         data: 'notifications', orderable: false, render: (data, row, type) => {
  //           let zatcaBtn = ``;
  //           this.printid = type.id;

  //           let buttons = zatcaBtn +
  //             `<a class="btn btn-sm btn-default" notification-invoice="${type.id}">
  //               <i class="fa fa-eye" title="${this.translate.instant('view notification')}" notification-invoice="${type.id}"></i></a>`;
  //           buttons += `<a class="btn btn-sm btn-default"  href="/dashboard/invoice-notifications/add/${type.id}">
  //               <i class="icon-plus" aria-hidden="true" title="${this.translate.instant('add notification')}"></i></a>`;

  //           return buttons;
  //         }
  //       },
  //       {
  //         data: 'operations', orderable: false, render: (data, row, type) => {
  //           let zatcaBtn = ``;
  //           this.printid = type.id;
  //           console.log(type)
  //           if (type.isDraft == false) {
  //             if (!type.zatcaVerified) {
  //               zatcaBtn = `<a id="verf" *ngIf="changeBtn.value === false" class="btn btn-sm btn-default" xml-invoice="${type.id}">
  //                             ${this.translate.instant("zatca verified")}
  //                         </a>`;
  //             } else {
  //               zatcaBtn = `<button *ngIf="changeBtn.value === false" type="button" class="btn btn-sm btn-default">
  //                             ${this.translate.instant("zatca is verified")}
  //                         </button>`;
  //             }

  //           }

  //           let buttons = zatcaBtn
  //           if (type.isDraft == true) {

  //             buttons += `<a class="btn btn-sm btn-default" target="_blank" href="/dashboard/invoices/showdraft/${type.id}">
  //             <i class="fa fa-eye" aria-hidden="true"></i></a>`;
  //             buttons += `<a class="btn btn-sm btn-default" target="_blank"  href="/dashboard/invoices/printdraft/${type.id}">
  //             <i class="icon-printer"></i></a>`;
  //             buttons += `<a class="btn btn-sm btn-default" edit-link="/dashboard/invoices/add-or-edit/${type.id}">
  //             <i class="icon-pencil" edit-link="/dashboard/invoices/add-or-edit/${type.id}"></i></a>`;
  //             buttons += `<a class="btn btn-sm btn-danger" edit-link="/dashboard/invoices/add-or-edit/${type.id}">
  //             <i class="icon-trash" remove-element="${type.id}"></i></a>`

  //             buttons += `<a class="btn btn-sm btn-primary" convert-type="${type.id}" title="تحويل لفاتوره"> <i class="fa fa-reply-all" aria-hidden="true" convert-type="${type.id}">
  //             </i></a>`;

  //           } else {

  //             buttons += `<a class="btn btn-sm btn-default" target="_blank" href="/dashboard/invoices/show/${type.id}">
  //             <i class="fa fa-eye" aria-hidden="true"></i></a>`;
  //             buttons += `<a class="btn btn-sm btn-default" target="_blank"  href="/dashboard/invoices/print/${type.id}">
  //             <i class="icon-printer"></i></a>
  //             <a class="btn btn-sm btn-default" target="_blank"  href="/dashboard/invoices/download/${type.id}">
  //             <i class="fa fa-download"></i></a>`;

  //           }

  //           if (type.isDraft == false) {
  //             buttons += `<a class="btn btn-sm btn-default" edit-link="/dashboard/invoices/add-or-edit/${type.id}">
  //               <i class="icon-pencil" edit-link="/dashboard/invoices/add-or-edit/${type.id}"></i></a>`;
  //             buttons += `<a class="btn btn-sm btn-default" edit-link="/dashboard/invoices/add-or-edit/${type.id}">
  //                      <i class="icon-trash" remove-element="${type.id}"></i></a>`;
  //           }

  //           return buttons;
  //         }
  //       }
  //     ],
  //   };
  // }

}
