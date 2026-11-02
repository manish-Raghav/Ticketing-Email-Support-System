const validatePassword = (password) => {

  if (!password || password.length < 8) {
    return "Password must contain at least 8 characters";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain one uppercase letter";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain one lowercase letter";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain one number";
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must contain one special character";
  }

  return null;
};

export default validatePassword;