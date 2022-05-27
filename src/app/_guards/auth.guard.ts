import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
    private authService: AuthService,

  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    var currentUser = localStorage.getItem('@bairrista:currentUser');
    console.log(currentUser)
    if (currentUser) {
      this.authService.saveUser(JSON.parse(currentUser));
      return true;
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
