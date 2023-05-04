const router = require("express").Router();
const { validateUser, validate, loginValidator } = require("../middlewares/validator");

// Require Controllers
const { createUser, loginUser, verifyEmail, forgotPassword, resetPassword } = require('../controllers/userControlers');
const { isResetTokenValid } = require("../middlewares/user");


// Routes
router.post("/create", validateUser, validate, createUser);
router.post("/signin", loginValidator, validate, loginUser);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post('/reset-password', isResetTokenValid, resetPassword)
router.get('/verify-token', isResetTokenValid, (req, res) => {
    res.json({success: true})
})


module.exports = router