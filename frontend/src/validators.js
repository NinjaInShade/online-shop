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

function titleValidate(value) {
  if (value.length > 15) {
    return "Cannot exceed 15 chars";
  }

  return "default";
}

function descriptionValidate(value) {
  if (value.length > 50) {
    return "Cannot exceed 50 chars";
  }

  if (value.length < 8) {
    return "Minimum 8 chars";
  }

  return "default";
}

function priceValidate(value) {
  if (isNaN(value) === true) {
    return "Must be a number";
  }

  // eslint-disable-next-line
  if (value == 0) {
    return "Cannot be £0";
  }

  return "default";
}

module.exports = {
  emailValidate,
  passwordValidate,
  nameValidate,
  titleValidate,
  descriptionValidate,
  priceValidate,
};
