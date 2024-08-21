import { calculateMortgage } from './mortgage.js';
import { renderResultsSection } from './results.js';

function extractFormData(formElement) {
  if (!formElement) {
    return null;
  }

  const formValues = new FormData(formElement);
  return Object.fromEntries(formValues.entries());
}

function extractValidationAttributes(validationStr) {
  validationStr = validationStr.split('|');

  const validationData = {};

  for (const attribute of validationStr) {
    const [ key, value ] = attribute.split('=');
    if (value === undefined) {
      validationData[key] = true;
    } else {
      validationData[key] = value;
    }
  }

  return Object.keys(validationData).length ? validationData : null;
}

function formatNum(numStr) {
  numStr = numStr.split('.');

  let [ integer, decimal ] = 
    [ numStr[0].split('').reverse().join(''), numStr[1] ];
  let formattedNum = '';

  for (let i = 0; i < integer.length; i++) {
    if (i % 3 === 0 && i > 0) {
      formattedNum += ',';
    }
    formattedNum += integer[i];
  }

  return formattedNum.split('').reverse().join('') + (decimal != null ? '.' + decimal : '');
}

function formattedInputValuesToNum(...inputValues) {
  return inputValues.map(val => Number(val.replace(/[\,]/g, '')));
}

function validateForm(formElement) {
  const data = extractFormData(formElement);
  const keys = Object.keys(data);

  resetFormValidity(formElement);

  let isValid = true;

  for (const key of keys) {
    const inputElem = formElement.querySelector(`input[name="${key}"]`);
    const inputElemValidationData = extractValidationAttributes(inputElem.dataset.validation);

    if (!inputElem || !inputElem.required) continue;   
    
    const errorMessageElem = inputElemValidationData.type === 'radio' ? 
      inputElem.closest('div').nextElementSibling :
      inputElem.parentElement.nextElementSibling;

    if (!errorMessageElem) continue;
    
    if (!data[key]) {
      handleValidationError(inputElem, errorMessageElem, 'This field is required');
      isValid = false;
      continue;
    }

    if (inputElemValidationData.type === 'number') {
      const inputState = validateNumberField(inputElem.value, inputElemValidationData);

      if (!inputState.status) {
        handleValidationError(inputElem, errorMessageElem, inputState.message);
        isValid = false;
      }

      continue;
    }
  }

  return isValid ? {status: true, value: data} : {status: false, value: null};
}

export function validateNumberField(inputVal, inputValidationAttributes) {
  inputVal = Number(inputVal.replace(/[\,]/g, ''));
  const validationAttributes = inputValidationAttributes;
  const { min, max } = validationAttributes;

  let isValid = true;
  let inputMessage = 'Success';

  if (isNaN(inputVal)) {
    isValid = false;
    inputMessage = 'Input must be a valid number';
  } else if (min && inputVal < min) {
    isValid = false;
    inputMessage = `Input must be greater than or equal to ${formatNum(min.toString())}`;
  } else if (max && inputVal > max) {
    isValid = false;
    inputMessage = `Input must be less than or equal to ${formatNum(max.toString())}`;
  }

  return {status: isValid, message: inputMessage};
}

function showErrorMessage(errorMessageElem, message) {
  errorMessageElem.textContent = message;
  errorMessageElem.classList.remove('u-hidden');
}

function handleValidationError(inputElem, errorMessageElem, message) {
  showErrorMessage(errorMessageElem, message);

  const inputWrapper = inputElem.closest('.js-input-wrapper');
  if (inputWrapper) {
    inputWrapper.classList.add('calculator__input-wrapper--error');
  }
}

function clearErrorMessages(formElement) {
  formElement.querySelectorAll('.js-error-message').forEach(elem => {
    elem.textContent = '';
    elem.classList.add('u-hidden');
  });
}

function resetFormValidity(formElement) {
  formElement.querySelectorAll('.js-input-wrapper').forEach(elem => {
    elem.classList.remove('calculator__input-wrapper--error');
  });
  clearErrorMessages(formElement);
}

function resetForm(formElement) {
  const data = extractFormData(formElement);
  const keys = Object.keys(data);

  resetFormValidity(formElement);

  for (const key of keys) {
    const inputElem = formElement.querySelector(`input[name="${key}"]`);

    if (!inputElem) continue;

    if (inputElem.type === 'radio') {
      inputElem.click();
    } else {
      inputElem.value = '';
    }
  }
}

export function setupFormEventListeners() {
  const formElement = document.querySelector('.js-calculator');

  document.addEventListener('input', (e) => {
    const target = e.target;

    if (target.classList.contains('js-calculator-input')) {
      const validationInfo = extractValidationAttributes(target.dataset.validation);
      
      if (!validationInfo) return;
      if (validationInfo.type === 'number') {
        const cleanedValue = target.value.replace(/[^0-9\.]/g, '');
        
        let cleanedInput = '';
        let isDecimalFound = false;

        for (const char of cleanedValue) {
          if (char === '.') {
            if (!isDecimalFound) {
              cleanedInput += char;
              isDecimalFound = true;
            }
          } else {
            cleanedInput += char;
          }
        }

        target.value = formatNum(cleanedInput);
      }
    }
  });

  document.querySelector('.js-calculator-submit-button').addEventListener('click', (e) => {
    e.preventDefault();
  
    const formState = validateForm(formElement);
    if (formState.status) {
      const { mortgageAmount, mortgageTerm, interestRate, mortgageType } = formState.value;
      renderResultsSection(
        calculateMortgage(...formattedInputValuesToNum(mortgageAmount, mortgageTerm, interestRate), mortgageType)
      );
    }
  });

  document.querySelector('.js-clear-all-input-button').addEventListener('click', () => {
    resetForm(formElement);
  });
}

