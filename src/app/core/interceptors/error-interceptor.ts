import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return throwError(() => new Error('Acceso no autorizado'));
      }
      return throwError(() => new Error('Ocurrió un error'));
    })
  );
}
