import axios from "axios";

// axios.defaults.headers.common["x-auth-token"] = localStorage.getItem("token");

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (expectedError) {
    return new Promise(error);
  }

  console.log("Loggin the error: ", error);
  alert("An unexpected error occured.");
  return new Promise(error);
});

export default axios;
