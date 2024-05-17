import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MyProfileComponent} from "./my-profile/my-profile.component";
import {UserListComponent} from "./user-list/user-list.component";
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {ListingComponent} from "./listing/listing.component";
import {ListingListComponent} from "./listing-list/listing-list.component";
import {RegisterComponent} from "./register/register.component";
import {ServerErrorComponent} from "./server-error/server-error.component";
import {AccessDeniedComponent} from "./access-denied/access-denied.component";
import {AddListingComponent} from "./add-listing/add-listing.component";
import {MyListingsComponent} from "./my-listings/my-listings.component";

const routes: Routes = [
  { path: 'users', component: UserListComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile/:userId', component: UserProfileComponent },
  { path: 'listing/:listingId', component: ListingComponent },
  { path: 'listings', component: ListingListComponent },
  { path: 'myProfile', component: MyProfileComponent },
  {path: 'server-error', component: ServerErrorComponent },
  {path: 'access-denied', component: AccessDeniedComponent },
  {path: 'add-listing', component: AddListingComponent },
  {path: 'my-listings', component: MyListingsComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
