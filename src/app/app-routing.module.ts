import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MyProfileComponent} from "./my-profile/my-profile.component";
import {UserListComponent} from "./user-list/user-list.component";
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {ListingComponent} from "./listing/listing.component";
import {ListingListComponent} from "./listing-list/listing-list.component";

const routes: Routes = [
  { path: 'users', component: UserListComponent },
  // { path: 'inregistrare', component: SignupComponent },
  { path: 'profil/:userId', component: UserProfileComponent },
  { path: 'anunt/:listingId', component: ListingComponent },
  { path: 'anunturi', component: ListingListComponent },
  { path: 'profilul_meu', component: MyProfileComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
