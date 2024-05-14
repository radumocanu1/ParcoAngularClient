import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Router} from "@angular/router";
import {catchError, Observable} from "rxjs";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log("Redirecting to login page");
          this.router.navigate(['/register']);
        } else if (error.status === 403) {
          console.log("Redirecting to access denied page");
          this.router.navigate(['/access-denied']);
        } else if (error.status === 500 || (error.error && error.error.code === 'ECONNREFUSED')) {
          console.log("Redirecting to server error page");
          this.router.navigate(['/server-error']);
        }

        throw(error);
      })
    );
  }
}
