import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { IClient } from '../../../../shared/models/client';
import { ClientService } from '../client.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss'],
})
export class ClientListComponent implements OnInit {
  clients: IClient[] = [];
  dtOptions = {};
  baseUrl = environment.baseUrl;
  clientIdsToExport: number[] = [];
  searchedDate1: Date;
  searchedDate2: Date;
  searchEnum: any;
  searchemail: any;
  searchphone: any;
  searchname: any;
  searchAdministratorName: any;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  constructor(
    private clientService: ClientService,
    private toastr: ToastrService,
    private router: Router,
    private renderer: Renderer2,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.initializeClients();
  }

  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('edit-link')) {
        this.router.navigate([event.target.getAttribute('edit-link')]);
      }

      if (event.target.hasAttribute('remove-element')) {
        this.removeClient(event.target.getAttribute('remove-element'));
      }
    });
  }

  initializeClients() {
    if (this.translate.currentLang == 'ar') {
      var langUrl = " '//cdn.datatables.net/plug-ins/1.13.3/i18n/ar.json'";
    } else {
      var langUrl = " '//cdn.datatables.net/plug-ins/1.13.3/i18n/en-GB.json'";
    }
    let lastPage = 0;
    let lastSearchText = '';
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      language: {
        url: langUrl,
      },
      displayStart: lastPage, // Last Selected Page
      search: { search: lastSearchText }, // Last Searched Text

      processing: true,
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        lastPage = dataTablesParameters.start; // Note :  dataTablesParameters.start = page count * table length
        lastSearchText = dataTablesParameters.search.value;
        dataTablesParameters.searchAdministratorName =
          this.searchAdministratorName;
        dataTablesParameters.searchEmail = this.searchemail;
        dataTablesParameters.searchEnum = this.searchEnum;
        dataTablesParameters.searchedName = this.searchname;
        dataTablesParameters.searchPhone = this.searchphone;
        if (this.searchedDate1 != null && this.searchedDate2 != null) {
          dataTablesParameters.searchedDate1 = this.searchedDate1;
          dataTablesParameters.searchedDate2 = this.searchedDate2;
        }
        this.clientService.getClients(dataTablesParameters).then((resp) => {
          this.clients = resp.data;
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsTotal,
            data: resp.data,
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
          data: 'name',
          render: function (data) {
            return data?.length > 20 ? data.slice(0, 20) + '...' : data;
          },
        },
        {
          data: 'address',
          render: function (data) {
            return data?.length > 20 ? data.slice(0, 20) + '...' : data;
          },
        },
        {
          data: 'phone',
          render: function (data) {
            if (data) {
              return data;
            } else {
              return '';
            }
          },
        },
        {
          data: 'administratorName',
          defaultContent: '',
          render: function (data, type, row: any) {
            const value = data || row.administratorNameAr || row.administratorNameEn || '';
            return value?.length > 20 ? value.slice(0, 20) + '...' : value;
          },
        },
        { data: 'clientNum' },
        {
          data: 'email',
          render: function (data) {
            if (data) {
              return data;
            } else {
              return '';
            }
          },
        },
        {
          data: 'createdDate',
          orderable: false,
          render: function (data) {
            return new Date(data).toLocaleDateString();
          },
        },
        {
          data: 'id',
          render: (data) => {
            return `<a class="btn btn-sm btn-outline-dark" edit-link="/dashboard/clients/add-or-edit/${data}">
                        ${this.translate.instant('edit')}</a>
                    <a class="btn btn-sm btn-outline-danger" remove-element="${data}">
                        ${this.translate.instant('remove')}</a>`;
          },
        },
      ],
    };
  }

  removeClient(id: number) {
    this.clientService.remove(id).subscribe(() => {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          this.router.navigate([`/dashboard/clients`]);
        });
      this.toastr.success(this.translate.instant('saveSucess'));
    });
  }

  exportSelectedClient() {
    this.clientService.exportclient(this.clientIdsToExport).subscribe((url) => {
      window.open(this.baseUrl + url['location'], '_blank');
    });
  }
  Exportbydate() {
    console.log(this.searchedDate1);
    console.log(this.searchedDate2);
    this.clientIdsToExport.length = 0;

    this.clientService
      .ClientSerchdate(this.searchedDate1, this.searchedDate2)
      .then((res: any) => {
        console.log('شاشة');
        console.log(res);
        window.open(this.baseUrl + res['location'], '_blank');
        // this.clients.forEach(e => {
        //   this.clientIdsToExport.push(e.id)
        // });
        // this.exportSelectedClient();
      });
  }
  clearFilter() {
    this.searchedDate1 = null;
    this.searchedDate2 = null;
    this.submitFilter();
  }
  submitFilter() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }
}