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
  hasChangingPermission: data.hasChangingPermission === "0" ? false : true,
};

export default {
  authData,
};
