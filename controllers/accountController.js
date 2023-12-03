const utilities = require('../utilities')
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
require("dotenv").config()

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
        res.status(500).render("account/register", {
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
        // res.redirect('account/login')
        // Render does not change the link above
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
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
    const accountData = await accountModel.getAccountByEmail(account_email)
    if(!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }

    try {
        if(await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000 })
            return res.redirect("/account/")
        }
    } catch (error) {
        return new Error('Access Forbidden')
    }
}

/* **********************
 *   Account Management View
 * ********************* */
async function buildAccountManagementView(req, res) {
    let nav = await utilities.getNav()
    let {accountData} = res.locals.accountData
    res.render("account/account-management", {
        title: "Account Management",
        nav,
        errors: null,
    })
}

/* **********************
 *   Account Logout
 * ********************* */
async function logoutAccount(req, res) {
    res.clearCookie('jwt');
    return res.redirect("/");
}

/* **********************
 *   Account Update View
 * ********************* */
async function updateView (req, res) {
    let nav = await utilities.getNav()
    const accountId = parseInt(req.params.account_id)
    const accountData = await accountModel.getAccountById(accountId)
    res.render("account/account-update", {
        title: "Edit Account Info",
        nav,
        errors:null,
        account_id: accountId,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email
    })
}

/* **********************
 *   Process Account Update
 * ********************* */
async function updateAccount (req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    const result = await accountModel.updateAccount(account_firstname, account_lastname, account_email, account_id)
    const data = await accountModel.getAccountById(account_id)

    if(result) {
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
        res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000 })
        req.flash("notice", "Account updated successfully.")
        res.redirect('/account/')
    } else {
        req.flash('error', 'Account update failed. Please try again.')
        res.status(501).render("account/account-update", {
            title: "Edit Account Info",
            nav,
            errors: null,
            account_firstname,
            account_lastname,
            account_email,
            account_id
        })
    }
}

/* **********************
 *   Process Password Update
 * ********************* */
async function updatePassword (req, res) {
    let nav = await utilities.getNav()
    const { account_id, account_password, account_firstname, account_lastname, account_email } = req.body
    
    // Hash the password before storing
    let hashedPassword
    try {
        hashedPassword = bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the update password.')
        res.status(500).render("account/account-update", {
            title: "Edit Account Info",
            nav,
            errors: null,
        })
    }

    const accountId = parseInt(req.body.account_id)
    const accountData = await accountModel.getAccountById(accountId)
    const result = await accountModel.updatePassword(hashedPassword, account_id)

    if(result) {
        req.flash("notice", "Password updated successfully.")
        return res.redirect('/account/management', {
            title: "Account Management",
            nav,
            errors: null,
        })
    } else {
        req.flash('error', 'Password update failed. Please try again.')
        res.status(501).render("account/update", {
            title: "Edit Account Info",
            nav,
            errors: null,
            account_id: accountData.account_id,
            account_firstname: accountData.account_firstname,
            account_lastname: accountData.account_lastname,
            account_email: accountData.account_email,
            
        })
    }
}

module.exports = { buildLogin, buildRegister, registerAccount, loginAccount, buildAccountManagementView, logoutAccount, updateView, updateAccount, updatePassword }