const validationRule = {
  required: (value) => (value ? undefined : "Required"),

  passwordMatch: (value1, value2) =>
    value1 !== '' && value1 === value2 ? "Old password and new password should not be the same!" : undefined,

  passwordNotMatch: (value1, value2) =>
    value1 !== '' && value1 !== value2 ? "Confirm password does not match" : undefined,

  password: (value) =>
    value &&
    !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9\s]).{8,64}$/.test(value)
      ? "Password must be 8–64 characters and include an uppercase letter, a lowercase letter, a number and a special character."
      : undefined,

  email: (value) =>
    value &&
    !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}(\.[0-9]{1,3}){3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      value
    )
      ? "Invalid email address"
      : undefined,

  urlMatch: (value) =>
    value &&
    !/(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-F\d]{2})+(:([\d\w]|%[a-fA-F\d]{2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,63}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-F\d]{2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-F\d]{2})=?)*)?(#([-+_~.\d\w]|%[a-fA-F\d]{2})*)?/.test(
      value
    )
      ? "Invalid URL"
      : undefined,
};

export default validationRule;
