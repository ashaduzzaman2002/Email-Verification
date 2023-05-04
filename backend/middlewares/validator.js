const { check, validationResult } = require("express-validator");
const { sendError } = require("../utils/helper");

exports.validateUser = [
  check("name").trim().not().isEmpty().withMessage("Name is required"),
  check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password should atleast 6 characters"),
];

exports.loginValidator = [
  check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  check("password").trim().not().isEmpty().withMessage("Password is required"),
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req).array();

  if (!errors.length) return next();

  sendError(res, errors[0].msg, 400)
};
