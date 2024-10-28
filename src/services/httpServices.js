import axios from "axios";

axios.interceptors.request.use((config) => {
  config.baseURL = process.env.REACT_APP_API_ENDPOINT;
  config.timeout = 10000;
  return config;
});

axios.interceptors.response.use(null, (error) => {

  if (!error.response) {
    const networkErrors = [
      'Network Error',
      'ECONNABORTED',
      'ETIMEDOUT',
      'ERR_NETWORK'
    ];

    if (networkErrors.some(msg => error.message.includes(msg))) {
      return Promise.reject({
        status: 'network_error',
        message: 'Unable to connect to the server. Please check your internet connection.',
        originalError: error
      });
    }
  }

  // Handle expected errors (4xx status codes)
  const expectedError =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;

  if (expectedError) {
    return Promise.reject({
      status: error.response.status,
      message: error.response.data.message || 'An error occurred',
      originalError: error
    });
  }

  // Handle server errors (5xx status codes)
  if (error.response && error.response.status >= 500) {
    return Promise.reject({
      status: error.response.status,
      message: 'Server error. Please try again later.',
      originalError: error
    });
  }

  // Handle all other unexpected errors
  console.error('Unexpected error:', error);
  return Promise.reject({
    status: 'unknown_error',
    message: 'An unexpected error occurred. Please try again.',
    originalError: error
  });
});

export default axios;
