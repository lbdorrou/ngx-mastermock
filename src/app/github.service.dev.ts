import { Mastermock } from 'ngx-mastermock/ngx-mastermock';
import { MastermockResponse } from 'ngx-mastermock/ngx-mastermock';

import { HttpResponse } from '@angular/common/http';

export default class implements Mastermock {

    public registerEndpoints() {
        return {
            'https://api.github.com/repos/angular/angular/tags': this.githubVersions
        };
    }


    public githubVersions(): MastermockResponse {
        return {
            response: new HttpResponse({
                status: 200,
                body: this.generateMockVersions()
            })
        };
    }

    private generateMockVersions() {
        return [{
            name: '5.0.3',
            zipball_url: 'https://api.github.com/repos/angular/angular/zipball/5.0.3',
            tarball_url: 'https://api.github.com/repos/angular/angular/tarball/5.0.3',
            commit: {
                sha: '65a40e659bf2f62ec5964dca186e68c067014734',
                url: 'https://api.github.com/repos/angular/angular/commits/65a40e659bf2f62ec5964dca186e68c067014734'
            }
        },
        {
            name: '5.0.2',
            zipball_url: 'https://api.github.com/repos/angular/angular/zipball/5.0.2',
            tarball_url: 'https://api.github.com/repos/angular/angular/tarball/5.0.2',
            commit: {
                sha: 'b1f8eb14c8cd1f415b07d72e09d14bed77c8d4ac',
                url: 'https://api.github.com/repos/angular/angular/commits/b1f8eb14c8cd1f415b07d72e09d14bed77c8d4ac'
            }
        }];
    }
}
