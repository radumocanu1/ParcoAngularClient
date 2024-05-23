import {MatDateFormats, NativeDateAdapter} from "@angular/material/core";

const MY_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export class CustomDateAdapter extends NativeDateAdapter {
  override parse(value: any): Date | null {
    if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
      const str = value.split('/');
      const day = Number(str[0]);
      const month = Number(str[1]) - 1;
      const year = Number(str[2]);
      return new Date(year, month, day);
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }

  override format(date: Date, displayFormat: any): string {
    if (displayFormat === 'input') {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${this._to2digit(day)}/${this._to2digit(month)}/${year}`;
    }
    return date.toDateString();
  }

  private _to2digit(n: number) {
    return ('00' + n).slice(-2);
  }
}
