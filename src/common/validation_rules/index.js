const validationRule = {
  required: (value) => (value ? undefined : "Required"),

  passwordMatch: (value1, value2) =>
    value1 !== '' && value1 === value2 ? "Old password and new password should not be the same!" : undefined,

  passwordNotMatch: (value1, value2) =>
    value1 !== '' && value1 !== value2 ? "Confirm password does not match" : undefined,

  password: (value) =>
    value &&
    !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{3,15}$/.test(value)
      ? "Password must include uppercase, lowercase, number, special character, and be 3–15 characters long."
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
