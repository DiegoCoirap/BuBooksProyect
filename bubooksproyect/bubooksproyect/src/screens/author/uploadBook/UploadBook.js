import axios from 'axios';
import {useNavigate} from "react-router-dom";
import './UploadBook.css';
import HeaderAuthor from "../../../components/header/HeaderAuthor";
import url from '../../../environment'
import {useState} from "react";
const CreateBookForm = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [language, setLanguage] = useState('');
    const [synopsis, setSynopsis] = useState('');
    const [category, setCategory] = useState('');
    const [series, setSeries] = useState('');
    const [volumeNumber, setVolumeNumber] = useState(0);
    const [targetAudience, setTargetAudience] = useState('');
    const [matureContent, setMatureContent] = useState(false);
    const [price, setPrice] = useState('');
    const [bookCover, setBookCover] = useState('');
    const [rating, setRating] = useState(0);

    const handleSubmit = async (event) => {
        event.preventDefault();


        const bookData = {
            title,
            language,
            synopsis,
            series,
            volumeNumber,
            target_audience: targetAudience,
            mature_content: matureContent,
            price,
            book_cover: bookCover,
        };

        try {
            const response = await axios.post(`${url}/bubooks/create-book`, bookData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.status === 200) {
                console.log('Book created successfully');
                window.history.back();
            } else {
                console.log('Error creating book:', response.data.message);
            }
        } catch (error) {
            console.error('Error creating book:', error);
        }
    };

    return (
        <div className="uploadBookPage">
            <HeaderAuthor/>
            <div className="uploadBookPageMain">
                <h1>Edit your book</h1>
                <form className="uploadBookForm" onSubmit={handleSubmit}>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <label htmlFor="language">Language:</label>
                    <select
                        id="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        required
                    >
                        <option value="">Select Language</option>
                        <option value="ES">Spanish</option>
                        <option value="EN">English</option>
                        <option value="FR">French</option>
                        <option value="DE">German</option>
                        <option value="JA">Japanese</option>
                        <option value="KO">Korean</option>
                        <option value="RU">Russian</option>
                        <option value="PT">Portuguese</option>
                        <option value="ZH">Chinese</option>
                        <option value="IT">Italian</option>
                        <option value="HI">Hindi</option>
                    </select>

                    <label htmlFor="synopsis">Synopsis:</label>
                    <textarea
                        id="synopsis"
                        value={synopsis}
                        onChange={(e) => setSynopsis(e.target.value)}
                        required
                    ></textarea>


                    <label htmlFor="series">Series:</label>
                    <input
                        type="text"
                        id="series"
                        value={series}
                        onChange={(e) => setSeries(e.target.value)}
                        required
                    />

                    <label htmlFor="volumeNumber">Volume Number:</label>
                    <input
                        type="number"
                        id="volumeNumber"
                        value={volumeNumber}
                        onChange={(e) => setVolumeNumber(e.target.value)}
                        required
                    />

                    <label htmlFor="targetAudience">Target Audience:</label>
                    <select
                        id="targetAudience"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        required
                    >
                        <option value="">Select Target Audience</option>
                        <option value="0-5">Baby</option>
                        <option value="5-10">Kid</option>
                        <option value="10-15">Early Adolescence</option>
                        <option value="15-20">Teenagers</option>
                        <option value="20-25">Young Adult</option>
                        <option value="25+">Adult</option>
                    </select>

                    <label htmlFor="matureContent">Mature Content:</label>
                    <select
                        id="matureContent"
                        value={matureContent ? 'Y' : 'N'}
                        onChange={(e) => setMatureContent(e.target.value === 'Y')}
                        required
                    >
                        <option value="Y">Yes</option>
                        <option value="N">No</option>
                    </select>

                    <label htmlFor="price">Price:</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />

                    <label htmlFor="bookCover">Book Cover URL:</label>
                    <input
                        type="text"
                        id="bookCover"
                        value={bookCover}
                        onChange={(e) => setBookCover(e.target.value)}
                        required
                    />
                    <button type="submit">Create Book</button>
                </form>
            </div>
        </div>

    );
};

export default CreateBookForm;
