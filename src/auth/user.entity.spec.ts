import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('UserEntity', () => {
  let user: User;
  beforeEach(() => {
    user = new User();
    user.password = 'password';
    user.salt = 'salt';
    bcrypt.hash = jest.fn();
  });

  describe('validatePassword', () => {
    it('return true as password is valid', async () => {
      bcrypt.hash.mockReturnValue('password');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('123456');
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 'salt');
      expect(result).toBe(true);
    });

    it('return false as password is not valid', async () => {
      bcrypt.hash.mockReturnValue('wrongPassword');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('wrongPassword');
      expect(bcrypt.hash).toHaveBeenCalledWith('wrongPassword', 'salt');
      expect(result).toBe(false);
    });
  });
});
