export const MessageNotificationContents = {
  RECEIVE_FROM: (amount) => `Amount: \$${amount / 100}`,
  DEPOSIT_SUCCESS: (amount, nameBankAccount) =>
    `Dear customer, your deposit of \$${
      amount / 100
    } from ${nameBankAccount} has been successfully processed.`,
  WITHDRAW_SUCCESS: (amount, nameLocalBank) =>
    `Dear customer, your withdrawal of \$${
      amount / 100
    } from your wallet to your local bank account ${nameLocalBank} has been successfully processed`,
  TRANSFER_SUCCESS: (amount, userName) =>
    `You have successfully transferred \$${amount / 100} to ${userName}.`,
};
