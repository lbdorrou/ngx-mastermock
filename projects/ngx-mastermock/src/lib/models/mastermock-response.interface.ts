import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

export interface MastermockResponse {
    response: HttpResponse<any> | HttpErrorResponse;
    delay?: number;
    serverPassthrough?: boolean;
}
