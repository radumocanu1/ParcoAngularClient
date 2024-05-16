import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bytesToImage'
})
export class BytesToImagePipe implements PipeTransform {
  transform(base64String: string): string {
    if (!base64String) {
      return '';
    }
    // Prefix pentru tipul de conținut (în acest caz, jpeg). Poate fi ajustat dacă folosești alte formate de imagini (ex: 'data:image/png;base64,')
    return `data:image/jpeg;base64,${base64String}`;
  }
}
