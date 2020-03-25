import { isValidMobileNumber, getSuggestions } from './number.util';

describe('number util', () => {
  describe('isValidMobileNumber', () => {
    it('should return "true" for valid number', async () => {
      expect(isValidMobileNumber(27824469836)).toBe(true);
    });

    it('should return "false" for valid number', async () => {
      expect(isValidMobileNumber(918726257239)).toBe(false);
    });
  });

  describe('getSuggestions', () => {
    it('should return zero suggestion', async () => {
      expect(getSuggestions('2824469836')).toEqual([]);
    });

    it('should return one suggestion', async () => {
      expect(getSuggestions('824469836')).toEqual([{ number: 27824469836, changed: 'first-two' }]);
    });

    it('should return multiple suggestions', async () => {
      expect(getSuggestions('781116755')).toEqual([
        { number: 27721116755, changed: 'first-two-fourth' },
        { number: 27731116755, changed: 'first-two-fourth' },
        { number: 27741116755, changed: 'first-two-fourth' },
        { number: 27761116755, changed: 'first-two-fourth' },
        { number: 27771116755, changed: 'first-two-fourth' },
      ]);
    });
  });
});
