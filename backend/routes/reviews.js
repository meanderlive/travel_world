import express from 'express'
import { createReview, getAllReviewsForTour } from './../controllers/reviewController.js'
import { verifyUser} from "../utils/verifyToken.js"

const router = express.Router()

router.post('/:tourId' ,createReview)
router.get('/get/:tourId', getAllReviewsForTour)
export default router