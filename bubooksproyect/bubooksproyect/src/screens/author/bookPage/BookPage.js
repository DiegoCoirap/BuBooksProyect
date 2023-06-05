import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Api from '../../../Api';
import './BookPage.css';
import axios from 'axios';
import HeaderWithIcons from "../../../components/header/HeatherWithIcons";
import Rating from "@mui/material/Rating";
import HeaderWithoutIcons from "../../../components/header/HeaderWithoutIcons";
import HeaderAuthor from "../../../components/header/HeaderAuthor";

const BookPageAuthor = () => {
  const { id } = useParams(); // Get the "id" parameter from the URL
  const [bookData, setBookData] = useState({ comments: [] });

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await Api.getBookById(id); // Fetch book data by ID
        if (response) {
          setBookData(response);
          console.log(response.title);
          bookData.title = response.title;
          if (response.title) {
            showComments(); // Call showComments only if the book data has a title
          }
        } else {
          console.error('No se obtuvo ninguna respuesta del servidor');
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchBookData();
  }, [id]);

  const showComments = async () => {
    if (!bookData || !bookData.title) {
      console.error('Book data is missing');
      return;
    }

    try {
      const response = await axios.post(
        `http://192.168.0.23:8000/bubooks/comments`, // Fetch comments for the book
        {
          book: bookData.title,
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

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
        console.error('No se obtuvo ninguna respuesta del servidor');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getBookCoverUrl = (author) => {
    return `http://192.168.0.23:8000/media/images/authors/author_${author}/book/example.jpg`;
  };

  if (!bookData) {
    return <div>Loading...</div>; // Display a loading message while book data is being fetched
  }

  return (
    <div className='bookPageMain'>
      <HeaderAuthor /> {/* Render the author header */}
      <div className='bookPage'>
        <h1 className='bookPageTitle'>{bookData.title}</h1>
        <h2 className='bookPageAuthor'>{bookData.author}</h2>
        <div className='bookPageBody'>
          <div className='imageAndRating'>
            <img
              src={getBookCoverUrl(bookData.author)}
              alt='BOOK COVER'
              className='bookPageBookCover'
            />
            <div className='bookPageRating'>
              <Rating
                size='large'
                name='read-only'
                value={bookData.rating}
                precision={0.5}
                readOnly
              />
            </div>
          </div>
          <div className='bookPageInformation'>
            <p className='bookPageSinopsis'>{bookData.synopsis}</p>
          </div>
          <div className='bookpageAditional'>
            <p>
              <span>Language: </span>
              {bookData.language}
            </p>
            <p>
              <span>Series: </span>
              {bookData.series}
            </p>
            <p>
              <span>Volume number: </span>
              {bookData.volume_number}
            </p>
            <p>
              <span>Target audience: </span>
              {bookData.target_audience}
            </p>
            <p>
              <span>Mature content: </span>
              {bookData.mature_content}
            </p>
          </div>
        </div>
        <div className='commentSection'>
          <h3>Comments</h3>
          <div className='commentList'>
            {bookData.comments &&
              bookData.comments.map((comment, index) => (
                <div className='bookPagecomment' key={index}>
                  <h4>Comment by {comment.user}</h4>
                  <p>Title: {comment.title}</p>
                  <p>Comment: {comment.comment}</p>
                  <div className='commentRating'>
                    <Rating
                      name='read-only'
                      value={comment.rating}
                      precision={0.5}
                      readOnly
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPageAuthor;
