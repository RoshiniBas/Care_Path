import {
  X,
  MapPin,
  Clock,
  Navigation,
  Star,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

type Facility = {
  name: string;
  type: string;
  distance: string;
  location: string;
  open: string;
  specialties: string;
  address?: string;
  phone?: string;
  rating?: number;
  reviewCount?: number;
};

type Review = {
  rating: number;
  comment: string;
  createdAt: string;
};

type FacilityDetailsModalProps = {
  facility: Facility;
  onClose: () => void;
};

export default function FacilityDetailsModal({
  facility,
  onClose,
}: FacilityDetailsModalProps) {
  const navigate = useNavigate();

  const storageKey = `carepath-reviews-${facility.name}`;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const savedReviews = localStorage.getItem(storageKey);

    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch {
        setReviews([]);
      }
    }
  }, [storageKey]);

  const seededRating = facility.rating ?? 0;
  const seededReviewCount = facility.reviewCount ?? 0;

  const totalReviewCount = seededReviewCount + reviews.length;

  const reviewRatingTotal = reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );

  const averageRating =
    totalReviewCount > 0
      ? (
          (seededRating * seededReviewCount + reviewRatingTotal) /
          totalReviewCount
        ).toFixed(1)
      : "0.0";

  const submitReview = () => {
    if (selectedRating === 0) {
      alert("Please select a rating first.");
      return;
    }

    const newReview: Review = {
      rating: selectedRating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    const updatedReviews = [...reviews, newReview];

    setReviews(updatedReviews);

    localStorage.setItem(
      storageKey,
      JSON.stringify(updatedReviews)
    );

    setSelectedRating(0);
    setComment("");

    alert("Thank you! Your review has been submitted.");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="facility-modal"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="modal-header">
          <div>
            <span className="modal-type">{facility.type}</span>

            <h2>{facility.name}</h2>

            {/* Rating */}
            <div className="facility-rating-summary">

              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    fill={
                      star <= Math.round(Number(averageRating))
                        ? "#f5b301"
                        : "none"
                    }
                    color="#f5b301"
                  />
                ))}
              </div>

              <strong>{averageRating}</strong>

              <span>
                ({totalReviewCount} reviews)
              </span>

            </div>
          </div>

          <button
            className="modal-close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Details */}
        <div className="modal-details">

          <div className="modal-detail">
            <MapPin size={18} />

            <div>
              <span>Location</span>
              <strong>{facility.location}</strong>
            </div>
          </div>

          {facility.address && (
            <div className="modal-detail">
              <MapPin size={18} />

              <div>
                <span>Address</span>
                <strong>{facility.address}</strong>
              </div>
            </div>
          )}

          {facility.phone && (
            <div className="modal-detail">
              <span>📞</span>

              <div>
                <span>Phone</span>

                <a
                  href={`tel:${facility.phone.replace(
                    /[^+\d]/g,
                    ""
                  )}`}
                  className="modal-phone"
                >
                  {facility.phone}
                </a>
              </div>
            </div>
          )}

          <div className="modal-detail">
            <Clock size={18} />

            <div>
              <span>Opening hours</span>
              <strong>{facility.open}</strong>
            </div>
          </div>

          <div className="modal-detail">
            <Navigation size={18} />

            <div>
              <span>Distance</span>
              <strong>{facility.distance}</strong>
            </div>
          </div>

        </div>

        {/* Specialties */}
        <div className="modal-section">
          <h3>Available services</h3>
          <p>{facility.specialties}</p>
        </div>

        {/* Rating section */}
        <div className="rating-section">

          <div className="rating-section-header">
            <div>
              <h3>Patient ratings</h3>

              <p>
                Share your experience with this facility.
              </p>
            </div>

            <div className="large-rating">
              <strong>{averageRating}</strong>

              <span>
                out of 5
              </span>
            </div>
          </div>

          {/* User rating */}
          <div className="rate-hospital">

            <h4>Rate this hospital</h4>

            <div className="interactive-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="star-button"
                  onMouseEnter={() =>
                    setHoverRating(star)
                  }
                  onMouseLeave={() =>
                    setHoverRating(0)
                  }
                  onClick={() =>
                    setSelectedRating(star)
                  }
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    size={28}
                    fill={
                      star <=
                      (hoverRating || selectedRating)
                        ? "#f5b301"
                        : "none"
                    }
                    color="#f5b301"
                  />
                </button>
              ))}
            </div>

            <textarea
              className="review-input"
              placeholder="Write a review about your experience..."
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              rows={3}
            />

            <button
              className="submit-review-button"
              onClick={submitReview}
            >
              Submit Review
            </button>

          </div>

          {/* User reviews */}
          {reviews.length > 0 && (
            <div className="reviews-list">

              <h4>Your reviews</h4>

              {reviews.map((review, index) => (
                <div
                  className="review-card"
                  key={index}
                >

                  <div className="review-card-header">

                    <div className="review-stars">
                      {[1, 2, 3, 4, 5].map(
                        (star) => (
                          <Star
                            key={star}
                            size={14}
                            fill={
                              star <= review.rating
                                ? "#f5b301"
                                : "none"
                            }
                            color="#f5b301"
                          />
                        )
                      )}
                    </div>

                    <span>
                      You
                    </span>

                  </div>

                  {review.comment && (
                    <p>{review.comment}</p>
                  )}

                </div>
              ))}

            </div>
          )}

        </div>

        {/* Actions */}
        <div className="modal-actions">

          <button
            className="modal-primary"
            onClick={() => {
              onClose();

              navigate("/appointments", {
                state: { facility },
              });
            }}
          >
            Request Appointment
          </button>

          <button
            className="modal-secondary"
            onClick={() => {
              onClose();

              navigate("/directions", {
                state: { facility },
              });
            }}
          >
            <Navigation size={16} />
            Get Directions
          </button>

        </div>

      </div>
    </div>
  );
}