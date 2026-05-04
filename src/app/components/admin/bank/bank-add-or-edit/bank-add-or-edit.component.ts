import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BankService } from '../bank.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IBankEditOrCreate } from '../../../../shared/models/bank';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-bank-add-or-edit',
  templateUrl: './bank-add-or-edit.component.html',
  styleUrls: ['./bank-add-or-edit.component.scss'],
})
export class BankAddOrEditComponent implements OnInit {
  bankForm: FormGroup;
  DefaultText: any = 'SA';
  isCash: boolean = false;

  constructor(
    private bankService: BankService,
    private router: Router,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.createLoginForm();
    this.initializeBankToEdit(+this.activatedRoute.snapshot.paramMap.get('id'));
  }

  initializeBankToEdit(id: number) {
    if (id > 0) {
      this.bankService.getBank(id).subscribe((bank) => {
        this.bankForm.patchValue(bank);
        this.isCash = bank.accountNumber ? false : true;
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
    this.bankService.addNew(this.bankForm.value).subscribe(() => {
      this.router.navigateByUrl('/dashboard/banks');
      this.toastr.success(this.translate.instant('saveSucess'));
    });
  }

  private onEditSubmit() {
    let id = +this.activatedRoute.snapshot.paramMap.get('id');
    let data = this.bankForm.value;

    data['id'] = +this.activatedRoute.snapshot.paramMap.get('id');

    this.bankService.edit(id, data).subscribe(() => {
      this.router.navigateByUrl('/dashboard/banks');
      this.toastr.success(this.translate.instant('saveSucess'));
    });
  }

  private createLoginForm() {
    const oldValues = this.bankForm ? this.bankForm.getRawValue() : {};

    if (this.isCash) {
      this.bankForm = new FormGroup({
        bankName: new FormControl(
          oldValues['bankName'] || null,
          Validators.required
        ),
        bankAccountName: new FormControl(
          oldValues['bankAccountName'] || null,
          Validators.required
        ),
        currency: new FormControl(
          oldValues['currency'] || null,
          Validators.required
        ),
      });
    } else {
      this.bankForm = new FormGroup({
        bankName: new FormControl(
          oldValues['bankName'] || null,
          Validators.required
        ),
        bankAccountName: new FormControl(
          oldValues['bankAccountName'] || null,
          Validators.required
        ),
        accountNumber: new FormControl(
          oldValues['accountNumber'] || null,
          Validators.required
        ),
        ibanNumber: new FormControl(
          oldValues['ibanNumber'] || null,
          Validators.required
        ),
        swift: new FormControl(oldValues['swift'] || null),
        currency: new FormControl(
          oldValues['currency'] || null,
          Validators.required
        ),
      });
    }
  }

  onTogglePayCash(event: Event) {
    this.isCash = (event.target as HTMLInputElement).checked;
    this.createLoginForm();
  }
}
