import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  ExportInvoicesRequest,
  IInvoice,
  IInvoiceNotification,
  InvoiceNotification,
  InvoiceType,
  ShortOrLong,
} from '../../../../shared/models/invoice';
import { InvoiceService } from '../invoice.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ClientService } from '../../client/client.service';
import { IClient } from '../../../../shared/models/client';
import { environment } from '../../../../../environments/environment';
import { CalculateService } from '../calculate.service';
import { DialogNotificationlistComponent } from '../dialog-notificationlist/dialog-notificationlist.component';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, map } from 'rxjs';
import { AccountService } from 'src/app/components/account/account.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
})
export class InvoiceListComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  elm: HTMLElement;
  invoices: IInvoice[] = [];
  Zipinvoices: IInvoice[] = [];
  clients: IClient[];
  dtOptions = {};
  currentOpenedNotifications: IInvoiceNotification[];
  baseUrl = environment.baseUrl;
  invoiceIdsToExport: number[] = [];
  changeBtn = new BehaviorSubject(false);

  // start table filters
  searchId: number;
  searchDate: Date;
  searchedDate1: Date;
  searchedDate2: Date;
  searchClientId: string;
  searchInvoiceType: InvoiceType;
  searchShortOrLong: ShortOrLong;
  searchTotal: number;
  searchInvoiceFatora: boolean;
  // end table filters
  printid: any;
  currentInvoiceId: number;
  admin: any;
  useremail: any;
  constructor(
    private invoiceService: InvoiceService,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private renderer: Renderer2,
    private accountService: AccountService,
    private router: Router,
    private clientService: ClientService,
    public dialog: MatDialog,
    private calculateService: CalculateService,
    private elem: ElementRef,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.initializeInvoices();
    this.loadClients();
    console.log(this.translate.currentLang);
    this.searchClientId = '';
    this.searchInvoiceType = null;
    this.searchShortOrLong = null;
    this.searchInvoiceFatora = null;
    let admin = this.checkadmin().subscribe((res) => {
      console.log(res);
      this.admin = res;
    });
    console.log('in invoice check invoice');
    console.log(this.admin);
    this.changeBtn.next(false);
  }
  checkadmin() {
    return this.accountService.currentUser$.pipe(
      map((admin) => {
        console.log(admin.email);
        this.useremail=admin.email
        if (admin) {
          console.log('in admin');
          if (admin.roles.includes('Admin')) return true;
         } else {
        }
        return false;
      })
    );
  }
  ngAfterViewInit(): void {
    this.initializeInvoiceButtons();
    // this.initializeInvoiceNotificationModelElement();
  }

  initializeInvoices() {
    this.dtOptions = this.setTableOptions();
  }

  //  getTotal(invoice: IInvoice): number {
  //  if (invoice.invoiceType == 1 && invoice.shortOrLong == 0) {
  //   return invoice.total;
  // } else {
  //    let total = 0;
  //    invoice.invoiceItems.reduce((accumulator, obj) => {
  //     return total += (obj.unitPrice * obj.quantity) + ((obj.tax.taxValue * (obj.unitPrice * obj.quantity)) / 100);
  //   }, 0);

  //   return total;
  //  }
  //  }

  close(): void {
    this.elm.classList.remove('show');
    setTimeout(() => {
      this.elm.style.width = '0';
    }, 75);
  }

  open(invoiceId: number): void {
    // this.currentInvoiceId = invoiceId;
    // this.invoiceService.getInvoiceNotifications(invoiceId).subscribe(notifications => {
    //   this.currentOpenedNotifications = notifications;
    // });
    const dialogRef = this.dialog.open(DialogNotificationlistComponent, {
      width: '600vw',
      height: '800px',
      disableClose: true,
      data: { invoicrId: invoiceId },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result} `);
    });
  }

  downloadbydate() {
    if (this.searchedDate1 != null && this.searchedDate2 != null) {
      this.invoiceService
        .InvoiceZipBydate(this.searchedDate1, this.searchedDate2)
        .subscribe((res: any) => {
          console.log('شاشة');
          console.log(res);
          console.log(res.location);
          this.Zipinvoices = res;
          // this.invoices.forEach(e => {
          //   this.invoiceIdsToExport.push(e.id)
          // });
          console.log('res[location]');
          console.log(this.baseUrl + res.location);
          window.open(this.baseUrl + res.location, '_blank');
          // this.exportSelectedInvoices();
        });
    } else {
      this.toastr.error('ادخل التاريخ');
    }
  }

  removeInvoice(id: number) {
    if (confirm('هل انت متأكد ؟')) {
      this.invoiceService.remove(id).subscribe(() => {
        let invoiceIndex = this.invoices.findIndex((a) => a.id == id);
        this.invoices.splice(invoiceIndex, 1);
        this.toastr.success(this.translate.instant('saveSucess'));
        window.location.reload();
      });
    }
  }

  submitFilter() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  onCheckboxChange(invoiceId: any) {
    const index = this.invoiceIdsToExport.findIndex(
      (num) => num == invoiceId.toString()
    );

    if (index === -1) {
      this.invoiceIdsToExport.push(invoiceId);
    } else {
      this.invoiceIdsToExport.splice(index, 1);
    }
  }

  exportSelectedInvoices(num: number) {
    this.invoiceService
      .ExportInvoicesIds(this.invoiceIdsToExport, num)
      .subscribe((url) => {
        window.open(this.baseUrl + url['location'], '_blank');
      });
  }

  onImportBtnClick() {
    $('#importInput').click();
  }

  onImportChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      this.invoiceService.import(formData).subscribe(
        () => {
          window.location.reload();

          this.toastr.success(this.translate.instant('saveSucess'));
        },
        (err) => {
          console.log(err.error.errorMessage);
          this.toastr.error(this.translate.instant(err.error.errorMessage));
        }
      );
    }
  }
  convertinvoice(invoicetype) {
    console.log('in convert function');
    console.log(invoicetype);
    this.invoiceService.convertInvoice(invoicetype).subscribe((res) => {
      console.log(res);
      location.reload();
    });
  }


  // Exportbydate(num: number) {
  //   console.log(this.searchedDate1);
  //   console.log(this.searchedDate2);
  //   this.invoiceIdsToExport.length = 0;
  //   if (this.searchedDate1 != null && this.searchedDate2 != null) {
  //     this.invoiceService
  //       .InvoiceSerchdate(this.searchedDate1, this.searchedDate2)
  //       .then((res: any) => {
  //         console.log('شاشة');
  //         console.log(res);
  //         this.invoices = res;
  //         this.invoices.forEach((e) => {
  //           this.invoiceIdsToExport.push(e.id);
  //         });
  //         this.exportSelectedInvoices(num); // edite
  //       });
  //   } else {
  //     this.toastr.error('ادخل التاريخ');
  //   }
  // }

exportInvoicesByDateRange(exportType: number) {
  if (!this.searchedDate1 || !this.searchedDate2) {
    this.toastr.error('من فضلك اختر كلا التواريخ.');
    return;
  }

  // تحويل التاريخ إلى صيغة YYYY-MM-DD
  const formatDate = (date: Date): string => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const d1 = formatDate(this.searchedDate1);
  const d2 = formatDate(this.searchedDate2);

  // تجهيز الطلب
  const request: ExportInvoicesRequest = {
    invoicesIds: [], // فارغ، لأننا نستخدم التواريخ
    n: exportType,
    d1,
    d2
  };

  // استدعاء الخدمة
  this.invoiceService.exportInvoices(request).subscribe({
    next: (response: any) => {
      if (response.location) {
        window.open(this.invoiceService.baseUrl + response.location, '_blank');
      } else {
        this.toastr.error('لم يتم استلام الملف.');
      }
    },
    error: (err) => {
      this.toastr.error('فشل التصدير. تأكد من التواريخ.');
    }
  });
}



  
  clearFilter() {
    this.searchedDate1 = null;
    this.searchedDate2 = null;
    this.submitFilter();
  }

  private initializeInvoiceButtons() {
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('data-box')) {
        this.onCheckboxChange(event.target.getAttribute('data-box'));
      }

      if (event.target.hasAttribute('xml-invoice')) {
        this.verifyZatca(event.target.getAttribute('xml-invoice'));
      }

      if (event.target.hasAttribute('notification-invoice')) {
        this.open(event.target.getAttribute('notification-invoice'));
      }

      if (event.target.hasAttribute('edit-link')) {
        this.router.navigate([event.target.getAttribute('edit-link')]);
      }

      if (event.target.hasAttribute('remove-element')) {
        this.removeInvoice(event.target.getAttribute('remove-element'));
      }
      if (event.target.hasAttribute('convert-type')) {
        console.log('inconvert');
        this.convertinvoice(event.target.getAttribute('convert-type'));
      }
    });
  }

  // private initializeInvoiceNotificationModelElement() {
  //   this.elm = this.myModal.nativeElement as HTMLElement;
  // }

  private setTableOptions() {
    if (this.translate.currentLang == 'ar') {
      var langUrl = " '//cdn.datatables.net/plug-ins/1.13.3/i18n/ar.json'";
    } else {
      var langUrl = " '//cdn.datatables.net/plug-ins/1.13.3/i18n/en-GB.json'";
    }

    let lastPage = 0;
    let lastSearchText = '';

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
        lastPage = dataTablesParameters.start; // Note :  dataTablesParameters.start = page count * table length
        lastSearchText = dataTablesParameters.search.value;
        dataTablesParameters.searchId = this.searchId;
        dataTablesParameters.searchDate = this.searchDate;
        dataTablesParameters.searchClientId = this.searchClientId;
        dataTablesParameters.searchInvoiceType = this.searchInvoiceType;
        dataTablesParameters.searchShortOrLong = this.searchShortOrLong;
        dataTablesParameters.searchTotal = this.searchTotal;
        dataTablesParameters.searchInvoiceFatora = this.searchInvoiceFatora;
        if (this.searchedDate1 != null && this.searchedDate2 != null) {
          dataTablesParameters.searchedDate1 = this.searchedDate1;
          dataTablesParameters.searchedDate2 = this.searchedDate2;
        }
        this.invoiceService.getInvoices(dataTablesParameters).then((resp) => {
          this.invoices = resp.data;
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
      scrollX: true,
      lengthMenu: ['5', '10', '20'],
      columns: [
        {
          data: 'id',
          orderable: false,
          render: (data, row, type) => {
            return `<input type="checkbox" data-box="${data}" class="invoiceCheckbox" />`;
          },
        },
        {
          data: 'invoiceNum',
          orderable: false,
          render: (data, row, type) => {
            if (type.isDraft) {
              return `<div class="drafttr">${data}</div>`;
            } else if (type.hasInvoiceNotifications) {
              return `<div class="notificationtr">${data}</div>`;
            } else {
              return data;
            }
          },
        },
        {
          data: 'date',
          orderable: false,
          render: function (data) {
            return new Date(data).toLocaleDateString();
          },
        },
        {
          data: 'client',
          orderable: false,
          render: (data) => {
           if(  data!= null && data.nameAr != null)
          {
          return  data.nameAr.length > 20 ? data.nameAr.slice(0, 20)+'...' : data.nameAr
          }
          else{
                return this.translate.instant('not-found')
          }
          },
        },
        {
          data: 'invoiceType',
          orderable: false,
          render: (data) => {
            if (data == 1) return this.translateService.instant('Invoice Tax');
            else if (data == 2)
              return this.translateService.instant('Simple Invoice');
            else return '';
          },
        },
        
        {
          data: 'total',
         orderable: false,
         render: (data, row, type) => {
           return data;
         },
       },
       {
           data: 'TotalWithVat',
          orderable: false,
          render: (data, row, type) => {
            return this.calculateService
              .getTotalPriceAfterTax(type)
              .toLocaleString();
          },
        },
        {
          data: 'notifications',
          orderable: false,
          render: (data, row, type) => {
            let zatcaBtn = ``;
            this.printid = type.id;

            let buttons =
              zatcaBtn +
              `<a class="btn btn-sm btn-default" notification-invoice="${
                type.id
              }">
                <i class="fa fa-eye" title="${this.translateService.instant(
                  'view notification'
                )}" notification-invoice="${type.id}"></i></a>`;
            buttons += `<a class="btn btn-sm btn-default"  href="/dashboard/invoice-notifications/add/${
              type.id
            }">
                <i class="icon-plus" aria-hidden="true" title="${this.translateService.instant(
                  'add notification'
                )}"></i></a>`;

            return buttons;
          },
        },
        {
          data: 'operations',
          orderable: false,
          render: (data, row, type) => {
            let zatcaBtn = ``;
            this.printid = type.id;
            if (type.isDraft == false){
            if (type.zatcaVerified==true) {
              zatcaBtn = `<button type="button" class="btn btn-sm btn-default">
                            ${this.translateService.instant("zatca verified")}
                            </button>`;
            } else {
              zatcaBtn = `<button type="button" class="btn btn-sm btn-default">
                            ${this.translateService.instant("zatca not verified")}
                        </button>`;
            }
          }
            let buttons = zatcaBtn;
            if (type.isDraft == true) {
              buttons += `<a class="btn btn-sm btn-default" target="_blank" href="/dashboard/invoices/showdraft/${type.id}">
              <i class="fa fa-eye" aria-hidden="true"></i></a>`;
              buttons += `<a class="btn btn-sm btn-default" target="_blank"  href="/dashboard/invoices/printdraft/${type.id}">
              <i class="icon-printer"></i></a>`;
              buttons += `<a class="btn btn-sm btn-default" edit-link="/dashboard/invoices/add-or-edit/${type.id}">
              <i class="icon-pencil" edit-link="/dashboard/invoices/add-or-edit/${type.id}"></i></a>`;
              buttons += `<a class="btn btn-sm btn-danger" edit-link="/dashboard/invoices/add-or-edit/${type.id}">
              <i class="icon-trash" remove-element="${type.id}"></i></a>`;

              buttons += `<a class="btn btn-sm btn-primary" convert-type="${type.id}" title="تحويل لفاتوره"> <i class="fa fa-reply-all" aria-hidden="true" convert-type="${type.id}">
              </i></a>`;
            } else {
              buttons += `<a class="btn btn-sm btn-default" target="_blank" href="/dashboard/invoices/show/${type.id}">
              <i class="fa fa-eye" aria-hidden="true"></i></a>`;
              buttons += `<a class="btn btn-sm btn-default" target="_blank"  href="/dashboard/invoices/print/${type.id}">
              <i class="icon-printer"></i></a>
              <a class="btn btn-sm btn-default" target="_blank"  href="/dashboard/invoices/download/${type.id}">
              <i class="fa fa-download"></i></a>`;
            }

            if (this.admin && type.isDraft == false) {
              buttons += `<a class="btn btn-sm btn-default" edit-link="/dashboard/invoices/add-or-edit/${type.id}">
                <i class="icon-pencil" edit-link="/dashboard/invoices/add-or-edit/${type.id}"></i></a>`;
              buttons += `<a class="btn btn-sm btn-default" edit-link="/dashboard/invoices/add-or-edit/${type.id}">
                       <i class="icon-trash" remove-element="${type.id}"></i></a>`;
            }

            return buttons;
          },
        },
      ],
    };
  }

  print() {
    console.log('in print function');
    localStorage.setItem('print', 'true');
    this.router.navigate([`/dashboard/invoices/show/${this.printid}`]);
  }
  private loadClients() {
    this.clientService.getClientLookups().subscribe((clients) => {
      this.clients = clients;
    });
  }

  private verifyZatca(invoiceId: number) {
    this.invoiceService.verifyZatca(invoiceId).subscribe({
      next: (data) => {
        this.changeBtn.next(true);
        this.toastr.success(this.translateService.instant('saveSucess'));
      },
      error: (err) => {
        this.toastr.error(this.translateService.instant('Not Verified'));
      },
    });
  }
}
