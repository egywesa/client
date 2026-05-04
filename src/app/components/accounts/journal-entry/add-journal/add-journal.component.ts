import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JournalEntryService } from '../journal-entry.service';
import { IChartOfAccount } from 'src/app/shared/models/accounts';
import { REGEX } from 'src/app/utils/regex.constants';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-journal',
  templateUrl: './add-journal.component.html',
  styleUrls: ['./add-journal.component.scss'],
})
export class AddJournalComponent implements OnInit {
  @Input() accounts: IChartOfAccount[] = [];
  journalForm: FormGroup;

  constructor(
    private journalService: JournalEntryService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  private initForm() {
    this.journalForm = this.fb.group({
      entryDate: ['', Validators.required],
      description: [''],
      lines: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.addLine();
  }

  get lineItems() {
    return this.journalForm.get('lines') as FormArray;
  }

  addLine() {
    const line = this.fb.group({
      accountId: [null, Validators.required],
      amount: [
        null,
        [Validators.required, Validators.pattern(REGEX.positiveNegativeNumber)],
      ],
      description: [''],
    });

    this.lineItems.push(line);
  }

  removeLine(index: number): void {
    this.lineItems.removeAt(index);
  }

  saveEntry() {
    if (this.journalForm.invalid) {
      this.journalForm.markAllAsTouched();
    } else {
      this.journalService.addEntry(this.journalForm.value).subscribe({
        next: () => {
          this.journalForm.reset();
          this.lineItems.clear();
          this.addLine();
          this.toastr.success(this.translate.instant('saveSucess'));
        },
      });
    }
  }
}
