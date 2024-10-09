/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const baseController = require("./controllers/baseController")
const pool = require("./database")
const utilities = require("./utilities/")

const app = express()

/* ***********************
 * Routes
 *************************/
/* View Engine and Templates */
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root


/*ROUTES*/
app.use(require("./routes/static"))
// iNDEX ROUTE - uNIT3, ACTIVITY
//app.get("/", utilities,handleErrors(baseController.buildHome))
// Inventory routes - Unit 3, activity
//app.use("/inv", require("./routes/inventory-route"))



/*Index Route*/
app.get("/", function(req, res) {
  res.render("index", {title: "Home"})
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
