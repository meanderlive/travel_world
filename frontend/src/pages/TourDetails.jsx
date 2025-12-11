import React, { useRef, useState, useEffect } from 'react';
import './../styles/tour-details.css';
import { Container, Row, Col, Form, ListGroup } from 'reactstrap';
import { useParams } from 'react-router-dom';
import calculateAvgRating from '../utils/avgRating';
import avatar from '../assets/images/avatar.jpg';
import Booking from '../components/Booking/Booking';
import Newsletter from '../shared/Newsletter';
import useFetch from './../hooks/useFetch';
import { BASE_URL } from './../utils/config';
import axios from 'axios';
import ReactStars from 'react-rating-stars-component';

const TourDetails = () => {
  const { id } = useParams();
  const reviewMsgRef = useRef('');
  const [tourRating, setTourRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const userData = user?.data;
  const { data: tour, loading, error } = useFetch(`${BASE_URL}/tours/${id}`);

  const {
    photo,
    title,
    description,
    price,
    address,
    city,
    distance,
    maxGroupSize
  } = tour;

  const { totalRating, avgRating } = calculateAvgRating(reviews);

  const options = { day: 'numeric', month: 'long', year: 'numeric' };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/review/get/${id}`);
        if (response.status === 200) {
          setReviews(response.data.data);
        }
      } catch (error) {
        console.error('Error occurred while fetching the reviews:', error);
      }
    };
    fetchReviews();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const reviewText = reviewMsgRef.current.value;

    const reviewData = {
      productId: id,
      username: userData?.username,
      reviewText,
      rating: tourRating,
    };

    try {
      const response = await axios.post(`${BASE_URL}/reviews/${id}`, reviewData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log('Review submitted successfully:', response.data);
        // Optionally, you could fetch the reviews again to update the review list
        setReviews((prevReviews) => [...prevReviews, response.data.data]);
      } else {
        console.error('Failed to submit review:', response.status, response.data);
      }
    } catch (error) {
      console.error('Error occurred while submitting the review:', error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tour]);

  return (
    <>
      <section>
        <Container>
          {loading && <h4 className='text-center pt-5'>Loading...</h4>}
          {error && <h4 className='text-center pt-5'>{error}</h4>}
          {!loading && !error &&
            <Row>
              <Col lg='8'>
                <div className="tour__content">
                  <img src={photo} alt="" />

                  <div className="tour__info">
                    <h2>{title}</h2>
                    <div className='d-flex align-items-center gap-5'>
                      <span className='tour__rating d-flex align-items-center gap-1'>
                        <i className="ri-star-fill" style={{ color: "var(--secondary-color)" }}></i>{avgRating === 0 ? null : avgRating}
                        {totalRating === 0 ? (
                          "Not rated"
                        ) : (
                          <span>({reviews?.length}) </span>
                        )}
                      </span>

                      <span>
                        <i className="ri-map-pin-line" style={{ color: "var(--secondary-color)" }}></i>
                        {address}
                      </span>
                    </div>
                    <div className="tour__extra-details">
                      <span><i className="ri-map-pin-2-line" style={{ color: "var(--secondary-color)" }}></i>{city}</span>
                      <span><i className="ri-money-dollar-circle-line" style={{ color: "var(--secondary-color)" }}></i>{price}/per person</span>
                      <span><i className="ri-map-pin-time-line" style={{ color: "var(--secondary-color)" }}></i>{distance} k/m</span>
                      <span><i className="ri-group-line" style={{ color: "var(--secondary-color)" }}></i>{maxGroupSize} people</span>
                    </div>
                    <h5>Description</h5>
                    <p>{description}</p>
                  </div>

                  <div className="tour__reviews" mt-4>
                    <h4>Reviews ({reviews?.length} reviews)</h4>

                    <Form onSubmit={submitHandler}>
                      <div className='d-flex align-items-center gap-3 mb-4 rating__group'>
                        <ReactStars
                          count={5}
                          onChange={(newRating) => setTourRating(newRating)}
                          size={24}
                          activeColor="#ffd700"
                        />
                      </div>

                      <div className="review__input">
                        <input
                          type="text"
                          ref={reviewMsgRef}
                          placeholder='Share your thoughts'
                          required
                        />
                        <button className="btn primary__btn text-white" type='submit'>
                          Submit
                        </button>
                      </div>
                    </Form>

                    <ListGroup className='user__reviews'>
                      {
                        reviews?.map(review => (
                          <div className="review__item" key={review._id}>
                            <img src={avatar} alt="" />

                            <div className='w-100'>
                              <div className='d-flex align-items-center justify-content-between'>
                                <div>
                                  <h5>{review.username}</h5>
                                  <p>{new Date(review.createdAt).toLocaleDateString("en-US", options)}</p>
                                </div>
                                <span className="d-flex align-items-center">
                                  <ReactStars
                                    count={5}
                                    value={review.rating}
                                    size={24}
                                    edit={false}
                                    activeColor="#ffd700"
                                  />
                                </span>
                              </div>
                              <h6>{review.reviewText}</h6>
                            </div>
                          </div>
                        ))}
                    </ListGroup>
                  </div>
                </div>
              </Col>

              <Col lg='4'>
                <Booking tour={tour} avgRating={avgRating} />
              </Col>
            </Row>
          }
        </Container>
      </section>
      <Newsletter />
    </>
  )
}

export default TourDetails;
