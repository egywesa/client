import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuppliersService } from '../suppliers.service';
import { whitespaceValidator } from 'src/app/shared/validators/whitespace.validator';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.scss'],
})
export class AddSupplierComponent implements OnInit {
  supplierForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private suppliersService: SuppliersService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {}

  private initForm() {
    this.supplierForm = this.fb.group({
      name: ['', [Validators.required, whitespaceValidator]],
      contactName: [''],
      phone: [''],
      email: [''],
      address: [''],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  addSupplier() {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
    } else {
      this.suppliersService.addSupplier(this.supplierForm.value).subscribe({
        next: () => {
          this.supplierForm.reset();
          this.toastr.success(this.translate.instant('saveSucess'));
        },
      });
    }
  }
}
