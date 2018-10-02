import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';

import { getMockEnvironment } from './mock-environment.service';

import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';


@Injectable()
export class MastermockInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (getMockEnvironment().getEnabled()) {
      const devResponse =  getMockEnvironment().retrieveResponse(request);
      if (devResponse.serverPassthrough) {
        return next.handle(request);
      }
      if (devResponse.response instanceof HttpErrorResponse ) {
        return throwError(devResponse.response);
      } else {
        return of(devResponse.response).pipe(delay(devResponse.delay || 10));
      }


    } else {
      return next.handle(request);
    }
  }
}
