import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Api from '../../../Api';
import './BookPage.css';
import axios from 'axios';
import Background from '../../../img/background.png';
import HeaderWithIcons from "../../../components/header/HeatherWithIcons";
import './BookPage.css'
import Heart from "@mui/icons-material/FavoriteBorderOutlined";
import Cart from "@mui/icons-material/AddShoppingCartOutlined";
import Rating from "@mui/material/Rating";
import url from '../../../environment';

const BookPage = () => {
  const { id } = useParams();
  const [bookData, setBookData] = useState({ comments: [] });

  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await Api.getBookById(id);
        if (response) {
          setBookData(response);
          console.log(response.title);
          bookData.title = response.title;
          console.log(bookData.rating);
          if (response.title) {
            showComments(); // Call showComments only if the book data has a title
          }
        } else {
          console.error('No response received from the server');
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchBookData();
  }, [id]);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleRatingChange = (event) => {
    setRating(Number(event.target.value));
  };

  const showComments = async () => {
    if (!bookData || !bookData.title) {
      console.error('Book data is missing');
      return;
    }

    try {
      const response = await axios.post(`${url}/bubooks/comments`, {
        book: bookData.title
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.data && Array.isArray(response.data)) {
        const comments = response.data.map((comment) => ({
          title: comment.title,
          comment: comment.comment,
          rating: comment.rating,
          user: comment.user.toString(),
        }));
        setBookData((prevData) => ({
          ...prevData,
          comments: comments,
        }));
      } else {
        console.error('No response received from the server');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getBookCoverUrl = (author) => {
    return `${url}/media/images/authors/author_${author}/book/example.jpg`;
  };

  const addToWishlist = async (id) => {
    try {
      const response = await Api.addToWishlist(id);
      if (response.status === 200) {
        console.log(`Book added to wishlist: ${id}`);
      } else {
        console.error('Failed to add book to wishlist');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addToCart = async (id) => {
    try {
      const response = await Api.addToCart(id);
      if (response.status === 200) {
        console.log(`Book added to cart: ${id}`);
      } else {
        console.error('Failed to add book to cart');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddComment = async () => {
    try {
      await Api.createComment({
        title: 'New Comment',
        comment: comment,
        rating: rating,
        book: bookData.title,
      });
      const response = await Api.getBookById(id);
      if (response) {
        setBookData(response);
      } else {
        console.error('No response received from the server');
      }
      setComment('');
      setRating(5);
    } catch (error) {
      console.error(error);
    }
    window.location.reload();
  };

  if (!bookData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='bookPageMain'>
      <HeaderWithIcons/>
      <div className="bookPage">
        <h1 className="bookPageTitle">{bookData.title}</h1>
        <h2 className="bookPageAuthor">{bookData.author}</h2>
        <div className="bookPageBody">
          <div className="imageAndRating">
            <img
              src={getBookCoverUrl(bookData.author)}
              alt='BOOK COVER'
              className='bookPageBookCover'
            />
            <div className='bookPageRating'>
              <Rating size='large' name='read-only' value={bookData.rating} precision={0.5} readOnly/>
            </div>
          </div>
          <div className="bookPageInformation">
            <p className='bookPageSinopsis'>{bookData.synopsis}</p>
            <div className="bookPagePriceAndButtons">
              <p>{bookData.price}</p>
              <div className='bookPageButtons'>
                <button className='bookPageButtons' onClick={() => addToWishlist(bookData.id)}>
                  <Heart fontSize="large"/>
                </button>
                <button className='bookPageButtons' onClick={() => addToCart(bookData.id)}>
                  <Cart fontSize="large"/>
                </button>
              </div>
            </div>
          </div>
          <div className="bookpageAditional">
            <p><span>Language: </span>{bookData.language}</p>
            <p><span>Series: </span>{bookData.series}</p>
            <p><span>Volume number: </span>{bookData.volume_number}</p>
            <p><span>Target audience: </span>{bookData.target_audience}</p>
            <p><span>Mature content: </span>{bookData.mature_content}</p>
          </div>
        </div>
        <div className="commentSection">
          <h3>Comments</h3>
          <div className="commentList">
            {bookData.comments && bookData.comments.map((comment, index) => (
              <div className="bookPagecomment" key={index}>
                <h4>Comment by {comment.user}</h4>
                <p>Title: {comment.title}</p>
                <p>Comment: {comment.comment}</p>
                <div className='commentRating'>
                  <Rating name='read-only' value={comment.rating} precision={0.5} readOnly/>
                </div>
              </div>
            ))}
          </div>
          <div className="addComment">
            <h3>Add a Comment</h3>
            <div className="commentBox">
              <p>Rating:</p>
              <input
                className='bookPageRatingArea'
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={handleRatingChange} // Add the onChange handler
              />
              <p>Comment:</p>
              <textarea
                className='bookPageTextArea'
                value={comment}
                onChange={handleCommentChange} // Add the onChange handler
                placeholder="Enter your comment..."
              ></textarea>
              <button className='commentSubmit' onClick={handleAddComment}>Add Comment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPage;

