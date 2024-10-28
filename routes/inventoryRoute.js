const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const { body } = require('express-validator');
const validate = require("../utilities/inventory-validation");
const invValidate = require("../utilities/inventory-validation"); // Ensure correct import

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// router.get("/detail/:invId", utilities.handleErrors(invController.getInventoryItemDetail));
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Route to get inventory items by classification (unique path)
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// New POST route for add-classification with basic validation
router.post('/add-classification', [
    body('classification_name')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Classification name cannot be empty.')
        .matches(/^[^\\s!@#$%^&*()_+={}|:;,.<>?`~]+$/)
        .withMessage('Classification name cannot contain spaces or special characters.')
], utilities.handleErrors(invController.addClassification));

// POST route to add inventory with validation
router.post('/add-inventory', [
    body('inv_make').trim().notEmpty().withMessage('Make cannot be empty.'),
    body('inv_model').trim().notEmpty().withMessage('Model cannot be empty.'),
    body('inv_year').isInt({ min: 1886 }).withMessage('Year must be a valid integer greater than 1886.'),
    body('classification_id').notEmpty().withMessage('You must select a classification.')
], utilities.handleErrors(invController.addInventory));

// Comment out duplicate routes
// router.post(
//     "/add-classification", 
//     invValidate.classificationRules(),
//     invValidate.checkClassificationName,
//     utilities.handleErrors(invController.addClassification)
// );

// router.post(
//     "/add-inventory",
//     invValidate.invRules(),
//     invValidate.checkInvName,
//     utilities.handleErrors(invController.addInventory)
// );

module.exports = router;