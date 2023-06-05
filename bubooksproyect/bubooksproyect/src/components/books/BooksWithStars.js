import React, { useEffect, useState } from 'react';
import './BooksWithStars.css';
import Rating from '@mui/material/Rating';
import Heart from '@mui/icons-material/FavoriteBorderOutlined';
import Cart from '@mui/icons-material/AddShoppingCartOutlined';
import Left from '@mui/icons-material/ArrowBackIosNewOutlined';
import Right from '@mui/icons-material/ArrowForwardIosOutlined';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import Api from '../../Api';

const BooksWithStars = () => {
  const navigate = useNavigate();
  const [bookData, setBookData] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const booksPerPage = 16;
  const pagesVisited = pageNumber * booksPerPage;

  useEffect(() => {
    // Fetch book data from API
    const fetchBookData = async () => {
      try {
        const response = await Api.getBooks();
        setBookData(response.items);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBookData();
  }, []);

  const addToWishlist = async (id) => {
    try {
      // Add book to wishlist via API
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
      // Add book to cart via API
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

  const navigateToAuthorProfile = (alias) => {
    // Navigate to author profile page
    navigate(`/author/${alias}`);
  };

  const navigateToBookPage = (id) => {
    console.log(id);
    // Navigate to book page
    navigate(`/bookpage/${id}`);
  };

  const getBookCoverUrl = (author) => {
    // Generate book cover URL based on author
    return `http://192.168.1.133:8000/media/images/authors/author_${author}/book/example.jpg`;
  };

  const pageCount = Math.ceil(bookData.length / booksPerPage);

  const changePage = ({ selected }) => {
    // Change current page number
    setPageNumber(selected);
  };

  return (
    <div className='containerBooks'>
      <div className='booksWithStars'>
        {bookData.slice(pagesVisited, pagesVisited + booksPerPage).map((book) => (
          <div key={book.id} className='bookList'>
            <img
              src={getBookCoverUrl(book.author)}
              alt='BOOK COVER'
              onClick={() => navigateToBookPage(book.id)}
              className='bookCover'
            />
            <div className='bookInformation'>
              <h4 className='bookTitle'>{book.title}</h4>
              <p className='bookAuthor' onClick={() => navigateToAuthorProfile(book.author)}>
                {book.author}
              </p>
              <div className='bookRating'>
                <Rating name='read-only' value={book.rating} precision={0.5} readOnly />
              </div>
              <div className='bookButtons'>
                <button className='wishlistButton' onClick={() => addToWishlist(book.id)}>
                  <Heart />
                </button>
                <button className='cartButton' onClick={() => addToCart(book.id)}>
                  <Cart />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="paginator">
        <ReactPaginate
          previousLabel={<Left />}
          nextLabel={<Right />}
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName={'pagination'}
          previousLinkClassName={'pagination__link'}
          nextLinkClassName={'nextBttn'}
          disabledClassName={'pagination__link--disabled'}
          activeClassName={'pagination__link--active'}
        />
      </div>
    </div>
  );
};

export default BooksWithStars;
