import React, { Component } from "react";
import icon from "../images/logo.png";
import { NavLink } from "react-router-dom";

class SidebarMenu extends Component {
  render() {
    const { items } = this.props;
    const websiteURL = process.env.REACT_APP_WEBSITE;
    return (
      <aside className='sidebar'>
        <div className='title'>
          <a href={websiteURL}>
            <img src={icon} alt='logo' />
          </a>
        </div>
        <nav className='menu'>
          <ul>
            {items.map((item) => {
              return (
                <li
                  key={item.id}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      this.handleMenuItemClick(item);
                    }
                  }}
                >
                  {item.action ? (
                    <NavLink
                      to={"#"}
                      isActive={(match) => {
                        if (!match || item.link === "#") {
                          return false;
                        }
                        return true;
                      }}
                    >
                      <i className={"fa menu-icon " + item.fontAwesomeIcon}></i>
                      {item.title}
                    </NavLink>
                  ) : (
                    <NavLink
                      to={item.link}
                      isActive={(match) => {
                        if (!match || item.link === "#") {
                          return false;
                        }
                        return true;
                      }}
                    >
                      <i className={"fa menu-icon " + item.fontAwesomeIcon}></i>
                      {item.title}
                    </NavLink>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    );
  }

  handleMenuItemClick = (item) => {
    if (item.handler) {
      item.handler();
    } else {
      const sidebarItems = this.props.items;
      const index = sidebarItems.indexOf(item);
      this.setState({ activeItem: index });
    }
  };
}

export default SidebarMenu;
