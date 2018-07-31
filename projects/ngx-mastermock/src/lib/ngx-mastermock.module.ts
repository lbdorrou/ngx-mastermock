import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { ContextService } from './context.service';

export const USE_MOCK_DATA = new InjectionToken<boolean>('useMockData');
export const FILE_CONTEXT = new InjectionToken<any>('fileContex');

export function contextFactory(useMockData: boolean, fileContext: any) {
  if (useMockData) {
    const contextService = new ContextService();
    contextService.setContext(fileContext, useMockData);
    contextService.initMockFiles();
    return contextService;
  }
}

@NgModule ({

})
export class NgxMastermockModule {
  static forRoot(useMockData: boolean, fileContext: any): ModuleWithProviders {
    return {
      ngModule: NgxMastermockModule,
      providers: [
        {
          provide: USE_MOCK_DATA,
          useValue: useMockData
        },
        {
          provide: FILE_CONTEXT,
          useValue: fileContext
        },
        {
          provide: ContextService,
          useFactory: contextFactory,
          deps: [USE_MOCK_DATA, FILE_CONTEXT]
        }
      ]
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule: NgxMastermockModule,
      providers: [
        {
          provide: ContextService,
          useFactory: contextFactory,
          deps: [USE_MOCK_DATA, FILE_CONTEXT]
        }
      ]
    };
  }

}
