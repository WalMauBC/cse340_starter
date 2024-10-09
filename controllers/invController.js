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

/* *******************************************
 * Build vehicle details view
 * ******************************************* */
invCont.buildVehicleDetailsView = async function(req, res, next) {
    const inventoryId = req.params.inventoryId
    const data = await invModel.getInventoryItemByInvId(inventoryId)
    const details = await utilities.buildVehicleDetailsView(data)
    let nav = await utilities.getNav()
    const vehicleYear = data.inv_year
    const vehicleMake = data.inv_make
    const vehicleModel = data.inv_model
    res.render("./inventory/details", {
        title: `${data.inv_year} ${vehicleMake} ${vehicleModel}`,
        nav,
        details
    })
}
// Move module.exports outside of the function
module.exports = invCont;