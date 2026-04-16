import React, { useState, useEffect, useRef } from 'react';
import { fetchMovie, submitReview } from '../actions/movieActions';
import { useDispatch, useSelector } from 'react-redux';
import { Card, ListGroup, ListGroupItem, Image, Container, Row, Col} from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom'; // Import useParams
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

const MovieDetail = () => {
  const dispatch = useDispatch();
  const { movieId } = useParams(); // Get movieId from URL parameters
  const selectedMovie = useSelector(state => state.movie.selectedMovie);
  const loading = useSelector(state => state.movie.loading); // Assuming you have a loading state in your reducer
  const error = useSelector(state => state.movie.error); // Assuming you have an error state in your reducer


  useEffect(() => {
    dispatch(fetchMovie(movieId));
  }, [dispatch, movieId]);

  const [show, setShow] = useState(false);
  const ratingRef = useRef(null);
  const commentRef = useRef(null);

  const handleClose = () => {
    setShow(false);
    // Clear form values
    if (ratingRef.current) ratingRef.current.value = '';
    if (commentRef.current) commentRef.current.value = '';
  };

  const handleShow = () => setShow(true);

  const handleSubmitReview = () => {
    const reviewData = {
      movieId: movieId,
      rating: parseInt(ratingRef.current.value),
      review: commentRef.current.value
    };
    
    dispatch(submitReview(reviewData)).then(() => {
      handleClose();
      dispatch(fetchMovie(movieId));
    }).catch((error) => {
      console.error('Review submission failed:', error);
    });
  };

  const DetailInfo = () => {
    if (loading) {
      return <div>Loading....</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    if (!selectedMovie) {
      return <div>No movie data available.</div>;
    }

    return (
      // bg-dark text-dark p-4 rounded
        
      <Card className="movie-detail">
        {/* <Card.Header>Movie Detail</Card.Header> */}
        <Container>
          <Row>
            <Col md={4} className="image-col">
              <Image className="image" src={selectedMovie.imageUrl} rounded />
            </Col>

            <Col md={8} className="info-col">
              <ListGroup>
                <ListGroupItem>{selectedMovie.title}</ListGroupItem>
                <ListGroupItem>
                  {selectedMovie.actors?.map((actor, i) => (
                    <p key={i}>
                      <b>{actor.actorName}</b> {actor.characterName}
                    </p>
                  ))}
                </ListGroupItem>
                <ListGroupItem>
                  <h4>
                    <BsStarFill /> {selectedMovie.avgRating?.toFixed(1)}
                  </h4>
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
        </Container>

        <Card.Body className="card-body bg-white">
          <Card.Header>Reviews <Button variant="secondary" onClick={handleShow}>Add a Review</Button></Card.Header>
          
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Create a new review</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form> 
                <Form.Group>
                  <Form.Label>Rating</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder='0-5'
                    min="0"
                    max="5"
                    ref={ratingRef}
                  />
                </Form.Group>
                 <Form.Group>
                  <Form.Label>Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder='This is the best movie ever...'
                    ref={commentRef}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSubmitReview}>
                Submit Review
              </Button>
            </Modal.Footer>
          </Modal>

          {selectedMovie.movieReviews?.map((review, i) => (
            <p key={i}>
              <b>{review.username}</b>&nbsp; {review.review} &nbsp; <BsStarFill />{' '}
              {review.rating}
            </p>
          ))}
        </Card.Body>
      </Card>
    );
  };

  return <DetailInfo />;
};


export default MovieDetail;
