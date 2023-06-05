import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cart.css';
import HeaderWithIcons from '../../../components/header/HeatherWithIcons';
import url from '../../../environment';

const Cart = () => {
  const [cartBooks, setCartBooks] = useState([]);

  useEffect(() => {
    // Fetch cart books when the component mounts
    const fetchCartBooks = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: '*/*',
          },
        };

        // Send a GET request to retrieve cart books from the server
        const response = await axios.get(`${url}/bubooks/cart`, config);
        setCartBooks(response.data);
      } catch (error) {
        console.error('Error fetching cart books:', error);
      }
    };

    fetchCartBooks();
  }, []);

  const handlePayPalPayment = async () => {
    try {
      // Perform PayPal payment logic here

      // Mark books as bought
      const markBooksAsBought = async () => {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };

        const promises = cartBooks.map((book) => {
          const payload = {
            book_id: book.id,
          };

          // Send an HTTP POST request to mark a book as bought
          return axios.post(`${url}/bubooks/book-bought`, payload, config);
        });

        try {
          // Wait for all the requests to complete
          await Promise.all(promises);

          // Clear the cart after successful payment
          setCartBooks([]);
        } catch (error) {
          console.error('Error marking books as bought:', error);
        }
      };

      await markBooksAsBought();
    } catch (error) {
      console.error('Error during PayPal payment:', error);
    }
  };

  return (
    <div className="cartPage">
      <HeaderWithIcons />
      <div className="cartPageBody">
        <h1>Your Cart</h1>
        {cartBooks.length > 0 ? (
          <div className="cart">
            <ul>
              {cartBooks.map((book) => (
                <li key={book.id} className="cartList">
                  <div className="cartList">
                    <p>{book.title}</p>
                    <p className="cartPrice">{book.price}$</p>
                  </div>
                </li>
              ))}
            </ul>
            <button onClick={handlePayPalPayment} className="paypalButton">
              Pay with PayPal
            </button>
          </div>
        ) : (
          <p className="emptyCart">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Cart;
