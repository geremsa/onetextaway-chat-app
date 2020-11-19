import React from "react";
import {NavLink} from 'react-router-dom'

function Header() {
  return (
    <header className="users-top">
      <div className="users-title">
        <span>One</span>
        <img src="./chat.svg" alt="text" />
        <span>away</span>
      </div>
      <nav>
        <NavLink to='/' activeClassName="link-active" exact key="users" className="users-link">
          Chats
        </NavLink>
        <NavLink to='/groups' activeClassName="link-active" exact key="groups" className="users-link">
          Groups
        </NavLink>
        <NavLink to='/status' activeClassName="link-active" exact key="status" className="users-link">
          Status
        </NavLink>
        <NavLink to='/users' activeClassName="link-active" exact className="users-link">
          Users
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
