import { TestBed } from '@angular/core/testing';

import { LoginUser } from './login-user';

describe('LoginUser', () => {
  let service: LoginUser;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginUser);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
