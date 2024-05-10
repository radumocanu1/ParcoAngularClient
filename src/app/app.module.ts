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
import {FormsModule} from "@angular/forms";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import {MatDialogModule} from "@angular/material/dialog";
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef
} from "@angular/material/snack-bar";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatOption, MatSelect, MatSelectModule} from "@angular/material/select";
import { RegisterComponent } from './register/register.component';

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
    MatSelectModule
  ],
  providers: [UserService, {
    provide: APP_INITIALIZER,
    useFactory: initializeKeycloak,
    multi: true,
    deps: [KeycloakService]
  }],
  bootstrap: [AppComponent],
  exports: [
    ProfileDropdownComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
