import { Component, OnInit } from '@angular/core';
import {IProduct} from "../../../../shared/models/product";
import {ProductService} from "../product.service";
import {TranslateService} from "@ngx-translate/core";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute} from "@angular/router";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: IProduct[] = [];
  productIdsToExport: number[] = [];
  baseUrl = environment.baseUrl;
  dtOptions = {};

  constructor(private productService: ProductService, private toastr: ToastrService,
     private translate: TranslateService ) { }

  ngOnInit(): void {
    this.initializeProducts();
  }

  initializeProducts() {
    this.productService.getProducts().subscribe(products => {
      this.products = products
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

  onImportBtnClick() {
    $('#importInput').click();
  }

  onImportChange(event) {
    console.log(event.target.files.length)
    if (event.target.files.length > 0) {
      const file:File = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      console.log(file);
      this.productService.import(formData).subscribe(() => {
        this.toastr.success(this.translate.instant('saveSucess'));
        window.location.reload();

      });
    }
  }
  exportSelectedProducts() {
    this.productService.exportInvoices(this.productIdsToExport).subscribe(url => {
      window.open(this.baseUrl + url['location'], "_blank");
      window.location.reload();
    });
  }
  onCheckboxChange(Id: any) {
    console.log(Id)
    console.log("in change function")
    const index = this.productIdsToExport.findIndex(num => num == Id.toString());
    if (index === -1) {
      this.productIdsToExport.push(Id);
    } else {
      this.productIdsToExport.splice(index, 1);
    }
    console.log(this.productIdsToExport)
  }
  removeProduct(id: number) {
    if (confirm("هل انت متأكد ؟"))
    {
      this.productService.remove(id).subscribe(() => {
        let productIndex = this.products.findIndex(a => a.id == id);
        this.products.splice(productIndex, 1);
        this.toastr.success(this.translate.instant('saveSucess'));
      })
    }
  }
}
