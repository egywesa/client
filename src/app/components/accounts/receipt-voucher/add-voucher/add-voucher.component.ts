import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IBank } from 'src/app/shared/models/bank';
import { IClient } from 'src/app/shared/models/client';
import { ReceiptVoucherService } from '../receipt-voucher.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { REGEX } from 'src/app/utils/regex.constants';

@Component({
  selector: 'app-add-receipt-voucher',
  templateUrl: './add-voucher.component.html',
  styleUrls: ['./add-voucher.component.scss'],
})
export class AddReceiptVoucherComponent implements OnInit {
  @Input() banks: IBank[] = [];
  @Input() clients: IClient[] = [];
  voucherForm: FormGroup;

  constructor(
    private receiptVoucherService: ReceiptVoucherService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {}

  private initForm() {
    this.voucherForm = this.fb.group({
      date: ['', Validators.required],
      clientId: [null, Validators.required],
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
      this.receiptVoucherService.addVoucher(this.voucherForm.value).subscribe({
        next: () => {
          this.voucherForm.reset();
          this.toastr.success(this.translate.instant('saveSucess'));
        },
      });
    }
  }
}
