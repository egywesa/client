import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountsService } from './accounts.service';
import { TranslateService } from '@ngx-translate/core';
import { IChartOfAccount } from 'src/app/shared/models/accounts';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { whitespaceValidator } from 'src/app/shared/validators/whitespace.validator';
import { REGEX } from 'src/app/utils/regex.constants';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chart-of-accounts',
  templateUrl: './chart-of-accounts.component.html',
  styleUrls: ['./chart-of-accounts.component.scss'],
})
export class ChartOfAccountsComponent implements OnInit, OnDestroy {
  expanded: { [key: number]: boolean } = {};
  modalForm: FormGroup;
  accounts: IChartOfAccount[] = [];
  activeTabAccounts: IChartOfAccount[] = [];
  modalVisible: boolean = false;
  activeTab: string = 'Expense';
  searchKey: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private accountsService: AccountsService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  private initForm() {
    this.modalForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, whitespaceValidator]],
      openingBalance: [
        0,
        [Validators.required, Validators.pattern(REGEX.positiveNegativeNumber)],
      ],
      currentBalance: [
        0,
        [Validators.required, Validators.pattern(REGEX.positiveNegativeNumber)],
      ],
      type: [''],
      parentId: [],
      children: [],
      editing: [false],
    });
  }

  ngOnInit() {
    this.accountsService.fetchAccounts();
    this.accountsService.accounts$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.setTab(this.activeTab);
      },
    });
  }

  toggleExpand(id: number) {
    this.expanded[id] = !this.expanded[id];
  }

  openModal(account?: IChartOfAccount, parentId?: number) {
    this.initForm();
    if (account) {
      this.modalForm.patchValue({ ...account, editing: true });
    } else {
      this.modalForm.patchValue({ parentId, type: this.activeTab });
    }
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;
    this.modalForm.reset();
  }

  saveModal(account: IChartOfAccount) {
    if (this.modalForm.invalid) {
      this.modalForm.markAllAsTouched();
    } else {
      if (this.modalForm.value.editing) {
        this.accountsService.updateAccount(account).subscribe({
          next: () => {
            this.closeModal();
            this.toastr.success(this.translate.instant('saveSucess'));
          },
        });
      } else {
        this.accountsService.addAccount(account).subscribe({
          next: () => {
            this.closeModal();
            this.toastr.success(this.translate.instant('saveSucess'));
          },
        });
      }
    }
  }

  deleteAccount(id: number) {
    if (confirm(this.translate.instant('deleteConfirmation'))) {
      this.accountsService.deleteAccount(id).subscribe({
        next: () => {
          this.toastr.success(this.translate.instant('deleteSuccess'));
        },
      });
    }
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.activeTabAccounts = this.accounts.filter(
      (acc: IChartOfAccount) => acc.type === this.activeTab
    );

    this.searchKey = '';
  }

  searchAccount() {
    const key = this.searchKey.toLowerCase();
    this.activeTabAccounts = this.accounts.filter(
      (acc: IChartOfAccount) =>
        acc.type === this.activeTab &&
        (acc.name.toLowerCase().includes(key) ||
          acc.code.toLowerCase().includes(key) ||
          acc.children.some((child) =>
            child.name.toLowerCase().includes(key)
          ) ||
          acc.children.some((child) => child.code.toLowerCase().includes(key)))
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
