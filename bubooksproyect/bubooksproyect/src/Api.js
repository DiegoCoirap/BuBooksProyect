import axios from 'axios';
import BASE_URL from './environment';

const api = axios.create({
  baseURL: BASE_URL,
});

const getToken = () => {
  return localStorage.getItem('token');
};

const setAuthHeader = () => {
  const token = getToken();
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default {

  async fetchAuthorProfile(alias) {
    try {
      setAuthHeader();
      const response = await api.post('/bubooks/author-profile', { alias });
      return response.data;
    } catch (error) {
      throw new Error('Error fetching author profile.');
    }
  },
  async login(props) {
    try {
      const response = await api.post('/bubooks/login', {
        username: props.username,
        password: props.password,
      });
      return response.data;
    } catch (error) {
      throw new Error('Incorrect username or password.');
    }
  },

  async signUp(props) {
    try {
      const response = await api.post('/bubooks/sign-up-user', {
        username: props.username,
        email: props.email,
        password: props.password,
        is_author: props.is_author,
      });
      return response.data;
    } catch (error) {
      throw new Error('Error. Try again.');
    }
  },

  async getBooks() {
    try {
      setAuthHeader();
      const response = await api.get('/bubooks/library');

      return response.data;
    } catch (error) {
      throw new Error('Error retrieving books.');
    }
  },

  async getBookById(id) {
    try {
      setAuthHeader();
      const response = await api.get(`/bubooks/book/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error retrieving book.');
    }
  },

  async createComment(payload) {
    try {
      setAuthHeader();
      const response = await api.post('/bubooks/create-comment', payload);
      return response.data;
    } catch (error) {
      throw new Error('Error creating comment.');
    }
  },

  async getComments(bookTitle) {
    try {
      setAuthHeader();
      const response = await api.post('/bubooks/comments', {
        params: {
          book: bookTitle
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Error retrieving comments.');
    }
  },

  async addToWishlist(bookId) {
    try {
      setAuthHeader();
      const response = await api.post('/bubooks/add-book-wishlist', {
        book_id: bookId,
      });
      return response.data;
    } catch (error) {
      throw new Error('Error adding book to wishlist.');
    }
  },
async addToCart(bookId) {
  try {
    setAuthHeader();
    const response = await api.post('/bubooks/add-book-cart', {
      book_id: bookId,
    });
    return response.data; // Cambiar "return response;" a "return response.data;"
  } catch (error) {
    throw new Error('Error adding book to cart.');
  }
}

};
