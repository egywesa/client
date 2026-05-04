import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PriceService } from "../price.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { IPriceEditOrCreate } from "../../../../shared/models/price";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-price-add-or-edit',
  templateUrl: './price-add-or-edit.component.html',
  styleUrls: ['./price-add-or-edit.component.scss']
})
export class PriceAddOrEditComponent implements OnInit {
  priceForm: FormGroup;

  constructor(private priceService: PriceService, private router: Router,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute, private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.createLoginForm();
    this.initializePriceToEdit(+this.activatedRoute.snapshot.paramMap.get('id'));
  }

  initializePriceToEdit(id: number) {
    if (id > 0) {
      this.priceService.getPrice(id).subscribe(price => {
        this.priceForm.patchValue(price);
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
    this.priceService.addNew(this.priceForm.value).subscribe(() => {
      this.router.navigateByUrl('/dashboard/prices');
      this.toastr.success(this.translate.instant('saveSucess'));
    });
  }

  private onEditSubmit() {
    let id = +this.activatedRoute.snapshot.paramMap.get('id');
    let data = this.priceForm.value;

    data['id'] = +this.activatedRoute.snapshot.paramMap.get('id');

    this.priceService.edit(id,
      data).subscribe(() => {
        this.router.navigateByUrl('/dashboard/prices');
        this.toastr.success(this.translate.instant('saveSucess'));
      });
  }

  private createLoginForm() {
    this.priceForm = new FormGroup({
      planAr: new FormControl(null, Validators.required),
      planEn: new FormControl(null, Validators.required),
      invoice: new FormControl(null, Validators.required),
      priceMonthly: new FormControl(null, Validators.required),
      priceAnnual: new FormControl(null, Validators.required),
    });
  }

}
