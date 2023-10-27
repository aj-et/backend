const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
    const nav = await utilities.getNav()
    res.render("index", {title: "Home", nav})
}

baseController.errorHandler = async function (req, res, next) {
    const nav = await utilities.getNav()
    const title = 'Error: 500'
    let errImg = '/images/site/rick-roll.gif'
    const message = 'Oh no! You have been rickrolled. Maybe try a different route?'
    res.render("errors/error", {
        nav,
        title,
        message,
        errImg
    })
}

module.exports = baseController