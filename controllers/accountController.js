const utilities = require('../utilities')
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

/* *****
*   Deliver login view
* *****/
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("./account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* *****
*   Deliver registration view
* *****/
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("./account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* *****
*   Process Registration
* *****/
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        req.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if(regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'ve registered ${account_firstname}. Please log-in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        req.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
}

/* *****
*   Process Login
* *****/
async function loginAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body

    const logResult = await accountModel.loginAccount(
        account_email,
        account_password
    )

    
}

module.exports = { buildLogin, buildRegister, registerAccount }