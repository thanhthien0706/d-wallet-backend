export const MessageError = {
  DEFAULT: (message: MessageName) => [`${message}`],
  NOT_FOUND: (content: MessageName) => [`${content} not found`],
  EXISTS: (content: MessageName) => [`${content} already exists`],
  INCORRECT: (content: MessageName) => [`${content} is incorrect`],
  ACCESS_DENIED: () => `access denied`,
  NOT_ENOUGH_MONEY: () => [`Money is not enough`],
  WEBHOOK_EVENT: (content: string) => [`${content}`],
  GET_BALANCE_ERROR: () => [`Error get balance`],
  SECONDPASSWORD_TOKEN_INVALID: () => [`Second password token invalid`],
  SEND_MAIL_ERROR: () => [`Can not send email`],
  NOT_FOUND_RESET_CODE_TOKEN: () => [`Not found reset code token`],
  NOT_FOUND_RESET_CODE: () => [`Not found reset code`],
  NOT_FOUND_RESET_PASSWORD_TOKEN: () => [`Not found reset password token`],
  RESET_PASSWORD_TOKEN_INVALID: () => [`reset password token is invalid`],
  RESET_CODE_IS_NOT_EXPIRES: () => [`Latest code is not expired`],
  RESET_CODE_TOKEN_INVALID: () => [`reset code token is invalid`],
  RESET_CODE_INVALID: () => [`reset code is invalid`],
};

export enum MessageName {
  IDTOKEN = 'idtoken',
  AMOUNT = 'Amount',
  USER = 'user',
  CARD = 'card',
  TRANSACTION = 'transaction',
  NOTIFICATION_SETTING = 'notification setting',
  SECOND_PASSWORD = 'Second Password',
  TOKEN_SECOND_PASSWORD = 'Token second password',
  LOCALBANK = 'Local bank',
}

export enum EmailSubject {
  RESET_PASSWORD = 'Reset password',
}
