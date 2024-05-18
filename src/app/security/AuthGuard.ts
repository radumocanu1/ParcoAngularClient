import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated) {
      this.router.navigate(["/register"])
      return false;
    }
    return true
    //
    // const requiredRoles = route.data.roles;
    //
    // if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
    //   return true;
    // }
    //
    // return requiredRoles.every((role) => this.roles.includes(role));
  }
}
