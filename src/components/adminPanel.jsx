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

class AdminPanel extends Component {
  state = {
    sidebarItems: [
      {
        id: "1",
        title: "داشبورد",
        link: "/admin/dashboard",
        fontAwesomeIcon: "fa-database",
      },
      {
        id: "2",
        title: "کاربران",
        link: "/admin/users",
        fontAwesomeIcon: "fa-users",
      },
      {
        id: "3",
        title: "دستگاه‌ها",
        link: "/admin/devices",
        fontAwesomeIcon: "fa-hdd",
      },
      {
        id: "4",
        title: "خروج",
        link: "/admin/logout",
        fontAwesomeIcon: "fa-sign-out-alt",
      },
    ],
  };

  componentDidMount() {
    if (!authData.isAdmin) {
      const sidebarItems = this.state.sidebarItems.filter(
        (item) => item.id !== "2"
      );
      this.setState({ sidebarItems });
    }
  }

  render() {
    const sidebarItems = this.state.sidebarItems;

    return (
      <div className="panel-container">
        <div className="container-fluid p-0 h-100 w-100 d-flex flex-row main-section">
          <SidebarMenu items={sidebarItems} />
          <main className="content">
            <Switch>
              <Route path="/admin/dashboard" component={Dashboard} />
              <Route path="/admin/users" component={Users} />
              <Route path="/admin/user/:username" component={User} />
              <Route path="/admin/devices" component={Devices} />
              <Route path="/admin/device/:deviceID" component={Device} />
              <Route path="/admin/settings" component={Settings} />
              <Route path="/admin/new-user" component={NewUser} />
              <Route path="/admin/new-device" component={NewDevice} />
              <Route path="/admin/logout" component={Logout} />
              <Route path="/admin/not-found" component={NotFound} />
              <Redirect from="/admin/" exact to="/admin/dashboard" />
              <Redirect to="/admin/not-found" />
            </Switch>
          </main>
        </div>
      </div>
    );
  }

  onExitClickHandler = () => {
    let url = `/login`;
    this.props.history.replace(url);
  };
}

export default AdminPanel;
