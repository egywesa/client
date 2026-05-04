import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from '../company/company.service';
import { DataTableDirective } from 'angular-datatables';
import { ICompany } from 'src/app/shared/models/company';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-companies-reports',
  templateUrl: './companies-reports.component.html',
  styleUrls: ['./companies-reports.component.scss']
})
export class CompaniesReportsComponent implements OnInit {
  searchstatus:any
  dtOptions = {};
  dtOptionsreport = {};

  companies: ICompany[] = [];
  companylisttoexport:ICompany[] = [];
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  datatableElementexport: DataTableDirective;

  companiesIdsToExport: number[] = [];
  baseUrl = environment.baseUrl;
  constructor(private companyService: CompanyService, private toastr: ToastrService,
    private translate: TranslateService, private renderer: Renderer2,
    private router: Router) { }
  ngOnInit(): void {
    this.searchstatus=4;
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
        dataTablesParameters.StaicsType = this.searchstatus;
        this.companyService.getCompaniesreports(dataTablesParameters).then((resp) => {
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
        { data: 'commercialRegNumber' },
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

  initializeCompaniesexport() {
 let value={
staictype:this.searchstatus,
skip:-1,
pagesize:-1
 }
 console.log(value)
        this.companyService.getCompaniesreportsexport(value).then((resp) => {
          this.companylisttoexport = resp.data;
          console.log('in export list ')
          console.log(resp)
          console.log('export company');
          console.log(this.companylisttoexport)
          if(this.companylisttoexport.length!=0){
             this.companylisttoexport.forEach(e => {
            this.companiesIdsToExport.push(e.id)
          });
          this.companyService.exportcompanyreport(this.companiesIdsToExport).subscribe(url => {
            this.companylisttoexport=[]
            window.open(this.baseUrl + url['location'], "_blank");
          });
          }
        });
      }


  submitFilter(){
    this.initializeCompanies();
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    
    });
  }

  exportcompanies(){
    this.initializeCompaniesexport()

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
