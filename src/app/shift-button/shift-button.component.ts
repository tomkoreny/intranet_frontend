import {Component, EventEmitter, Input, Output} from '@angular/core';

interface Shift {
  id: number;
  user: User;
}
interface User {
  id: number;
  name: string;
  color: string;
  bgColor: string;
  perms: [string];
}

@Component({
  selector: 'app-shift-button',
  templateUrl: './shift-button.component.html',
  styleUrls: ['./shift-button.component.scss'],
})
export class ShiftButtonComponent {
  @Input() date: string;
  @Input() day: number;
  @Input() workplace: number;
  @Input() shifts: Shift[];
  @Input() users: User[];
  @Input() admin = false;
  @Output() r = new EventEmitter<boolean>();

  getDate() {
    return this.date + '-' + this.day;
  }

  refetch() {
    this.r.emit(true);
  }

  fetchUsers() {
  }
}
