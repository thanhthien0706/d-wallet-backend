export const CARD_NUMBER_PATTERN = /^[0-9]{13,19}$/;
export const CVC_NUMBER_PATTERN = /^[0-9]{3,4}$/;
export const NAME_PATTERN =
  /^[a-zA-ZàáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệđĐìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựýỳỷỹỵ ]*$/;
export const PASSWORD_NOT_CONTAIN_VIETNAMESE = /^[a-zA-Z0-9!@#$%^&*, ]*$/;
export const PASSWORD_CONTAIN_SPECIAL_CHARACTER = /[!@#$%^&*,]/;
export const CONTAIN_UPPER_CASE = /[A-Z]/;
export const CONTAIN_LOWER_CASE = /[a-z]/;
export const CONTAIN_DIGIT = /[0-9]/;
