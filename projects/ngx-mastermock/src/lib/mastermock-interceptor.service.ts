import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';

import { ContextService } from './context.service';

import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';


@Injectable()
export class MastermockInterceptor implements HttpInterceptor {

  constructor(private context: ContextService) { }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.context && this.context.isMockData()) {
      const devResponse = this.context.retrieveResponse(request);
      if (devResponse.serverPassthrough) {
        return next.handle(request);
      }
      if (devResponse.response.status === 400 || devResponse.response.status === 404 || devResponse.response.status === 500) {
        return throwError(devResponse.response);
      } else {
        return of(devResponse.response).pipe(delay(devResponse.delay || 10));
      }
    } else {
      return next.handle(request);
    }
  }
}
