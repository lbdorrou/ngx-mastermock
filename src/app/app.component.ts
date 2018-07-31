import { Component, OnInit } from '@angular/core';
import { GithubService } from './github.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  versions = [];

  constructor(private githubService: GithubService ) { }

  ngOnInit() {
    this.githubService.angularVersions$.subscribe((data) => {
      this.versions = data;
    });

    this.githubService.getAngularReleases();
  }
}
