import { UserService } from './user.service';

describe('User service', () => {
  it('provides "register" method', () => {
    expect(UserService.register).toBeDefined();
  });
  describe('methods', () => {
    describe('forgotPassword', () => {
      it('is defined', () => {
        expect(UserService.forgotPassword).toBeDefined();
      });
    });
  });

  describe('"login" method', () => {
    it('is provided', () => {
      expect(UserService.login).toBeDefined();
    });
  });

  it('provides "login2fa" method', () => {
    expect(UserService.login2fa).toBeDefined();
  });

  it('provides "register" method', () => {
    expect(UserService.register).toBeDefined();
  });

  xit('writes to local storage to store user data', () => {
    UserService.store({ user: 'foo' }).catch(() => {});
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  xit('reads from local storage to restore user', () => {
    UserService.restore();
    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
  });

  xit('removes user from local storage', () => {
    UserService.appLogout().catch(() => {});
    expect(localStorage.removeItem).toHaveBeenCalledTimes(1);
  });

  it('provides "verify" method', () => {
    expect(UserService.verify).toBeDefined();
  });
});
