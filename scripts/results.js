import { formatCurrency } from './utils/money.js';

function generateResultHTML(results) {
  const monthlyMortgagePayment = results.monthlyMortgagePayment;
  const totalMortgagePayment = results.totalMortgagePayment;

  if (!monthlyMortgagePayment || !totalMortgagePayment) {
    console.error('Invalid object was passed to the function');
    return `
      <h2 class="results__header">An error has occured</h2>

      <p class="results__message">
        An error has occured. Please try again or reload the page.
      </p>
    `;
  }

  return `
    <h2 class="results__header">Your results</h2>

    <p class="results__message">
      Your results are shown below based on the information you provided. 
      To adjust the results, edit the form and click “calculate repayments” again.
    </p>

    <div class="results__values">
      <p>Your monthly repayments</p>
      <span class="result__monthly-payment">£${formatCurrency(results.monthlyMortgagePayment)}</span>

      <hr>

      <p>Total you'll repay over the term</p>
      <span class="result__total-payment">£${formatCurrency(results.totalMortgagePayment)}</span>
    </div>
  `;
}

export function renderResultsSection(values) {
  const resultsSectionElem = document.querySelector('.results');
  resultsSectionElem.classList.remove('results--empty');
  resultsSectionElem.classList.add('results--complete');
  resultsSectionElem.innerHTML = generateResultHTML(values);
}