import axios from "./httpServices";
import qs from "qs";
import jwtDecode from "jwt-decode";

const renewToken = async (token) => {
  try {
    const response = await axios.post(
      "/renewToken.php",
      qs.stringify({ token })
    );
    if (response.data.ok) {
      const newToken = response.data.body.token;
      localStorage.setItem("token", newToken);
    } else {
      token = null;
    }
  } catch (e) {
    token = null;
    console.error(e);
  }
};

const getToken = () => {
  let token = localStorage.getItem("token");
  if (token !== null) {
    const decode = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    if (now > decode.nbf && now < decode.exp) {
      // renew token
      renewToken(token);
    }
  }
  return token;
};

export default getToken;
