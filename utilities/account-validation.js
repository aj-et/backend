const utilities = require(".")
const accountModel = require("../models/account-model")

const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
    return [
        // valid email is required and cannot already exist in the DB
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if (!emailExists){
                throw new Error("Account does not exist. Please log in or use different email")
            }
        }),
    ]
}

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLogData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Logged in",
            nav,
            account_email
        })
        return
    }
    next()
}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent.
    
        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."), // on error this message is sent.
    
        // valid email is required and cannot already exist in the DB
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if (emailExists){
                throw new Error("Email exists. Please log in or use different email")
            }
        }),
    
        // password is required and must be strong password
        body("account_password")
            .trim()
            .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/* ******************************
 * Account Update Validation Rules 
 * ***************************** */
validate.updateAccountRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent.
    
        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."), // on error this message is sent.
    
        // valid email is required and cannot already exist in the DB
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
    ]
}

/* ******************************
 * Password Update Validation Rules 
 * ***************************** */
validate.updatePasswordRules = () => {
    return [
        // password is required and must be strong password
        body("account_password")
            .trim()
            .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            })
            .withMessage("Password does not meet requirements.")
    ]
}

/* ******************************
 * Check data and return errors or continue to update account
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/account-update", {
            errors,
            title: "Edit Account Info",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/* ******************************
 * Check data and return errors or continue to update password
 * ***************************** */
validate.checkPasswordData = async (req, res, next) => {
    const accountId = parseInt(req.body.account_id)
    const accountData = await accountModel.getAccountById(accountId)
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/account-update", {
            errors,
            title: "Edit Account Info",
            nav,
            account_id: accountData.account_id,
            account_firstname: accountData.account_firstname,
            account_lastname: accountData.account_lastname,
            account_email: accountData.account_email,
        })
        return
    }
    next()
}

module.exports = validate