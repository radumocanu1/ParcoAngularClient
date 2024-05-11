import { Component } from '@angular/core';
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  public isLoggedIn = false;
  constructor(private readonly keycloak: KeycloakService) {
  }
  public async ngOnInit() {
    this.isLoggedIn = this.keycloak.isLoggedIn();

  }
  public login() {
    this.keycloak.login({redirectUri:"http://localhost:4200/myProfile"});
  }
}
