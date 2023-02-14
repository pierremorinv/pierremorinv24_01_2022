var validator = require("email-validator");
module.exports = (req, res, next) => {
  const email = req.body.email;
  if (validator.validate(email) == true) {
    next();
  } else {
    res.status(400).json({
      error: "l'email n'est pas valide !",
    });
  }
};
