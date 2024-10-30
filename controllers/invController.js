const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build details by vehicleDetails view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryByInvId(inv_id)
  const vehicle = data
  const content = await utilities.buildDetailView(vehicle)
  let nav = await utilities.getNav()
  const vehicleName = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
  res.render("./inventory/vehicleDetails", {
    title: vehicleName,
    nav,
    content
  })
}

invCont.buildError = async function (req, res, next) {
  const inv_id = 100
  const data = await invModel.getInventoryByInvId(inv_id)
  const vehicle = data
  const content = await utilities.buildInventoryDetails(vehicle)
  let nav = await utilities.getNav()
  const vehicleName = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
  res.render("./inventory/vehicleDetails", {
    title: vehicleName,
    nav,
    content
  })
}

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationSelect
  })
}


invCont.buildAddView = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    nav,
    title: "Add New Classification",
    errors: null
  })
}

invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  
  let addResult = await invModel.addClassification(classification_name)
  nav = await utilities.getNav()
  
  if (addResult) {
    req.flash(
      "notice",
      `You have added a new classification ${classification_name}`
    )

    res.redirect("/inv")
  } else {
    req.flash("notice", "Adding classification failed.")
    res.status(501).render("./inventory/add-classification", {
      nav,
      title: "Add Classification",
      errors: null,
    })
  }
}

invCont.buildAddInv = async function(req, res, next) {
  let nav = await utilities.getNav()
  let classificationNames = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    nav,
    title: "Add New Vehicle",
    classificationNames,
    errors: null
  })
}

invCont.addInventory = async function(req, res, next) {
  let nav = await utilities.getNav()
  const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
  } = req.body
  const vehicle = `${inv_year} ${inv_make} ${inv_model}`
  
  let addResult = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
  let classificationNames = utilities.buildClassificationList(classification_id)
  
  if (addResult) {
    req.flash("notice", `${vehicle} has been added to the inventory`)
    res.redirect("/inv")
  } else {
    req.flash("notice", "Adding vehicle failed")
    res.status(501).render("./inventory/add-inventory", {
      nav,
      title: "Add New Vehicle",
      classificationNames,
      errors: null,
    })
  }
  
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit item view
 * ************************** */
invCont.editInvItemView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const inventoryData = await invModel.getInventoryByInvId(inv_id)
  console.log(inventoryData)
  const classificationSelect = await utilities.buildClassificationList(inventoryData.classification_id)
  const itemName = `${inventoryData.inv_make} ${inventoryData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: inventoryData.inv_id,
    inv_make: inventoryData.inv_make,
    inv_model: inventoryData.inv_model,
    inv_year: inventoryData.inv_year,
    inv_description: inventoryData.inv_description,
    inv_image: inventoryData.inv_image,
    inv_thumbnail: inventoryData.inv_thumbnail,
    inv_price: inventoryData.inv_price,
    inv_miles: inventoryData.inv_miles,
    inv_color: inventoryData.inv_color,
    classification_id: inventoryData.classification_id
  })
}

/* ***************************
 *  Update Vehicle Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
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
    classification_id
  } = req.body

  const updateResult = await invModel.updateInventory(
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
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("message success", itemName+' was successfully updated.')
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("message warning", "Sorry, the insert failed.")
    res.status(501).render("inventory/editInventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.deleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInvId(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* ***************************
 *  Delete Inventory Item
 *  Unit 5, Delete Activity
 * ************************** */
invCont.deleteItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id  = parseInt(req.body.inv_id)
 
  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult) {
    req.flash("message success", 'The deletion was successful.')
    res.redirect('/inv/')
  } else {
    req.flash("message warning", 'Sorry, the delete failed.')
    res.redirect("/inv/delete/inv_id")
  }
}

module.exports = invCont