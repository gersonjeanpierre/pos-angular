import { CanActivateChildFn } from '@angular/router';

export const roleChildGuard: CanActivateChildFn = (childRoute, state) => {
  return true;
};
