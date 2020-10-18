import React, { Component } from "react";
import SidebarMenu from "./sidebar-menu";
import { Route, Redirect, Switch } from "react-router-dom";
import NotFound from "./notFound";
import Dashboard from "./dashboard";
import Users from "./users";
import Devices from "./devices";
import Settings from "./settings";
import User from "./user";

class AdminPanel extends Component {
  state = {};
  render() {
    let sidebarItems = [
      {
        id: "1",
        title: "داشبورد",
        link: "/admin/dashboard",
        fontAwesomeIcon: "fa-database",
        isActive: true,
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
        title: "تنظیمات",
        link: "/admin/settings",
        fontAwesomeIcon: "fa-cog",
      },
      {
        id: "5",
        title: "خروج",
        link: "#",
        fontAwesomeIcon: "fa-sign-out-alt",
      },
    ];
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
              <Route path="/admin/settings" component={Settings} />
              <Route path="/admin/not-found" component={NotFound} />
              <Redirect from="/admin/" exact to="/admin/dashboard" />
              <Redirect to="/admin/not-found" />
            </Switch>
          </main>
        </div>
      </div>
    );
  }
}

export default AdminPanel;
