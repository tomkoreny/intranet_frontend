import { Component, OnInit } from '@angular/core';
import gql from 'graphql-tag';
import {Apollo, ApolloQueryObservable} from 'apollo-angular';
import {LoginService} from '../login.service';


interface QueryResponse {
  thisUser: User;
  workplaces: [Workplace];
  users: [User];
  allShifts: [DayType];
}

interface Workplace {
  username: string;
  color: string;
  bgColor: string;
  name: string;
  id: number;
}

const ShiftsView = gql`
  query shiftsView($date: String!) {
    thisUser {
      id,
      perms
    }
    workplaces {
      id, name, bgColor, color
    }
    users {
      id, name, shortName, color, bgColor,
      workplaces { id }
    }
    allShifts(Date: $date) {
      Day, Workplaces {
        Id, Shifts {
          id,
          user {id, shortName, color, bgColor},
          note
        }
      }
    }
  }
`;
interface Rtrn {
  allShifts: [DayType];
}
interface DayType {
  Day: number;
  Workplaces: [W];
}

interface W {
  Id: number;
  Shifts: [Shift];
}

interface Shift {
  id: number;
  user: User;
}
interface User {
  id: number;
  name: string;
  shortName: string;
  color: string;
  bgColor: string;
  perms: [string];
  workplaces: [Workplace];
}


@Component({
  selector: 'app-shifts-grid',
  templateUrl: './shifts-grid.component.html',
  styleUrls: ['./shifts-grid.component.scss']
})
export class ShiftsGridComponent implements OnInit {
  t;
  days;
  workplaces;
  users: User[];
  admin = false;
  query: ApolloQueryObservable<QueryResponse>;
  shifts: [DayType];
  constructor(private apollo: Apollo, private login: LoginService) { }

  ngOnInit() {
    this.t = new Date().toISOString().substr(0, 7);
    this.days = Array.from(new Array(this.daysInMonth(new Date(this.t))), (val, index) => index + 1);
    this.query = this.apollo.watchQuery<QueryResponse>({
      query: ShiftsView,
      variables: {
        'date': this.t
      }
    });
    this.query.subscribe((res) => {
      this.workplaces = res.data.workplaces;
      this.users = res.data.users;
      this.shifts = res.data.allShifts;
      this.login.user = res.data.thisUser;
      this.admin = !!(res.data.thisUser && res.data.thisUser.perms && res.data.thisUser.perms.includes('admin'));
    });
  }

  getUsers(w) {
    if (!this.users) {
      return [];
    }
    return this.users.filter((u) => u.workplaces && !!u.workplaces.find((workplace) => workplace.id === w));
  }

  getShifts(d, w) {
    if (this.shifts) {
      const x = this.shifts.find((r) => r.Day === d);
      if (x) {
        const v = x.Workplaces.find((r) => r.Id === w);
        return v ? v.Shifts : [];
      } else {
        return [];
      }
    }
    return [];
  }

  daysInMonth(anyDateInMonth) {
    return new Date(anyDateInMonth.getYear(),
      anyDateInMonth.getMonth() + 1,
      0).getDate();
  }

  getDate(d) {
    return this.t + '-' + d;
  }

  isWeekend(d) {
    return new Date(this.getDate(d)).getDay() === 0 || new Date(this.getDate(d)).getDay() === 6;
  }

  getBgForDay(d) {
    return this.isWeekend(d) ? '#999999' : '#FFFFFF';
  }

  omg() {
    this.query.setVariables({date: this.t});
    this.query.refetch();
  }
}
