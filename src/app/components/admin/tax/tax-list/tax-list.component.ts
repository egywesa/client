import { Component, OnInit } from '@angular/core';
import { ITax } from "../../../../shared/models/tax";
import { TaxService } from "../tax.service";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-tax-list',
  templateUrl: './tax-list.component.html',
  styleUrls: ['./tax-list.component.scss']
})
export class TaxListComponent implements OnInit {
  taxes: ITax[] = [];
  dtOptions = {};

  constructor(private taxService: TaxService, private toastr: ToastrService, private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.initializeTaxes();
  }

  initializeTaxes() {

    this.taxService.getTaxes().subscribe(taxes => {
      console.log('in tax')
      this.taxes = taxes
    });

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
      order: [1, 'asc'],
      autoWidth: false,
      ordering: true,
      scrollX: true,
      lengthMenu: ['5', '10', '20'],
    };
  }

  removeTax(id: number) {
    if (confirm("هل انت متأكد ؟")) {
      this.taxService.remove(id).subscribe(() => {
        let taxIndex = this.taxes.findIndex(a => a.id == id);
        this.taxes.splice(taxIndex, 1);
        this.toastr.success(this.translate.instant('saveSucess'));
      })
    }
  }
}
