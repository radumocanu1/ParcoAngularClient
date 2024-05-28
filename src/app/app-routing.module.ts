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
import {ChatContainerComponent} from "./chat-container/chat-container.component";
import {UnauthorizedComponent} from "./unauthorized/unauthorized.component";
import {UserListingsComponent} from "./user-listings/user-listings.component";
import {AdminListingComponent} from "./admin-listing/admin-listing.component";
import {AdminListingListComponent} from "./admin-listing-list/admin-listing-list.component";
import {PaymentSuccessComponent} from "./payment-success/payment-success.component";
import {PaymentRejectComponent} from "./payment-reject/payment-reject.component";
import {RentedListingsComponent} from "./rented-listings/rented-listings.component";
import {FullScreenMapComponent} from "./full-screen-map/full-screen-map.component";

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'users', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'profile/:userId', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'listing/:listingId', component: ListingComponent, canActivate: [AuthGuard] },
  { path: 'listings', component: ListingListComponent },
  { path: 'myProfile', component: MyProfileComponent, canActivate: [AuthGuard] },
  {path: 'server-error', component: ServerErrorComponent },
  {path: 'unauthorized', component:UnauthorizedComponent },
  {path: 'access-denied', component: AccessDeniedComponent },
  {path: 'add-listing', component: AddListingComponent, canActivate: [AuthGuard] },
  {path: 'my-listings', component: MyListingsComponent, canActivate: [AuthGuard]},
  { path: 'chat', component: ChatContainerComponent, children: [
      { path: ':chatUUID', component: ChatComponent }
    ]},
  {path: 'userListings/:userUUID', component: UserListingsComponent, canActivate: [AuthGuard] },
  {path: 'admin/listing/:listingUUID', component: AdminListingComponent, canActivate: [AuthGuard] },
  {path: 'admin/listings', component: AdminListingListComponent, canActivate: [AuthGuard] },
  {path:'payment/success', component: PaymentSuccessComponent, canActivate: [AuthGuard] },
  {path:'payment/cancel', component: PaymentRejectComponent, canActivate: [AuthGuard] },
  {path:'rented-listings', component: RentedListingsComponent, canActivate: [AuthGuard] },
  {path:'map', component: FullScreenMapComponent},





];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
