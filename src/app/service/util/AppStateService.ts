import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private componentState: any = {};

  setState(key: string, value: any): void {
    this.componentState[key] = value;
  }

  getState(key: string): any {
    return this.componentState[key];
  }

  clearState(key: string): void {
    delete this.componentState[key];
  }
}
