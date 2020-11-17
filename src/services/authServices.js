import jwtDecode from "jwt-decode";

const token = localStorage.getItem("token");
const data = jwtDecode(token);
export const authData = {
  username: data.username,
  token: token,
  isAdmin: data.isAdmin,
};

export default {
  authData,
};
