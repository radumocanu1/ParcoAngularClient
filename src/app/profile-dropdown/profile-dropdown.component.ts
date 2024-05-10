import {Component, OnInit} from '@angular/core';
import {KeycloakProfile} from "keycloak-js";
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-profile-dropdown',
  templateUrl: './profile-dropdown.component.html',
  styleUrl: './profile-dropdown.component.css'
})
export class ProfileDropdownComponent implements OnInit {
  public isLoggedIn = false;
  public userProfile: KeycloakProfile | null = null;
  isDropdownOpen = false;
  constructor(private readonly keycloak: KeycloakService) {
  }

  public async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();
    if (!this.isLoggedIn) {
      localStorage.removeItem("currentUserProfilePicture");

    }

    if (this.isLoggedIn) {
      this.userProfile = await this.keycloak.loadUserProfile();
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  public login() {
    this.keycloak.login({redirectUri:"http://localhost:4200/myProfile"});
  }

  public logout(): void {
    this.keycloak.logout("http://localhost:4200").then(() => {
      console.log("Logout successful");
    }).catch((error: any) => {
      console.error("Logout failed:", error);
    });
  }


  protected readonly localStorage = localStorage;
}
