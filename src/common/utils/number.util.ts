import { SuggestionInterface } from '../../mobile/interface/mobile.interface';

export const isValidMobileNumber = (number: number | string): boolean => {
  const regex = new RegExp(/(^(27|0)[87][23467]((\d{7})|( |-)((\d{3}))( |-)(\d{4})|( |-)(\d{7})))/);
  return regex.test(number.toString());
};

export const getSuggestions = (number: string): SuggestionInterface[] => {
  const suggestions = [];
  if (number.length === 9) {
    let suggestion = `27${number}`;
    let changed = 'first-two';
    if (isValidMobileNumber(suggestion)) {
      suggestions.push({ changed, number: parseInt(`27${number}`) });
    } else {
      ['2', '3', '4', '6', '7'].forEach((item: string) => {
        const index = 3;
        suggestion = suggestion.substring(0, index) + item + suggestion.substring(index + 1);
        if (isValidMobileNumber(suggestion)) {
          changed = 'first-two-fourth';
          suggestions.push({ changed, number: parseInt(suggestion, 10) });
        }
      });
    }
  }
  return suggestions;
};
