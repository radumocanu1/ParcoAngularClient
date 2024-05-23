import {Pipe, PipeTransform} from "@angular/core";
import {Status} from "../../model/Status";

@Pipe({
  name: 'translateStatus'
})
export class TranslateStatusPipe implements PipeTransform {
  transform(value: Status): string {
    switch (value) {
      case Status.ACTIVE:
        return 'Activ';
      case Status.DEACTIVATED:
        return 'Dezactivat';
      case Status.PENDING:
        return 'În așteptare';
      default:
        return 'Necunoscut';
    }
  }
}








