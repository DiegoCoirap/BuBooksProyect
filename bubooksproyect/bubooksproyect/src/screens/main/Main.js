import React, { useState } from 'react';
import axios from 'axios';
import HeaderWithIcons from '../../components/header/HeatherWithIcons';
import BooksWithStars from '../../components/books/BooksWithStars';
import './Main.css'

const Main = () => {



  return (
    <div className='main'>
      <HeaderWithIcons />
      <div className='mainBody'>
          <h1 className='mainTitle'>Our books</h1>
          <BooksWithStars className='booksMain' />
      </div>
    </div>
  );
};

export default Main;
