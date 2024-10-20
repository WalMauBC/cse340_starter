// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const { body } = require('express-validator'); // Import express-validator for validation
const validate = require("../utilities/inventory-validation");


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.getInventoryItemDetail));

// Route to get get inventory items by classification
router.get(
    "/getInventory/:classification_id", 
    utilities.handleErrors(invController.getInventoryJSON)
);

//router.get("/error", utilities.handleErrors(invController.buildError));

router.get("/", utilities.handleErrors(invController.buildManagement));
router.get("/add-classification", utilities.handleErrors(invController.getAddClassificationView));
//router.get("/add-inventory", utilities.handleErrors(invController.buildAddInv));

// ** New POST Route to Add Classification **
router.post('/add-classification', [
    body('classification_name')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Classification name cannot be empty.')
        .matches(/^[^\\s!@#$%^&*()_+={}|:;,.<>?`~]+$/)
        .withMessage('Classification name cannot contain spaces or special characters.')
], utilities.handleErrors(invController.addClassification))

/*Route to display the add inventory form
router.get(
    "/add-inventory",
    validate.inventoryRules(), // Added to test validation
    utilities.handleErrors(invController.getAddInventoryView)
)*/

// New POST Route to Add Inventory Item
router.post('/add-inventory', [
    body('inv_make').trim().notEmpty().withMessage('Make cannot be empty.'),
    body('inv_model').trim().notEmpty().withMessage('Model cannot be empty.'),
    body('inv_year').isInt({ min: 1886 }).withMessage('Year must be a valid integer greater than 1886.'),
    body('classification_id').notEmpty().withMessage('You must select a classification.'),
    
], utilities.handleErrors(invController.addInventory)); // Ensure this method exists in the controller

router.get('/edit/:inv_id', 
    utilities.handleErrors(invController.getEditInventoryView)
)

// Updated POST route to edit inventory
router.post('/edit/:inv_id', [
    body('inv_make').trim().notEmpty().withMessage('Make cannot be empty.'),
    body('inv_model').trim().notEmpty().withMessage('Model cannot be empty.'),
    body('inv_year').isInt({ min: 1886 }).withMessage('Year must be a valid integer greater than 1886.'),
    body('classification_id').notEmpty().withMessage('You must select a classification.'),
], utilities.handleErrors(invController.getEditInventoryView)); // Ensure this method exists in the controller

// New post route to update inventory
//router.post('/update/', invController.updateInventory)

// GET route for delete confirmation
router.get('/delete/:inv_id', 
    utilities.handleErrors(invController.getDeleteInventoryView)
)

// POST route for deleting an inventory item
router.post('/delete/', 
    utilities.handleErrors(invController.deleteInventoryItem)
)

// POST route for deleting an inventory item
router.post('/delete/:inv_id',
    utilities.handleErrors(invController.deleteInventoryItem)
)


//EL CODIGO SE ROMPRE CUANDO AGREGO ESTE CODIGO
//THE CODE BREAKS WHEN I ADD THIS CODE

/*router.post(
    "/add-classification", 
    invValidate.classificationRules(),
    invValidate.checkClassificationName,
    utilities.handleErrors(invController.addClassification)
)

router.post(
    "/add-inventory",
    invValidate.invRules(),
    invValidate.checkInvName,
    utilities.handleErrors(invController.addInventory)
)*/

router.get(
    "/getInventory/:classification_id",
    utilities.handleErrors(invController.getInventoryJSON)
)

module.exports = router;