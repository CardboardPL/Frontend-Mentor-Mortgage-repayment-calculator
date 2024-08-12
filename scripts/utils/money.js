export function formatCurrency(num) {
  num = parseFloat(num);

  if (isNaN(num)) {
    return '';
  }

  const numStr = num.toFixed(2);
  let [ integer, decimal ] = numStr.split('.');

  integer = integer.split('').reverse();
  let formattedInteger = '';

  for (let i = 0; i < integer.length; i++) {
    if (i > 0 && i % 3 === 0) {
      formattedInteger += ',';
    }
    formattedInteger += integer[i];
  }

  return formattedInteger.split('').reverse().join('') + '.' + decimal;
};