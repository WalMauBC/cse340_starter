const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;

  // Render the view and pass the nav variable along with others
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav, // Pass the nav variable here
    grid,
  });
};

// Move module.exports outside of the function
module.exports = invCont;