// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require('../utilities')
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")

// Route to management
router.get("/", utilities.handleErrors(invController.buildManagementView));
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// assignment 03
router.get("/detail/:inv_id", invController.buildByInventoryId);

router.post(
    "/add-classification",
    invValidate.addNewClassificationRules(),
    invValidate.checkNewClassificationData,
    utilities.handleErrors(invController.addNewClassification)
);

router.post(
    "/add-inventory",
    invValidate.addNewInventoryRules(),
    invValidate.checkNewInventoryData,
    utilities.handleErrors(invController.addNewInventory)
);


module.exports = router;