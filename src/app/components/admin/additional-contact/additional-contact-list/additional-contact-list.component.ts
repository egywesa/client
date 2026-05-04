import { Component, OnInit, Renderer2 } from '@angular/core';
import { IAdditionalContact } from "../../../../shared/models/additional-contact";
import { AdditionalContactService } from "../additional-contact.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";

@Component({
  selector: 'app-additional-contact-list',
  templateUrl: './additional-contact-list.component.html',
  styleUrls: ['./additional-contact-list.component.scss']
})
export class AdditionalContactListComponent implements OnInit {
  additionalContacts: IAdditionalContact[] = [];
  dtOptions = {};

  constructor(private additionalContactService: AdditionalContactService,
    private toastr: ToastrService, private translate: TranslateService,
    private router: Router, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.initializeAdditionalContacts();
  }

  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute("edit-link")) {
        this.router.navigate([event.target.getAttribute("edit-link")]);
      }

      if (event.target.hasAttribute("remove-element")) {
        this.removeAdditionalContact(event.target.getAttribute("remove-element"));
      }
    });
  }

  initializeAdditionalContacts() {
    // this.additionalContactService.getAdditionalContacts().subscribe(additionalContacts => {
    //   this.additionalContacts = additionalContacts
    // });
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
      serverSide: true,
      processing: true,
      language: {
        url: langUrl,
      },
      ajax: (dataTablesParameters: any, callback) => {
        lastPage = dataTablesParameters.start;  // Note :  dataTablesParameters.start = page count * table length
        lastSearchText = dataTablesParameters.search.value;
        this.additionalContactService.getAdditionalContacts(dataTablesParameters).then((resp) => {
          this.additionalContacts = resp.data;
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
         { data: 'name'}// render: function (data) {
        //     return data.length > 20 ? data.slice(0, 20)+'...' : data;
         // } }
         ,
        { data: 'title', render: function (data) {
            return data.length > 20 ? data.slice(0, 20)+'...' : data;
          } },
        { data: 'phone' },
        { data: 'email' },
        // { data: 'facebook' },
        // { data: 'twitter' },
        // { data: 'linkedin' },
        {
          data: 'id', render: (data) => {
            return `<a class="btn btn-sm btn-outline-dark" edit-link="/dashboard/additional-contacts/add-or-edit/${data}">
                        ${this.translate.instant('edit')}</a>
                    <a class="btn btn-sm btn-outline-danger" remove-element="${data}">
                        ${this.translate.instant('remove')}</a>`;
          }
        }
      ],
    };
  }

  removeAdditionalContact(id: number) {
    this.additionalContactService.remove(id).subscribe(() => {
      this.router.navigateByUrl('/dashboard', { skipLocationChange: true }).then(() => {
        this.router.navigate([`/dashboard/additional-contacts`]);
      });
      this.toastr.success(this.translate.instant('saveSucess'));
    });
  }
}
