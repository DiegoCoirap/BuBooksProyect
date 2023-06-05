import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthorProfile.css';
import photo from '../../../img/background.png';
import HeaderAuthor from "../../../components/header/HeaderAuthor";
import url from '../../../environment';

const AuthorProfile = () => {
  const { alias } = useParams(); // Get the "alias" parameter from the URL
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await axios.post(
          `${url}/bubooks/author-profile`, // Make a POST request to fetch the author's profile
          {
            alias,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the JWT token in the request headers
            },
          }
        );
        setAuthor(response.data); // Set the fetched author data to the state
      } catch (error) {
        console.error(error);
      }
    };

    fetchAuthor();
  }, [alias]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the JWT token from the local storage
    navigate('/'); // Navigate back to the home page
  };

  const handleEditProfile = () => {
    navigate('/editProfile'); // Navigate to the edit profile page
  };

  const handleUploadBook = () => {
    navigate('/uploadBook'); // Navigate to the upload book page
  };

  const navigateToBookPage = (id) => {
    navigate(`/book/${id}`); // Navigate to the book page with the specified book ID
  };

  if (!author) {
    return <div>Loading...</div>; // Display a loading message while author data is being fetched
  }

  return (
    <div className='authorProfile'>
      <HeaderAuthor /> {/* Render the author header */}
      <div className='authorProfileMain'>
        <div className='authorProfileLeft'>
          <h1>{author.alias}</h1>
          <img src={photo} alt='Author' /> {/* Display the author's photo */}
          <p>{author.about_you}</p> {/* Display information about the author */}
          <div className="authorProfileButtons">
            <button onClick={handleEditProfile}>Edit Profile</button> {/* Button to edit the author's profile */}
            <button onClick={handleUploadBook}>Upload Book</button> {/* Button to upload a book */}
            <button className='logoutButton' onClick={handleLogout}>
              Log out
            </button> {/* Button to log out */}
          </div>
        </div>
        <div className='authorProfileRight'>
          <h2>Books</h2>
          <ul>
            {author.books.map((book) => (
              <li key={book.id}>
                <div className="authorProfileBook">
                  <img src={photo} alt='BookCover' onClick={() => navigateToBookPage(book.id)} /> {/* Display the book cover image */}
                  {book.title} {/* Display the book title */}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuthorProfile;
