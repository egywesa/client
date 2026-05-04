import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IFileRes, FileType } from '../shared/models/file';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private baseUrl = environment.baseUrl;
  constructor() {}

  downloadFile(data: IFileRes, fileName: string, type: FileType): void {
    const url = `${this.baseUrl}${data.location}`;

    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download =
          type === FileType.EXCEL ? `${fileName}.xlsx` : `${fileName}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      })
      .catch((err) => {
        console.error('Download failed:', err);
      });
  }
}
