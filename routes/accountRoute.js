// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require('../utilities')
const accController = require('../controllers/accountController')
const regValidate = require('../utilities/account-validation')

// Get Route when 'My account' link is clicked
router.get("/", utilities.checkLogin, utilities.handleErrors(accController.buildAccountManagementView));
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
    utilities.handleErrors(accController.loginAccount)
)

router.get('/logout', utilities.checkLogin, utilities.handleErrors(accController.logoutAccount))

router.get(
    '/update/:account_id',
    utilities.checkLogin,
    utilities.handleErrors(accController.updateView)
)

// Account update
router.post(
    '/update',
    regValidate.updateAccountRules(),
    regValidate.checkUpdateData,
    utilities.checkLogin,
    utilities.handleErrors(accController.updateAccount)
)

// Password update
router.post(
    '/updatePassword',
    regValidate.updatePasswordRules(),
    regValidate.checkPasswordData,
    utilities.checkLogin,
    utilities.handleErrors(accController.updatePassword)
)

module.exports = router;