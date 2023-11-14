import BigNumber from 'bignumber.js';

const divAmount = (amount: string | number, n: string | number) => {
  return BigNumber(amount).div(n);
};

const plusAmount = (amount: string | number, n: string | number) => {
  return BigNumber(amount).plus(n);
};

const minusAmount = (amount: string | number, n: string | number) => {
  return BigNumber(amount).minus(n);
};

const multiplyAmount = (amount: string | number, n: string | number) => {
  return BigNumber(amount).multipliedBy(n);
};

/**
 * If the amount is greater than n, return true, else return false.
 * @param {string | number} amount - string | number
 * @param {string} n - The amount you want to check against
 * @returns A function that takes two arguments, amount and n.
 */
const checkAmount = (amount: string, n: string) => {
  const check = BigNumber(amount).comparedTo(n);
  return check === 1 ? true : false;
};

export { divAmount, plusAmount, minusAmount, multiplyAmount, checkAmount };
