const utilities = require(".")
const invModel = require("../models/inventory-model")
const reviewModel = require("../models/review-model")
const { body, validationResult } = require("express-validator")
const validate = {}

  /* **********************************
  *  Review Validation Rules
  * ********************************* */
 validate.reviewRules = () => {
    return [
        body("review_text")
        .trim()
        .notEmpty()
        .withMessage("Review text required.")
        .bail()
        .isLength({min: 10})
        .withMessage("Provide a review text of at least 10 characters."),
    ]
 }

 validate.checkNewReviewData = async (req, res, next) => {
    const { review_text, screen_name, inv_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        const invData = await invModel.getInventoryByInvId(inv_id)
        const reviewData = await reviewModel.getReviewsByInvId(inv_id)
        const grid = await utilities.buildInventoryDetailGrid(invData)
        const reviews = await utilities.buildInventoryReviewSection(reviewData)
        let nav = await utilities.getNav()
        const vehicleTitle = `${invData.inv_year} ${invData.inv_make} ${invData.inv_model}`
        res.render("./inventory/detail", {
          title: vehicleTitle,
          nav,
          grid,
          screen_name,
          reviews,
          review_text,
          inv_id,
          errors,
        })
        return
    }
    next()
 }

 validate.checkEditReviewData = async (req, res, next) => {
    const { review_id, review_text, review_date } = req.body

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        try {
            let nav = await utilities.getNav()

            res.render("review/edit-review", {
                title: "Edit Review",
                nav,
                errors,
                review_id,
                review_date,
                review_text
            })
            return
        } catch (err) {
            res.status(500).send("Server error while rendering the page.")
        }
    }
    next()
 }

 module.exports = validate