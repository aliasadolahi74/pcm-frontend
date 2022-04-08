import React, { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";
import "../services/httpServices";
import { authData } from "../services/authServices";
import config from "../config.json";

const UsersDropdown = ({ onChange, clientUsername }) => {
  const [state, setState] = useState({ users: [] });

  useEffect(() => {
    const getUsers = async () => {
      try {
        const loginOptions = {
          method: "POST",
          headers: { "content-type": "application/x-www-form-urlencoded" },
          data: qs.stringify({ ...authData, clientUsername }),
          url: `${config.apiBaseURL}/users-for-dropdown.php`,
        };
        const usersInfo = await axios(loginOptions);
        const errors = usersInfo.data.errors;

        if (errors) {
          alert(errors[0].message);
        } else {
          const users = usersInfo.data.body || [];
          setState({ users });
        }
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          alert("Bad Request");
        }

        if (ex.response && ex.response.status === 403) {
          alert("شما دسترسی لازم به این بهش را ندارید");
        }
      }
    };

    getUsers();
  }, []);

  return (
    <select onChange={onChange}>
      <option key='none' value='null'>
        هیچکدام
      </option>
      {state.users.map((user) => (
        <option key={user.username} value={user.username}>
          {user.nickname}
        </option>
      ))}
    </select>
  );
};

export default UsersDropdown;
