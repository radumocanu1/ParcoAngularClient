import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bytesToImage'
})
export class BytesToImagePipe implements PipeTransform {
  transform(base64String: string): string {
    if (!base64String) {
      return '';
    }

    return `data:image/jpeg;base64,${base64String}`;
  }
}
