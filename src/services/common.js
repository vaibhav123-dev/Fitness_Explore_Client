import { emailValidation } from "../constants";

const validateEmail = (email) => {
  // Regular expression for email validation
  const re = emailValidation;
  return re.test(email);
};

const passwordsMatch = (formData) => {
  return formData.password === formData.confirm_password;
};

export { validateEmail, passwordsMatch };
