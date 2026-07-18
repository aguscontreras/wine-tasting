import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { sessionGuard } from './session.guard';
import { Catas, Assistants } from '../../services';
import { signal } from '@angular/core';

describe('sessionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => sessionGuard(...guardParameters));

  let catasMock: any;
  let assistantsMock: any;
  let routerMock: any;

  beforeEach(() => {
    catasMock = {
      activeCata: signal<any>(null),
    };
    assistantsMock = {
      activeAssistant: signal<any>(null),
    };
    routerMock = {
      createUrlTree: vi.fn().mockImplementation((commands) => ({ commands })),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Catas, useValue: catasMock },
        { provide: Assistants, useValue: assistantsMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should redirect to /home if activeCata and activeAssistant are missing', () => {
    catasMock.activeCata.set(null);
    assistantsMock.activeAssistant.set(null);

    const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(result).toEqual({ commands: ['/home'] } as any);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/home']);
  });

  it('should redirect to /home if only activeCata is present', () => {
    catasMock.activeCata.set({ id: 1 });
    assistantsMock.activeAssistant.set(null);

    const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(result).toEqual({ commands: ['/home'] } as any);
  });

  it('should redirect to /home if only activeAssistant is present', () => {
    catasMock.activeCata.set(null);
    assistantsMock.activeAssistant.set({ id: 1 });

    const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(result).toEqual({ commands: ['/home'] } as any);
  });

  it('should allow navigation if both activeCata and activeAssistant are present', () => {
    catasMock.activeCata.set({ id: 1 });
    assistantsMock.activeAssistant.set({ id: 2 });

    const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(result).toBe(true);
  });
});
