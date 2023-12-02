const jwt = require("jsonwebtoken")
require("dotenv").config()
const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    // console.log(data.rows)
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => { 
            grid += '<li>'
            grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
            + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
            + 'details"><img src="' + vehicle.inv_thumbnail 
            +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
            +' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$' 
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else { 
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **************************************
* Build the inventory view HTML assignment 03
* ************************************ */
Util.buildInventoryGrid = async function(vehicleData) {
    if (!vehicleData || typeof vehicleData !== 'object') {
        return '<p>No vehicle found!</p>'
    }
    const formattedMiles = vehicleData.inv_miles.toLocaleString();
    const html = `
        <div class="vehicle">
            <div class='vehicle-image'>
                <img src=${vehicleData.inv_image} alt=${vehicleData.inv_make}>
            </div>
            <div class='vehicle-details'>
                <h3>${vehicleData.inv_make} ${vehicleData.inv_model} Details</h3>
                <div class='details'>
                    <h3 class='bg-gray'>Price: $${Intl.NumberFormat('en-US').format(vehicleData.inv_price)}</h3>
                    <p class='bg-non-gray'><span class='highlight'>Description:</span> ${vehicleData.inv_description}</p>
                    <p class='bg-gray'><span class='highlight'>Color:</span> ${vehicleData.inv_color}</p>
                    <p class='bg-non-gray'><span class='highlight'>Miles:</span> ${formattedMiles}</p>
                </div>
            </div>
        </div>
    `

    return html;
}

Util.buildClassificationOptions = async function (req, res, next) {
    let data = await invModel.getClassifications();
    let options = data.rows.map(row => ({
        value: row.classification_id,
        label: row.classification_name,
    }))
    return options;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("notice", "Please login to view this page.")
                    res.clearCookie("jwt")
                    return res.direct("/account/login")
                }
                res.locals.accountData = accountData
                res.locals.loggedIn = true
                next()
            }
        )
    } else {
        next()
    }
}

Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedIn) {
        next()
    } else {
        req.flash("notice", "Please login to view this page.")
        return res.redirect("/account/login")
    }
}

module.exports = Util