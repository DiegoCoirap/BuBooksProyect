import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import HeaderWithIcons from "../../../components/header/HeatherWithIcons";
import api from '../../../Api'; // Import the API module we created

import './AuthorProfile.css';

const AuthorUserProfile = () => {
  const { alias } = useParams(); // Get the author's alias from the URL parameters
  const [author, setAuthor] = useState(null); // State to store author data

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const authorData = await api.fetchAuthorProfile(alias); // Use the fetchAuthorProfile function from the API
        setAuthor(authorData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAuthor();
  }, [alias]);

  if (!author) {
    return <div>Loading...</div>;
  }

  return (
    <div className='authorProfile'>
      <HeaderWithIcons/>
      <div className="authorProfileMain">
        <div className="authorProfileLeft">
          <h1>{author.alias}</h1>
          <img src={author.image} alt="Author"/>
          <p>{author.about_you}</p>
        </div>

        <div className="authorProfileRight">
          <h2>His books</h2>
          <ul>
            {author.books.map(book => (
              <li key={book.id}>
                <div className='authorProfileBook'>
                  <img src={book.book_cover} alt={book.title}/>
                  {book.title}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuthorUserProfile;
