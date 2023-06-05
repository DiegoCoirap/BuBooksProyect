import React, { useState, useEffect } from 'react';
import Download from '@mui/icons-material/FileDownloadOutlined';
import axios from 'axios';
import HeaderWithIcons from '../../../components/header/HeatherWithIcons';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import Delete from '@mui/icons-material/ClearOutlined';
import url from '../../../environment';

const UserProfile = ({ onRemoveFromWishlist, onLogout }) => {
  const navigate = useNavigate();
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch purchased books
    const fetchPurchasedBooks = async () => {
      try {
        const response = await axios.get(`${url}/bubooks/my-books`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPurchasedBooks(response.data);
      } catch (error) {
        console.error('Error fetching purchased books:', error);
      }
    };

    // Fetch wishlist
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(`${url}/bubooks/wish-list`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setWishlist(response.data);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };

    // Call the fetch functions
    fetchPurchasedBooks();
    fetchWishlist();
  }, []);

  useEffect(() => {
    // Set the appropriate message based on the state of purchased books and wishlist
    if (purchasedBooks.length === 0 && wishlist.length === 0) {
      setMessage('No tienes libros comprados ni elementos en tu lista de deseos.');
    } else if (purchasedBooks.length === 0) {
      setMessage('No tienes libros comprados.');
    } else if (wishlist.length === 0) {
      setMessage('No tienes elementos en tu lista de deseos.');
    } else {
      setMessage('');
    }
  }, [purchasedBooks, wishlist]);

  const handleDownloadBook = (bookId) => {
    const downloadedBook = purchasedBooks.find((book) => book.id === bookId);
    if (downloadedBook) {
      // Perform download logic here
      console.log('Descargando libro:', downloadedBook.title);
    }
  };

  const handleRemoveFromWishlist = (bookId) => {
    onRemoveFromWishlist(bookId);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="userProfilePage">
      <HeaderWithIcons />
      <div className="userProfileMain">
        <div className="userProfileMainLeft">
          <h1>Your Profile</h1>
          <button className="userProfileLogOut" onClick={handleLogout}>
            Logout
          </button>
          <h2 className="userProfilePurchaseBooks">Purchased Books</h2>
          {message === 'No tienes libros comprados.' && <p>{message}</p>}
          {purchasedBooks.length > 0 ? (
            purchasedBooks.map((book) => (
              <div className="userProfileList" key={book.id}>
                <h3>{book.title}</h3>
                <Download onClick={() => handleDownloadBook(book.id)} />
              </div>
            ))
          ) : (
            message !== 'No tienes libros comprados.' && <p>{message}</p>
          )}
        </div>

        <div className="userProfileMainRight">
          <h1 className="userProfileWishList">Wishlist</h1>
          {message === 'No tienes elementos en tu lista de deseos.' && <p>{message}</p>}
          {wishlist.length > 0 ? (
            wishlist.map((book) => (
              <div key={book.id} className="userProfileList">
                <h3>{book.title}</h3>
                <Delete onClick={() => handleRemoveFromWishlist(book.id)} />
              </div>
            ))
          ) : (
            message !== 'No tienes elementos en tu lista de deseos.' && <p>{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
