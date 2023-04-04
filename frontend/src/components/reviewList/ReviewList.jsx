import React from 'react';
import PropTypes from 'prop-types';
import Review, { reviewPropTypes } from '../review/Review';

function ReviewList({ reviews, setIsModal }) {
  return (
    <>
      <div className="my-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reviews</h2>
        <button
          type="button"
          className="btn px-10"
          onClick={() => setIsModal(true)}
        >
          Add review
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {!reviews.length && <p>No reviews for this toilet</p>}
        {reviews.length !== 0 &&
          reviews.map((review) => <Review key={review._id} {...review} />)}
      </div>
    </>
  );
}

ReviewList.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.shape(reviewPropTypes)).isRequired,
  setIsModal: PropTypes.func.isRequired,
};

export default ReviewList;
