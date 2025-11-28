import { CtasCareCategory } from './triage.enum';

export const generateRandomCode = (length: number = 6): string => {
  const chars = '0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }

  return result;
};

export const triageResponse = (ctasCategory: string): string => {
  let response: string = '';
  switch (ctasCategory.toLocaleLowerCase()) {
    case CtasCareCategory.ctas1:
      response =
        'You need a very urgent medical care; Would you like me to direct you to the appropriate healthcare facility around you?';
      break;
    case CtasCareCategory.ctas2:
      response =
        'You need a an urgent medical care; Would you like me to direct you to the appropriate healthcare facility around you?';
      break;
    case CtasCareCategory.ctas3:
      response =
        'You should see a medical propfessional for further diagnosis as soon as possible. Would you like me to direct you to the appropriate healthcare facility around you?';
      break;
    case CtasCareCategory.ctas4:
      response =
        'You need to visit a non emergency healthcare facility. Would you like me to direct you to the appropriate healthcare facility around you?';
      break;
    case CtasCareCategory.ctas5:
      response =
        'You can watch this at home to see if the condition improves but I can still direct you to the appropriate care if you need. Would you like me to direct you to the appropriate healthcare facility around you?';
      break;
    default:
      response = 'Unable to determine triage category.';
      break;
  }

  return response;
};
