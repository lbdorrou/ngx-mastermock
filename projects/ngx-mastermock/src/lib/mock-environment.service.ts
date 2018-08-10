
import { Injectable } from '@angular/core';

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
            for (const url in this.regexUrlMap) {
                if (this.regexUrlMap.hasOwnProperty(url)) {
                    const matchedUrl = new RegExp(url).exec(trimmedUrl);
                    if (matchedUrl) {
                        contextUrl = this.regexUrlMap[url];
                        wildcards = matchedUrl.slice(1);
                        break;
                    }
                }
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
