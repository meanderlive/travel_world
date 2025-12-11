import mongoose from "mongoose";
import Tour from "../models/Tour.js";
import Review from "../models/Review.js";

export const createReview = async (req, res) => {
  const tourId = req.params.tourId; 
  console.log("Received tourId:", req.params.tourId);


  try {
      if (!mongoose.Types.ObjectId.isValid(tourId)) {
          return res.status(400).json({ success: false, message: "Invalid tour ID format." });
      }

      const tour = await Tour.findById(tourId);
      console.log("Received tourId:", tourId);

      if (!tour) {
          return res.status(404).json({ success: false, message: "Tour not found." });
      }
      const newReview = new Review({
          productId: tourId,
          ...req.body
      });

      const savedReview = await newReview.save();

      await Tour.findByIdAndUpdate(tourId, { 
          $push: { reviews: savedReview._id } 
      });

      res.status(200).json({ success: true, message: "Review submitted", data: savedReview });
  } catch (err) {
      console.error("Error submitting review:", err);
      res.status(500).json({ success: false, message: "Failed to submit.", error: err.message });
  }
};


export const getAllReviewsForTour = async (req, res) => {
  const tourId = req.params.tourId;

  try {
    const reviews = await Review.find({ productId: tourId })
      .populate("productId", "username")
      .sort({ createdAt: -1 }); // Adjust based on your Tour model fields
    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve reviews." });
  }
};
