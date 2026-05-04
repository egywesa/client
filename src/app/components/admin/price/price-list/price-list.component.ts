import { Component, OnInit } from '@angular/core';
import { IPrice } from "../../../../shared/models/price";
import { PriceService } from "../price.service";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.scss']
})
export class PriceListComponent implements OnInit {
  prices: IPrice[] = [];
  dtOptions = {};

  constructor(private priceService: PriceService, private toastr: ToastrService, private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.initializePrices();
  }

  initializePrices() {
    this.priceService.getPrices().subscribe(prices => {
      this.prices = prices
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

  removePrice(id: number) {
    if (confirm("هل انت متأكد ؟")) {
      this.priceService.remove(id).subscribe(() => {
        let priceIndex = this.prices.findIndex(a => a.id == id);
        this.prices.splice(priceIndex, 1);
        this.toastr.success(this.translate.instant('saveSucess'));
      })
    }
  }
}
