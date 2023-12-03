// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require('../utilities')
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")

// Route to management
router.get(
    "/",
    utilities.checkLogin,
    utilities.isAuthorized,
    utilities.handleErrors(invController.buildManagementView)
);

router.get(
    "/add-classification", 
    utilities.checkLogin,
    utilities.isAuthorized,
    utilities.handleErrors(invController.buildAddClassification)
);

router.get(
    "/add-inventory", 
    utilities.checkLogin,
    utilities.isAuthorized,
    utilities.handleErrors(invController.buildAddInventory)
);

// Route to build inventory by classification view
router.get(
    "/type/:classificationId",
    invController.buildByClassificationId
);

// assignment 03
router.get(
    "/detail/:inv_id",
    invController.buildByInventoryId
);

router.post(
    "/add-classification",
    utilities.checkLogin,
    utilities.isAuthorized,
    invValidate.addNewClassificationRules(),
    invValidate.checkNewClassificationData,
    utilities.handleErrors(invController.addNewClassification)
);

router.post(
    "/add-inventory",
    utilities.checkLogin,
    utilities.isAuthorized,
    invValidate.addNewInventoryRules(),
    invValidate.checkNewInventoryData,
    utilities.handleErrors(invController.addNewInventory)
);

router.get(
    "/getInventory/:classification_id",
    utilities.checkLogin,
    utilities.isAuthorized,
    utilities.handleErrors(invController.getInventoryJSON)
)

router.get(
    "/edit/:inv_id",
    utilities.checkLogin,
    utilities.isAuthorized,
    utilities.handleErrors(invController.editInventoryView)
)

router.post(
    "/update/",
    utilities.checkLogin,
    utilities.isAuthorized,
    invValidate.addNewInventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

router.get(
    '/delete/:inv_id',
    utilities.checkLogin,
    utilities.isAuthorized,
    utilities.handleErrors(invController.deleteInventoryView)
)

router.post(
    '/delete',
    utilities.checkLogin,
    utilities.isAuthorized,
    utilities.handleErrors(invController.deleteInventory)
)


module.exports = router;