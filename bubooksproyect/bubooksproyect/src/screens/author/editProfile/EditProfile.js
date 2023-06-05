import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';
import HeaderAuthor from "../../../components/header/HeaderAuthor";
import url from '../../../environment';

const EditAuthor = () => {
  const navigate = useNavigate();
  const [alias, setAlias] = useState('');
  const [aboutYou, setAboutYou] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(localStorage.token);

    const authorData = {
      alias,
      about_you: aboutYou,
      image,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${url}/bubooks/modify-author`,
        authorData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log('Author profile has been successfully edited');
        // Redirect to the author profile with the alias as a parameter in the URL
        localStorage.setItem('alias', alias);
        navigate(`/authorProfile/${alias}`);
      } else {
        console.log('Error editing author profile:', response.data.message);
      }
    } catch (error) {
      console.error('Error editing author profile:', error);
    }
  };

  return (
    <div className="editUser">
      <HeaderAuthor /> {/* Render the author header */}
      <div className="editUserContainer">
        <h2 className="editUserH2">Edit your profile</h2>
        <form className='editUserForm' onSubmit={handleSubmit}>
          <label htmlFor='alias'>Alias:</label>
          <input
            type='text'
            id='alias'
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            required
          />

          <label htmlFor='aboutYou'>About You:</label>
          <textarea
            id='aboutYou'
            value={aboutYou}
            onChange={(e) => setAboutYou(e.target.value)}
            required
          ></textarea>

          <label htmlFor='image'>Image URL:</label>
          <input
            type='text'
            id='image'
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />

          <button type='submit' className='editUserButton'>
            Edit Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAuthor;
