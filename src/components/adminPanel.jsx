import React, { Component } from "react";
import SidebarMenu from "./sidebar-menu";
import { Route, Redirect, Switch } from "react-router-dom";
import NotFound from "./notFound";
import Dashboard from "./dashboard";
import Users from "./users";
import Devices from "./devices";
import Settings from "./settings";
import User from "./user";
import Device from "./device";
import NewUser from "./newUser";
import NewDevice from "./newDevice";
import { authData } from "./../services/authServices";
import Logout from "./logout";
import EditNickname from "./editNickname";
import EditPassword from "./editPassword";
import DeviceAssignment from "./device-assignment";
import EditDevice from "./editDevice";
import Support from "./support";
import Report from "./report";
import Print from "./print";
import EditPhoneNumber from "./editPhoneNumber";
import EditAddress from "./editAddress";
import jwtDecode from "jwt-decode";
import axios from "axios";
import config from "../config.json";
import qs from "qs";
import SMSServiceSettings from "./smsServiceSettings";

const dir = process.env.REACT_APP_CUSTOM_DIR;
const panelURL = process.env.REACT_APP_PANEL_URL;

class AdminPanel extends Component {
  state = {
    sidebarItems: [
      {
        id: "1",
        title: "داشبورد",
        link: `${dir}/admin/dashboard`,
        fontAwesomeIcon: "fa-database",
      },
      {
        id: "2",
        title: "کاربران",
        link: `${dir}/admin/users`,
        fontAwesomeIcon: "fa-users",
      },
      {
        id: "3",
        title: "دستگاه‌ها",
        link: `${dir}/admin/devices`,
        fontAwesomeIcon: "fa-hdd",
      },
      {
        id: "4",
        title: "سرویس پیامکی",
        link: `${dir}/admin/sms-settings`,
        fontAwesomeIcon: "fa-sms",
      },
      {
        id: "5",
        title: "پشتیبانی",
        link: `${dir}/admin/support`,
        fontAwesomeIcon: "fa-headset",
      },
      {
        id: "6",
        title: "خروج",
        fontAwesomeIcon: "fa-sign-out-alt",
        action: () => {
          localStorage.clear();
          window.location.href = panelURL;
        },
      },
    ],
  };

  componentDidMount() {
    var sidebarItems;
    if (!authData.isAdmin) {
      sidebarItems = this.state.sidebarItems.filter(
        (item) => item.id !== "2" && item.id !== "4"
      );
    } else {
      sidebarItems = this.state.sidebarItems.filter((item) => item.id !== "5");
    }
    this.setState({ sidebarItems });
  }

  render() {
    const sidebarItems = this.state.sidebarItems;

    const token = localStorage.getItem("token");
    const now = new Date().getTime();
    let expireTimestamp = 0;
    let routes;
    try {
      const decodedToken = jwtDecode(token);
      expireTimestamp = decodedToken["expire"];
    } catch (e) {}
    if (token !== null && expireTimestamp > now) {
      refreshToken(token);
      routes = (
        <Switch>
          <Route path={`${dir}/admin/dashboard`} component={Dashboard} />
          <Route path={`${dir}/admin/users`} component={Users} />
          <Route path={`${dir}/admin/user/:username`} component={User} />
          <Route path={`${dir}/admin/devices`} component={Devices} />
          <Route
            path={`${dir}/admin/sms-settings`}
            component={SMSServiceSettings}
          />
          <Route
            path={`${dir}/admin/edit-device/:deviceID`}
            component={EditDevice}
          />
          <Route path={`${dir}/admin/report/:deviceID`} component={Report} />
          <Route path={`${dir}/admin/print/:deviceID`} component={Print} />
          <Route
            path={`${dir}/admin/device/:deviceID/:phoneNumber`}
            component={Device}
          />
          <Route path={`${dir}/admin/settings`} component={Settings} />
          <Route path={`${dir}/admin/new-user`} component={NewUser} />
          <Route path={`${dir}/admin/support`} component={Support} />
          <Route path={`${dir}/admin/new-device`} component={NewDevice} />
          <Route
            path={`${dir}/admin/device-assignment/:clientUsername`}
            component={DeviceAssignment}
          />
          <Route path={`${dir}/admin/logout`} component={Logout} />
          <Route
            path={`${dir}/admin/editNickname/:clientUsername`}
            component={EditNickname}
          />
          <Route
            path={`${dir}/admin/editPassword/:clientUsername`}
            component={EditPassword}
          />
          <Route
            path={`${dir}/admin/editPhoneNumber/:clientUsername`}
            component={EditPhoneNumber}
          />
          <Route
            path={`${dir}/admin/editAddress/:clientUsername`}
            component={EditAddress}
          />
          <Route path={`${dir}/admin/not-found`} component={NotFound} />
          <Redirect
            from={`${dir}/admin/`}
            exact
            to={`${dir}/admin/dashboard`}
          />
          <Redirect to={`${dir}/admin/not-found`} />
        </Switch>
      );
    } else {
      window.location = `${dir}/login`;
    }

    return (
      <div className='background'>
        <div className='panel-container'>
          <div className='container-fluid p-0 h-100 w-100 d-flex flex-row main-section'>
            <SidebarMenu items={sidebarItems} />
            <main className='content'>{routes}</main>
          </div>
        </div>
      </div>
    );
  }
}

async function refreshToken(oldToken) {
  const loginOptions = {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "content-type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify({ token: oldToken }),
    url: `${config.apiBaseURL}/refresh-token.php`,
  };
  const loginInfo = await axios(loginOptions);
  const token = loginInfo.data.body.token;
  localStorage.removeItem("token");
  localStorage.setItem("token", token);
}

export default AdminPanel;
