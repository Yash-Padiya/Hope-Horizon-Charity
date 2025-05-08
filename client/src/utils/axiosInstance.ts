import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}`, // Replace with your API's base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// You can use this function to add the authentication token to your request
const setAuthToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers['Authorization'];
  }
};

export { axiosInstance, setAuthToken };
