import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TaxService} from "../tax.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ITaxEditOrCreate} from "../../../../shared/models/tax";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-tax-add-or-edit',
  templateUrl: './tax-add-or-edit.component.html',
  styleUrls: ['./tax-add-or-edit.component.scss']
})
export class TaxAddOrEditComponent implements OnInit {
  taxForm: FormGroup;

  constructor(private taxService: TaxService, private router: Router,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute, private translate: TranslateService
    ) { }

  ngOnInit(): void {
    this.createLoginForm();
    this.initializeTaxToEdit(+this.activatedRoute.snapshot.paramMap.get('id'));
  }

  initializeTaxToEdit(id: number) {
    if (id > 0) {
      this.taxService.getTax(id).subscribe(tax => {
        this.taxForm.patchValue(tax);
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
    this.taxService.addNew(this.taxForm.value).subscribe(() => {
      this.router.navigateByUrl('/dashboard/taxes');
      this.toastr.success(this.translate.instant('saveSucess'));
    });
  }

  private onEditSubmit() {
    let id = +this.activatedRoute.snapshot.paramMap.get('id');
    let data = this.taxForm.value;

    data['id'] = +this.activatedRoute.snapshot.paramMap.get('id');

    this.taxService.edit(id,
      data).subscribe(() => {
        this.router.navigateByUrl('/dashboard/taxes');
        this.toastr.success(this.translate.instant('saveSucess'));
      });
  }

  private createLoginForm() {
    this.taxForm = new FormGroup({
      taxNameAr: new FormControl(null, Validators.required),
      taxNameEn: new FormControl(null, Validators.required),
      taxValue: new FormControl(null, Validators.required)
    });
  }

}
