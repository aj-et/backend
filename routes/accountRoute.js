// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require('../utilities')
const accController = require('../controllers/accountController')
const regValidate = require('../utilities/account-validation')

// Get Route when 'My account' link is clicked
router.get("/login", utilities.handleErrors(accController.buildLogin));
router.get("/register", utilities.handleErrors(accController.buildRegister));

router.post(
    '/register',
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accController.registerAccount)
)

router.post(
    '/login',
    regValidate.loginRules(),
    regValidate.checkLogData,
    (req, res) => {
        res.status(200).send('login process')
    }
)

module.exports = router;