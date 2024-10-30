const pool = require("../database/")
/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}
/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getClassificationsById error " + error)
  }
}
async function getInventoryByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
       WHERE i.inv_id = $1`,
       [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryByInvId error " + error)
  }
}
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1)"
    const data = await pool.query(sql, [classification_name])
    return data.rows
  } catch (error) {
    console.error("Failed to add classification name: ", error)
  }
}
async function checkExistingName(classification_name) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const name = await pool.query(sql, [classification_name])
    return name.rowCount
  } catch(error) {
    console.error(error.message)
    return 'This classification name already exists'
  }
}
async function addInventory(
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
) {
  try {
    const sql = "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)"
    const data = await pool.query(sql, [ inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, ])
    return data.rowCount
  }
   catch (error) {
    console.error("Adding vehicle data failed")
  }
}
async function deleteInventoryItem (inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1"
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
    new Error("Delete Inventory Error")
  }
}
module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInvId, addClassification, checkExistingName, addInventory, deleteInventoryItem}
