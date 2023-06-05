import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HeaderWithoutIcons from "../../../components/header/HeaderWithoutIcons";
import './CreateProfile.css';
import url from '../../../environment';

const CreateAuthor = () => {
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
      const response = await axios.post(
        `${url}/bubooks/create-author`,
        authorData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log('Author profile has been successfully created');
        // Redirect to the author profile with the alias as a parameter in the URL
        localStorage.setItem('alias', alias);
        navigate(`/authorProfile/${alias}`);
      } else {
        console.log('Error creating author profile:', response.data.message);
      }
    } catch (error) {
      console.error('Error creating author profile:', error);
    }
  };

  return (
    <div className='createUser'>
      <HeaderWithoutIcons /> {/* Render the header without icons */}
      <div className='createUserContainer'>
        <h2 className='createUseH2'>Create your profile</h2>
        <form className='createUserForm' onSubmit={handleSubmit}>
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

          <button type='submit' className='createUserButton'>
            Create Author
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAuthor;
