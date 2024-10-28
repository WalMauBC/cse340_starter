const utilities = require("../utilities")
const reviewModel = require("../models/review-model")
const invCont = require("../controllers/invController")

const reviewCont = {}
/* ***************************
 *  Add New Review
 * ************************** */
reviewCont.addReview = async function(req, res, next) {
    const { review_text, inv_id, account_id } = req.body

    try {

        const addResult = await reviewModel.addReview(review_text, inv_id, account_id)

        if (!addResult) {
            req.flash("notice", "Something went wrong. Failed to add review.")
        }
        // refresh the page with the new review
        res.redirect(`/inv/detail/${inv_id}`)

    } catch (error) {
        console.error("Error adding review: ", error)
    }
}

/* ***************************
 *  Build Edit Review
 * ************************** */
reviewCont.buildEditReview = async function (req, res, next) {
    let nav = await utilities.getNav()
    const review_id = parseInt(req.params.review_id)
    const reviewData = await reviewModel.getReviewByReviewId(review_id)
    
    if (reviewData) {
        const reviewDate = new Date(reviewData.review_date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})
        res.render("review/edit-review", {
            title: "Edit Review",
            nav,
            errors: null,
            review_id: reviewData.review_id,
            review_date: reviewDate,
            review_text: reviewData.review_text,
        })
    }
}

/* ***************************
 *  Build Delete Review
 * ************************** */
reviewCont.buildDeleteReview = async function(req, res, next) {
    const review_id = parseInt(req.params.review_id)
    let nav = await utilities.getNav()
    const reviewData = await reviewModel.getReviewByReviewId(review_id)
    
    if (reviewData) {
        const reviewDate = new Date(reviewData.review_date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})
        res.render("review/delete-review", {
            title: "Delete Review",
            nav,
            errors: null,
            review_id,
            review_date: reviewDate,
            review_text: reviewData.review_text,
        })
    }
}

/* ***************************
 *  Edit Review
 * ************************** */
  reviewCont.editReview = async function (req, res, next) {
    const { review_id, review_text } = req.body
    let nav = await utilities.getNav()

    const addResult = await reviewModel.editReview(review_id, review_text)
    
    if (addResult) {
        req.flash("notice", "The review has been successfully updated.")
        res.redirect("/account")
    } else {
        req.flash("notice", "Sorry the edit failed.")
        res.status(500).render("review/edit-review", {
            nav,
            errors: null,
            review_id,
            review_text,
        })
    }

}

/* ***************************
 *  Delete Review
 * ************************** */
reviewCont.deleteReview = async function(req, res, next) {
    let nav = await utilities.getNav()
    const { review_id, review_text, review_date } = req.body

    const deleteResult = await reviewModel.deleteReview(review_id)
    if (deleteResult) {
        req.flash("notice", "The review has been successfully deleted.")
        res.redirect("/account")
    } else {
        req.flash("notice", "Sorry, the delete failed.")
        res.status(501).render("review/delete-review"), {
            title: "Delete",
            nav,
            errors: null,
            review_id,
            review_text,
            review_date,
        }
    }
}
module.exports = reviewCont