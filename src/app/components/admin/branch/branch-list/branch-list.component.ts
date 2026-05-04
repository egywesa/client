import { Component, OnInit, Renderer2 } from '@angular/core';
import { IBranch } from "../../../../shared/models/branch";
import { BranchService } from "../branch.service";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { AccountService } from 'src/app/components/account/account.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnInit {
  branches: IBranch[] = [];
  dtOptions = {};
  admin: any;
  constructor(private branchService: BranchService, private toastr: ToastrService,
    private translate: TranslateService, private renderer: Renderer2,
    private router: Router,private accountService: AccountService) { }

  ngOnInit(): void {
    this.initializeBranches();
    let admin = this.checkadmin().subscribe((res) => {
      console.log(res);
      this.admin = res;
    });
  }

  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute("edit-link")) {
        this.router.navigate([event.target.getAttribute("edit-link")]);
      }

      if (event.target.hasAttribute("remove-element")) {
        this.removeBranch(event.target.getAttribute("remove-element"));
      }

    });
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

  initializeBranches() {
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
        this.branchService.getBranches(dataTablesParameters).then((resp) => {
          this.branches = resp.data;
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
        { data: 'branchId' },
        { data: 'branchName', render: function (data) {
            return data?.length > 20 ? data.slice(0, 20)+'...' : data;
          } },
        { data: 'address', render: function (data) {
            return data?.length > 20 ? data.slice(0, 20)+'...' : data;
          } },
        {
          data: 'companyName', render: (data) => {
            return data != null ? data?.length > 20 ? data.slice(0, 20)+'...' : data : this.translate.instant('not exists');
          }
        },
        {
          data: 'branchId',
          render: (data) => {
            let buttons = '';
            buttons += `<a class="btn btn-sm btn-outline-dark" edit-link="/dashboard/branches/add-or-edit/${data}">
          ${this.translate.instant('edit')}</a>
      <a class="btn btn-sm btn-outline-danger" remove-element="${data}">
          ${this.translate.instant('remove')}</a>`;

            // if (this.admin == false) {
            //   buttons += `<a class="btn btn-sm mr-1 btn-outline-info" href="/dashboard/zatac/${data}">
            // ${this.translate.instant('zatacsetting')}</a>`;
            // }
            return buttons
          },

        },

      ],
    };
  }

  removeBranch(id: number) {
    this.branchService.remove(id).subscribe(() => {
      this.router.navigateByUrl('/dashboard', { skipLocationChange: true }).then(() => {
        this.router.navigate([`/dashboard/branches`]);
      });
      this.toastr.success(this.translate.instant('saveSucess'));
    });
  }
}
