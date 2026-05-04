import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { IBank } from '../../../../shared/models/bank';
import { BankService } from '../bank.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-bank-list',
  templateUrl: './bank-list.component.html',
  styleUrls: ['./bank-list.component.scss'],
})
export class BankListComponent implements OnInit, AfterViewInit {
  banks: IBank[] = [];
  dtOptions = {};

  constructor(
    private bankService: BankService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.initializeBanks();
  }

  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('edit-link')) {
        this.router.navigate([event.target.getAttribute('edit-link')]);
      }

      if (event.target.hasAttribute('remove-element')) {
        this.removeBank(event.target.getAttribute('remove-element'));
      }
    });
  }

  initializeBanks() {
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
      displayStart: lastPage, // Last Selected Page
      search: { search: lastSearchText }, // Last Searched Text
      processing: true,
      serverSide: true,
      language: {
        url: langUrl,
      },
      ajax: (dataTablesParameters: any, callback) => {
        lastPage = dataTablesParameters.start; // Note :  dataTablesParameters.start = page count * table length
        lastSearchText = dataTablesParameters.search.value;
        this.bankService.getBanks(dataTablesParameters).then((resp) => {
          this.banks = resp.data;
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
          data: 'bankName',
          render: function (data) {
            if (data != null) {
              return data.length > 20 ? data.slice(0, 20) + '...' : data;
            } else {
              return data;
            }
          },
        },
        {
          data: 'bankAccountName',
          render: function (data) {
            if (data != null) {
              return data.length > 20 ? data.slice(0, 20) + '...' : data;
            } else {
              return data;
            }
          },
        },
        {
          data: 'accountNumber',
          render: function (data) {
            if (data) {
              return data;
            } else {
              return '';
            }
          },
        },
        {
          data: 'ibanNumber',
          render: function (data) {
            if (data) {
              return data;
            } else {
              return '';
            }
          },
        },
        {
          data: 'swift',
          render: function (data) {
            if (data) {
              return data;
            } else {
              return '';
            }
          },
        },
        {
          data: 'currency',
          render: function (data) {
            if (data) {
              return data;
            } else {
              return '';
            }
          },
        },
        {
          data: 'id',
          render: (data) => {
            return `<a class="btn btn-sm btn-outline-dark" edit-link="/dashboard/banks/add-or-edit/${data}">
                        ${this.translate.instant('edit')}</a>
                    <a class="btn btn-sm btn-outline-danger" remove-element="${data}">
                        ${this.translate.instant('remove')}</a>`;
          },
        },
      ],
    };
  }

  removeBank(id: number) {
    this.bankService.remove(id).subscribe(() => {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          this.router.navigate([`/dashboard/banks`]);
        });
      this.toastr.success(this.translate.instant('saveSucess'));
    });
  }
}
