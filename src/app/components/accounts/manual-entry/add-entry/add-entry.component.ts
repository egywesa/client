import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IChartOfAccount } from 'src/app/shared/models/accounts';
import { ManualEntryService } from '../manual-entry.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { REGEX } from 'src/app/utils/regex.constants';

@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.scss'],
})
export class AddEntryComponent implements OnInit {
  @Input() accounts: IChartOfAccount[] = [];
  entryForm: FormGroup;

  constructor(
    private manualEntryService: ManualEntryService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {}

  private initForm() {
    this.entryForm = this.fb.group({
      entryDate: ['', Validators.required],
      accountId: [null, Validators.required],
      amount: [
        null,
        [Validators.required, Validators.pattern(REGEX.positiveNegativeNumber)],
      ],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  addEntry() {
    if (this.entryForm.invalid) {
      this.entryForm.markAllAsTouched();
    } else {
      this.manualEntryService.addEntry(this.entryForm.value).subscribe({
        next: () => {
          this.entryForm.reset();
          this.toastr.success(this.translate.instant('saveSucess'));
        },
      });
    }
  }
}
