import { HttpResponse } from '@angular/common/http';

export interface MastermockResponse {
    response: HttpResponse<any>;
    delay?: number;
    serverPassthrough?: boolean;
}
