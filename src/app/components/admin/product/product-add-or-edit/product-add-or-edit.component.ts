import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ProductService} from "../product.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {IProductEditOrCreate} from "../../../../shared/models/product";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-product-add-or-edit',
  templateUrl: './product-add-or-edit.component.html',
  styleUrls: ['./product-add-or-edit.component.scss']
})
export class ProductAddOrEditComponent implements OnInit {
  productForm: FormGroup;

  constructor(private productService: ProductService, private router: Router,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute, private translate: TranslateService
    ) { }

  ngOnInit(): void {
    this.createLoginForm();
    this.initializeProductToEdit(+this.activatedRoute.snapshot.paramMap.get('id'));
  }

  initializeProductToEdit(id: number) {
    if (id > 0) {
      this.productService.getProduct(id).subscribe(product => {
        this.productForm.patchValue(product);
      });
    }
  }

  onSubmit() {
    if (+this.activatedRoute.snapshot.paramMap.get('id') > 0) {
      this.onEditSubmit();
    } else {
      this.onCreateSubmit();
    }
  }

  private onCreateSubmit() {
    this.productService.addNew(this.productForm.value).subscribe(() => {
      this.router.navigateByUrl('/dashboard/products');
      this.toastr.success(this.translate.instant('saveSucess'));
    });
  }

  private onEditSubmit() {
    let id = +this.activatedRoute.snapshot.paramMap.get('id');
    let data = this.productForm.value;

    data['id'] = +this.activatedRoute.snapshot.paramMap.get('id');

    this.productService.edit(id,
      data).subscribe(() => {
        this.router.navigateByUrl('/dashboard/products');
        this.toastr.success(this.translate.instant('saveSucess'));
      });
  }

  private createLoginForm() {
    this.productForm = new FormGroup({
      productId: new FormControl(null),
      productName: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required),
    });
  }

}
