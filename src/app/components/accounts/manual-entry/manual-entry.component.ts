import { Component, OnInit } from '@angular/core';
import { IChartOfAccount } from 'src/app/shared/models/accounts';
import { ManualEntryService } from './manual-entry.service';

@Component({
  selector: 'app-manual-entries',
  templateUrl: './manual-entry.component.html',
  styleUrls: ['./manual-entry.component.scss'],
})
export class ManualEntryComponent implements OnInit {
  accounts: IChartOfAccount[] = [];

  constructor(private manualEntryService: ManualEntryService) {}

  ngOnInit(): void {
    this.manualEntryService
      .getAccounts()
      .subscribe((accounts) => (this.accounts = accounts));
  }
}
