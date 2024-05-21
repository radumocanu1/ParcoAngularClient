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
import {AuthGuard} from "./security/AuthGuard";
import {HomeComponent} from "./home/home.component";
import {ChatComponent} from "./chat/chat.component";

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'users', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'profile/:userId', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'listing/:listingId', component: ListingComponent, canActivate: [AuthGuard] },
  { path: 'listings', component: ListingListComponent },
  { path: 'myProfile', component: MyProfileComponent, canActivate: [AuthGuard] },
  {path: 'server-error', component: ServerErrorComponent },
  {path: 'access-denied', component: AccessDeniedComponent },
  {path: 'add-listing', component: AddListingComponent, canActivate: [AuthGuard] },
  {path: 'my-listings', component: MyListingsComponent, canActivate: [AuthGuard]},
  { path: 'chat/:chatID/:userUUID', component: ChatComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
