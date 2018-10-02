import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  angularVersions$: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient) { }

  public getAngularReleases() {
    this.http.get('https://api.github.com/repos/angular/angular/tags')
    .subscribe(
      (response: any) => {
        this.angularVersions$.next(response);
      },
      (error: any) => {
      });
  }

}
