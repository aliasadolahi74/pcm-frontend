import jwtDecode from "jwt-decode";

const token = localStorage.getItem("token");
let data = {};
try {
  data = jwtDecode(token);
} catch (e) {}

export const authData = {
  username: data.username,
  token: token,
  isAdmin: data.isAdmin,
};

export default {
  authData,
};
