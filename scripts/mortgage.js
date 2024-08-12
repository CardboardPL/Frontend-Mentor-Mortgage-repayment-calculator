export function calculateMortgage(principal = 0, loanTerm = 0, interestRate = 0, typeOfLoan = null) {
  if (principal <= 0 || interestRate <= 0 || loanTerm <= 0 || !typeOfLoan) {
    return null;
  }

  interestRate = interestRate / 100 / 12;
  const principalInCents = principal * 100;
  const numberOfMonths = loanTerm * 12;

  const mortgagePayments = {
    'Repayment': principalInCents * interestRate * (1 + interestRate) ** numberOfMonths / ((1 + interestRate) ** numberOfMonths - 1), 
    'Interest Only': principalInCents * interestRate,
  }

  if (!mortgagePayments.hasOwnProperty(typeOfLoan)) {
    return null;
  }
  
  const monthlyPayment = mortgagePayments[typeOfLoan];
  const monthlyMortgagePayment = Math.round(monthlyPayment) / 100;
  const totalMortgagePayment = Math.round(monthlyPayment * numberOfMonths) / 100;
  
  return { monthlyMortgagePayment, totalMortgagePayment };
}