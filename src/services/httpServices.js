import axios from "axios";

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (expectedError) {
    return new Promise(error);
  }
  alert("An unexpected error occured.");
  return new Promise((resolve, reject) => {
    reject(error.response);
  });
});

export default axios;
