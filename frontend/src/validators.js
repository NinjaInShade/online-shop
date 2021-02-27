function emailValidate(value) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(value).toLowerCase()) ? "default" : "Not an email";
}

function passwordValidate(value) {
  if (value.length < 8) {
    return "Must be atleast 8 chars";
  }

  return "default";
}

function nameValidate(value) {
  if (value.length > 15) {
    return "Cannot exceed 15 chars";
  }

  return "default";
}

module.exports = {
  emailValidate,
  passwordValidate,
  nameValidate,
};
