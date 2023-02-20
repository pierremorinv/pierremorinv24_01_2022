var validator = require("email-validator");
module.exports = (req, res, next) => {
  const email = req.body.email;
  if (validator.validate(email)) {
    next();
  } else {
    res.status(400).json({
      error: "l'email n'est pas valide !",
    });
  }
};
