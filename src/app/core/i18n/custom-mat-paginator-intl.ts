import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  override changes = new Subject<void>();

  constructor(private translate: TranslateService) {
    super();
    this.setLabels();
  }

  private setLabels() {
    this.itemsPerPageLabel = this.translate.instant('paginator.itemsPerPage');
    this.nextPageLabel = this.translate.instant('paginator.nextPage');
    this.previousPageLabel = this.translate.instant('paginator.previousPage');
    this.firstPageLabel = this.translate.instant('paginator.firstPage');
    this.lastPageLabel = this.translate.instant('paginator.lastPage');

    this.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ): string => {
      if (length === 0 || pageSize === 0) {
        return this.translate.instant('paginator.rangePage', {
          start: 0,
          end: 0,
          length,
        });
      }

      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;

      return this.translate.instant('paginator.rangePage', {
        start: startIndex + 1,
        end: endIndex,
        length,
      });
    };

    this.changes.next();
  }
}
