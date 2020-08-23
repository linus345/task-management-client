import axios from 'axios';

axios.create({
    baseUrl: process.env.REACT_APP_API_URL,
    headers: {
        'Authorization': `Bearer ${token}`,
    },
});

