import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  private viewSubject = new BehaviorSubject<string>('dashboard');
  view$ = this.viewSubject.asObservable();

  setView(view: string): void {
    this.viewSubject.next(view);
  }
}
