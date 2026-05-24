import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import { ApolloClient, createNetworkInterface } from 'apollo-client';
import {ApolloModule} from 'apollo-angular';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { LogoutComponent } from './logout/logout.component';
import { UsersComponent } from './users/users.component';
import { WorkplacesComponent } from './workplaces/workplaces.component';
import {LoginService} from './login.service';
import { ShiftButtonComponent } from './shift-button/shift-button.component';
import { ShiftsGridComponent } from './shifts-grid/shifts-grid.component';
import {AuthGuard} from './auth.guard';
import { UserFormComponent } from './user-form/user-form.component';
import { SButtonComponent } from './sbutton/sbutton.component';
import { environment } from '../environments/environment';
import { WorkplaceFormComponent } from './workplace-form/workplace-form.component';
import {appRoutes} from './app.routes';
import { ChangePasswordComponent } from './change-password/change-password.component';
import {AdminGuard} from './admin.guard';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertService } from 'ng2-sweetalert2';
import { RacesListComponent } from './races-list/races-list.component';
import { RaceFormComponent } from './race-form/race-form.component';
import { ResultsTableComponent } from './results-table/results-table.component';
import { OrderResultsPipe } from './order-results.pipe';
import {NgPipesModule} from 'ngx-pipes';
const networkInterface = createNetworkInterface({
    uri: environment.url + 'query'
  });

const client = new ApolloClient({
  networkInterface: networkInterface,
});

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }
    req.options.headers['token'] = localStorage.getItem('token') ? localStorage.getItem('token') : null;
    next();
  }
}]);


export function provideClient(): ApolloClient {
  return client;
}



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    LogoutComponent,
    UsersComponent,
    WorkplacesComponent,
    ShiftButtonComponent,
    ShiftsGridComponent,
    UserFormComponent,
    SButtonComponent,
    WorkplaceFormComponent,
    ChangePasswordComponent,
    RacesListComponent,
    RaceFormComponent,
    ResultsTableComponent,
    OrderResultsPipe,
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    ApolloModule.forRoot(provideClient),
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NgPipesModule,
  ],
  providers: [LoginService, AuthGuard, AdminGuard, SweetAlertService],
  bootstrap: [AppComponent]
})
export class AppModule { }
