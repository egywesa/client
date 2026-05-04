import { Component, OnInit } from '@angular/core';
import { JournalEntryService } from './journal-entry.service';
import { IChartOfAccount } from 'src/app/shared/models/accounts';

@Component({
  selector: 'app-journal-entry',
  templateUrl: './journal-entry.component.html',
  styleUrls: ['./journal-entry.component.scss'],
})
export class JournalEntryComponent implements OnInit {
  accounts: IChartOfAccount[] = [];

  constructor(private journalService: JournalEntryService) {}

  ngOnInit(): void {
    this.journalService.getAccounts().subscribe((accounts) => {
      this.accounts = accounts;
    });
  }
}
