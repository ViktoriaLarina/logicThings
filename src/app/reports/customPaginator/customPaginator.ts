import { MatPaginator, MatPaginatorIntl } from '@angular/material';

export class CustomPaginator extends MatPaginatorIntl {
  itemsPerPageLabel = 'Записей на странице';
  nextPageLabel     = 'Следующая страница';
  previousPageLabel = 'Предыдущая страница';
  getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 из ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} из ${length}`;
  }
}
