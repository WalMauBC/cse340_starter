// Needed Resources
const express = require("express")
const router = new express.Router()
const servErrorController = require("../controllers/servErrorController")

// Route to build error server view
router.get("/", servErrorController.throwServerError)

module.exports = router;