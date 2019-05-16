import { MastermockResponse } from './models/mastermock-response.interface';
import { HttpRequest } from '@angular/common/http';

export class MockEnvironment {

    private fileContext: any = null;
    private enabled = false;

    private urlMap: any;
    private regexUrlMap: any;

    private wildCardPattern = /\${[^}]+}+/g;

    static initTestEnvironment(fileContext: any): MockEnvironment {
      const mockEnvironment = getMockEnvironment();
      mockEnvironment.initTestEnvironment(fileContext);
      return mockEnvironment;
    }

    initMockFiles(): void {
        this.urlMap = {};
        this.regexUrlMap = {};

        for (let i = 0; i < this.fileContext.keys().length; i++) {
            const key = this.fileContext.keys()[i];
            const mock = this.fileContext(key);

            if (mock.default && mock.default.prototype.registerEndpoints) {
                const mockClass = new mock.default();
                const urlMappings = mockClass.registerEndpoints();
                for (const url in urlMappings) {
                    if (urlMappings.hasOwnProperty(url)) {
                        this.urlMap[url] = {
                            endpoint: urlMappings[url],
                            parent: mockClass
                        };
                        const reg = url.replace(/\//g, '\\/');
                        this.regexUrlMap[reg.replace(this.wildCardPattern, '([a-zA-Z0-9$-_.+!*(), ]+)')] = this.urlMap[url];
                    }
                }
            }
        }
    }

    private getUrlParmas(reqUrl: string) {
        const urlParams = {};
        const tempUrl = reqUrl.split('?');
        if (tempUrl.length > 1) {
            const paramSegments = tempUrl[1].split('&');
            for (const param of paramSegments) {
                const splitParam = param.split('=');
                urlParams[splitParam[0]] = splitParam[1];
            }
        }
        return urlParams;
    }

    retrieveResponse(request: HttpRequest<any>): MastermockResponse {
        const fullUrl = request.url;

        const urlParams = this.getUrlParmas(fullUrl);
        const trimmedUrl = fullUrl.split('?')[0];

        let contextUrl = this.urlMap[trimmedUrl];
        let wildcards: Array<string>;

        if (!contextUrl) {
            const validUrls = [];
            for (const url in this.regexUrlMap) {
                if (this.regexUrlMap.hasOwnProperty(url)) {
                    const matchedUrl = new RegExp(url).exec(trimmedUrl);
                    if (matchedUrl) {
                        validUrls.push({
                            'matchedUrl': url,
                            'urlMap': this.regexUrlMap[url],
                            'wildcards': matchedUrl.slice(1)
                        });
                    }
                }
            }

            if (validUrls.length > 1) {
                const requestedPath = new URL(trimmedUrl).pathname.split('/').filter(e => e);
                validUrls.forEach(validUrl => {
                    const testPath = new URL(validUrl.matchedUrl).pathname.split('/').filter(e => e);
                    if (this.pathsAreEqual(requestedPath, testPath)) {
                        contextUrl = validUrl.urlMap;
                        wildcards = validUrl.wildcards;
                    }
                });
                if (!contextUrl) {
                    console.warn('Previously found valid regex urls, but could not find exact match. ' +
                                 'Using first of valid regex urls for mock');
                }
            }

            if (validUrls.length === 1 || !contextUrl) {
                contextUrl = validUrls[0].urlMap;
                wildcards = validUrls[0].wildcards;
            }
        }

        if (!contextUrl) {
            console.error(`Requested devopment mock file for ${request.url} but none was found. Falling back to server`);
            return {
                serverPassthrough: true,
                response: null
            };
        }

        return contextUrl.endpoint.call(contextUrl.parent, request, wildcards, urlParams);
    }

    pathsAreEqual(requestedPath: Array<string>, testPath: Array<string>) {
        if (!Array.isArray(requestedPath) || !Array.isArray(testPath) || requestedPath.length !== testPath.length) {
            return false;
        }

        for (let i = 0; i < requestedPath.length; i++) {
            if (testPath[i].includes('([a-zA-Z0-9$-_.+!*(),%20]+)')) {
                continue;
            } else if (requestedPath[i] !== testPath[i]) {
                return false;
            }
        }

        return true;
    }

    initTestEnvironment(fileContext: any) {
      if (fileContext) {
          this.fileContext = fileContext;
          this.initMockFiles();
          this.enabled = true;
      }
    }

    getFileContext() {
        return this.fileContext;
    }

    getEnabled() {
        return this.enabled;
    }

}

let _mockEnvironment: MockEnvironment = null;

export function getMockEnvironment() {
  return _mockEnvironment = _mockEnvironment || new MockEnvironment();
}
