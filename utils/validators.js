const isValidRegistration = (username, email, password, confirmedPassword) => {
  const errors = {};

  if (username.trim() === '') {
    errors.username = 'Username is required.';
  }
  if (email.trim() === '') {
    errors.email = 'Email is required.';
  } else {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email.match(re)) {
      errors.email = 'Email is invalid.';
    }
  }
  if (password.trim() === '') {
    errors.password = 'Password is required.';
  } else if (password !== confirmedPassword) {
    errors.password = 'Passwords do not match.';
  }

  return { errors, valid: Object.keys(errors) < 1 };
};

function isValidLogin(username, password) {
  const errors = {};
  if (username.trim() === '') {
    errors.username = 'Username is required.';
  }
  if (password.trim() === '') {
    errors.password = 'Password is required.';
  }

  return { errors, valid: Object.keys(errors).length < 1 };
}

module.exports = { isValidRegistration, isValidLogin };
