import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';

const StarRating = ({ rating }) => {
    const totalStars = 5;
    let stars = [];

    // Create full stars
    for (let i = 1; i <= totalStars; i++) {
        if (i <= rating) {
            // Full star
            stars.push(<FontAwesomeIcon icon={faStar} className="text-yellow-500" key={i} />);
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            // Half star
            stars.push(<FontAwesomeIcon icon={faStarHalfAlt} className="text-yellow-500" key={i} />);
        } else {
            // Empty star
            stars.push(<FontAwesomeIcon icon={faStar} className="text-gray-300" key={i} />);
        }
    }

    return <div>{stars}</div>;
};

export default StarRating;