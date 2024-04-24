//index.js in /Utils
export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const validatePassword = (password) => {
  return password.length >= 6 ? true : false;
};

export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const isCompanyBalanceValid = (input) => {
  if (!parseFloat(input)) return false;

  var pattern = /^\d{1,8}(\.\d{1,2})?$/;
  return pattern.test(input);
};

export const isValidCompanySeats = (input) => {
  var pattern = /^\d(,\d)*$/;
  return pattern.test(input);
};

export const isJSONObject = (obj) => {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  try {
    JSON.stringify(obj);
    return true;
  } catch (e) {
    return false;
  }
};

export const isJSONString = (str) => {
  if (typeof str !== "string") {
    return false;
  }
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};
