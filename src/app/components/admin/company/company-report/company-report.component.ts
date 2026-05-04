import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from '../company.service';
import { ICompany, ICompanyToShow } from 'src/app/shared/models/company';
import { environment } from 'src/environments/environment';
import { IClient } from 'src/app/shared/models/client';
import { ExportInvoicesRequest, IInvoice, InvoiceType, ShortOrLong } from 'src/app/shared/models/invoice';
import { CalculateService } from '../../invoice/calculate.service';
import { DataTableDirective } from 'angular-datatables';
import { ClientService } from '../../client/client.service';
import { InvoiceService } from '../../invoice/invoice.service';
import { PriceService } from '../../price/price.service';
import { IPrice } from 'src/app/shared/models/price';

@Component({
  selector: 'app-company-report',
  templateUrl: './company-report.component.html',
  styleUrls: ['./company-report.component.scss']
})
export class CompanyReportComponent implements OnInit {
  company: ICompanyToShow;
  baseUrl = environment.baseUrl;
  dtOptions = {};
  dtOptionspayment = {}
  invoices: IInvoice[] = [];
  clients: IClient[];
  printid: any;
  currentInvoiceId: number;
  admin: any;
  startAt: any;
  endAt: any;
  rest: any;
  
  // filte invoices
  searchId: number;
  searchDate: Date;
  searchedDate1:Date;
  searchedDate2:Date;
  searchClientId: string;
  searchInvoiceType: InvoiceType;
  invoiceIdsToExport: number[] = [];

  searchTotal: number;
  searchInvoiceFatora: boolean;
  prices: IPrice[] = [];

  constructor(private companyService: CompanyService, private toastr: ToastrService,
    private translate: TranslateService, private renderer: Renderer2, private activatedRoute: ActivatedRoute,
    private router: Router, private clientService: ClientService, private priceService: PriceService, private invoiceService: InvoiceService, private translateService: TranslateService, private calculateService: CalculateService) { }
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  ngOnInit(): void {
    this.searchClientId = '';
    this.searchInvoiceType = null;

    this.searchInvoiceFatora = null
    this.initializePayments()
    this.dtOptions = this.setTableOptions();
    this.loadClients();
    this.getcompanyReport();
    this.initializePrices();
    this.getInvoicesStatics();
  }

  getcompanyReport() {
    this.companyService.getCompanyReport(+this.activatedRoute.snapshot.paramMap.get('id')).subscribe((resp: any) => {
      this.company = resp;
      console.log(resp)
      console.log('in repost company')
      console.log(this.company)

    });
  }

  initializePayments() {
    if (this.translate.currentLang == 'ar') {
      var langUrl = " '//cdn.datatables.net/plug-ins/1.13.3/i18n/ar.json'";
    } else {
      var langUrl = " '//cdn.datatables.net/plug-ins/1.13.3/i18n/en-GB.json'";

    }
    let lastPage = 0;
    let lastSearchText = "";
    this.dtOptionspayment = {
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
        this.companyService.getCompanypayments(dataTablesParameters, +this.activatedRoute.snapshot.paramMap.get('id')).then((resp: any) => {
          console.log('get payment')
          console.log(resp)
          if (resp.data.result.length != 0) {
            this.startAt = new Date(resp.data.result[0].startAt).toLocaleDateString();
            this.endAt = new Date(resp.data.result[0].endAt).toLocaleDateString();
            this.rest = resp.data.result[0].invoicesLimit - resp.data.result[0].currentInvoicesLimit;
        

          }
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsTotal,
            data: resp.data.result
          });
        });
      },
      order: [1, 'asc'],
      autoWidth: false,
      ordering: true,
      scrollX: true,
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
          data: 'pricePlan', render: (data) => {
            return `${data.toLocaleString()}`
          }
        },
        
        {
          data: 'user', render: data => {
            return data.firstName + " " + data.lastName
          }
        }
      ],
    };
  }
  ngAfterViewInit(): void {
    this.initializeInvoiceButtons();

  }
  private verifyZatca(invoiceId: number) {
    this.invoiceService.verifyZatca(invoiceId).subscribe(xml => {

    });
  }

  Exportbydate() {
    console.log(this.searchedDate1);
    console.log(this.searchedDate2);
    this.invoiceIdsToExport.length = 0;
    if (this.searchedDate1 != null && this.searchedDate2 != null) {
      this.invoiceService.InvoiceSerchdateForCompany(this.searchedDate1, this.searchedDate2, +this.activatedRoute.snapshot.paramMap.get('id')).subscribe((res: any) => {
        console.log("شاشة")
        console.log(res)
        this.invoices = res
        this.invoices.forEach(e => {
          this.invoiceIdsToExport.push(e.id)
        });
        this.exportSelectedInvoices(1); //edite
      })
    }
    else {
      this.toastr.error("ادخل التاريخ")
    }

  }

  Exportbydate2() {
    console.log(this.searchedDate1);
    console.log(this.searchedDate2);
    this.invoiceIdsToExport.length = 0;
    if (this.searchedDate1 != null && this.searchedDate2 != null) {
      this.invoiceService.InvoiceSerchdateForCompany(this.searchedDate1, this.searchedDate2, +this.activatedRoute.snapshot.paramMap.get('id')).subscribe((res: any) => {
        console.log("شاشة")
        console.log(res)
        this.invoices = res
        this.invoices.forEach(e => {
          this.invoiceIdsToExport.push(e.id)
        });
        this.exportSelectedInvoices(0); //edite
      })
    }
    else {
      this.toastr.error("ادخل التاريخ")
    }

  }
  downloadbydate(){
    if (this.searchedDate1 != null && this.searchedDate2 != null) {
      this.invoiceService.InvoicedownloaddateForCompany(this.searchedDate1, this.searchedDate2, +this.activatedRoute.snapshot.paramMap.get('id')).subscribe((res: any) => {
        console.log("شاشة")
        console.log(res)
        console.log(res.location)
        this.invoices = res
        // this.invoices.forEach(e => {
        //   this.invoiceIdsToExport.push(e.id)
        // });
        console.log("res[location]");
        console.log(this.baseUrl + res.location);
        window.open(this.baseUrl + res.location, "_blank");
        // this.exportSelectedInvoices();
      })
    }
    else {
      this.toastr.error("ادخل التاريخ")
    }
  }



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


  
  exportSelectedInvoices(num :number) {
    this.invoiceService.ExportInvoicesIds(this.invoiceIdsToExport, num).subscribe(url => {
      window.open(this.baseUrl + url['location'], "_blank");
    });
  }

  clearFilter() {
    this.searchedDate1 = null;
    this.searchedDate2 = null;
    this.submitFilter();
  }

  private initializeInvoiceButtons() {
    this.renderer.listen('document', 'click', (event) => {

      if (event.target.hasAttribute("xml-invoice")) {
        this.verifyZatca(event.target.getAttribute("xml-invoice"));
      }
      if (event.target.hasAttribute("remove-element")) {
        this.removeInvoice(event.target.getAttribute("remove-element"));
      }
      if (event.target.hasAttribute("remove-notificationelement")) {
        this.removeNotificationInvoice(event.target.getAttribute("remove-notificationelement"));
      }
      if (event.target.hasAttribute("edit-link")) {
        this.router.navigate([event.target.getAttribute("edit-link")]);
      }



    });
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
        dataTablesParameters.searchId = this.searchId;
        if(this.searchedDate1!=null &&this.searchedDate2!=null ){
          dataTablesParameters.searchedDate1=this.searchedDate1
          dataTablesParameters.searchedDate2=this.searchedDate2
        }
        dataTablesParameters.searchClientId = this.searchClientId;
        dataTablesParameters.searchInvoiceType = this.searchInvoiceType;

        dataTablesParameters.searchTotal = this.searchTotal;
        dataTablesParameters.searchInvoiceFatora = this.searchInvoiceFatora;

        console.log("dataTablesParameters")
        console.log(dataTablesParameters)

        this.companyService.getCompanyInvoices(dataTablesParameters, +this.activatedRoute.snapshot.paramMap.get('id')).then((resp: any) => {
          this.invoices = resp.result;
          console.log(this.invoices)
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsTotal,
            data: resp.result
          });
        });
      },
      // order: [1, 'asc'],
      autoWidth: false,
      ordering: true,
      lengthMenu: ['5', '10', '20'],
      columns: [
        {
          data: 'id', orderable: false, render: (data, row, type) => {
            return `<input type="checkbox" data-box="${data}" class="invoiceCheckbox" />`;
          }
        },
        {
          data: 'invoiceNum', orderable: false, render: (data, row, type) => {
            if (type.isDraft) {
              return `<div class="drafttr">${data}</div>`;
            } else if (type.hasInvoiceNotifications) {
              return `<div class="notificationtr">${data}</div>`;
            }
            else {
              return data;
            }
          }
        },
        {
          data: 'date', orderable: false, render: function (data) {
            return new Date(data).toLocaleDateString()
          }
        },
        {
          data: 'client', orderable: false, render: (data) => {
              return data != null ? data.nameAr.length > 20 ? data.nameAr.slice(0, 20)+'...' : data.nameAr : this.translateService.instant('not-found')
            }

        },
        {
          data: 'invoiceType', orderable: false, render: (data) => {
            if (data == 1)
              return this.translateService.instant('Invoice Tax');
            else if (data == 2)
              return this.translateService.instant('Simple Invoice');
            else if (data == 3)
              return this.translateService.instant('CreditNote');
            else if (data == 4)
              return this.translateService.instant('DebitNote');
            else
              return '';
          }
        },

        {
          data: 'total', orderable: false, render: (data, row, type) => {
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
            let buttons = zatcaBtn
            if (type.isDraft == true) {
              buttons += `<a class="btn btn-sm btn-default" target="_blank" href="/dashboard/invoices/showdraft/${type.id}">
              <i class="fa fa-eye" aria-hidden="true"></i></a>`;
            } else {
              if (type.invoiceType == 3 || type.invoiceType == 4) {
                buttons += `<a class="btn btn-sm btn-default" target="_blank" href="/dashboard/invoice-notifications/show/${type.id}">
                        <i class="fa fa-eye" title="${this.translateService.instant('view notification')}" notification-invoice="${type.id}"></i></a>`;


              }
              
              
             
            }

            if (type.invoiceType == 1 || type.invoiceType == 2 ) {

              buttons += `<a class="btn btn-sm btn-default" edit-link="/dashboard/invoices/add-or-edit/${type.id}">
                <i class="icon-pencil" edit-link="/dashboard/invoices/add-or-edit/${type.id}"></i></a>`;

           

            }
            if (type.isDraft == true) {
              buttons += `<a class="btn btn-sm btn-default" target="_blank"  href="/dashboard/invoices/printdraft/${type.id}">
                <i class="icon-printer"></i></a>`;
            }

            if(!type.isDraft){
              if (type.invoiceType == 3 || type.invoiceType == 4) {
                buttons += `<a class="btn btn-sm btn-default" target="_blank" href="/dashboard/invoice-notifications/download/${type.id}">
                <i class="icon-printer"></i></a>`;
              } else {
                buttons += `<a class="btn btn-sm btn-default" target="_blank"  href="/dashboard/invoices/print/${type.id}">
                <i class="icon-printer"></i></a>`;
              }
            }
            if (type.invoiceType == 3 || type.invoiceType == 4) {
              buttons += `<a class="btn btn-sm btn-default" edit-link="/dashboard/invoices/add-or-edit/${type.id}">
              <i class="icon-trash" remove-notificationelement="${type.id}"></i></a>`;
              buttons += `<a class="btn btn-sm btn-default" edit-link="/dashboard/invoice-notifications/edit/${type.id}">
              <i class="icon-pencil" edit-link="/dashboard/invoice-notifications/edit/${type.id}"></i></a>`;
            }
            else {
              buttons += `<a class="btn btn-sm btn-default" edit-link="/dashboard/invoices/add-or-edit/${type.id}">
            <i class="icon-trash" remove-element="${type.id}"></i></a>`;

            }

            //   buttons += `<a class="btn btn-sm btn-default" edit-link="/dashboard/invoices/add-or-edit/${type.id}">
            //     <i class="icon-pencil" edit-link="/dashboard/invoices/add-or-edit/${type.id}"></i></a>`;
            // }

            return buttons;
          }
        }
      ],
    };
  }
  submitFilter() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  private loadClients() {
    this.clientService.getClientLookups().subscribe(clients => {
      this.clients = clients;
    });
  }

  private initializePrices() {
    this.priceService.getPrices().subscribe(prices => {
      console.log(prices)
      this.prices = prices
    });
  }
  subscribe(id: any, isyearly: boolean) {

    console.log(id, isyearly)
    this.companyService.newsubscrip(id, isyearly, +this.activatedRoute.snapshot.paramMap.get('id')).subscribe((res: any) => {
      console.log(res)
      this.toastr.success(this.translate.instant('success subscrip'))
    })
  }
  statiscmontly = []
  getInvoicesStatics() {
    this.companyService.getInvoicesStatics(+this.activatedRoute.snapshot.paramMap.get('id')).subscribe((res: any) => {
      console.log('in invoice statics')
      console.log(res)
      this.statiscmontly = res;
    })
  }
  removeInvoice(id: number) {
    if (confirm("هل انت متأكد ؟")) {
      this.invoiceService.remove(id).subscribe(() => {
        let invoiceIndex = this.invoices.findIndex(a => a.id == id);
        this.invoices.splice(invoiceIndex, 1);
        this.toastr.success(this.translate.instant('saveSucess'));
        window.location.reload();
      })
    }
  }
  removeNotificationInvoice(id: number) {
    if (confirm("هل انت متأكد ؟")) {
      this.invoiceService.removeInvoiceWithNotification(id).subscribe(() => {
        let invoiceIndex = this.invoices.findIndex(a => a.id == id);
        this.invoices.splice(invoiceIndex, 1);
        this.toastr.success(this.translate.instant('saveSucess'));
        window.location.reload();
      })
    }
  }
}
