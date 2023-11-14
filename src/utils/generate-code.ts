// Generate a 4 digits reset code
export const generateResetCode = () => {
  return Math.random().toString().substr(-4, 10);
};
