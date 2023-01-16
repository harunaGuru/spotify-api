const validateName = (name) => {
  const nameRegex = new RegExp(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/);

  return nameRegex.test(name);
};

const validateEmail = (email) => {
  const emailReg = new RegExp(
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
    // /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    //"gm"
  );

  return emailReg.test(email);
};

const validatePassword = (password) => {
  const reg = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}/);

  return reg.test(password);
};
// console.log(validateEmail("haruna.dauda@gmail.com"))
// console.log(validatePassword("Haru123@"));
// console.log(validateName("haroon"))
module.exports = {
  validatePassword,
  validateEmail,
  validateName,
};
