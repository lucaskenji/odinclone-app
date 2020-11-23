import localStrings from '../../../localization';

const locale = localStorage.getItem('localizationCode') === 'en-US' ? 'en-US' : 'pt-BR';

const validateName = (input) => {
  // Checks if input is empty or blank
  if (!input.value || /^\s*$/.test(input.value)) {
    input.setCustomValidity(localStrings[locale]['register']['error']['invalidName']);
    return {valid: false};
  }
    
  input.setCustomValidity('');
  return {valid: true};
}

const validateEmail = (input) => {
  // Checks if email pattern is correct (pattern from W3)
  if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(input.value)) {
    input.setCustomValidity(localStrings[locale]['register']['error']['invalidEmail']);
    return {valid: false};
  }
  
  input.setCustomValidity('');
  return {valid: true};
}

const validatePassword = (input) => {
  // Checks if input is empty
  if (!input.value) {
    input.setCustomValidity(localStrings[locale]['register']['error']['invalidPassword']);
    return {valid: false};
  }
  
  input.setCustomValidity('');
  return {valid: true};
}

export {
  validateName,
  validateEmail,
  validatePassword
};