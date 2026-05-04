import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISupplier } from 'src/app/shared/models/suppliers';
import { PaymentVoucherService } from '../payment-voucher.service';
import { IBank } from 'src/app/shared/models/bank';
import { REGEX } from 'src/app/utils/regex.constants';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-voucher',
  templateUrl: './add-voucher.component.html',
  styleUrls: ['./add-voucher.component.scss'],
})
export class AddVoucherComponent implements OnInit {
  @Input() banks: IBank[] = [];
  @Input() suppliers: ISupplier[] = [];
  voucherForm: FormGroup;

  constructor(
    private paymentVoucherService: PaymentVoucherService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {}

  private initForm() {
    this.voucherForm = this.fb.group({
      date: ['', Validators.required],
      supplierId: [null, Validators.required],
      bankId: [null, Validators.required],
      amount: [
        null,
        [Validators.required, Validators.pattern(REGEX.positiveNegativeNumber)],
      ],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  addVoucher() {
    if (this.voucherForm.invalid) {
      this.voucherForm.markAllAsTouched();
    } else {
      this.paymentVoucherService.addVoucher(this.voucherForm.value).subscribe({
        next: () => {
          this.voucherForm.reset();
          this.toastr.success(this.translate.instant('saveSucess'));
        },
      });
    }
  }
}
