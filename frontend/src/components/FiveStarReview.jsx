import React, { useState } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";

const FiveStarReview = ({ avgRating, allowRating }) => {
  const [rating, setRating] = useState(avgRating || 0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRatingClick = (value) => {
    setRating(value);
    if (onRatingSelect) onRatingSelect(value);
  };

  const handleMouseEnter = (value) => {
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          onClick={() => allowRating && handleRatingClick(star)}
          onMouseEnter={() =>allowRating &&  handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
        >
          {(hoverRating || rating) >= star ? (
            <div className="text-blue-500">
              <BsStarFill />
            </div>
          ) : (
            <BsStar />
          )}
        </div>
      ))}
    </div>
  );
};

export default FiveStarReview;
