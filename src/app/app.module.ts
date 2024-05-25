import {APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileDropdownComponent } from './profile-dropdown/profile-dropdown.component';
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {MatIconModule} from "@angular/material/icon";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatMenuModule} from "@angular/material/menu";
import { MyProfileComponent } from './my-profile/my-profile.component';
import {UserService} from "./service/UserService";
import {HttpClientModule} from "@angular/common/http";
import { ListingComponent } from './listing/listing.component';
import { ListingListComponent } from './listing-list/listing-list.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserListComponent } from './user-list/user-list.component';
import {GoogleMapsModule} from "@angular/google-maps";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {InterceptorModule} from "./interceptors/InterceptorModule";
import {NgOptimizedImage} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import {MatDialogModule} from "@angular/material/dialog";
import {
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
} from "@angular/material/snack-bar";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatOption, MatSelect, MatSelectModule} from "@angular/material/select";
import { RegisterComponent } from './register/register.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import {AddListingComponent} from './add-listing/add-listing.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import {NgxFileDropModule} from "ngx-file-drop";
import {BytesToImagePipe} from "./service/util/BytesToImagePipe";
import {ModalModule} from "ngx-bootstrap/modal";
import { ImageModalComponent } from './image-modal/image-modal.component';
import { FullImageModalComponent } from './full-image-modal/full-image-modal.component';
import { MyListingsComponent } from './my-listings/my-listings.component';
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import {MatCheckbox} from "@angular/material/checkbox";
import { RentDialogComponent } from './rent-dialog/rent-dialog.component';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';
import {ChatService} from "./service/ChatService";
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatContainerComponent } from './chat-container/chat-container.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { UserListingsComponent } from './user-listings/user-listings.component';
import {TranslateStatusPipe} from "./service/util/TranslateStatusPipe";
import { AdminListingListComponent } from './admin-listing-list/admin-listing-list.component';
import { AdminListingComponent } from './admin-listing/admin-listing.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentRejectComponent } from './payment-reject/payment-reject.component';
import { RentedListingsComponent } from './rented-listings/rented-listings.component';



function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        realm: 'Parco',
        url: 'http://localhost:8081',
        clientId: 'testClientID'
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html'
      }
    });
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProfileDropdownComponent,
    MyProfileComponent,
    ListingComponent,
    ListingListComponent,
    UserProfileComponent,
    UserListComponent,
    ImagePreviewComponent,
    RegisterComponent,
    DeleteAccountComponent,
    AddListingComponent,
    ServerErrorComponent,
    AccessDeniedComponent,
    BytesToImagePipe,
    TranslateStatusPipe,
    ImageModalComponent,
    FullImageModalComponent,
    MyListingsComponent,
    RentDialogComponent,
    HomeComponent,
    ChatComponent,
    ChatListComponent,
    ChatContainerComponent,
    UnauthorizedComponent,
    UserListingsComponent,
    AdminListingListComponent,
    AdminListingComponent,
    PaymentSuccessComponent,
    PaymentRejectComponent,
    RentedListingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    KeycloakAngularModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    HttpClientModule,
    GoogleMapsModule,
    BrowserAnimationsModule,
    InterceptorModule,
    NgOptimizedImage,
    MatTooltip,
    FormsModule,
    MatFormField,
    MatInput,
    MatGridTile,
    MatGridList,
    MatDialogModule,
    MatSnackBarAction,
    MatSnackBarActions,
    MatSnackBarLabel,
    MatProgressSpinner,
    MatSelect,
    MatOption,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgxFileDropModule,
    ModalModule.forRoot(),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatNativeDateModule,
    MatCheckbox


  ],
  providers: [UserService, ChatService, {
    provide: APP_INITIALIZER,
    useFactory: initializeKeycloak,
    multi: true,
    deps: [KeycloakService]
  },
    { provide: MAT_DATE_LOCALE, useValue: 'ro-RO' },],
  bootstrap: [AppComponent],
  exports: [
    ProfileDropdownComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
