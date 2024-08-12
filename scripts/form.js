import { calculateMortgage } from './mortgage.js';
import { renderResultsSection } from './results.js';

function extractFormData(formElement) {
  if (!formElement) {
    return null;
  }

  const formValues = new FormData(formElement);
  return Object.fromEntries(formValues.entries());
}

function validateForm(formElement) {
  const data = extractFormData(formElement);
  const keys = Object.keys(data);

  resetFormValidity(formElement);

  let isValid = true;

  for (const key of keys) {
    const inputElem = formElement.querySelector(`input[name="${key}"]`);
    
    if (!inputElem || !inputElem.required) continue;   
    
    const errorMessageElem = inputElem.type === 'radio' ? 
      inputElem.closest('div').nextElementSibling :
      inputElem.parentElement.nextElementSibling;

    if (!errorMessageElem) continue;
    
    if (!data[key]) {
      isValid = false;
      showErrorMessage(errorMessageElem, 'This field is required');

      const inputWrapper = inputElem.closest('.js-input-wrapper');

      if (inputWrapper) {
        inputWrapper.classList.add('calculator__input-wrapper--error');
      }
      
      continue;
    }

    if (inputElem.type === 'number') {
      const inputState = validateNumberField(inputElem);

      if (!inputState.status) {
        showErrorMessage(errorMessageElem, inputState.message);
        inputElem.closest('.js-input-wrapper').classList.add('calculator__input-wrapper--error')
        isValid = false;
      }

      continue;
    }
  }

  return isValid ? {status: true, value: data} : {status: false, value: null};
}

export function validateNumberField(inputElem) {
  const inputVal = parseFloat(inputElem.value.replace(/\s/g, ''));
  const minVal = inputElem.min;
  const maxVal = inputElem.max;

  let isValid = true;
  let inputMessage ='Success'

  if (isNaN(inputVal)) {
    isValid = false;
    inputMessage = 'Number must be a valid number';
  } else if (minVal && inputVal < minVal) {
    isValid = false;
    inputMessage = `Number must be greater than ${minVal}`;
  } else if (maxVal && inputVal > maxVal) {
    isValid = false;
    inputMessage = `Number must be greater than ${maxVal}`;
  }

  return {status: isValid, message: inputMessage};
}

function showErrorMessage(errorMessageElem, message) {
  errorMessageElem.textContent = message;
  errorMessageElem.classList.remove('u-hidden');
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

  document.querySelector('.js-calculator-submit-button').addEventListener('click', (e) => {
    e.preventDefault();
  
    const formState = validateForm(formElement);
    if (formState.status) {
      const { mortgageAmount, mortgageTerm, interestRate, mortgageType } = formState.value;
      renderResultsSection(
        calculateMortgage(mortgageAmount, mortgageTerm, interestRate, mortgageType)
      );
    }
  });

  document.querySelector('.js-clear-all-input-button').addEventListener('click', () => {
    resetForm(formElement);
  });
}

