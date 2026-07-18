import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Catas, Assistants } from '../../services';

export const sessionGuard: CanActivateFn = () => {
  const catas = inject(Catas);
  const assistants = inject(Assistants);
  const router = inject(Router);

  if (catas.activeCata() && assistants.activeAssistant()) {
    return true;
  }

  return router.createUrlTree(['/home']);
};
