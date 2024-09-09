import React, { useState } from 'react';
import axios from 'axios';

function NewsletterDesigner() {
    const [newsletter, setNewsletter] = useState({
        title: '',
        content: '',
        offers: '',
        imageUrls: []
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewsletter({ ...newsletter, [name]: value });
    };

    const handleImageUrlChange = (e) => {
        const urls = e.target.value.split(',').map(url => url.trim());
        setNewsletter({ ...newsletter, imageUrls: urls });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/newsletter/send', newsletter);
            alert(response.data.message);
        } catch (error) {
            console.error('Error sending newsletter:', error);
            alert('Failed to send newsletter');
        }
    };

    return (
        <div>
            <h2>Design Newsletter</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={newsletter.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        name="content"
                        value={newsletter.content}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="offers">Special Offers:</label>
                    <textarea
                        id="offers"
                        name="offers"
                        value={newsletter.offers}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor="imageUrls">Image URLs (comma-separated):</label>
                    <input
                        type="text"
                        id="imageUrls"
                        value={newsletter.imageUrls.join(', ')}
                        onChange={handleImageUrlChange}
                    />
                </div>
                <button type="submit">Send Newsletter</button>
            </form>

            <div>
                <h3>Newsletter Preview</h3>
                <div style={{ border: '1px solid #ccc', padding: '20px', marginTop: '20px' }}>
                    <h2>{newsletter.title}</h2>
                    <p>{newsletter.content}</p>
                    <h3>Special Offers</h3>
                    <p>{newsletter.offers}</p>
                    {newsletter.imageUrls.map((url, index) => (
                        <img key={index} src={url} alt={`Newsletter image ${index + 1}`} style={{ maxWidth: '100%', marginTop: '10px' }} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default NewsletterDesigner;