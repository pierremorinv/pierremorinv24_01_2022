var passwordValidator = require("password-validator");
var passwordSchema = new passwordValidator();

passwordSchema
  .is()
  .min(8) // Minimum 8 caractère
  .is()
  .max(100) // Maximum 100 caractère
  .has()
  .uppercase(1) // Mettre des majuscules
  .has()
  .lowercase() // Mettre des minuscule
  .has()
  .digits(2) // Mettre 2 chiffres
  .has()
  .not()
  .spaces(); // Ne pas voir d'espace

module.exports = (req, res, next) => {
  const password = req.body.password;
  if (passwordSchema.validate(password)) {
    next();
  } else {
    return res.status(400).json({
      error: "Le mot de passe n'est pas assez fort",
    });
  }
};
