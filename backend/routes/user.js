const express = require("express");
const router = express.Router();
const emailValidator = require("../middleware/emailValidator");
const passwordValidator = require("../middleware/passwordValidator");
const userCtrl = require("../controllers/user");

router.post("/signup/", passwordValidator, emailValidator, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
