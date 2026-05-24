import {
  Component, EventEmitter, Input, Output, ViewChild,
} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {NgbDropdown} from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertService } from 'ng2-sweetalert2';


const insertShift = gql`
  mutation insertShift($user: Int!, $date: String!, $workplace: Int!, $note: String) {
    insertShift(Userid: $user, Date: $date, Workplaceid: $workplace, Note: $note) {
      id,
      user {id, shortName, color, bgColor}
    }
  }
`;

const editShift = gql`
  mutation editShift($user: Int!, $id: Int!) {
    editShift(Id: $id, Userid: $user) {
      id,
      user {id, shortName, color, bgColor}
    }
  }
`;

const addNote = gql`
  mutation addNote($note: String, $id: Int!) {
    editShift(Id: $id, Note: $note) {
      id
    }
  }
`;

const deleteShift = gql`
  mutation deleteShift($id: Int!) {
    deleteShift(Id: $id)
  }
`;

interface InsShifts {
  insertShift: Shift;
}
interface EdtShifts {
  editShift: Shift;
}
interface DltShifts {
  deleteShift: number;
}
interface Shift {
  id: number;
  user: User;
  note: string;
}
interface User {
  id: number;
  shortName: string;
  color: string;
  bgColor: string;
  perms: [string];
}

@Component({
  selector: 'app-sbutton',
  templateUrl: './sbutton.component.html',
  styleUrls: ['./sbutton.component.scss'],
})
export class SButtonComponent {
  @Input() s: Shift;
  @Input() date: string;
  @Input() workplace: number;
  @Input() users: User[];
  @Output() refetch = new EventEmitter<boolean>();
  @Output() fetchUsers = new EventEmitter<boolean>();
  @ViewChild('myDrop') el: NgbDropdown;
  @Input() admin = false;
  @Input() a = true;

  constructor(private apollo: Apollo, private swal: SweetAlertService) {
  }

  note(id: number, e: Event) {
    e.preventDefault();
    const self = this;
    this.swal.swal({
      title: 'Zadejte poznámku',
      input: 'text',
      showCancelButton: true,
      inputValidator: function (value) {
        return new Promise(function (resolve, reject) {
          if (value) {
            self.apollo.mutate<EdtShifts>({
              mutation: addNote,
              variables: {
                id: id,
                note: value,
              },
            }).subscribe(() => {
              self.refetch.emit(true);
              resolve(value);
            }, (error) => {
              console.log('there was an error sending the query', error);
            });
          } else {
            reject('Je nutno vyplnit poznámku!');
          }
        });
      }
    });
  }

  dltNote(id: number, e: Event) {
    e.preventDefault();
    this.apollo.mutate<EdtShifts>({
      mutation: addNote,
      variables: {
        id: id,
        note: 'RESET NOTE PLS',
      },
    }).subscribe(() => {
      this.refetch.emit(true);
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
  }


  style(u: Shift) {
    if (u) {
      return {'background-color': u.user.bgColor, 'color': u.user.color};
    } else {
      return {'background-color': '#FFF', 'color': '#000'};
    }
  }

  name(shift: Shift) {
    if (shift) {
      if (shift.note) {
        return shift.user.shortName + ' (' + shift.note + ')';
      }
      return shift.user.shortName;
    } else {
      return 'VOLNO';
    }
  }

  insertUser(id: number, e: Event) {
    e.preventDefault();
    this.el.close();
    this.apollo.mutate<InsShifts>({
      mutation: insertShift,
      variables: {
        note: '',
        date: this.date,
        workplace: this.workplace,
        user: id,
      },
    }).subscribe(() => {
      this.refetch.emit(true);
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
  }

  changeUser(u: number, shift: Shift, e: Event) {
    if (!shift) {
      this.insertUser(u, e);
    } else {
      e.preventDefault();
      this.apollo.mutate<EdtShifts>({
        mutation: editShift,
        variables: {
          id: shift.id,
          user: u,
        },
      }).subscribe(() => {
        this.refetch.emit(true);
      }, (error) => {
        console.log('there was an error sending the query', error);
      });
    }
  }

  deleteUser(shift: number, e: Event) {
    e.preventDefault();
    this.apollo.mutate<DltShifts>({
      mutation: deleteShift,
      variables: {
        id: shift,
      },
    }).subscribe(() => {
      this.refetch.emit(true);
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
  }

  getId(s) {
    return s ? s.id : 0;
  }

  hasNote(s) {
    return s ? (!!s.note) : false;
  }

}
