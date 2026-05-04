import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ICompany } from "../../../../shared/models/company";
import { CompanyService } from "../company.service";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "../../../../../environments/environment";
import { DataTableDirective } from 'angular-datatables';
import { process } from "@progress/kendo-data-query";
import { DataBindingDirective, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
  companies: ICompany[] = [];
  baseUrl = environment.baseUrl;
  dtOptions = {};
  searchname:any;
  searchEmail:any;
  searchPhoneNumber:any;
  searchVat:any;
  searchId:any;
  public pageSize = 10;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  public gridData: unknown[] = this.companies;
  public gridView!: unknown[] ;
  skip=0;
  public mySelection: string[] = [];


  // public onFilter(input: Event): void {
  //   const inputValue = (input.target as HTMLInputElement).value;
  //   console.log(inputValue)
  //   this.gridView = process(this.gridData, {
  //     filter: {
  //       logic: "or",
  //       filters: [
  //         {
  //           field: "full_name",
  //           operator: "contains",
  //           value: inputValue,
  //         },
  //         {
  //           field: "job_title",
  //           operator: "contains",
  //           value: inputValue,
  //         },
  //         {
  //           field: "budget",
  //           operator: "contains",
  //           value: inputValue,
  //         },
  //         {
  //           field: "phone",
  //           operator: "contains",
  //           value: inputValue,
  //         },
  //         {
  //           field: "address",
  //           operator: "contains",
  //           value: inputValue,
  //         },
  //       ],
  //     },
  //   }).data;
  //   console.log(this.dataBinding)

  //   this.dataBinding.skip = 0;
  //   this.dataBinding.pageSize=4;
  //  console.log(this.dataBinding.data);
  // }
  constructor(private companyService: CompanyService, private toastr: ToastrService,
    private translate: TranslateService, private renderer: Renderer2,
    private router: Router) { }

  ngOnInit(): void {
    this.initializeCompanies();
  }

  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute("edit-link")) {
        this.router.navigate([event.target.getAttribute("edit-link")]);

      }

      if (event.target.hasAttribute("remove-element")) {
        this.removeCompany(event.target.getAttribute("remove-element"));
      }
    });
  }

  // initialCompanies(){
  //   this.companyService.getCompanysgridtable().subscribe((resp:any) => {
  //     console.log(resp)
  //     this.companies = resp.data;
  //     console.log('in end function')
  //     console.log(this.companies)
  //     this.gridData=this.companies;
  //     this.gridView = this.gridData
  //   });
  // }
  // public pageChange(event: PageChangeEvent): void {

  //   this.initialCompanies();
  // }

  initializeCompanies() {
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
      language: {
        url: langUrl,
      },
      displayStart: lastPage, // Last Selected Page
      search: { search: lastSearchText }, // Last Searched Text
      processing: true,
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        lastPage = dataTablesParameters.start;  // Note :  dataTablesParameters.start = page count * table length
        lastSearchText = dataTablesParameters.search.value;
        dataTablesParameters.searchedCompanyName = this.searchname;
        dataTablesParameters.searchEmail = this.searchEmail;
        dataTablesParameters.searchPhoneNumber = this.searchPhoneNumber;
        dataTablesParameters.searchVat = this.searchVat;
        dataTablesParameters.searchId = this.searchId;

        this.companyService.getCompanies(dataTablesParameters).then((resp) => {
          this.companies = resp.data;

          console.log(resp)
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsTotal,
            data: resp.data
          });
        });
      },
      // order: [1, 'asc'],
      autoWidth: false,
      ordering: true,
      scrollX: true,
      lengthMenu: ['5', '10', '20'],
      columns: [
        { data: 'id' },
        { data: 'companyName' },
        { data: 'activityName' },
        { data: 'phoneNumber'},
        { data: 'email' },
        {data: 'createdDate', orderable: false, render: function (data) {
          return new Date(data).toLocaleDateString()
        }},
        { data: 'vat' },
        {
          data: 'id', render: (data) => {
            return `<a class="btn btn-sm btn-outline-dark" href="/dashboard/company/report/${data}">
                    <i class="fa fa-eye" aria-hidden="true"></i></a>
            <a class="btn btn-sm btn-outline-dark" edit-link="/dashboard/companies/add-or-edit/${data}">
                        ${this.translate.instant('edit')}</a>
                    <a class="btn btn-sm btn-outline-danger" remove-element="${data}">
                        ${this.translate.instant('remove')}</a>`;
          }
        }
      ],
    };
  }

  submitFilter(){
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }
  removeCompany(id: number) {
    if (confirm("هل انت متأكد ؟")) {
      this.companyService.remove(id).subscribe(() => {
        let companyIndex = this.companies.findIndex(a => a.id == id);
        this.companies.splice(companyIndex, 1);
        this.toastr.success(this.translate.instant('saveSucess'));
      })
    }
  }
}


