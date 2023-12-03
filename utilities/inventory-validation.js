const utilities = require(".")
const invModel = require("../models/inventory-model")

const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Add New Classification Validation Rules
 * ********************************* */
validate.addNewClassificationRules = () => {
    return [
        // Classification name is required
        body("classification_name")
        .trim()
        .isAlpha()
        .withMessage("Classification name does not meet the requirements."),
    ]
}

/* ******************************
 * Check data and return errors or continue to add new classification
 * ***************************** */
validate.checkNewClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

/*  **********************************
 *  Add New Inventory Validation Rules
 * ********************************* */
validate.addNewInventoryRules = () => {
    return [
        // classification_id is required
        body("classification_id")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please select from the classification."),
        
        // inv_make is required
        body("inv_make")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Please enter a minimum of 3 characters on make."),

        // inv_model is required
        body("inv_model")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Please enter a minimum of 3 characters on model."),

        // inv_description is required
        body("inv_description")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Please enter description."),

        // inv_image is required
        body("inv_image")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Image path is invalid."),

        // inv_thumbnail is required
        body("inv_thumbnail")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Image path is invalid."),

        // inv_price is required
        body("inv_price")
            .trim()
            .isNumeric()
            .withMessage("Please enter a price."),

        // inv_year is required
        body("inv_year")
            .trim()
            .isLength({ min: 4, max: 4 })
            .isNumeric()
            .matches(/^(19[0-9]\d|20\d{2})$/)
        .withMessage("Please enter a valid year between 1900 - 2099."),

        // inv_miles is required
        body("inv_miles")
            .trim()
            .isLength({ min: 1 })
            .isNumeric()
        .withMessage("Please a valid mileage."),

        // inv_color is required
        body("inv_color")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please enter a valid color."),
    ]
}

/* ******************************
 * Check data and return errors or continue to add new inventory
 * ***************************** */
validate.checkNewInventoryData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const options = await utilities.buildClassificationOptions();
        res.render("inventory/add-inventory", {
            errors,
            title: "Add New Inventory",
            nav,
            options,
            classification_id,
            inv_make, inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
        })
        return
    }
    next()
}

/* ******************************
 * Check data and return errors or continue to update the inventory by inv_id
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { classification_id, inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const options = await utilities.buildClassificationOptions();
        res.render("inventory/add-inventory", {
            errors,
            title: "Edit" + inv_make + " " + inv_model,
            nav,
            options,
            classification_id,
            inv_id,
            inv_make, 
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
        })
        return
    }
    next()
}

module.exports = validate