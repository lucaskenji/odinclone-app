const validateName = (input) => {
  // Checks if input is empty or blank
  if (!input.value || /^\s*$/.test(input.value)) {
    input.setCustomValidity('Provide a valid name.');
    return {valid: false};
  }
    
  input.setCustomValidity('');
  return {valid: true};
}

const validateEmail = (input) => {
  // Checks if email pattern is correct (pattern from W3)
  if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(input.value)) {
    input.setCustomValidity('Provide a valid email.');
    return {valid: false};
  }
  
  input.setCustomValidity('');
  return {valid: true};
}

const validatePassword = (input) => {
  // Checks if input is empty
  if (!input.value) {
    input.setCustomValidity('Provide a valid password.');
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